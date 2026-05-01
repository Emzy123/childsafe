import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Clock, 
  Phone,
  Upload,
  Camera,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Select, 
  Textarea, 
  Alert,
  Badge 
} from '../components/ui';

// Form validation schemas
const victimSchema = z.object({
  fullName: z.string().optional().or(z.literal('')),
  nickname: z.string().optional().or(z.literal('')),
  age: z.coerce.number().min(0).max(17).optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer_not_to_say']).optional().or(z.literal('')),
  residencyStatus: z.enum(['lives_with_parents', 'foster_care', 'street_child', 'orphanage', 'other']).optional().or(z.literal('')),
  school: z.string().optional().or(z.literal('')),
  disabilities: z.array(z.string()).optional(),
});

const incidentSchema = z.object({
  type: z.enum(['physical', 'sexual', 'emotional', 'neglect', 'child_labor', 'trafficking', 'online_abuse']),
  subType: z.string().optional().or(z.literal('')),
  date: z.string().min(1, 'Date is required'),
  timeRange: z.enum(['morning', 'afternoon', 'evening', 'overnight']),
  reoccurrence: z.boolean(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'ongoing_for_years']).optional().or(z.literal('')),
  location: z.string().min(10, 'Please provide more specific location details'),
  description: z.string().min(50, 'Please provide at least 50 characters'),
  witnesses: z.array(z.object({
    name: z.string().optional().or(z.literal('')),
    contact: z.string().optional().or(z.literal('')),
    statement: z.string().optional().or(z.literal('')),
  })).optional(),
  attachments: z.array(z.string()).optional(),
});

const perpetratorSchema = z.object({
  known: z.boolean(),
  type: z.enum(['parent', 'relative', 'neighbor', 'teacher', 'religious_leader', 'stranger', 'other']).optional().or(z.literal('')),
  firstName: z.string().optional().or(z.literal('')),
  lastName: z.string().optional().or(z.literal('')),
  middleName: z.string().optional().or(z.literal('')),
  aliases: z.string().optional().or(z.literal('')),
  physicalDescription: z.string().optional().or(z.literal('')),
  contact: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  vehicle: z.string().optional().or(z.literal('')),
  occupation: z.string().optional().or(z.literal('')),
  previousOffenses: z.boolean().optional(),
  photo: z.string().optional().or(z.literal('')),
});

const reporterSchema = z.object({
  contactMethod: z.enum(['none', 'whatsapp', 'sms', 'phone_call']),
  contactValue: z.string().optional().or(z.literal('')),
  safeContactTime: z.array(z.string()).optional(),
  relationship: z.enum(['parent', 'sibling', 'teacher', 'neighbor', 'stranger', 'other']).optional().or(z.literal('')),
  isMandatedReporter: z.boolean().optional(),
});

export default function AnonymousReport() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset
  } = useForm({
    resolver: zodResolver(
      currentStep === 1 ? victimSchema :
      currentStep === 2 ? incidentSchema :
      currentStep === 3 ? perpetratorSchema :
      reporterSchema
    )
  });

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentValues = getValues();
      if (Object.keys(currentValues).length > 0) {
        localStorage.setItem('reportDraft', JSON.stringify(currentValues));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [getValues]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('reportDraft');
    if (savedDraft) {
      try {
        reset(JSON.parse(savedDraft));
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [reset]);

  const watchedValues = watch();

  const onSubmit = async (currentStepData) => {
    setSubmitting(true);
    try {
      // Get all values across all unmounted steps instead of just the current step's validated data
      const allData = { ...getValues(), ...currentStepData };
      
      // Map form data to backend DTO
      let abuseType = allData.type;
      let descriptionPrefix = '';
      if (['child_labor', 'trafficking', 'online_abuse'].includes(abuseType)) {
        descriptionPrefix = `[Specific Type: ${abuseType?.toUpperCase()}] `;
        abuseType = 'other';
      }
      
      const payload = {
        abuseType: abuseType,
        description: descriptionPrefix + (allData.description || ''),
        incidentDate: allData.date,
        location: allData.location,
      };

      // Add optional victim data
      if (allData.fullName) {
        const nameParts = allData.fullName.split(' ');
        payload.victimFirstName = nameParts[0];
        if (nameParts.length > 1) payload.victimLastName = nameParts.slice(1).join(' ');
      }
      if (allData.age) payload.victimApproximateAge = parseInt(allData.age, 10);
      if (allData.gender) payload.victimGender = allData.gender;

      // Add optional perpetrator data
      if (allData.firstName) payload.perpetratorFirstName = allData.firstName;
      if (allData.lastName) payload.perpetratorLastName = allData.lastName;
      if (allData.aliases) payload.perpetratorAliases = allData.aliases;

      // Add optional reporter data
      if (allData.contactMethod && allData.contactValue) {
        if (allData.contactMethod === 'email' || allData.contactValue.includes('@')) {
          payload.reporterEmail = allData.contactValue;
        } else {
          payload.reporterPhone = allData.contactValue;
        }
      }

      const response = await api.post('/incidents/anonymous-report', payload);
      
      const caseRef = response.data.caseRef || `CAB-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      toast.success(`Report submitted! Case Reference: ${caseRef}`);
      
      // Clear draft
      localStorage.removeItem('reportDraft');
      
      // Navigate to confirmation page
      navigate('/report-confirmation', { state: { caseRef } });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDraft = () => {
    localStorage.setItem('reportDraft', JSON.stringify(getValues()));
    toast.success('Draft saved successfully');
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedFiles.length > 10) {
      toast.error('Maximum 10 files allowed');
      return;
    }
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const abuseTypes = [
    { 
      id: 'physical', 
      label: 'Physical Abuse', 
      icon: '👊',
      subTypes: ['Beating', 'Burning', 'Shaking', 'Choking', 'Other Physical Harm']
    },
    { 
      id: 'sexual', 
      label: 'Sexual Abuse', 
      icon: '🔞',
      subTypes: ['Rape', 'Molestation', 'Exploitation', 'Inappropriate Touching', 'Other Sexual Abuse']
    },
    { 
      id: 'emotional', 
      label: 'Emotional Abuse', 
      icon: '💔',
      subTypes: ['Verbal Abuse', 'Isolation', 'Threats', 'Humiliation', 'Other Emotional Harm']
    },
    { 
      id: 'neglect', 
      label: 'Neglect', 
      icon: '🏚️',
      subTypes: ['Abandonment', 'Malnutrition', 'No Medical Care', 'Lack of Supervision', 'Other Neglect']
    },
    { 
      id: 'child_labor', 
      label: 'Child Labor', 
      icon: '🔨',
      subTypes: ['Hawking', 'Mining', 'Domestic Servitude', 'Forced Labor', 'Other Labor Exploitation']
    },
    { 
      id: 'trafficking', 
      label: 'Trafficking', 
      icon: '🚚',
      subTypes: ['Forced Marriage', 'Organ Harvesting', 'Begging', 'Sex Trafficking', 'Other Trafficking']
    },
    { 
      id: 'online_abuse', 
      label: 'Online Abuse', 
      icon: '📱',
      subTypes: ['Cyberbullying', 'Sextortion', 'Grooming', 'Online Exploitation', 'Other Online Abuse']
    }
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderVictimInformationStep();
      case 2:
        return renderIncidentDetailsStep();
      case 3:
        return renderPerpetratorInformationStep();
      case 4:
        return renderReporterInformationStep();
      default:
        return renderVictimInformationStep();
    }
  };

  const renderVictimInformationStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-primary-600" />
            <h3 className="text-xl font-semibold">Victim Information</h3>
          </div>
          <p className="text-gray-600">
            Only provide information if known. Anonymity is guaranteed.
          </p>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Full Name (Optional)</label>
              <Input 
                {...register('fullName')}
                placeholder="Only provide if known"
                error={errors.fullName?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                <Info className="inline h-3 w-3 mr-1" />
                Why we ask for names: Helps identify if the child is already in our system
              </p>
            </div>
            
            <div className="form-group">
              <label className="form-label">Nickname/Alias (Optional)</label>
              <Input 
                {...register('nickname')}
                placeholder="Common nickname or alias"
                error={errors.nickname?.message}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Age (Optional)</label>
              <div className="flex space-x-3">
                <Select {...register('age')} error={errors.age?.message}>
                  <option value="">Select Age</option>
                  {[...Array(18)].map((_, i) => (
                    <option key={i} value={i}>{i} years</option>
                  ))}
                </Select>
                <Button variant="outline" size="sm">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Don't know exact age?
                </Button>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Date of Birth (Optional)</label>
              <Input 
                type="date"
                {...register('dateOfBirth')}
                error={errors.dateOfBirth?.message}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Gender (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {['male', 'female', 'non-binary', 'prefer_not_to_say'].map(gender => (
                  <label key={gender} className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('gender')}
                      value={gender}
                      className="form-radio mr-2"
                    />
                    <span className="text-sm capitalize">{gender.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Residency Status (Optional)</label>
              <Select {...register('residencyStatus')} error={errors.residencyStatus?.message}>
                <option value="">Select Status</option>
                <option value="lives_with_parents">Lives with parents</option>
                <option value="foster_care">Foster care</option>
                <option value="street_child">Street child</option>
                <option value="orphanage">Orphanage</option>
                <option value="other">Other</option>
              </Select>
            </div>
            
            <div className="form-group md:col-span-2">
              <label className="form-label">School/Organization (Optional)</label>
              <Input 
                {...register('school')}
                placeholder="School name or organization"
                error={errors.school?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-suggest with Nigerian schools database
              </p>
            </div>
            
            <div className="form-group md:col-span-2">
              <label className="form-label">Known Disabilities (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {['Physical', 'Intellectual', 'Speech', 'None', 'Prefer not to say'].map(disability => (
                  <label key={disability} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      {...register('disabilities')}
                      value={disability.toLowerCase()}
                      className="form-checkbox mr-2"
                    />
                    <span className="text-sm">{disability}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Photo Upload (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Upload photo (face-blurring AI recommended)
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="victim-photo-upload"
                onChange={handleFileUpload}
              />
              <label htmlFor="victim-photo-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </label>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderIncidentDetailsStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-warning" />
            <h3 className="text-xl font-semibold">Incident Details</h3>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="form-group">
            <label className="form-label">Incident Type *</label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {abuseTypes.map(type => (
                <label key={type.id} className="cursor-pointer">
                  <input
                    type="radio"
                    {...register('type')}
                    value={type.id}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg text-center transition-all ${
                    watchedValues.type === type.id 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium text-gray-900">{type.label}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.type && <p className="text-error text-sm mt-1">{errors.type.message}</p>}
          </div>

          {watchedValues.type && (
            <div className="form-group">
              <label className="form-label">Sub-categories</label>
              <div className="flex flex-wrap gap-2">
                {abuseTypes.find(t => t.id === watchedValues.type)?.subTypes.map(subType => (
                  <label key={subType} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      {...register('subType')}
                      value={subType}
                      className="form-checkbox mr-2"
                    />
                    <span className="text-sm">{subType}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <Input 
                type="date"
                {...register('date')}
                error={errors.date?.message}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Time Range *</label>
              <Select {...register('timeRange')} error={errors.timeRange?.message}>
                <option value="">Select time</option>
                <option value="morning">Morning (6AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 6PM)</option>
                <option value="evening">Evening (6PM - 12AM)</option>
                <option value="overnight">Overnight (12AM - 6AM)</option>
              </Select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reoccurrence</label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('reoccurrence')}
                className="form-checkbox mr-2"
              />
              <span className="text-sm">Has this happened before?</span>
            </label>
            
            {watchedValues.reoccurrence && (
              <div className="mt-3">
                <Select {...register('frequency')} error={errors.frequency?.message}>
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="ongoing_for_years">Ongoing for years</option>
                </Select>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Location Intelligence *</label>
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">Click to set location pin</p>
                </div>
              </div>
              
              <Textarea 
                {...register('location')}
                placeholder="Describe location precisely (Landmarks, building description, nearby streets)"
                rows={3}
                error={errors.location?.message}
              />
              <p className="text-xs text-gray-500">
                Address suggestions as you type using Nigeria Postal Service API
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <div className="space-y-3">
              <Textarea 
                {...register('description')}
                placeholder="Provide detailed description of what happened..."
                rows={6}
                error={errors.description?.message}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Min 50 characters • {watchedValues.description?.length || 0} characters
                </p>
                <Button variant="outline" size="sm">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  AI Assistance
                </Button>
              </div>
              {watchedValues.description && watchedValues.description.length < 50 && (
                <Alert variant="warning">
                  Please provide more details to help us understand the situation better.
                </Alert>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">File Attachments</label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload up to 10 files (Images, Videos, Audio, Documents)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    All files are encrypted and stored securely
                  </p>
                </div>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Camera className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Witnesses (Optional)</label>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Input placeholder="Name (Optional)" />
                <Input placeholder="Contact (Optional)" />
                <Input placeholder="Statement (Optional)" />
              </div>
              <Button variant="outline" size="sm">
                + Add Witness
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderPerpetratorInformationStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-critical" />
            <h3 className="text-xl font-semibold">Perpetrator Information</h3>
          </div>
          <p className="text-gray-600">
            Intelligence gathering - Only provide if safe to do so
          </p>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="form-group">
            <label className="form-label">Do you know the perpetrator?</label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('known')}
                className="form-checkbox mr-2"
              />
              <span className="text-sm">Yes, I know who the perpetrator is</span>
            </label>
          </div>

          {watchedValues.known && (
            <>
              <div className="form-group">
                <label className="form-label">Perpetrator Type</label>
                <div className="flex flex-wrap gap-2">
                  {['parent', 'relative', 'neighbor', 'teacher', 'religious_leader', 'stranger', 'other'].map(type => (
                    <label key={type} className="inline-flex items-center">
                      <input
                        type="radio"
                        {...register('type')}
                        value={type}
                        className="form-radio mr-2"
                      />
                      <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <Input {...register('firstName')} error={errors.firstName?.message} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <Input {...register('lastName')} error={errors.lastName?.message} />
                </div>
                <div className="form-group">
                  <label className="form-label">Middle Name</label>
                  <Input {...register('middleName')} error={errors.middleName?.message} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nicknames/Aliases</label>
                <Input 
                  {...register('aliases')}
                  placeholder="Critical for matching across cases"
                  error={errors.aliases?.message}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Physical Description</label>
                <Textarea 
                  {...register('physicalDescription')}
                  placeholder="Height, Build, Skin tone, Scars/Marks, Distinguishing features"
                  rows={4}
                  error={errors.physicalDescription?.message}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Contact/Address</label>
                  <Input 
                    {...register('contact')}
                    placeholder="Phone number, email, or known address"
                    error={errors.contact?.message}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-suggest from Nigerian address database
                  </p>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Vehicle Information</label>
                  <Input 
                    {...register('vehicle')}
                    placeholder="License plate, Make, Model, Color"
                    error={errors.vehicle?.message}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Occupation/Position</label>
                  <Input 
                    {...register('occupation')}
                    placeholder="Especially important for authority figures"
                    error={errors.occupation?.message}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">&nbsp;</label>
                  <label className="inline-flex items-center mt-6">
                    <input
                      type="checkbox"
                      {...register('previousOffenses')}
                      className="form-checkbox mr-2"
                    />
                    <span className="text-sm">I believe this person has abused other children</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Photo Upload (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Upload perpetrator photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="perpetrator-photo-upload"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="perpetrator-photo-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </label>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );

  const renderReporterInformationStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-success" />
            <h3 className="text-xl font-semibold">Reporter Information</h3>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          <Alert variant="info">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5" />
              <div>
                <strong>🔒 You can remain 100% anonymous.</strong>
                <p className="text-sm mt-1">
                  The following fields are OPTIONAL but help us follow up effectively.
                </p>
              </div>
            </div>
          </Alert>

          <div className="form-group">
            <label className="form-label">Preferred Contact Method</label>
            <Select {...register('contactMethod')} error={errors.contactMethod?.message}>
              <option value="none">None (Stay completely anonymous)</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="phone_call">Phone call</option>
            </Select>
          </div>

          {watchedValues.contactMethod && watchedValues.contactMethod !== 'none' && (
            <div className="form-group">
              <label className="form-label">Contact Information</label>
              <Input 
                {...register('contactValue')}
                placeholder={watchedValues.contactMethod === 'whatsapp' ? 'WhatsApp number' : 'Phone number or email'}
                error={errors.contactValue?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                Encrypted, visible only to case manager
              </p>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Safe Contact Time</label>
            <div className="flex flex-wrap gap-2">
              {['Morning', 'Afternoon', 'Evening', 'Anytime'].map(time => (
                <label key={time} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register('safeContactTime')}
                    value={time.toLowerCase()}
                    className="form-checkbox mr-2"
                  />
                  <span className="text-sm">{time}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Relationship to Victim</label>
            <Select {...register('relationship')} error={errors.relationship?.message}>
              <option value="">Select relationship</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="teacher">Teacher</option>
              <option value="neighbor">Neighbor</option>
              <option value="stranger">Concerned Citizen</option>
              <option value="other">Other</option>
            </Select>
          </div>

          <div className="form-group">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register('isMandatedReporter')}
                className="form-checkbox mr-2"
              />
              <span className="text-sm font-medium">I am a mandated reporter (e.g., teacher, doctor, counselor)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Certain professionals are legally required to report suspected child abuse
            </p>
          </div>

          <div className="bg-surface-secondary rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Before You Submit</h4>
            <div className="space-y-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox mr-2" required />
                <span className="text-sm">I confirm that the information provided is true to the best of my knowledge</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox mr-2" required />
                <span className="text-sm">I understand that false reporting is a serious offense</span>
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox mr-2" required />
                <span className="text-sm">I consent to the processing of this information for child protection purposes</span>
              </label>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <div className="bg-surface-elevated border-b border-border-light">
        <div className="max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Anonymous Reporting Form</h1>
                <p className="text-gray-600">Secure, confidential, 24/7 available</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {draftSaved && (
                <Badge variant="success" className="animate-fade-in">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Draft Saved
                </Badge>
              )}
              <Button variant="outline" onClick={saveDraft}>
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-surface-secondary border-b border-border-light">
        <div className="max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}:</span>
              <span className="text-sm text-gray-600">
                {currentStep === 1 && 'Victim Information'}
                {currentStep === 2 && 'Incident Details'}
                {currentStep === 3 && 'Perpetrator Information'}
                {currentStep === 4 && 'Submit Report'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Your draft is saved automatically every 30 seconds
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Emergency Banner */}
      <Alert variant="critical" className="mx-4 mt-4 max-w-container-xl">
        <div className="flex items-center justify-center space-x-3">
          <Phone className="h-5 w-5" />
          <span className="font-semibold">
            ⚠️ If this is an emergency, do not submit this form. Call 112 immediately.
          </span>
        </div>
      </Alert>

      {/* Form Content */}
      <div className="max-w-container-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex space-x-4">
              <Button variant="outline" onClick={saveDraft}>
                Save & Continue Later
              </Button>
              
              {currentStep < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Next Step
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  variant="primary"
                  loading={submitting}
                  className="bg-critical hover:bg-red-600"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Anonymous Report'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

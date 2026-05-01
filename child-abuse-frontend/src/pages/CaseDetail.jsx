import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Edit2, 
  History, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Shield, 
  Camera, 
  Phone, 
  Mail, 
  Home, 
  School, 
 
  Users, 
  Gavel, 
 
 
  MessageSquare, 
  Video, 
  FileImage, 
  FileAudio, 
  FileVideo, 
  Download, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  HelpCircle, 
  Settings, 
  MoreVertical, 
  RefreshCw, 
  Save, 
  X, 
  Printer, 
  Share, 
  Lock, 
  Unlock, 
  Flag, 
  Star, 
  Heart, 
  Bookmark, 
  Paperclip, 
  Link as LinkIcon, 
  ExternalLink, 
  Copy, 
  Trash2, 
  Archive, 
  Send, 
  Bell, 
  UserPlus, 
  UserMinus, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  BarChart, 
  PieChart, 
  Target, 
  Zap, 
  Award, 
 
 
   
  File, 
  Folder, 
  FolderOpen, 
  Database, 
  Server, 
  Cloud, 
  Wifi, 
  Battery, 
  Thermometer, 
  Wind, 
  Droplets, 
  Gauge, 
  Compass, 
  Map, 
  Navigation, 
  Globe, 
  Building, 
  Briefcase, 
  Stethoscope, 
 
  Eye as EyeIcon, 
  Brain, 
  HeartPulse, 
  Bone, 
 
  Pill, 
  Syringe, 
  Microscope, 
  TestTube, 
  Dna, 
  Fingerprint, 
  Footprints, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  FileText as FileTextIcon, 
  AlertTriangle as AlertTriangleIcon, 
  Shield as ShieldIcon, 
  Camera as CameraIcon, 
  Phone as PhoneIcon, 
  Mail as MailIcon, 
  Home as HomeIcon, 
  School as SchoolIcon, 
 
  Users as UsersIcon, 
  Gavel as GavelIcon, 
 
 
  MessageSquare as MessageSquareIcon, 
  Video as VideoIcon, 
  FileImage as FileImageIcon, 
  FileAudio as FileAudioIcon, 
  FileVideo as FileVideoIcon, 
  Download as DownloadIcon, 
  Upload as UploadIcon, 
  Plus as PlusIcon, 
  Search as SearchIcon2, 
  Filter as FilterIcon2, 
  ChevronRight as ChevronRightIcon, 
  ChevronDown as ChevronDownIcon, 
  ChevronUp as ChevronUpIcon, 
  Eye as EyeIcon2, 
  EyeOff as EyeOffIcon, 
  CheckCircle as CheckCircleIcon, 
  XCircle as XCircleIcon, 
  AlertCircle as AlertCircleIcon, 
  Info as InfoIcon, 
  HelpCircle as HelpCircleIcon, 
  Settings as SettingsIcon, 
  MoreVertical as MoreVerticalIcon, 
  RefreshCw as RefreshCwIcon, 
  Save as SaveIcon, 
  X as XIcon, 
  Printer as PrinterIcon, 
  Share as ShareIcon, 
  Lock as LockIcon, 
  Unlock as UnlockIcon, 
  Flag as FlagIcon, 
  Star as StarIcon, 
  Heart as HeartIcon, 
  Bookmark as BookmarkIcon, 
  Paperclip as PaperclipIcon, 
  Link as LinkIcon2, 
  ExternalLink as ExternalLinkIcon, 
  Copy as CopyIcon, 
  Trash2 as Trash2Icon, 
  Archive as ArchiveIcon, 
  Send as SendIcon, 
  Bell as BellIcon, 
  UserPlus as UserPlusIcon, 
  UserMinus as UserMinusIcon, 
  Activity as ActivityIcon, 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  Target as TargetIcon, 
  Zap as ZapIcon, 
  Award as AwardIcon, 
  Trophy as TrophyIcon, 
  Medal as MedalIcon, 
   
  File as FileIcon, 
  Folder as FolderIcon, 
  FolderOpen as FolderOpenIcon, 
  Database as DatabaseIcon, 
  Server as ServerIcon, 
  Cloud as CloudIcon, 
  Wifi as WifiIcon, 
  Battery as BatteryIcon, 
  Thermometer as ThermometerIcon, 
  Wind as WindIcon, 
  Droplets as DropletsIcon, 
  Gauge as GaugeIcon, 
  Compass as CompassIcon, 
  Map as MapIcon, 
  Navigation as NavigationIcon, 
  Globe as GlobeIcon, 
  Building as BuildingIcon, 
  Briefcase as BriefcaseIcon, 
  Stethoscope as StethoscopeIcon, 
 
  Eye as EyeIcon3, 
  Brain as BrainIcon, 
  HeartPulse as HeartPulseIcon, 
  Bone as BoneIcon, 
 
  Pill as PillIcon, 
  Syringe as SyringeIcon, 
  Microscope as MicroscopeIcon, 
  TestTube as TestTubeIcon, 
  Dna as DnaIcon, 
  Fingerprint as FingerprintIcon, 
  Footprints as FootprintsIcon
} from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Select, Alert, Badge, Spinner, Modal, Textarea } from '../components/ui';
import AnimatedCounter from '../components/AnimatedCounter';

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [history, setHistory] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [legalDocuments, setLegalDocuments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [updating, setUpdating] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    notes: '',
  });
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'general' });
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '', assignee: '' });
  const [newEvidence, setNewEvidence] = useState({ type: '', description: '', files: [] });

  useEffect(() => {
    if (id === 'new') {
      navigate('/report', { replace: true });
      return;
    }
    fetchCaseDetails();
    fetchCaseHistory();
    fetchEvidence();
    fetchMedicalRecords();
    fetchLegalDocuments();
    fetchTimeline();
    fetchNotes();
    fetchTasks();
    fetchContacts();
  }, [id, navigate]);

  const fetchCaseDetails = async () => {
    try {
      const response = await api.get(`/incidents/${id}`);
      
      // Provide default fallbacks for complex nested objects that were present in mock data
      // but might not be returned by the real backend API yet.
      const data = {
        ...response.data,
        priority: response.data.priority || 'medium',
        assignedTo: response.data.assigneeId ? 'Assigned Worker' : 'Unassigned',
        riskAssessment: response.data.riskAssessment || { 
          level: 'medium', 
          factors: ['Standard assessment pending'], 
          recommendations: ['Review case details'] 
        },
        nextActions: response.data.nextActions || ['Initial review'],
        victim: response.data.victim || { 
          firstName: 'Unknown', 
          lastName: '', 
          approximateAge: 'Unknown', 
          gender: 'Unknown', 
          school: 'Unknown', 
          medicalConditions: 'Unknown', 
          currentLocation: 'Unknown', 
          protectionStatus: 'pending' 
        },
        perpetrator: response.data.perpetrator || { 
          firstName: 'Unknown', 
          lastName: '', 
          relationship: 'Unknown', 
          age: 'Unknown', 
          occupation: 'Unknown', 
          aliases: 'None', 
          criminalHistory: 'Unknown', 
          currentStatus: 'unknown' 
        }
      };
      
      setCaseData(data);
      setUpdateData({ status: data.status, notes: '' });
    } catch (error) {
      console.error('FETCH CASE DETAILS ERROR:', error);
      toast.error('Failed to load case details');
      navigate('/cases');
    } finally {
      setLoading(false);
    }
  };

  const fetchCaseHistory = async () => {
    try {
      if (id === 'new') return;
      const response = await api.get(`/incidents/${id}/history`);
      setHistory(response.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      setHistory([]);
    }
  };

  const fetchEvidence = async () => setEvidence([]);
  const fetchMedicalRecords = async () => setMedicalRecords([]);
  const fetchLegalDocuments = async () => setLegalDocuments([]);
  const fetchTimeline = async () => setTimeline([]);
  const fetchNotes = async () => setNotes([]);
  const fetchTasks = async () => setTasks([]);
  const fetchContacts = async () => setContacts([]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Case updated successfully');
      setShowUpdateForm(false);
      fetchCaseDetails();
      fetchCaseHistory();
    } catch (error) {
      toast.error('Failed to update case');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const note = {
        id: notes.length + 1,
        ...newNote,
        author: user?.fullName || 'Current User',
        date: new Date()
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '', category: 'general' });
      setShowNoteModal(false);
      toast.success('Note added successfully');
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const task = {
        id: tasks.length + 1,
        ...newTask,
        status: 'pending',
        assignee: newTask.assignee
      };
      setTasks([task, ...tasks]);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', assignee: '' });
      setShowTaskModal(false);
      toast.success('Task added successfully');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported': return 'bg-warning/10 text-warning border-warning/20';
      case 'under_investigation': return 'bg-secondary-100 text-secondary-700 border-secondary-200';
      case 'with_agency': return 'bg-accent-100 text-accent-700 border-accent-200';
      case 'closed': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-critical/10 text-critical border-critical/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'medium': return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'low': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'in_progress': return 'bg-secondary-100 text-secondary-700 border-secondary-200';
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FileTextIcon className="h-4 w-4" /> },
    { id: 'victim', label: 'Victim Info', icon: <User className="h-4 w-4" /> },
    { id: 'perpetrator', label: 'Perpetrator', icon: <Shield className="h-4 w-4" /> },
    { id: 'evidence', label: 'Evidence', icon: <FileText className="h-4 w-4" /> },
    { id: 'medical', label: 'Medical', icon: <Stethoscope className="h-4 w-4" /> },
    { id: 'legal', label: 'Legal', icon: <Gavel className="h-4 w-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock className="h-4 w-4" /> },
    { id: 'notes', label: 'Notes', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'contacts', label: 'Contacts', icon: <Phone className="h-4 w-4" /> }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="h-12 w-12 text-gray-400" />
        <h2 className="text-xl font-bold text-gray-900">Case Not Found</h2>
        <p className="text-gray-500">The case you are looking for does not exist or you do not have permission to view it.</p>
        <Button onClick={() => navigate('/cases')}>Back to Cases</Button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/cases')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cases
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{caseData.caseRef}</h1>
            <p className="text-gray-600">Created on {new Date(caseData.createdAt || caseData.incidentDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge className={getPriorityColor(caseData.priority)}>
            {caseData.priority.toUpperCase()} PRIORITY
          </Badge>
          <Badge className={getStatusColor(caseData.status || 'reported')}>
            {(caseData.status || 'reported').replace('_', ' ').toUpperCase()}
          </Badge>
          <Button variant="outline" onClick={() => setShowUpdateForm(!showUpdateForm)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Update Status
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Update Form */}
      {showUpdateForm && (
        <Card className="mb-6">
          <CardBody>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Update Case Status</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowUpdateForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">New Status</label>
                  <Select value={updateData.status} onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}>
                    <option value="reported">Reported</option>
                    <option value="under_investigation">Under Investigation</option>
                    <option value="with_agency">With Agency</option>
                    <option value="closed">Closed</option>
                  </Select>
                </div>
                <div>
                  <label className="form-label">Priority</label>
                  <Select defaultValue={caseData.priority}>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="form-label">Notes / Comments</label>
                <Textarea
                  value={updateData.notes}
                  onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                  rows={3}
                  placeholder="Add any notes about this update..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowUpdateForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={updating}>
                  {updating ? 'Updating...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Case Summary */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Case Summary</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Case Reference</p>
                        <p className="font-medium">{caseData.caseRef}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Abuse Type</p>
                        <p className="font-medium capitalize">{caseData.abuseType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Incident Date</p>
                        <p className="font-medium">{new Date(caseData.incidentDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Assigned To</p>
                        <p className="font-medium">{caseData.assignedTo}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Location</p>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <p className="font-medium">{caseData.location}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Description</p>
                      <p className="text-gray-700">{caseData.description}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Risk Assessment</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Risk Level</span>
                      <Badge className={getPriorityColor(caseData.riskAssessment.level)}>
                        {caseData.riskAssessment.level.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Risk Factors</p>
                      <div className="space-y-2">
                        {caseData.riskAssessment.factors.map((factor, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            <span className="text-sm">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Recommendations</p>
                      <div className="space-y-2">
                        {caseData.riskAssessment.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Next Actions */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Next Actions</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {caseData.nextActions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-surface-secondary rounded-lg">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                        </div>
                        <span className="text-sm">{action}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Quick Stats</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{evidence.length}</div>
                      <div className="text-sm text-gray-500">Evidence Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{medicalRecords.length}</div>
                      <div className="text-sm text-gray-500">Medical Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'pending').length}</div>
                      <div className="text-sm text-gray-500">Pending Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
                      <div className="text-sm text-gray-500">Contacts</div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    {history.slice(0, 5).map((update) => (
                      <div key={update.id} className="text-sm">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="font-medium">{update.updatedBy}</span>
                        </div>
                        <p className="text-gray-600">{update.notes}</p>
                        <p className="text-xs text-gray-500">{update.createdAt.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Victim Info Tab */}
        {activeTab === 'victim' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{caseData.victim.firstName} {caseData.victim.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{caseData.victim.approximateAge}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium capitalize">{caseData.victim.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">School</p>
                      <p className="font-medium">{caseData.victim.school}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Medical Conditions</p>
                      <p className="font-medium">{caseData.victim.medicalConditions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Location</p>
                      <p className="font-medium">{caseData.victim.currentLocation}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Protection Status */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Protection Status</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Protection Status</span>
                      <Badge className="bg-success/10 text-success border-success/20">
                        {caseData.victim.protectionStatus.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="p-4 bg-success/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-success" />
                        <span className="font-medium text-success">Child is currently under protection</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Counseling
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Stethoscope className="h-4 w-4 mr-2" />
                      Book Medical Appointment
                    </Button>
                    <Button variant="outline" className="w-full">
                      <School className="h-4 w-4 mr-2" />
                      Contact School
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Family Services
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Perpetrator Tab */}
        {activeTab === 'perpetrator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{caseData.perpetrator.firstName} {caseData.perpetrator.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{caseData.perpetrator.age}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Relationship to Victim</p>
                      <p className="font-medium">{caseData.perpetrator.relationship}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Occupation</p>
                      <p className="font-medium">{caseData.perpetrator.occupation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Aliases</p>
                      <p className="font-medium">{caseData.perpetrator.aliases}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Criminal History</p>
                      <p className="font-medium">{caseData.perpetrator.criminalHistory}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Legal Status */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Legal Status</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Current Status</span>
                      <Badge className="bg-warning/10 text-warning border-warning/20">
                        {caseData.perpetrator.currentStatus.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="p-4 bg-warning/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Gavel className="h-5 w-5 text-warning" />
                        <span className="font-medium text-warning">Under investigation</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Legal Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Legal Actions</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                      <Gavel className="h-4 w-4 mr-2" />
                      File Charges
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Request Arrest Warrant
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Protection Order
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Court Documents
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Evidence Tab */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Evidence Collection</h3>
              <Button onClick={() => setShowEvidenceModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Evidence
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidence.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {item.type === 'photographic' && <Camera className="h-4 w-4 text-primary-600" />}
                          {item.type === 'medical_report' && <FileText className="h-4 w-4 text-secondary-600" />}
                          {item.type === 'witness_statement' && <MessageSquare className="h-4 w-4 text-accent-600" />}
                          {item.type === 'audio_recording' && <FileAudio className="h-4 w-4 text-warning" />}
                          {item.type === 'video' && <Video className="h-4 w-4 text-critical" />}
                          <span className="text-sm font-medium capitalize">{item.type.replace('_', ' ')}</span>
                        </div>
                        <Badge variant="outline" size="sm">{item.format}</Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600">{item.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{item.date.toLocaleDateString()}</span>
                        <span>{item.size}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">By {item.uploadedBy}</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Medical Tab */}
        {activeTab === 'medical' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Medical Records</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Medical Record
              </Button>
            </div>
            
            <div className="space-y-4">
              {medicalRecords.map((record) => (
                <Card key={record.id}>
                  <CardBody>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Stethoscope className="h-4 w-4 text-secondary-600" />
                          <span className="font-medium capitalize">{record.type.replace('_', ' ')}</span>
                        </div>
                        <span className="text-sm text-gray-500">{record.date.toLocaleDateString()}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Doctor</p>
                          <p className="font-medium">{record.doctor}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="font-medium capitalize">{record.type}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Findings</p>
                        <p className="text-sm text-gray-700">{record.findings}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Treatment</p>
                        <p className="text-sm text-gray-700">{record.treatment}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Legal Tab */}
        {activeTab === 'legal' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Legal Documents</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Legal Document
              </Button>
            </div>
            
            <div className="space-y-4">
              {legalDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardBody>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Gavel className="h-4 w-4 text-accent-600" />
                          <span className="font-medium capitalize">{doc.type.replace('_', ' ')}</span>
                        </div>
                        <Badge className={doc.status === 'active' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
                          {doc.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="font-medium">{doc.date.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Reference</p>
                          <p className="font-medium">{doc.reference}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Authority</p>
                        <p className="font-medium">{doc.authority || doc.officer}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Case Timeline</h3>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              <div className="space-y-6">
                {timeline.map((event, index) => (
                  <div key={event.id} className="relative flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      event.type === 'report' ? 'bg-primary-500' :
                      event.type === 'assignment' ? 'bg-secondary-600' :
                      event.type === 'medical' ? 'bg-success' :
                      event.type === 'legal' ? 'bg-accent-600' :
                      event.type === 'therapy' ? 'bg-warning' :
                      'bg-gray-500'
                    }`}>
                      {event.type === 'report' && <FileText className="h-4 w-4 text-white" />}
                      {event.type === 'assignment' && <Users className="h-4 w-4 text-white" />}
                      {event.type === 'medical' && <Stethoscope className="h-4 w-4 text-white" />}
                      {event.type === 'legal' && <Gavel className="h-4 w-4 text-white" />}
                      {event.type === 'therapy' && <Heart className="h-4 w-4 text-white" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{event.event}</h4>
                          <span className="text-sm text-gray-500">{event.date.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600">{event.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Case Notes</h3>
              <Button onClick={() => setShowNoteModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
            
            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{note.title}</h4>
                        <Badge variant="outline" size="sm">{note.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600">{note.content}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>By {note.author}</span>
                        <span>{note.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Task Management</h3>
              <Button onClick={() => setShowTaskModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getTaskStatusColor(task.status)}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600">{task.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Assignee</p>
                          <p className="font-medium">{task.assignee}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Due Date</p>
                          <p className="font-medium">{task.dueDate.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Case Contacts</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardBody>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{contact.name}</h4>
                        <Badge variant="outline" size="sm">{contact.role}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span>{contact.organization}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{contact.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{contact.email}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Evidence Modal */}
      <Modal isOpen={showEvidenceModal} onClose={() => setShowEvidenceModal(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add Evidence</h3>
          <form onSubmit={(e) => { e.preventDefault(); setShowEvidenceModal(false); }}>
            <div className="space-y-4">
              <div>
                <label className="form-label">Evidence Type</label>
                <Select value={newEvidence.type} onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}>
                  <option value="">Select type</option>
                  <option value="photographic">Photographic</option>
                  <option value="medical_report">Medical Report</option>
                  <option value="witness_statement">Witness Statement</option>
                  <option value="audio_recording">Audio Recording</option>
                  <option value="video">Video</option>
                </Select>
              </div>
              
              <div>
                <label className="form-label">Description</label>
                <Textarea
                  value={newEvidence.description}
                  onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                  placeholder="Describe the evidence..."
                />
              </div>
              
              <div>
                <label className="form-label">Files</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG, MP3, MP4 (MAX. 50MB)</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowEvidenceModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Evidence
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Note Modal */}
      <Modal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add Note</h3>
          <form onSubmit={handleAddNote}>
            <div className="space-y-4">
              <div>
                <label className="form-label">Title</label>
                <Input
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Note title..."
                />
              </div>
              
              <div>
                <label className="form-label">Category</label>
                <Select value={newNote.category} onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}>
                  <option value="general">General</option>
                  <option value="assessment">Assessment</option>
                  <option value="medical">Medical</option>
                  <option value="legal">Legal</option>
                  <option value="therapy">Therapy</option>
                </Select>
              </div>
              
              <div>
                <label className="form-label">Content</label>
                <Textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Note content..."
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowNoteModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Note
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add Task</h3>
          <form onSubmit={handleAddTask}>
            <div className="space-y-4">
              <div>
                <label className="form-label">Task Title</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title..."
                />
              </div>
              
              <div>
                <label className="form-label">Description</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Priority</label>
                  <Select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </Select>
                </div>
                
                <div>
                  <label className="form-label">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="form-label">Assignee</label>
                <Input
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  placeholder="Assign to..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowTaskModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Task
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

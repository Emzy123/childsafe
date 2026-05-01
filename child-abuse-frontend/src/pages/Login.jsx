import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Lock, 
  Mail, 
  User,
  Building,
  Clock,
  MessageSquare,
  Smartphone,
  Key,
  Globe,
  Server,
  Award,
  Users,
  ChevronRight
} from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Alert, Badge } from '../components/ui';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberDevice: z.boolean().optional(),
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [selectedRole, setSelectedRole] = useState('social_worker');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberDevice: false
    }
  });

  // Rotating testimonials
  const testimonials = [
    {
      text: "This system has revolutionized how we protect children in Nigeria. Real-time coordination saves lives.",
      author: "Director General",
      agency: "NAPTIP",
      avatar: "👔"
    },
    {
      text: "The intelligence features help us identify patterns and prevent abuse before it happens.",
      author: "Inspector General",
      agency: "Nigeria Police Force",
      avatar: "👮"
    },
    {
      text: "Finally, a unified platform that connects all child protection agencies seamlessly.",
      author: "Permanent Secretary",
      agency: "Ministry of Women Affairs",
      avatar: "🏛️"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);



  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      

      // Call AuthContext login
      const success = await login(data.email, data.password);
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      if (loginAttempts >= 2) {
        toast.error('Too many failed attempts. Please try again later or contact IT support.');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };



  const domainWhitelist = [
    '@gov.ng', '@naptip.gov.ng', '@police.gov.ng', '@womenaffairs.gov.ng',
    '@org.ng', '@unicef.org', '@savechildren.org', '@crin.org'
  ];

  const getRoleIcon = (role) => {
    switch (role) {
      case 'social_worker': return <User className="h-5 w-5" />;
      case 'law_enforcement': return <Shield className="h-5 w-5" />;
      case 'admin': return <Key className="h-5 w-5" />;
      case 'partner_agency': return <Building className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'social_worker': return 'Social Worker';
      case 'law_enforcement': return 'Law Enforcement';
      case 'admin': return 'System Administrator';
      case 'partner_agency': return 'Partner Agency';
      default: return 'User';
    }
  };



  return (
    <div className="min-h-screen bg-surface-primary flex">
      {/* Left Panel - Branding & Trust Indicators */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 border border-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 h-full">
          {/* Top Section - Logo & Security Badge */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">ChildSafe NG</h1>
                <p className="text-white/80">Enterprise Protection Platform</p>
              </div>
            </div>

            {/* Animated Security Badge */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-8 w-8 text-yellow-300" />
                <div>
                  <h3 className="font-semibold">SOC 2 Type II Compliant</h3>
                  <p className="text-sm text-white/80">Enterprise-grade security certification</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  <span className="text-sm">End-to-end encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  <span className="text-sm">Multi-factor authentication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  <span className="text-sm">24/7 security monitoring</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section - Testimonials */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-4">{testimonials[currentTestimonial].avatar}</div>
                <blockquote className="text-lg font-medium mb-4">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div>
                  <div className="font-semibold">{testimonials[currentTestimonial].author}</div>
                  <div className="text-sm text-white/80">{testimonials[currentTestimonial].agency}</div>
                </div>
              </div>
              
              {/* Testimonial Indicators */}
              <div className="flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section - Live Stats */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">1,247</div>
                  <div className="text-sm text-white/80">Secure sessions today</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">99.9%</div>
                  <div className="text-sm text-white/80">Uptime this month</div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-sm text-white/60">
              Phishing-resistant MFA available • IP whitelisting supported
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your ChildSafe NG account</p>
          </div>

          {/* Login Form */}
          <Card>
            <CardBody className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="form-label flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder={`name@${domainWhitelist[0]}`}
                    error={errors.email?.message}
                    className="pl-10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only approved government and organization domains
                  </p>
                </div>

                {/* Password Field */}
                <div>
                  <label className="form-label flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      placeholder="Enter your password"
                      error={errors.password?.message}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {watch('password') && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Password strength</span>
                        <span>Strong</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-green-500 h-1 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Options */}
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('rememberDevice')}
                      className="form-checkbox mr-2"
                    />
                    <span className="text-sm text-gray-600">Trust this browser for 30 days</span>
                  </label>

                  <div className="flex items-center justify-between text-sm">
                    <a href="#" className="text-secondary-600 hover:text-secondary-700">
                      Forgot password?
                    </a>
                    <a href="#" className="text-secondary-600 hover:text-secondary-700">
                      Need help logging in?
                    </a>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                {/* Failed Attempts Warning */}
                {loginAttempts > 0 && (
                  <Alert variant="warning">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        {3 - loginAttempts} attempts remaining
                      </span>
                    </div>
                  </Alert>
                )}
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface-elevated text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* SSO Options */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Server className="h-4 w-4 mr-2" />
                  Continue with SSO
                </Button>
                <Button variant="outline" className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  Continue with Microsoft
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Registration Link */}
          <div className="text-center">
            <p className="text-gray-600">
              New to ChildSafe NG?{' '}
              <Link to="/register" className="text-secondary-600 hover:text-secondary-700 font-medium">
                Request agency access
              </Link>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Lock className="h-3 w-3" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

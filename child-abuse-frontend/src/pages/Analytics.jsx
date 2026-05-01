import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  FileText, 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  MoreVertical, 
  RefreshCw, 
  Settings, 
  Share, 
  Printer, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Target, 
  Zap, 
  Award, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  ArrowUp, 
  ArrowDown, 
  ArrowRight, 
  ArrowLeft as ArrowLeftIcon, 
  Plus, 
  Minus, 
  X, 
  Edit, 
  Trash, 
  Archive, 
  Save, 
  Copy, 
  Clipboard, 
  Database, 
  Server, 
  HardDrive, 
  Wifi, 
  Battery, 
  Thermometer, 
  Wind, 
  Droplets, 
  Gauge, 
  Compass, 
  Navigation, 
  Map, 
  Building, 
  Home, 
  School, 
  Hospital, 
  Stethoscope, 
  Gavel, 
  Handcuffs, 
  Evidence, 
  MessageSquare, 
  Video, 
  FileImage, 
  FileAudio, 
  FileVideo, 
  FileText as FileTextIcon, 
  File as FileIcon, 
  Folder, 
  FolderOpen, 
  Briefcase, 
  DollarSign, 
  CreditCard, 
  Receipt, 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon, 
  Activity as ActivityIcon, 
  Users as UsersIcon, 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  AreaChart as AreaChartIcon, 
  RadarChart as RadarChartIcon, 
  ScatterChart as ScatterChartIcon, 
  Compose, 
  Send, 
  Bell, 
  User, 
  UserPlus, 
  UserMinus, 
  UserCheck, 
  UserX, 
  Star, 
  Heart, 
  Bookmark, 
  Flag, 
  Tag, 
  Hash, 
  AtSign, 
  Link, 
  Unlink, 
  Lock, 
  Unlock, 
  Key, 
  Shield as ShieldIcon, 
  ShieldCheck, 
  ShieldOff, 
  ShieldAlert, 
  Fingerprint, 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  MapPin as MapPinIcon, 
  Phone as PhoneIcon, 
  Mail as MailIcon, 
  Globe as GlobeIcon, 
  Target as TargetIcon, 
  Zap as ZapIcon, 
  Award as AwardIcon, 
  AlertTriangle as AlertTriangleIcon, 
  CheckCircle as CheckCircleIcon, 
  XCircle, 
  AlertCircle, 
  Info, 
  HelpCircle, 
  Settings as SettingsIcon, 
  MoreVertical as MoreVerticalIcon, 
  RefreshCw as RefreshCwIcon, 
  Download as DownloadIcon, 
  Upload as UploadIcon, 
  Share as ShareIcon, 
  Printer as PrinterIcon, 
  Copy as CopyIcon, 
  Trash as TrashIcon, 
  Archive as ArchiveIcon, 
  Save as SaveIcon, 
  Edit as EditIcon, 
  Plus as PlusIcon, 
  Minus as MinusIcon, 
  X as XIcon, 
  ChevronUp as ChevronUpIcon, 
  ChevronDown as ChevronDownIcon, 
  ChevronRight as ChevronRightIcon, 
  ChevronLeft as ChevronLeftIcon, 
  ArrowUp as ArrowUpIcon, 
  ArrowDown as ArrowDownIcon, 
  ArrowRight as ArrowRightIcon, 
  ArrowLeft as ArrowLeftIcon
} from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Select, Alert, Badge, Spinner } from '../components/ui';
import AnimatedCounter from '../components/AnimatedCounter';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ScatterChart, 
  Scatter, 
  Treemap, 
  FunnelChart, 
  Funnel
} from 'recharts';

export default function Analytics() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    trends: [],
    demographics: [],
    geographic: [],
    performance: [],
    comparisons: [],
    predictions: [],
    benchmarks: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('90d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('executive');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeRange, selectedMetric, selectedRegion]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call with comprehensive mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = {
        overview: {
          totalCases: 12456,
          activeCases: 3421,
          resolvedCases: 8923,
          responseRate: 87.3,
          avgResolutionTime: 14.5,
          victimRecoveryRate: 76.8,
          teamEfficiency: 92.1,
          systemUptime: 99.97,
          userSatisfaction: 4.6,
          costPerCase: 234.56,
          roi: 342.5
        },
        trends: generateTrendsData(),
        demographics: generateDemographicsData(),
        geographic: generateGeographicData(),
        performance: generatePerformanceData(),
        comparisons: generateComparisonsData(),
        predictions: generatePredictionsData(),
        benchmarks: generateBenchmarksData()
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTrendsData = () => [
    { month: 'Jan', cases: 890, resolved: 823, response: 92.5, satisfaction: 4.2 },
    { month: 'Feb', cases: 945, resolved: 867, response: 91.7, satisfaction: 4.3 },
    { month: 'Mar', cases: 1023, resolved: 945, response: 92.4, satisfaction: 4.4 },
    { month: 'Apr', cases: 1156, resolved: 1089, response: 94.2, satisfaction: 4.5 },
    { month: 'May', cases: 1234, resolved: 1156, response: 93.7, satisfaction: 4.6 },
    { month: 'Jun', cases: 1342, resolved: 1267, response: 94.4, satisfaction: 4.7 }
  ];

  const generateDemographicsData = () => [
    { age: '0-5', male: 234, female: 189, total: 423 },
    { age: '6-10', male: 456, female: 398, total: 854 },
    { age: '11-15', male: 567, female: 523, total: 1090 },
    { age: '16-18', male: 234, female: 289, total: 523 }
  ];

  const generateGeographicData = () => [
    { state: 'Lagos', cases: 3456, resolved: 3123, response: 90.4, population: 14567890 },
    { state: 'Abuja', cases: 2345, resolved: 2156, response: 91.9, population: 3456789 },
    { state: 'Kano', cases: 1876, resolved: 1734, response: 92.4, population: 12345678 },
    { state: 'Rivers', cases: 1234, resolved: 1156, response: 93.7, population: 5678901 },
    { state: 'Oyo', cases: 987, resolved: 923, response: 93.5, population: 7890123 },
    { state: 'Kaduna', cases: 876, resolved: 812, response: 92.7, population: 6789012 },
    { state: 'Enugu', cases: 654, resolved: 612, response: 93.6, population: 4567890 }
  ];

  const generatePerformanceData = () => [
    { metric: 'Response Time', current: 2.4, target: 3.0, benchmark: 2.8, unit: 'hours' },
    { metric: 'Resolution Rate', current: 87.3, target: 85.0, benchmark: 82.1, unit: '%' },
    { metric: 'Victim Recovery', current: 76.8, target: 75.0, benchmark: 71.2, unit: '%' },
    { metric: 'Team Efficiency', current: 92.1, target: 90.0, benchmark: 87.3, unit: '%' },
    { metric: 'User Satisfaction', current: 4.6, target: 4.5, benchmark: 4.2, unit: 'stars' },
    { metric: 'Cost per Case', current: 234.56, target: 250.0, benchmark: 278.90, unit: '$' }
  ];

  const generateComparisonsData = () => [
    { category: 'Response Time', us: 2.4, industry: 3.8, world: 4.2, unit: 'hours' },
    { category: 'Resolution Rate', us: 87.3, industry: 78.5, world: 72.1, unit: '%' },
    { category: 'Victim Recovery', us: 76.8, industry: 68.2, world: 61.7, unit: '%' },
    { category: 'Cost Efficiency', us: 234.56, industry: 345.78, world: 412.34, unit: '$' },
    { category: 'User Satisfaction', us: 4.6, industry: 4.1, world: 3.8, unit: 'stars' }
  ];

  const generatePredictionsData = () => [
    { month: 'Jul', predicted: 1456, confidence: 0.85, factors: ['Seasonal increase', 'School holiday'] },
    { month: 'Aug', predicted: 1523, confidence: 0.82, factors: ['Peak season', 'Awareness campaigns'] },
    { month: 'Sep', predicted: 1389, confidence: 0.88, factors: ['School return', 'Routine patterns'] },
    { month: 'Oct', predicted: 1342, confidence: 0.91, factors: ['Stable period', 'Preventive measures'] },
    { month: 'Nov', predicted: 1298, confidence: 0.89, factors: ['Weather patterns', 'Community outreach'] },
    { month: 'Dec', predicted: 1423, confidence: 0.86, factors: ['Holiday season', 'Family stress'] }
  ];

  const generateBenchmarksData = () => [
    { organization: 'UNICEF Primero', responseTime: 4.2, resolutionRate: 78.5, satisfaction: 4.1, cases: 8900 },
    { organization: 'Child Helpline', responseTime: 3.8, resolutionRate: 82.1, satisfaction: 4.2, cases: 12300 },
    { organization: 'Safe Horizon', responseTime: 5.1, resolutionRate: 75.3, satisfaction: 3.9, cases: 6700 },
    { organization: 'NSPCC', responseTime: 4.7, resolutionRate: 79.8, satisfaction: 4.0, cases: 15600 },
    { organization: 'ChildSafe NG', responseTime: 2.4, resolutionRate: 87.3, satisfaction: 4.6, cases: 12456 }
  ];

  const getPerformanceColor = (current, target) => {
    if (current >= target) return 'text-success';
    if (current >= target * 0.9) return 'text-warning';
    return 'text-critical';
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <ArrowUpIcon className="h-4 w-4 text-success" />;
    if (current < previous) return <ArrowDownIcon className="h-4 w-4 text-critical" />;
    return <ArrowRight className="h-4 w-4 text-gray-500" />;
  };

  const ExecutiveKPICard = ({ title, value, change, icon, color, subtitle, trend, format }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
          <div className="flex items-center space-x-2">
            {trend && getTrendIcon(value, value - change)}
            <div className={`text-sm font-medium ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-critical' : 'text-gray-500'}`}>
              {change > 0 ? '+' : ''}{change}%
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">
            {format ? format(value) : <AnimatedCounter target={value} />}
          </div>
          <div className="text-sm text-gray-600">{title}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      </CardBody>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Statistics</h1>
          <p className="text-gray-600">Executive Dashboard & Performance Insights</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Selector */}
          <div className="flex items-center bg-surface-secondary rounded-lg p-1">
            <button
              onClick={() => setActiveView('executive')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeView === 'executive' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Executive
            </button>
            <button
              onClick={() => setActiveView('detailed')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeView === 'detailed' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Detailed
            </button>
            <button
              onClick={() => setActiveView('comparative')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeView === 'comparative' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Comparative
            </button>
          </div>
          
          {/* Time Range Selector */}
          <Select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="w-32"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
            <option value="1y">1 Year</option>
            <option value="all">All Time</option>
          </Select>
          
          {/* Actions */}
          <Button variant="outline">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <ShareIcon className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Executive View */}
      {activeView === 'executive' && (
        <div className="space-y-6">
          {/* Executive KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ExecutiveKPICard
              title="Total Cases"
              value={analyticsData.overview.totalCases}
              change={12.3}
              icon={<FileTextIcon className="h-6 w-6 text-white" />}
              color="bg-primary-500"
              subtitle="All time"
              trend="up"
            />
            <ExecutiveKPICard
              title="Resolution Rate"
              value={analyticsData.overview.responseRate}
              change={3.2}
              icon={<CheckCircle className="h-6 w-6 text-white" />}
              color="bg-success"
              subtitle="Success rate"
              trend="up"
              format={(val) => `${val}%`}
            />
            <ExecutiveKPICard
              title="Avg Response Time"
              value={analyticsData.overview.avgResolutionTime}
              change={-8.5}
              icon={<Clock className="h-6 w-6 text-white" />}
              color="bg-secondary-600"
              subtitle="Hours to resolution"
              trend="down"
              format={(val) => `${val}h`}
            />
            <ExecutiveKPICard
              title="Victim Recovery"
              value={analyticsData.overview.victimRecoveryRate}
              change={5.7}
              icon={<Heart className="h-6 w-6 text-white" />}
              color="bg-accent-600"
              subtitle="Recovery percentage"
              trend="up"
              format={(val) => `${val}%`}
            />
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ExecutiveKPICard
              title="Team Efficiency"
              value={analyticsData.overview.teamEfficiency}
              change={2.1}
              icon={<UsersIcon className="h-6 w-6 text-white" />}
              color="bg-primary-500"
              subtitle="Productivity score"
              trend="up"
              format={(val) => `${val}%`}
            />
            <ExecutiveKPICard
              title="User Satisfaction"
              value={analyticsData.overview.userSatisfaction}
              change={0.3}
              icon={<Star className="h-6 w-6 text-white" />}
              color="bg-warning"
              subtitle="Average rating"
              trend="up"
              format={(val) => `${val}/5`}
            />
            <ExecutiveKPICard
              title="ROI"
              value={analyticsData.overview.roi}
              change={18.7}
              icon={<DollarSign className="h-6 w-6 text-white" />}
              color="bg-success"
              subtitle="Return on investment"
              trend="up"
              format={(val) => `${val}%`}
            />
          </div>

          {/* Executive Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Case Trends */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Case Trends & Resolution</h3>
                  <Button variant="ghost" size="sm">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="cases" stackId="1" stroke="#ef4444" fill="#ef4444" name="Total Cases" />
                    <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10b981" fill="#10b981" name="Resolved" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Performance vs Targets</h3>
                  <Button variant="ghost" size="sm">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" fill="#3b82f6" name="Current" />
                    <Bar dataKey="target" fill="#10b981" name="Target" />
                    <Bar dataKey="benchmark" fill="#f59e0b" name="Industry Avg" />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>

          {/* Geographic Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Geographic Distribution</h3>
                <Button variant="ghost" size="sm">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.geographic}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cases" fill="#ef4444" name="Total Cases" />
                  <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                  <Bar dataKey="response" fill="#3b82f6" name="Response Rate %" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Demographics */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Victim Demographics</h3>
                <Button variant="ghost" size="sm">
                  <MoreVerticalIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.demographics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="male" fill="#3b82f6" name="Male" />
                  <Bar dataKey="female" fill="#ec4899" name="Female" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Detailed View */}
      {activeView === 'detailed' && (
        <div className="space-y-6">
          {/* Detailed Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Response Time</span>
                    <Badge className="bg-success/10 text-success border-success/20">Excellent</Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">2.4h</div>
                  <div className="text-xs text-gray-500">Target: 3.0h</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Resolution Rate</span>
                    <Badge className="bg-success/10 text-success border-success/20">Target Met</Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">87.3%</div>
                  <div className="text-xs text-gray-500">Target: 85.0%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '87%' }} />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Victim Recovery</span>
                    <Badge className="bg-warning/10 text-warning border-warning/20">Above Target</Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">76.8%</div>
                  <div className="text-xs text-gray-500">Target: 75.0%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: '76%' }} />
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Team Efficiency</span>
                    <Badge className="bg-success/10 text-success border-success/20">Excellent</Badge>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">92.1%</div>
                  <div className="text-xs text-gray-500">Target: 90.0%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Performance */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Monthly Performance Metrics</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="response" stroke="#3b82f6" name="Response Rate %" />
                    <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#10b981" name="Satisfaction" />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Case Distribution */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Case Distribution by Type</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Physical Abuse', value: 35, color: '#ef4444' },
                        { name: 'Neglect', value: 28, color: '#f59e0b' },
                        { name: 'Sexual Abuse', value: 20, color: '#8b5cf6' },
                        { name: 'Emotional Abuse', value: 12, color: '#3b82f6' },
                        { name: 'Child Labor', value: 5, color: '#10b981' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Physical Abuse', value: 35, color: '#ef4444' },
                        { name: 'Neglect', value: 28, color: '#f59e0b' },
                        { name: 'Sexual Abuse', value: 20, color: '#8b5cf6' },
                        { name: 'Emotional Abuse', value: 12, color: '#3b82f6' },
                        { name: 'Child Labor', value: 5, color: '#10b981' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>

          {/* Predictive Analytics */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Predictive Analytics</h3>
                <Badge variant="outline">ML Model v2.1</Badge>
              </div>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="predicted" stroke="#3b82f6" strokeDasharray="5 5" name="Predicted" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-gray-600">
                <p>Predictions based on historical patterns, seasonal trends, and external factors.</p>
                <p>Confidence intervals: 82-91%</p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Comparative View */}
      {activeView === 'comparative' && (
        <div className="space-y-6">
          {/* Industry Comparison */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Industry Benchmark Comparison</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.comparisons}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="us" fill="#3b82f6" name="ChildSafe NG" />
                  <Bar dataKey="industry" fill="#10b981" name="Industry Avg" />
                  <Bar dataKey="world" fill="#f59e0b" name="Global Avg" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Organization Comparison */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Organization Performance Comparison</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {analyticsData.benchmarks.map((org, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{org.organization}</h4>
                      <Badge variant={org.organization === 'ChildSafe NG' ? 'primary' : 'outline'}>
                        {org.cases.toLocaleString()} cases
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Response Time</p>
                        <p className="font-medium">{org.responseTime}h</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Resolution Rate</p>
                        <p className="font-medium">{org.resolutionRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Satisfaction</p>
                        <p className="font-medium">{org.satisfaction}/5</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Rank</p>
                        <p className="font-medium">#{index + 1}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Performance Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Performance Radar</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { metric: 'Response Time', ChildSafeNG: 95, Industry: 75, Global: 60 },
                    { metric: 'Resolution Rate', ChildSafeNG: 87, Industry: 78, Global: 72 },
                    { metric: 'Victim Recovery', ChildSafeNG: 77, Industry: 68, Global: 62 },
                    { metric: 'Cost Efficiency', ChildSafeNG: 90, Industry: 65, Global: 55 },
                    { metric: 'User Satisfaction', ChildSafeNG: 92, Industry: 82, Global: 76 },
                    { metric: 'Team Efficiency', ChildSafeNG: 92, Industry: 85, Global: 78 }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="ChildSafe NG" dataKey="ChildSafeNG" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Radar name="Industry" dataKey="Industry" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Radar name="Global" dataKey="Global" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Cost Analysis</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                    <div>
                      <p className="font-medium">Cost per Case</p>
                      <p className="text-sm text-gray-500">Average cost to resolve a case</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">$234.56</p>
                      <p className="text-sm text-success">-15% vs industry</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                    <div>
                      <p className="font-medium">ROI</p>
                      <p className="text-sm text-gray-500">Return on investment</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">342.5%</p>
                      <p className="text-sm text-success">+127% vs industry</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                    <div>
                      <p className="font-medium">Cost Savings</p>
                      <p className="text-sm text-gray-500">Annual cost savings</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">$1.2M</p>
                      <p className="text-sm text-success">+23% YoY</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

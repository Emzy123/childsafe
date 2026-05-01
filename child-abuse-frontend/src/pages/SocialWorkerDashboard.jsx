import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { socialWorkerApi } from '../api/dashboardApi';
import {
  FileText, AlertTriangle, CheckCircle, Clock, PlusCircle,
  Users, Activity, ChevronRight, ArrowUp, ArrowDown,
  Download, RefreshCw, Eye, Search, MapPin, Calendar
} from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Select, Alert, Badge, Spinner, KPICard } from '../components/ui';
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CHART_COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#f97316'];

export default function SocialWorkerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [caseStats, setCaseStats] = useState({ reported: 0, under_investigation: 0, with_agency: 0, closed: 0 });
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, statsRes] = await Promise.all([
        socialWorkerApi.getDashboard(),
        socialWorkerApi.getStatistics()
      ]);
      const data = dashRes.data;
      setDashboardData(data);
      setRecentCases(data.recentCases || []);
      if (data.caseStats) setCaseStats(data.caseStats);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = useMemo(() => {
    return recentCases.filter(c => {
      const matchesSearch = !searchQuery ||
        (c.caseRef || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.abuseType || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [recentCases, searchQuery, selectedStatus]);

  const abuseTypeData = useMemo(() => {
    const counts = recentCases.reduce((acc, c) => {
      acc[c.abuseType] = (acc[c.abuseType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value], i) => ({
      name, value, color: CHART_COLORS[i % CHART_COLORS.length]
    }));
  }, [recentCases]);

  const statusTrendData = [
    { name: 'Reported', value: caseStats.reported || 0 },
    { name: 'Under Investigation', value: caseStats.under_investigation || 0 },
    { name: 'With Agency', value: caseStats.with_agency || 0 },
    { name: 'Closed', value: caseStats.closed || 0 },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-critical/10 text-critical border-critical/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'medium': return 'bg-primary-100 text-primary-700 border-primary-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'reported': return <Clock className="h-4 w-4 text-warning" />;
      case 'under_investigation': return <AlertTriangle className="h-4 w-4 text-secondary-600" />;
      case 'with_agency': return <FileText className="h-4 w-4 text-accent-600" />;
      case 'closed': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      reported: 'Reported',
      under_investigation: 'Under Investigation',
      with_agency: 'With Agency',
      closed: 'Closed',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Spinner size="xl" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="critical">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <div>
              <strong>Connection Error</strong>
              <p className="text-sm mt-1">{error}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={fetchDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  const totalCases = dashboardData?.totalCases || 0;
  const activeCases = dashboardData?.activeCases || 0;
  const closedCases = dashboardData?.closedCases || 0;
  const newCases = dashboardData?.newCases || 0;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">Social Worker Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.fullName || user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={fetchDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Link to="/report">
            <Button variant="primary" size="sm">
              <PlusCircle className="h-4 w-4 mr-2" /> New Case
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Cases"
          value={totalCases}
          icon={<FileText className="h-6 w-6 text-white" />}
          color="bg-primary-500"
          subtitle="All time"
        />
        <KPICard
          title="Active Cases"
          value={activeCases}
          icon={<Activity className="h-6 w-6 text-white" />}
          color="bg-warning"
          subtitle="Needs attention"
          trend="up"
        />
        <KPICard
          title="New Reports"
          value={newCases}
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          color="bg-critical"
          subtitle="Pending review"
        />
        <KPICard
          title="Closed Cases"
          value={closedCases}
          icon={<CheckCircle className="h-6 w-6 text-white" />}
          color="bg-success"
          subtitle="Resolved"
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Case Status Breakdown */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Case Status Breakdown</h3>
          </CardHeader>
          <CardBody>
            {statusTrendData.every(d => d.value === 0) ? (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <p>No case data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={statusTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        {/* Abuse Types */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Abuse Types Distribution</h3>
          </CardHeader>
          <CardBody>
            {abuseTypeData.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400">
                <p>No abuse type data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <RechartsPieChart>
                  <Pie data={abuseTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {abuseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Recent Cases Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg font-semibold">Recent Cases</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="reported">Reported</option>
                <option value="under_investigation">Under Investigation</option>
                <option value="with_agency">With Agency</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filteredCases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="h-12 w-12 mb-3 opacity-40" />
              <p className="font-medium">No cases found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Case Ref</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Type</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Location</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCases.map((c, idx) => (
                    <tr key={c.id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-primary-700">{c.caseRef}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{c.abuseType || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                          {getStatusIcon(c.status)}
                          {getStatusLabel(c.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {c.location ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {typeof c.location === 'object' ? c.location.state || c.location.city || 'N/A' : c.location}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/cases/${c._id || c.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-6 py-4 border-t border-gray-100">
            <Link to="/cases">
              <Button variant="outline" className="w-full">
                View All Cases <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link to="/cases/new">
              <Button variant="primary" className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" /> New Case
              </Button>
            </Link>
            <Link to="/cases">
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" /> All Cases
              </Button>
            </Link>
            <Link to="/statistics">
              <Button variant="outline" className="w-full">
                <Activity className="h-4 w-4 mr-2" /> Statistics
              </Button>
            </Link>
            <Button variant="outline" className="w-full" onClick={fetchDashboardData}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

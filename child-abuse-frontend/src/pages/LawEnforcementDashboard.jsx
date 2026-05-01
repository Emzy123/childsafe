import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lawEnforcementApi } from '../api/dashboardApi';
import {
  Shield, FileText, AlertTriangle, CheckCircle, Clock,
  Users, Activity, ChevronRight, Search, MapPin, RefreshCw,
  Eye, Lock, Gavel, Fingerprint, Scale, FileSearch, Bell
} from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Alert, Badge, Spinner, KPICard } from '../components/ui';
import {
  BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#ef4444', '#f59e0b', '#6366f1', '#10b981', '#8b5cf6', '#f97316'];

export default function LawEnforcementDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [cases, setCases] = useState([]);
  const [investigations, setInvestigations] = useState([]);
  const [warrants, setWarrants] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, casesRes, investigationsRes, warrantsRes, alertsRes, statsRes] = await Promise.allSettled([
        lawEnforcementApi.getDashboard(),
        lawEnforcementApi.getCases(),
        lawEnforcementApi.getInvestigations(),
        lawEnforcementApi.getWarrants(),
        lawEnforcementApi.getAlerts(),
        lawEnforcementApi.getStatistics(),
      ]);

      if (dashRes.status === 'fulfilled') setDashboardData(dashRes.value.data);
      if (casesRes.status === 'fulfilled') setCases(Array.isArray(casesRes.value.data) ? casesRes.value.data : []);
      if (investigationsRes.status === 'fulfilled') setInvestigations(Array.isArray(investigationsRes.value.data) ? investigationsRes.value.data : []);
      if (warrantsRes.status === 'fulfilled') setWarrants(Array.isArray(warrantsRes.value.data) ? warrantsRes.value.data : []);
      if (alertsRes.status === 'fulfilled') setAlerts(Array.isArray(alertsRes.value.data) ? alertsRes.value.data : []);
      if (statsRes.status === 'fulfilled') setStatistics(statsRes.value.data);
    } catch (err) {
      console.error('Law enforcement dashboard error:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesSearch = !searchQuery ||
        (c.caseRef || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cases, searchQuery, statusFilter]);

  const casesByType = useMemo(() => {
    const counts = cases.reduce((acc, c) => {
      acc[c.abuseType] = (acc[c.abuseType] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value], i) => ({
      name, value, color: COLORS[i % COLORS.length]
    }));
  }, [cases]);

  const casesByStatus = useMemo(() => {
    const counts = cases.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace(/_/g, ' '), value
    }));
  }, [cases]);

  const getStatusBadgeClass = (status) => {
    const map = {
      reported: 'bg-warning/10 text-warning',
      under_investigation: 'bg-primary-100 text-primary-700',
      with_agency: 'bg-accent-100 text-accent-700',
      closed: 'bg-success/10 text-success',
    };
    return map[status] || 'bg-gray-100 text-gray-600';
  };

  const getPriorityClass = (priority) => {
    const map = {
      critical: 'bg-critical/10 text-critical',
      high: 'bg-warning/10 text-warning',
      medium: 'bg-primary-100 text-primary-700',
      low: 'bg-success/10 text-success',
    };
    return map[priority] || 'bg-gray-100 text-gray-600';
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
              <Button variant="outline" size="sm" className="mt-3" onClick={fetchAll}>
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  const totalCases = dashboardData?.totalCases ?? cases.length;
  const activeCases = dashboardData?.activeCases ?? cases.filter(c => c.status !== 'closed').length;
  const closedCases = dashboardData?.closedCases ?? cases.filter(c => c.status === 'closed').length;
  const arrestsMade = dashboardData?.arrestsMade ?? 0;
  const warrantsIssued = dashboardData?.warrantsIssued ?? warrants.length;
  const evidenceCollected = dashboardData?.evidenceCollected ?? 0;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">Law Enforcement Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome, {user?.fullName || user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {alerts.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-critical/10 text-critical text-sm font-medium">
              <Bell className="h-4 w-4" />
              {alerts.length} Active Alert{alerts.length !== 1 ? 's' : ''}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={fetchAll}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {['overview', 'cases', 'investigations', 'warrants', 'alerts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab}
            {tab === 'alerts' && alerts.length > 0 && (
              <span className="ml-1.5 bg-critical text-white text-xs px-1.5 py-0.5 rounded-full">{alerts.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <KPICard title="Total Cases" value={totalCases} icon={<FileText className="h-6 w-6 text-white" />} color="bg-primary-500" subtitle="All time" />
            <KPICard title="Active Cases" value={activeCases} icon={<Activity className="h-6 w-6 text-white" />} color="bg-warning" subtitle="Under review" trend="up" />
            <KPICard title="Closed Cases" value={closedCases} icon={<CheckCircle className="h-6 w-6 text-white" />} color="bg-success" subtitle="Resolved" />
            <KPICard title="Arrests Made" value={arrestsMade} icon={<Lock className="h-6 w-6 text-white" />} color="bg-critical" subtitle="This year" trend="up" />
            <KPICard title="Warrants Issued" value={warrantsIssued} icon={<FileText className="h-6 w-6 text-white" />} color="bg-secondary-500" subtitle="Active warrants" />
            <KPICard title="Evidence Collected" value={evidenceCollected} icon={<Search className="h-6 w-6 text-white" />} color="bg-accent-500" subtitle="Total items" trend="up" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><h3 className="text-lg font-semibold">Cases by Status</h3></CardHeader>
              <CardBody>
                {casesByStatus.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-gray-400">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={casesByStatus} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h3 className="text-lg font-semibold">Cases by Type</h3></CardHeader>
              <CardBody>
                {casesByType.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-gray-400">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <RechartsPieChart>
                      <Pie data={casesByType} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                        {casesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )}
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {/* ── CASES ── */}
      {activeTab === 'cases' && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-lg font-semibold">All Cases ({filteredCases.length})</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search case ref..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All</option>
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
                <p>No cases found</p>
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
                      <tr key={c.id || idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm font-semibold text-primary-700">{c.caseRef}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{c.abuseType || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadgeClass(c.status)}`}>
                            {(c.status || '').replace(/_/g, ' ')}
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
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" /> View</Button>
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
      )}

      {/* ── INVESTIGATIONS ── */}
      {activeTab === 'investigations' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">My Investigations ({investigations.length})</h3>
          </CardHeader>
          <CardBody className="p-0">
            {investigations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <FileSearch className="h-12 w-12 mb-3 opacity-40" />
                <p>No investigations found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {investigations.map((inv, idx) => (
                  <div key={inv.id || idx} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{inv.title || inv.caseRef || `INV-${idx + 1}`}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{inv.type || inv.abuseType || '—'}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadgeClass(inv.status)}`}>
                        {(inv.status || '').replace(/_/g, ' ')}
                      </span>
                    </div>
                    {inv.createdAt && (
                      <p className="text-xs text-gray-400 mt-2">Opened: {new Date(inv.createdAt).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* ── WARRANTS ── */}
      {activeTab === 'warrants' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Warrants ({warrants.length})</h3>
          </CardHeader>
          <CardBody className="p-0">
            {warrants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Scale className="h-12 w-12 mb-3 opacity-40" />
                <p>No warrants found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {warrants.map((w, idx) => (
                  <div key={w.id || idx} className="px-6 py-4 hover:bg-gray-50 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{w.warrantNumber || w.title || `WRT-${idx + 1}`}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{w.type || '—'}</p>
                      {w.issuedDate && <p className="text-xs text-gray-400 mt-1">Issued: {new Date(w.issuedDate).toLocaleDateString()}</p>}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusBadgeClass(w.status)}`}>
                      {(w.status || '').replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* ── ALERTS ── */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardBody>
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Bell className="h-12 w-12 mb-3 opacity-40" />
                  <p>No active alerts</p>
                </div>
              </CardBody>
            </Card>
          ) : (
            alerts.map((alert, idx) => (
              <Alert key={alert.id || idx} variant={alert.severity === 'critical' ? 'critical' : alert.severity === 'warning' ? 'warning' : 'info'}>
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 mt-0.5" />
                  <div>
                    <strong>{alert.title || alert.type || 'Alert'}</strong>
                    <p className="text-sm mt-1">{alert.message || alert.description || '—'}</p>
                    {alert.createdAt && (
                      <p className="text-xs mt-2 opacity-70">{new Date(alert.createdAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </Alert>
            ))
          )}
        </div>
      )}
    </div>
  );
}

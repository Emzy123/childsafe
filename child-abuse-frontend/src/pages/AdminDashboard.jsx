import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminApi } from '../api/dashboardApi';
import {
  Shield, FileText, AlertTriangle, CheckCircle, Clock, PlusCircle,
  Users, Activity, Settings, Search, ChevronRight, ArrowUp, ArrowDown,
  RefreshCw, Eye, Edit, Trash2, MapPin, Calendar, Server, HardDrive,
  Wifi, Cpu, UserCheck, UserX, ShieldCheck, Database, Network,
  TrendingUp, TrendingDown, Key, UserPlus, Ban, Info
} from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Select, Alert, Badge, Spinner, KPICard } from '../components/ui';
import {
  BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#f97316'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [userStats, setUserStats] = useState([]);
  const [casesByStatus, setCasesByStatus] = useState([]);
  const [casesByType, setCasesByType] = useState([]);
  const [casesByLocation, setCasesByLocation] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        dashboardRes,
        statusRes,
        typeRes,
        locationRes,
        healthRes,
        logsRes
      ] = await Promise.allSettled([
        adminApi.getDashboard(),
        adminApi.getCasesByStatus(),
        adminApi.getCasesByType(),
        adminApi.getCasesByLocation(),
        adminApi.getSystemHealth(),
        adminApi.getAuditLogs(),
      ]);

      if (dashboardRes.status === 'fulfilled') setOverview(dashboardRes.value.data);
      if (statusRes.status === 'fulfilled') {
        const data = statusRes.value.data;
        setCasesByStatus(
          Array.isArray(data)
            ? data
            : Object.entries(data).map(([name, value]) => ({ name, value }))
        );
      }
      if (typeRes.status === 'fulfilled') {
        const data = typeRes.value.data;
        setCasesByType(
          Array.isArray(data)
            ? data
            : Object.entries(data).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))
        );
      }
      if (locationRes.status === 'fulfilled') {
        const data = locationRes.value.data;
        setCasesByLocation(Array.isArray(data) ? data : []);
      }
      if (healthRes.status === 'fulfilled') setSystemHealth(healthRes.value.data);
      if (logsRes.status === 'fulfilled') {
        const data = logsRes.value.data;
        setAuditLogs(Array.isArray(data) ? data : (data?.data || []));
      }
    } catch (err) {
      console.error('Admin dashboard fetch error:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatus = (status) => {
    const map = { healthy: 'success', degraded: 'warning', down: 'critical' };
    return map[status] || 'info';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Spinner size="xl" />
          <p className="text-gray-500">Loading admin dashboard...</p>
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

  const totalUsers = overview?.totalUsers || 0;
  const totalCases = overview?.totalCases || 0;
  const activeCases = overview?.activeCases || 0;
  const pendingCases = overview?.pendingCases || 0;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">System overview & management</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={fetchAll}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Link to="/admin/users">
            <Button variant="primary" size="sm">
              <UserPlus className="h-4 w-4 mr-2" /> Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {/* Module Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {['overview', 'cases', 'system', 'audit'].map(mod => (
          <button
            key={mod}
            onClick={() => setSelectedModule(mod)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
              selectedModule === mod
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW MODULE ── */}
      {selectedModule === 'overview' && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Users"
              value={totalUsers}
              icon={<Users className="h-6 w-6 text-white" />}
              color="bg-primary-500"
              subtitle="Registered accounts"
            />
            <KPICard
              title="Total Cases"
              value={totalCases}
              icon={<FileText className="h-6 w-6 text-white" />}
              color="bg-secondary-500"
              subtitle="All time"
            />
            <KPICard
              title="Active Cases"
              value={activeCases}
              icon={<Activity className="h-6 w-6 text-white" />}
              color="bg-warning"
              subtitle="Requires action"
              trend="up"
            />
            <KPICard
              title="Pending Review"
              value={pendingCases}
              icon={<Clock className="h-6 w-6 text-white" />}
              color="bg-critical"
              subtitle="Unassigned"
            />
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Cases by Status</h3>
              </CardHeader>
              <CardBody>
                {casesByStatus.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-gray-400">No data</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={casesByStatus} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Cases by Type</h3>
              </CardHeader>
              <CardBody>
                {casesByType.length === 0 ? (
                  <div className="flex items-center justify-center h-48 text-gray-400">No data</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <RechartsPieChart>
                      <Pie data={casesByType} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                        {casesByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
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

          {/* Cases by Location */}
          {casesByLocation.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Cases by Location</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {casesByLocation.slice(0, 6).map((loc, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-800">{loc.state || loc.name || loc._id}</span>
                      </div>
                      <span className="font-semibold text-primary-600">{loc.count || loc.value} cases</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}

      {/* ── CASES MODULE ── */}
      {selectedModule === 'cases' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Case Management</h3>
              <Link to="/cases">
                <Button variant="primary" size="sm">
                  View All Cases <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {casesByStatus.map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="text-2xl font-bold text-gray-900">{s.value || s.count || 0}</div>
                  <div className="text-sm text-gray-500 capitalize mt-1">{(s.name || s._id || '').replace(/_/g, ' ')}</div>
                </div>
              ))}
            </div>
            <Link to="/admin/analytics">
              <Button variant="outline" className="w-full">
                <Activity className="h-4 w-4 mr-2" /> Deep Analytics
              </Button>
            </Link>
          </CardBody>
        </Card>
      )}

      {/* ── SYSTEM MODULE ── */}
      {selectedModule === 'system' && (
        <div className="space-y-6">
          {systemHealth ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <KPICard title="System Status" value={systemHealth.status || 'N/A'} icon={<Server className="h-6 w-6 text-white" />} color={systemHealth.status === 'healthy' ? 'bg-success' : 'bg-critical'} subtitle="Current status" />
              <KPICard title="Uptime" value={`${systemHealth.uptime || 0}%`} icon={<Wifi className="h-6 w-6 text-white" />} color="bg-primary-500" subtitle="This month" />
              <KPICard title="Response Time" value={`${systemHealth.responseTime || 0}ms`} icon={<Cpu className="h-6 w-6 text-white" />} color="bg-secondary-500" subtitle="Average" />
              <KPICard title="Active Connections" value={systemHealth.activeConnections || 0} icon={<Network className="h-6 w-6 text-white" />} color="bg-accent-500" subtitle="Right now" />
              <KPICard title="DB Connections" value={systemHealth.databaseConnections || 0} icon={<Database className="h-6 w-6 text-white" />} color="bg-warning" subtitle="Active pool" />
              <KPICard title="Cache Hit Rate" value={`${systemHealth.cacheHitRate || 0}%`} icon={<HardDrive className="h-6 w-6 text-white" />} color="bg-success" subtitle="Cache efficiency" />
            </div>
          ) : (
            <Alert variant="info">
              <Info className="h-4 w-4 mr-2 inline" />
              System health data is unavailable.
            </Alert>
          )}
          <div className="flex gap-3">
            <Link to="/admin/system">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" /> System Settings
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ── AUDIT MODULE ── */}
      {selectedModule === 'audit' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Audit Logs</h3>
          </CardHeader>
          <CardBody className="p-0">
            {auditLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <FileText className="h-12 w-12 mb-3 opacity-40" />
                <p>No audit logs available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Action</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">User</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Timestamp</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {auditLogs.slice(0, 20).map((log, idx) => (
                      <tr key={log.id || idx} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm font-medium text-gray-800">{log.action || log.type || '—'}</td>
                        <td className="px-6 py-3 text-sm text-gray-600">{log.userId || log.user || '—'}</td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            log.result === 'success' ? 'bg-success/10 text-success' : 'bg-critical/10 text-critical'
                          }`}>
                            {log.result || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}

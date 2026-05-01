import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import {
  Users, Activity, CheckCircle, Clock, PlusCircle, Settings,
  Search, ChevronRight, ArrowUp, Eye, FileText, Globe,
  Building, Network, ShieldCheck, FolderSync, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Alert, Badge, Spinner, KPICard } from '../components/ui';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PartnerAgencyDashboard() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Partner agencies access shared incidents
      const res = await api.get('/incidents');
      const data = res.data;
      setCases(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      console.error('Partner agency dashboard error:', err);
      setError('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesSearch = !searchQuery ||
        (c.caseRef || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [cases, searchQuery, selectedStatus]);

  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status !== 'closed').length;
  const withAgency = cases.filter(c => c.status === 'with_agency').length;
  const closedCases = cases.filter(c => c.status === 'closed').length;

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
              <Button variant="outline" size="sm" className="mt-3" onClick={fetchData}>
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
              </Button>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Agency Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Cross-Agency Collaboration & Resource Sharing</p>
        </div>
        <div className="flex gap-2 mt-4 lg:mt-0">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Cases"
          value={totalCases}
          icon={<FileText className="h-6 w-6 text-white" />}
          color="bg-primary-500"
          subtitle="All incidents"
        />
        <KPICard
          title="Active Cases"
          value={activeCases}
          icon={<Activity className="h-6 w-6 text-white" />}
          color="bg-warning"
          subtitle="Under review"
          trend="up"
        />
        <KPICard
          title="With Agency"
          value={withAgency}
          icon={<Network className="h-6 w-6 text-white" />}
          color="bg-secondary-500"
          subtitle="Referred cases"
        />
        <KPICard
          title="Resolved Cases"
          value={closedCases}
          icon={<ShieldCheck className="h-6 w-6 text-white" />}
          color="bg-success"
          subtitle="Closed"
          trend="up"
        />
      </div>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg font-semibold">Shared Cases ({filteredCases.length})</h3>
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
              <FolderSync className="h-12 w-12 mb-3 opacity-40" />
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
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCases.map((c, idx) => (
                    <tr key={c.id || c._id || idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-primary-700">{c.caseRef}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{c.abuseType || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          c.status === 'closed' ? 'bg-success/10 text-success' :
                          c.status === 'with_agency' ? 'bg-accent-100 text-accent-700' :
                          c.status === 'under_investigation' ? 'bg-primary-100 text-primary-700' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {(c.status || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/cases/${c.id || c._id}`}>
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
    </div>
  );
;
}

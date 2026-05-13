import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Download, Calendar, Filter } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState({
    overview: {},
    casesByStatus: {},
    casesByType: {},
    casesByLocation: {},
    userPerformance: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const [overview, status, type, location, performance] = await Promise.all([
        api.get('/admin/statistics/overview', { params: dateRange }),
        api.get('/admin/statistics/cases-by-status', { params: dateRange }),
        api.get('/admin/statistics/cases-by-type', { params: dateRange }),
        api.get('/admin/statistics/cases-by-location', { params: dateRange }),
        api.get('/admin/statistics/user-performance', { params: dateRange })
      ]);

      setStatistics({
        overview: overview.data,
        casesByStatus: status.data,
        casesByType: type.data,
        casesByLocation: location.data,
        userPerformance: performance.data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (reportType) => {
    try {
      const response = await api.post('/admin/export/statistics', {
        format: 'excel',
        reportType,
        filters: dateRange
      });
      
      // Create download link
      const link = document.createElement('a');
      link.href = response.data.downloadUrl;
      link.download = response.data.filename;
      link.click();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive system analytics and reporting</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('monthly_summary')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Cases</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{statistics.overview.totalCases || 0}</p>
          <p className="text-sm text-gray-600 mt-2">
            {statistics.overview.averageResolutionTime ? 
              `Avg Resolution: ${Math.round(statistics.overview.averageResolutionTime)} days` : 
              'No resolution data'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Active Cases</h3>
            <Activity className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {statistics.casesByStatus.reported || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">Currently reported</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Closed Cases</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {statistics.casesByStatus.closed || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">Successfully resolved</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Under Investigation</h3>
            <TrendingDown className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {statistics.casesByStatus.under_investigation || 0}
          </p>
          <p className="text-sm text-gray-600 mt-2">Active investigations</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Cases by Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Cases by Status</h2>
          <div className="space-y-4">
            {Object.entries(statistics.casesByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    status === 'reported' ? 'bg-yellow-500' :
                    status === 'under_investigation' ? 'bg-blue-500' :
                    status === 'with_agency' ? 'bg-purple-500' :
                    'bg-green-500'
                  }`}></div>
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cases by Type */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Cases by Abuse Type</h2>
          <div className="space-y-4">
            {Object.entries(statistics.casesByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    type === 'physical' ? 'bg-red-500' :
                    type === 'sexual' ? 'bg-purple-500' :
                    type === 'emotional' ? 'bg-blue-500' :
                    type === 'neglect' ? 'bg-orange-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="capitalize">{type}</span>
                </div>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cases by Location */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Cases by Location</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(statistics.casesByLocation).slice(0, 9).map(([location, count]) => (
            <div key={location} className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">{location}</p>
              <p className="text-2xl font-bold text-red-600">{count}</p>
              <p className="text-sm text-gray-600">cases</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Closed Cases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Cases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Resolution Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statistics.userPerformance.map((user) => (
                <tr key={user.userId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'social_worker' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.totalCases}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.closedCases}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.activeCases}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.averageResolutionTime ? `${Math.round(user.averageResolutionTime)} days` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

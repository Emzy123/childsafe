import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { BarChart3, TrendingUp, PieChart, Activity, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Statistics() {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      let endpoint;
      if (user?.role === 'law_enforcement') {
        endpoint = '/law-enforcement/statistics';
      } else if (user?.role === 'admin') {
        endpoint = '/admin/statistics';
      } else {
        endpoint = '/statistics';
      }
      
      const response = await api.get(endpoint);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No statistics data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <p className="text-gray-600">Comprehensive case statistics and analysis</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Cases</p>
              <p className="text-3xl font-bold text-gray-900">
                {Object.values(statistics.casesByStatus || {}).reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <Activity className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Cases</p>
              <p className="text-3xl font-bold text-red-600">
                {statistics.casesByStatus?.reported || 0 + statistics.casesByStatus?.under_investigation || 0}
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Closed Cases</p>
              <p className="text-3xl font-bold text-green-600">
                {statistics.casesByStatus?.closed || 0}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">With Agency</p>
              <p className="text-3xl font-bold text-purple-600">
                {statistics.casesByStatus?.with_agency || 0}
              </p>
            </div>
            <Clock className="h-10 w-10 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Cases by Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-red-600" />
            Cases by Status
          </h2>
          <div className="space-y-4">
            {Object.entries(statistics.casesByStatus || {}).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{status.replace('_', ' ')}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full" 
                      style={{ width: `${(count / Object.values(statistics.casesByStatus || {}).reduce((a, b) => a + b, 0)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Cases by Abuse Type
          </h2>
          <div className="space-y-4">
            {Object.entries(statistics.casesByType || {}).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">{type}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full" 
                      style={{ width: `${(count / Object.values(statistics.casesByType || {}).reduce((a, b) => a + b, 0)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      {statistics.monthlyTrend && statistics.monthlyTrend.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Monthly Trend
          </h2>
          <div className="space-y-3">
            {statistics.monthlyTrend.map((trend, index) => (
              <div key={trend.month} className="flex justify-between items-center">
                <span className="text-gray-600">{trend.month}</span>
                <div className="flex items-center">
                  <div className="w-48 bg-gray-200 rounded-full h-3 mr-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full" 
                      style={{ width: `${Math.min((trend.count / Math.max(...statistics.monthlyTrend.map(t => t.count))) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{trend.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Case Resolution</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-semibold text-green-600">
                {Math.round((statistics.casesByStatus?.closed || 0) / Object.values(statistics.casesByStatus || {}).reduce((a, b) => a + b, 0) * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Investigations</span>
              <span className="font-semibold text-red-600">
                {statistics.casesByStatus?.under_investigation || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Review</span>
              <span className="font-semibold text-yellow-600">
                {statistics.casesByStatus?.reported || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Case Types</h3>
          <div className="space-y-3">
            {Object.entries(statistics.casesByType || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{type}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Agency Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">With Agency</span>
              <span className="font-semibold text-purple-600">
                {statistics.casesByStatus?.with_agency || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Under Investigation</span>
              <span className="font-semibold text-blue-600">
                {statistics.casesByStatus?.under_investigation || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Closed</span>
              <span className="font-semibold text-green-600">
                {statistics.casesByStatus?.closed || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

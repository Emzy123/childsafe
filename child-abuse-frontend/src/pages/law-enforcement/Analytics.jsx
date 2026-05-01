import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { TrendingUp, TrendingDown, Activity, Clock, Users, Target, BarChart3 } from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      let endpoint;
      if (user?.role === 'law_enforcement') {
        endpoint = '/law-enforcement/analytics';
      } else if (user?.role === 'admin') {
        endpoint = '/admin/analytics';
      } else {
        endpoint = '/analytics';
      }
      
      const response = await api.get(endpoint);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Performance metrics and case analysis</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Cases</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalCases}</p>
            </div>
            <Activity className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Closed Cases</p>
              <p className="text-3xl font-bold text-green-600">{analytics.closedCases}</p>
            </div>
            <Target className="h-10 w-10 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Cases</p>
              <p className="text-3xl font-bold text-red-600">{analytics.activeCases}</p>
            </div>
            <Activity className="h-10 w-10 text-red-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold text-purple-600">{analytics.completionRate}%</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Resolution Time</span>
              <span className="font-semibold">{analytics.averageResolutionTime} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Perpetrator Arrests</span>
              <span className="font-semibold">{analytics.perpetratorArrests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Warrants Issued</span>
              <span className="font-semibold">{analytics.warrantsIssued}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Case Status Distribution</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Reported</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${analytics.casesByStatus?.reported || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{analytics.casesByStatus?.reported || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Under Investigation</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${analytics.casesByStatus?.under_investigation || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{analytics.casesByStatus?.under_investigation || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">With Agency</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${analytics.casesByStatus?.with_agency || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{analytics.casesByStatus?.with_agency || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Closed</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${analytics.casesByStatus?.closed || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{analytics.casesByStatus?.closed || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Types Analysis */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Cases by Abuse Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(analytics.casesByType || {}).map(([type, count]) => (
            <div key={type} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 capitalize mb-2">{type}</h3>
              <p className="text-2xl font-bold text-red-600">{count}</p>
              <p className="text-sm text-gray-500">cases</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trend */}
      {analytics.monthlyTrend && analytics.monthlyTrend.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Trend</h2>
          <div className="space-y-3">
            {analytics.monthlyTrend.map((trend, index) => (
              <div key={trend.month} className="flex justify-between items-center">
                <span className="text-gray-600">{trend.month}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((trend.count / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{trend.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

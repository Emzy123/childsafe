import { useEffect, useState } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#dc2626', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/incidents/statistics/dashboard');
      setStats(response.data);
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statistics & Analytics</h1>
        <p className="text-gray-600">Data-driven insights for child protection</p>
      </div>

      {/* Total Cases Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Total Reported Cases</p>
          <p className="text-5xl font-bold text-red-600">{stats?.total || 0}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Abuse Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Abuse Type Distribution</h2>
          {stats?.byAbuseType && stats.byAbuseType.length > 0 ? (
            <PieChart width={400} height={300}>
              <Pie
                data={stats.byAbuseType}
                cx={200}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="abuseType"
              >
                {stats.byAbuseType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Case Status Distribution</h2>
          {stats?.byStatus && stats.byStatus.length > 0 ? (
            <BarChart width={400} height={300} data={stats.byStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#dc2626" />
            </BarChart>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
          {stats?.byMonth && stats.byMonth.length > 0 ? (
            <LineChart width={800} height={300} data={stats.byMonth.reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#dc2626" strokeWidth={2} />
            </LineChart>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>

      {/* Export Section */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Export Reports</h2>
        <p className="text-gray-600 mb-4">Generate and download reports for official use</p>
        <div className="flex space-x-4">
          <button
            onClick={() => window.print()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Print Report
          </button>
          <button
            className="border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:border-red-600 hover:text-red-600"
          >
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
}

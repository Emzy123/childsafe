import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { Search, Plus, FileText, Download, Eye, Calendar, Filter } from 'lucide-react';

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      let endpoint;
      if (user?.role === 'law_enforcement') {
        endpoint = '/law-enforcement/reports';
      } else if (user?.role === 'admin') {
        endpoint = '/admin/reports';
      } else {
        endpoint = '/reports';
      }
      
      const response = await api.get(endpoint);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.title?.toLowerCase().includes(search.toLowerCase()) ||
      report.caseRef?.toLowerCase().includes(search.toLowerCase()) ||
      report.type?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = !statusFilter || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      investigation: 'bg-red-100 text-red-800',
      evidence: 'bg-purple-100 text-purple-800',
      arrest: 'bg-orange-100 text-orange-800',
      final: 'bg-green-100 text-green-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Manage investigation reports and documentation</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="submitted">Submitted</option>
            </select>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Report
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/law-enforcement/reports/${report.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {report.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {report.caseRef}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/law-enforcement/reports/${report.id}`;
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle download
                          console.log('Download report:', report.id);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reports Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {reports.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <FileText className="h-10 w-10 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600">
                {reports.filter(r => r.status === 'in_progress').length}
              </p>
            </div>
            <FileText className="h-10 w-10 text-yellow-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Investigation</p>
              <p className="text-3xl font-bold text-red-600">
                {reports.filter(r => r.type === 'investigation').length}
              </p>
            </div>
            <FileText className="h-10 w-10 text-red-600 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { Search, Plus, Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Investigations() {
  const { user } = useAuth();
  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInvestigations();
  }, []);

  const fetchInvestigations = async () => {
    try {
      let endpoint;
      if (user?.role === 'law_enforcement') {
        endpoint = '/law-enforcement/investigations';
      } else if (user?.role === 'admin') {
        endpoint = '/admin/investigations';
      } else {
        endpoint = '/investigations';
      }
      
      const response = await api.get(endpoint);
      setInvestigations(response.data);
    } catch (error) {
      console.error('Error fetching investigations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestigations = investigations.filter((investigation) => {
    const searchLower = search.toLowerCase();
    return (
      investigation.title?.toLowerCase().includes(searchLower) ||
      investigation.caseRef?.toLowerCase().includes(searchLower) ||
      investigation.abuseType?.toLowerCase().includes(searchLower) ||
      investigation.location?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      on_hold: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-gray-900">Investigations</h1>
        <p className="text-gray-600">Manage and track ongoing investigations</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search investigations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Investigation
          </button>
        </div>
      </div>

      {/* Investigations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investigation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Abuse Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvestigations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No investigations found
                </td>
              </tr>
            ) : (
              filteredInvestigations.map((investigation) => (
                <tr
                  key={investigation.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/law-enforcement/investigations/${investigation.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {investigation.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {investigation.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {investigation.caseRef}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {investigation.abuseType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(investigation.priority)}`}>
                      {investigation.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investigation.status)}`}>
                      {investigation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {investigation.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(investigation.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Investigation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Investigations</p>
              <p className="text-3xl font-bold text-gray-900">{investigations.length}</p>
            </div>
            <Activity className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-3xl font-bold text-red-600">
                {investigations.filter(i => i.status === 'active').length}
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {investigations.filter(i => i.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">High Priority</p>
              <p className="text-3xl font-bold text-red-600">
                {investigations.filter(i => i.priority === 'high').length}
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-600 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}

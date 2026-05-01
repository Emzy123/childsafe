import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { Search, Plus, Users, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Collaborations() {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      let endpoint;
      if (user?.role === 'law_enforcement') {
        endpoint = '/law-enforcement/collaborations';
      } else if (user?.role === 'admin') {
        endpoint = '/admin/collaborations';
      } else {
        endpoint = '/collaborations';
      }
      
      const response = await api.get(endpoint);
      setCollaborations(response.data);
    } catch (error) {
      console.error('Error fetching collaborations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCollaborations = collaborations.filter((collaboration) => {
    const searchLower = search.toLowerCase();
    return (
      collaboration.caseRef?.toLowerCase().includes(searchLower) ||
      collaboration.with?.toLowerCase().includes(searchLower) ||
      collaboration.type?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      on_hold: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-gray-900">Collaborations</h1>
        <p className="text-gray-600">Manage inter-agency collaborations and partnerships</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search collaborations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Collaboration
          </button>
        </div>
      </div>

      {/* Collaborations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collaboration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Partner
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCollaborations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No collaborations found
                </td>
              </tr>
            ) : (
              filteredCollaborations.map((collaboration) => (
                <tr
                  key={collaboration.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/law-enforcement/collaborations/${collaboration.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Case Collaboration
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {collaboration.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {collaboration.caseRef}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {collaboration.with}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {collaboration.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(collaboration.status)}`}>
                      {collaboration.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(collaboration.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Collaboration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Collaborations</p>
              <p className="text-3xl font-bold text-gray-900">{collaborations.length}</p>
            </div>
            <Users className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-3xl font-bold text-green-600">
                {collaborations.filter(c => c.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {collaborations.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Case Updates</p>
              <p className="text-3xl font-bold text-purple-600">
                {collaborations.filter(c => c.type === 'case_update').length}
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {collaborations.slice(0, 5).map((collaboration) => (
            <div key={collaboration.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Collaboration with {collaboration.with}
                  </p>
                  <p className="text-xs text-gray-500">
                    Case: {collaboration.caseRef} • {collaboration.type}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {new Date(collaboration.createdAt).toLocaleDateString()}
                </p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(collaboration.status)}`}>
                  {collaboration.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

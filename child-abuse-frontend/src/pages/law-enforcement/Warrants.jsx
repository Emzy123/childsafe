import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { Search, Plus, FileText, AlertTriangle, Clock } from 'lucide-react';

export default function Warrants() {
  const { user } = useAuth();
  const [warrants, setWarrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchWarrants();
  }, []);

  const fetchWarrants = async () => {
    try {
      let endpoint;
      if (user?.role === 'law_enforcement') {
        endpoint = '/law-enforcement/warrants';
      } else if (user?.role === 'admin') {
        endpoint = '/admin/warrants';
      } else {
        endpoint = '/warrants';
      }
      
      const response = await api.get(endpoint);
      setWarrants(response.data);
    } catch (error) {
      console.error('Error fetching warrants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWarrants = warrants.filter((warrant) => {
    const searchLower = search.toLowerCase();
    return (
      warrant.target?.toLowerCase().includes(searchLower) ||
      warrant.type?.toLowerCase().includes(searchLower) ||
      warrant.caseRef?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800',
      executed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      arrest: 'bg-red-100 text-red-800',
      search: 'bg-blue-100 text-blue-800',
      seizure: 'bg-purple-100 text-purple-800',
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
        <h1 className="text-3xl font-bold text-gray-900">Warrants</h1>
        <p className="text-gray-600">Manage legal warrants and court orders</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search warrants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Warrant
          </button>
        </div>
      </div>

      {/* Warrants Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warrant ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issued
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredWarrants.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No warrants found
                </td>
              </tr>
            ) : (
              filteredWarrants.map((warrant) => (
                <tr
                  key={warrant.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/law-enforcement/warrants/${warrant.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    {warrant.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(warrant.type)}`}>
                      {warrant.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {warrant.target}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {warrant.caseRef}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(warrant.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(warrant.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(warrant.status)}`}>
                      {warrant.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Warrants Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Warrants</p>
              <p className="text-3xl font-bold text-gray-900">{warrants.length}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-3xl font-bold text-red-600">
                {warrants.filter(w => w.status === 'active').length}
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
                {warrants.filter(w => w.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-10 w-10 text-yellow-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Executed</p>
              <p className="text-3xl font-bold text-green-600">
                {warrants.filter(w => w.status === 'executed').length}
              </p>
            </div>
            <FileText className="h-10 w-10 text-green-600 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}

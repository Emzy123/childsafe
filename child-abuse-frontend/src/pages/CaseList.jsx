import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { Search, Filter } from 'lucide-react';

export default function CaseList() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      let endpoint;
      if (user?.role === 'admin') {
        endpoint = '/admin/incidents';
      } else if (user?.role === 'social_worker') {
        endpoint = '/social-worker/cases';
      } else if (user?.role === 'law_enforcement') {
        endpoint = '/law-enforcement/cases';
      } else {
        endpoint = '/incidents';
      }
      
      const response = await api.get(endpoint);
      // Admin API returns { incidents: [...] }, others return [...]
      setCases(response.data.incidents || response.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch = caseItem.caseRef.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || caseItem.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      reported: 'bg-yellow-100 text-yellow-800',
      under_investigation: 'bg-blue-100 text-blue-800',
      with_agency: 'bg-purple-100 text-purple-800',
      closed: 'bg-green-100 text-green-800',
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
        <h1 className="text-3xl font-bold text-gray-900">All Cases</h1>
        <p className="text-gray-600">Manage and track child abuse cases</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by case reference..."
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
              <option value="reported">Reported</option>
              <option value="under_investigation">Under Investigation</option>
              <option value="with_agency">With Agency</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Abuse Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Incident Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No cases found
                </td>
              </tr>
            ) : (
              filteredCases.map((caseItem) => (
                <tr
                  key={caseItem._id || caseItem.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.location.href = `/cases/${caseItem._id || caseItem.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    {caseItem.caseRef}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {caseItem.abuseType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(caseItem.incidentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {caseItem.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

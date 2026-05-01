import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { Search, Plus, AlertTriangle, User } from 'lucide-react';

export default function Perpetrators() {
  const { user } = useAuth();
  const [perpetrators, setPerpetrators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPerpetrators();
  }, []);

  const fetchPerpetrators = async () => {
    try {
      let endpoint;
      if (user?.role === 'law_enforcement') {
        endpoint = '/law-enforcement/perpetrators';
      } else if (user?.role === 'admin') {
        endpoint = '/admin/perpetrators';
      } else {
        endpoint = '/perpetrators';
      }
      
      const response = await api.get(endpoint);
      setPerpetrators(response.data);
    } catch (error) {
      console.error('Error fetching perpetrators:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPerpetrators = perpetrators.filter((perpetrator) => {
    const searchLower = search.toLowerCase();
    return (
      perpetrator.firstName?.toLowerCase().includes(searchLower) ||
      perpetrator.lastName?.toLowerCase().includes(searchLower) ||
      perpetrator.aliases?.some(alias => alias.toLowerCase().includes(searchLower))
    );
  });

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
        <h1 className="text-3xl font-bold text-gray-900">Perpetrators</h1>
        <p className="text-gray-600">Manage and track suspected perpetrators</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search perpetrators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Perpetrator
          </button>
        </div>
      </div>

      {/* Perpetrators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPerpetrators.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No perpetrators found</p>
          </div>
        ) : (
          filteredPerpetrators.map((perpetrator) => (
            <div key={perpetrator.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-3 mr-4">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {perpetrator.firstName} {perpetrator.lastName}
                  </h3>
                  {perpetrator.aliases && perpetrator.aliases.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Aliases: {perpetrator.aliases.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              
              {perpetrator.knownAssociations && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <strong>Known Associations:</strong> {perpetrator.knownAssociations}
                  </p>
                </div>
              )}
              
              {perpetrator.modusOperandi && perpetrator.modusOperandi.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <strong>Modus Operandi:</strong>
                  </p>
                  <ul className="text-sm text-gray-500 mt-1">
                    {perpetrator.modusOperandi.map((mo, index) => (
                      <li key={index} className="list-disc list-inside">{mo}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {perpetrator.address && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600">
                    <strong>Address:</strong> {perpetrator.address}
                  </p>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-500">
                  Added: {new Date(perpetrator.createdAt).toLocaleDateString()}
                </span>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

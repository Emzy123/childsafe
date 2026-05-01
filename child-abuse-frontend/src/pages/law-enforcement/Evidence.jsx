import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { Search, Plus, FileText, Download, Eye, Calendar } from 'lucide-react';

export default function Evidence() {
  const { user } = useAuth();
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = async () => {
    try {
      // Since evidence is case-specific, we'll fetch all cases and their evidence
      let endpoint;
      if (user?.role === 'law_enforcement') {
        endpoint = '/law-enforcement/cases';
      } else if (user?.role === 'admin') {
        endpoint = '/admin/cases';
      } else {
        endpoint = '/cases';
      }
      
      const response = await api.get(endpoint);
      const cases = response.data;
      
      // Fetch evidence for each case
      const allEvidence = [];
      for (const caseItem of cases) {
        try {
          const evidenceResponse = await api.get(`/law-enforcement/cases/${caseItem.id}/evidence`);
          const caseEvidence = evidenceResponse.data.map(evidence => ({
            ...evidence,
            caseRef: caseItem.caseRef,
            caseId: caseItem.id
          }));
          allEvidence.push(...caseEvidence);
        } catch (error) {
          // Skip cases without evidence
          console.log(`No evidence for case ${caseItem.caseRef}`);
        }
      }
      
      setEvidence(allEvidence);
    } catch (error) {
      console.error('Error fetching evidence:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvidence = evidence.filter((evidence) => {
    const searchLower = search.toLowerCase();
    return (
      evidence.description?.toLowerCase().includes(searchLower) ||
      evidence.type?.toLowerCase().includes(searchLower) ||
      evidence.caseRef?.toLowerCase().includes(searchLower)
    );
  });

  const getTypeColor = (type) => {
    const colors = {
      photo: 'bg-blue-100 text-blue-800',
      video: 'bg-purple-100 text-purple-800',
      document: 'bg-green-100 text-green-800',
      audio: 'bg-yellow-100 text-yellow-800',
      physical: 'bg-red-100 text-red-800',
      digital: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
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
        <h1 className="text-3xl font-bold text-gray-900">Evidence</h1>
        <p className="text-gray-600">Manage case evidence and documentation</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search evidence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Evidence
          </button>
        </div>
      </div>

      {/* Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvidence.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No evidence found</p>
            <p className="text-sm text-gray-400 mt-2">
              Evidence will appear here once added to cases
            </p>
          </div>
        ) : (
          filteredEvidence.map((evidenceItem) => (
            <div key={evidenceItem.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {evidenceItem.description || 'Evidence Item'}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(evidenceItem.type)}`}>
                    {evidenceItem.type || 'other'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Case: {evidenceItem.caseRef}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Collected: {new Date(evidenceItem.collectedAt).toLocaleDateString()}</span>
                </div>
                
                {evidenceItem.collectedBy && (
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">By:</span>
                    <span>{evidenceItem.collectedBy}</span>
                  </div>
                )}
              </div>
              
              {evidenceItem.metadata && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Additional Details:</p>
                  <div className="text-xs text-gray-600">
                    {Object.entries(evidenceItem.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-1">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Evidence Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Evidence</p>
              <p className="text-3xl font-bold text-gray-900">{evidence.length}</p>
            </div>
            <FileText className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Photos</p>
              <p className="text-3xl font-bold text-blue-600">
                {evidence.filter(e => e.type === 'photo').length}
              </p>
            </div>
            <Eye className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Documents</p>
              <p className="text-3xl font-bold text-green-600">
                {evidence.filter(e => e.type === 'document').length}
              </p>
            </div>
            <FileText className="h-10 w-10 text-green-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Digital</p>
              <p className="text-3xl font-bold text-purple-600">
                {evidence.filter(e => e.type === 'digital').length}
              </p>
            </div>
            <Download className="h-10 w-10 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import { Search, Calendar, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrackCase() {
  const [caseRef, setCaseRef] = useState('');
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!caseRef.trim()) {
      toast.error('Please enter a case reference number');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/incidents/track/${caseRef}`);
      setCaseData(response.data);
      toast.success('Case found');
    } catch (error) {
      toast.error('Case not found');
      setCaseData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      reported: 'bg-yellow-100 text-yellow-800',
      under_investigation: 'bg-blue-100 text-blue-800',
      with_agency: 'bg-purple-100 text-purple-800',
      closed: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      reported: 'Reported',
      under_investigation: 'Under Investigation',
      with_agency: 'With Agency',
      closed: 'Closed',
    };
    return texts[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Case</h1>
          <p className="text-gray-600 mb-6">
            Enter the case reference number you received when you submitted your report.
          </p>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={caseRef}
                onChange={(e) => setCaseRef(e.target.value)}
                placeholder="e.g., CAB-2026-ABC123"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 flex items-center"
              >
                <Search className="h-5 w-5 mr-2" />
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>

          {caseData && (
            <div className="border-t pt-6">
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{caseData.caseRef}</h2>
                    <p className="text-gray-500 mt-1">
                      Reported on {new Date(caseData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseData.status)}`}>
                    {getStatusText(caseData.status)}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Abuse Type</p>
                      <p className="font-medium capitalize">{caseData.abuseType}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Incident Date</p>
                      <p className="font-medium">{new Date(caseData.incidentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{caseData.location}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700">{caseData.description}</p>
                </div>

                {caseData.victim && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Victim</p>
                    <p className="text-gray-700">
                      {caseData.victim.firstName} {caseData.victim.lastName}
                      {caseData.victim.approximateAge && `, Age ${caseData.victim.approximateAge}`}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> For more detailed information about this case, please contact your local
                  child welfare agency with this case reference number.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

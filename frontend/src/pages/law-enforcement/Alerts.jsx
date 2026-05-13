import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { Search, Plus, AlertTriangle, Bell, Clock, CheckCircle, X } from 'lucide-react';

export default function Alerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      let endpoint;
      if (user?.role === 'law_enforcement') {
        endpoint = '/law-enforcement/alerts';
      } else if (user?.role === 'admin') {
        endpoint = '/admin/alerts';
      } else {
        endpoint = '/alerts';
      }
      
      const response = await api.get(endpoint);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const searchLower = search.toLowerCase();
    return (
      alert.message?.toLowerCase().includes(searchLower) ||
      alert.caseRef?.toLowerCase().includes(searchLower) ||
      alert.type?.toLowerCase().includes(searchLower)
    );
  });

  const getTypeColor = (type) => {
    const colors = {
      high_priority: 'bg-red-100 text-red-800',
      medium_priority: 'bg-yellow-100 text-yellow-800',
      low_priority: 'bg-blue-100 text-blue-800',
      info: 'bg-gray-100 text-gray-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      unread: 'bg-red-100 text-red-800',
      read: 'bg-gray-100 text-gray-800',
      acknowledged: 'bg-green-100 text-green-800',
      resolved: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'high_priority':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'medium_priority':
        return <Bell className="h-5 w-5 text-yellow-600" />;
      case 'low_priority':
        return <Bell className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const markAsRead = async (alertId) => {
    try {
      // In a real app, this would call an API to update the alert status
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, status: 'read' } : alert
      ));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const dismissAlert = async (alertId) => {
    try {
      // In a real app, this would call an API to dismiss the alert
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error dismissing alert:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
        <p className="text-gray-600">Manage case alerts and notifications</p>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create Alert
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No alerts found</p>
            <p className="text-sm text-gray-400 mt-2">
              Alerts will appear here when cases require attention
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition ${
                alert.status === 'unread' ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {alert.message}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(alert.type)}`}>
                        {alert.type.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Case: {alert.caseRef}</p>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        Created: {new Date(alert.createdAt).toLocaleDateString()} at {new Date(alert.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    {alert.caseId && (
                      <div className="mt-3">
                        <button
                          onClick={() => window.location.href = `/cases/${alert.caseId}`}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          View Case →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {alert.status === 'unread' && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Mark as read"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Dismiss"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{alerts.length}</p>
            </div>
            <Bell className="h-10 w-10 text-blue-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Unread</p>
              <p className="text-3xl font-bold text-red-600">
                {alerts.filter(a => a.status === 'unread').length}
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">High Priority</p>
              <p className="text-3xl font-bold text-red-600">
                {alerts.filter(a => a.type === 'high_priority').length}
              </p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-600 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Read</p>
              <p className="text-3xl font-bold text-gray-600">
                {alerts.filter(a => a.status === 'read').length}
              </p>
            </div>
            <CheckCircle className="h-10 w-10 text-gray-600 opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}

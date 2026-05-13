import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { Settings, Save, Shield, Database, Bell, Users, Clock, Download } from 'lucide-react';

export default function SystemSettings() {
  const { user } = useAuth();
  const [config, setConfig] = useState({
    systemName: '',
    version: '',
    maintenanceMode: false,
    allowAnonymousReporting: false,
    caseAutoAssignment: false,
    emailNotifications: false,
    dataRetentionDays: 2555,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSystemConfig();
  }, []);

  const fetchSystemConfig = async () => {
    try {
      const response = await api.get('/admin/system/config');
      setConfig(response.data);
    } catch (error) {
      console.error('Error fetching system config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await api.put('/admin/system/config', config);
      alert('System configuration saved successfully!');
    } catch (error) {
      console.error('Error saving system config:', error);
      alert('Error saving configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async (dataType) => {
    try {
      const response = await api.post(`/admin/export/${dataType}`, {
        format: 'excel',
        filters: {}
      });
      
      // Create download link
      const link = document.createElement('a');
      link.href = response.data.downloadUrl;
      link.download = response.data.filename;
      link.click();
    } catch (error) {
      console.error('Error exporting data:', error);
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
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Settings className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold">System Information</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
            <input
              type="text"
              value={config.systemName}
              onChange={(e) => setConfig({ ...config, systemName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
            <input
              type="text"
              value={config.version}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold">System Status</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Temporarily disable public access</p>
            </div>
            <button
              onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                config.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Allow Anonymous Reporting</p>
              <p className="text-sm text-gray-500">Enable public to submit anonymous reports</p>
            </div>
            <button
              onClick={() => setConfig({ ...config, allowAnonymousReporting: !config.allowAnonymousReporting })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                config.allowAnonymousReporting ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.allowAnonymousReporting ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Case Auto-Assignment</p>
              <p className="text-sm text-gray-500">Automatically assign cases to available workers</p>
            </div>
            <button
              onClick={() => setConfig({ ...config, caseAutoAssignment: !config.caseAutoAssignment })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                config.caseAutoAssignment ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.caseAutoAssignment ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Send email alerts for case updates</p>
            </div>
            <button
              onClick={() => setConfig({ ...config, emailNotifications: !config.emailNotifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                config.emailNotifications ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  config.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Database className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold">Data Management</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (Days)</label>
            <input
              type="number"
              value={config.dataRetentionDays}
              onChange={(e) => setConfig({ ...config, dataRetentionDays: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              min="1"
              max="3650"
            />
            <p className="text-sm text-gray-500 mt-1">How long to keep records (default: 7 years)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (Minutes)</label>
            <input
              type="number"
              value={config.sessionTimeout}
              onChange={(e) => setConfig({ ...config, sessionTimeout: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              min="5"
              max="1440"
            />
            <p className="text-sm text-gray-500 mt-1">User session duration (5-1440 minutes)</p>
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold">Password Policy</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Length</label>
            <input
              type="number"
              value={config.passwordPolicy.minLength}
              onChange={(e) => setConfig({
                ...config,
                passwordPolicy: { ...config.passwordPolicy, minLength: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              min="6"
              max="20"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Require Uppercase Letters</p>
                <p className="text-sm text-gray-500">Passwords must contain at least one uppercase letter</p>
              </div>
              <button
                onClick={() => setConfig({
                  ...config,
                  passwordPolicy: { ...config.passwordPolicy, requireUppercase: !config.passwordPolicy.requireUppercase }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  config.passwordPolicy.requireUppercase ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    config.passwordPolicy.requireUppercase ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Require Lowercase Letters</p>
                <p className="text-sm text-gray-500">Passwords must contain at least one lowercase letter</p>
              </div>
              <button
                onClick={() => setConfig({
                  ...config,
                  passwordPolicy: { ...config.passwordPolicy, requireLowercase: !config.passwordPolicy.requireLowercase }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  config.passwordPolicy.requireLowercase ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    config.passwordPolicy.requireLowercase ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Require Numbers</p>
                <p className="text-sm text-gray-500">Passwords must contain at least one number</p>
              </div>
              <button
                onClick={() => setConfig({
                  ...config,
                  passwordPolicy: { ...config.passwordPolicy, requireNumbers: !config.passwordPolicy.requireNumbers }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  config.passwordPolicy.requireNumbers ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    config.passwordPolicy.requireNumbers ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Require Special Characters</p>
                <p className="text-sm text-gray-500">Passwords must contain at least one special character</p>
              </div>
              <button
                onClick={() => setConfig({
                  ...config,
                  passwordPolicy: { ...config.passwordPolicy, requireSpecialChars: !config.passwordPolicy.requireSpecialChars }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  config.passwordPolicy.requireSpecialChars ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    config.passwordPolicy.requireSpecialChars ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Download className="h-6 w-6 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold">Data Export</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExportData('cases')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Cases
          </button>
          <button
            onClick={() => handleExportData('users')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Users
          </button>
          <button
            onClick={() => handleExportData('statistics')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Statistics
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveConfig}
          disabled={saving}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center disabled:opacity-50"
        >
          <Save className="h-5 w-5 mr-2" />
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
}

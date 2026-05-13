import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bell, 
  BellRing, 
  BellOff, 
  X, 
  Check, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  Settings, 
  Filter, 
  Search, 
  MoreVertical, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  User, 
  FileText, 
  Shield, 
  Activity, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Wifi, 
  Battery, 
  Zap, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Monitor, 
  Headphones, 
  Vibrate, 
  VibrateOff, 
  Speaker, 
  SpeakerOff, 
  Radio, 
  RadioOff, 
  WifiOff, 
  Signal, 
  SignalOff, 
  Download, 
  Upload, 
  Share, 
  Copy, 
  Trash, 
  Archive, 
  Bookmark, 
  BookmarkOff, 
  Flag, 
  FlagOff, 
  Tag, 
  TagOff, 
  Pin, 
  PinOff, 
  Lock, 
  Unlock, 
  Key, 
  UserPlus, 
  UserMinus, 
  Users, 
  UserCheck, 
  UserX, 
  Heart, 
  HeartOff, 
  Star, 
  StarOff, 
  ThumbsUp, 
  ThumbsDown, 
  Hand, 
  HandOff, 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon, 
  Bell as BellIcon, 
  BellRing as BellRingIcon, 
  BellOff as BellOffIcon, 
  Settings as SettingsIcon, 
  Filter as FilterIcon, 
  Search as SearchIcon, 
  MoreVertical as MoreVerticalIcon, 
  ChevronDown as ChevronDownIcon, 
  ChevronUp as ChevronUpIcon, 
  Clock as ClockIcon, 
  User as UserIcon, 
  FileText as FileTextIcon, 
  Shield as ShieldIcon, 
  Activity as ActivityIcon, 
  MessageSquare as MessageSquareIcon, 
  Calendar as CalendarIcon, 
  MapPin as MapPinIcon, 
  Phone as PhoneIcon, 
  Mail as MailIcon, 
  Globe as GlobeIcon, 
  Wifi as WifiIcon, 
  Battery as BatteryIcon, 
  Zap as ZapIcon, 
  Volume2 as Volume2Icon, 
  VolumeX as VolumeXIcon, 
  Smartphone as SmartphoneIcon, 
  Monitor as MonitorIcon, 
  Headphones as HeadphonesIcon, 
  Vibrate as VibrateIcon, 
  VibrateOff as VibrateOffIcon, 
  Speaker as SpeakerIcon, 
  SpeakerOff as SpeakerOffIcon, 
  Radio as RadioIcon, 
  RadioOff as RadioOffIcon, 
  WifiOff as WifiOffIcon, 
  Signal as SignalIcon, 
  SignalOff as SignalOffIcon, 
  Download as DownloadIcon, 
  Upload as UploadIcon, 
  Share as ShareIcon, 
  Copy as CopyIcon, 
  Trash as TrashIcon, 
  Archive as ArchiveIcon, 
  Bookmark as BookmarkIcon, 
  BookmarkOff as BookmarkOffIcon, 
  Flag as FlagIcon, 
  FlagOff as FlagOffIcon, 
  Tag as TagIcon, 
  TagOff as TagOffIcon, 
  Pin as PinIcon, 
  PinOff as PinOffIcon, 
  Lock as LockIcon, 
  Unlock as UnlockIcon, 
  Key as KeyIcon, 
  UserPlus as UserPlusIcon, 
  UserMinus as UserMinusIcon, 
  Users as UsersIcon, 
  UserCheck as UserCheckIcon, 
  UserX as UserXIcon, 
  Heart as HeartIcon, 
  HeartOff as HeartOffIcon, 
  Star as StarIcon, 
  StarOff as StarOffIcon, 
  ThumbsUp as ThumbsUpIcon, 
  ThumbsDown as ThumbsDownIcon, 
  Hand as HandIcon, 
  HandOff as HandOffIcon
} from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Select, Alert, Badge, Modal } from './ui';

const NotificationCenter = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    sms: false,
    desktop: true,
    sound: true,
    vibration: true,
    caseUpdates: true,
    systemAlerts: true,
    mentions: true,
    reports: true,
    reminders: true,
    frequency: 'immediate'
  });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const notificationSoundRef = useRef(null);

  // Mock notification data
  const mockNotifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'Critical Case Update',
      message: 'New high-priority case assigned to you - CAB-2026-0847',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
      actions: ['View Case', 'Acknowledge'],
      category: 'case',
      priority: 'high',
      sender: 'System',
      metadata: { caseId: 'CAB-2026-0847', caseType: 'Physical Abuse' }
    },
    {
      id: 2,
      type: 'info',
      title: 'Monthly Report Available',
      message: 'Your monthly performance report is ready for review',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      actions: ['View Report', 'Download'],
      category: 'system',
      priority: 'medium',
      sender: 'Analytics Team',
      metadata: { reportId: 'RPT-2026-04', reportType: 'monthly' }
    },
    {
      id: 3,
      type: 'warning',
      title: 'Case Follow-up Required',
      message: '3 cases require follow-up within 24 hours',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      actions: ['View Cases', 'Schedule'],
      category: 'case',
      priority: 'medium',
      sender: 'System',
      metadata: { caseCount: 3, urgency: 'high' }
    },
    {
      id: 4,
      type: 'success',
      title: 'Case Resolved',
      message: 'Case CAB-2026-0842 has been successfully resolved',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      actions: ['View Details', 'Archive'],
      category: 'case',
      priority: 'low',
      sender: 'Sarah Johnson',
      metadata: { caseId: 'CAB-2026-0842', resolutionType: 'successful' }
    },
    {
      id: 5,
      type: 'info',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Sunday 2:00 AM - 4:00 AM',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      actions: ['View Details', 'Set Reminder'],
      category: 'system',
      priority: 'low',
      sender: 'IT Team',
      metadata: { maintenanceType: 'scheduled', duration: '2 hours' }
    }
  ];

  useEffect(() => {
    // Initialize notifications
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  useEffect(() => {
    // Handle clicks outside dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const newNotification = {
        id: notifications.length + 1,
        type: ['info', 'success', 'warning', 'urgent'][Math.floor(Math.random() * 4)],
        title: 'New Activity',
        message: `New notification at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date(),
        read: false,
        actions: ['View', 'Dismiss'],
        category: 'system',
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        sender: 'System',
        metadata: {}
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Play notification sound if enabled
      if (preferences.sound && !document.hidden) {
        playNotificationSound();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [preferences.sound]);

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent': return <AlertCircle className="h-5 w-5 text-critical" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error': return <XCircle className="h-5 w-5 text-critical" />;
      default: return <Info className="h-5 w-5 text-primary-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'urgent': return 'bg-critical/10 border-critical/20 text-critical';
      case 'warning': return 'bg-warning/10 border-warning/20 text-warning';
      case 'success': return 'bg-success/10 border-success/20 text-success';
      case 'error': return 'bg-critical/10 border-critical/20 text-critical';
      default: return 'bg-primary-100 border-primary-200 text-primary-700';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (!notifications.find(n => n.id === id)?.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleNotificationAction = (notification, action) => {
    // Handle different notification actions
    switch (action) {
      case 'View Case':
        // Navigate to case detail
        console.log('Viewing case:', notification.metadata.caseId);
        break;
      case 'View Report':
        // Navigate to report
        console.log('Viewing report:', notification.metadata.reportId);
        break;
      case 'Acknowledge':
        markAsRead(notification.id);
        break;
      case 'Archive':
        deleteNotification(notification.id);
        break;
      default:
        console.log('Action:', action, 'Notification:', notification);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                        filter === 'unread' && !notification.read ||
                        filter === 'read' && notification.read ||
                        filter === notification.category ||
                        filter === notification.priority;
    
    const matchesSearch = searchQuery === '' || 
                          notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const NotificationItem = ({ notification }) => (
    <div className={`p-4 border rounded-lg hover:bg-surface-secondary transition-colors ${
      !notification.read ? 'border-primary-200 bg-primary-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-xs text-gray-500">
                  {notification.sender} • {formatTimestamp(notification.timestamp)}
                </span>
                <Badge variant="outline" size="sm">
                  {notification.category}
                </Badge>
              </div>
              
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex items-center space-x-2 mt-3">
                  {notification.actions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleNotificationAction(notification, action)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAsRead(notification.id)}
                disabled={notification.read}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteNotification(notification.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-critical text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(true)}
                >
                  <SettingsIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </Button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex items-center space-x-2 mt-3">
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="case">Cases</option>
                <option value="system">System</option>
                <option value="urgent">Urgent</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </Select>
              
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-80">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <BellOffIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <Modal isOpen={showPreferences} onClose={() => setShowPreferences(false)}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowPreferences(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Notification Methods */}
          <div>
            <h4 className="text-md font-medium mb-3">Notification Methods</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-500">Receive notifications via email</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.email}
                  onChange={(e) => setPreferences(prev => ({ ...prev, email: e.target.checked }))}
                  className="form-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-gray-500">Receive notifications on mobile devices</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.push}
                  onChange={(e) => setPreferences(prev => ({ ...prev, push: e.target.checked }))}
                  className="form-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">SMS Notifications</div>
                    <div className="text-sm text-gray-500">Receive notifications via SMS</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.sms}
                  onChange={(e) => setPreferences(prev => ({ ...prev, sms: e.target.checked }))}
                  className="form-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Desktop Notifications</div>
                    <div className="text-sm text-gray-500">Receive notifications on desktop</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.desktop}
                  onChange={(e) => setPreferences(prev => ({ ...prev, desktop: e.target.checked }))}
                  className="form-checkbox"
                />
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h4 className="text-md font-medium mb-3">Notification Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Volume2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Sound</div>
                    <div className="text-sm text-gray-500">Play sound for new notifications</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.sound}
                  onChange={(e) => setPreferences(prev => ({ ...prev, sound: e.target.checked }))}
                  className="form-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Vibrate className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Vibration</div>
                    <div className="text-sm text-gray-500">Vibrate for mobile notifications</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.vibration}
                  onChange={(e) => setPreferences(prev => ({ ...prev, vibration: e.target.checked }))}
                  className="form-checkbox"
                />
              </label>
            </div>
          </div>

          {/* Notification Types */}
          <div>
            <h4 className="text-md font-medium mb-3">Notification Types</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Case Updates</div>
                    <div className="text-sm text-gray-500">Updates on case progress</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.caseUpdates}
                  onChange={(e) => setPreferences(prev => ({ ...prev, caseUpdates: e.target.checked }))}
                  className="form-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">System Alerts</div>
                    <div className="text-sm text-gray-500">System notifications and alerts</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.systemAlerts}
                  onChange={(e) => setPreferences(prev => ({ ...prev, systemAlerts: e.target.checked }))}
                  className="form-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Mentions</div>
                    <div className="text-sm text-gray-500">When you are mentioned</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.mentions}
                  onChange={(e) => setPreferences(prev => ({ ...prev, mentions: e.target.checked }))}
                  className="form-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Reports</div>
                    <div className="text-sm text-gray-500">New reports and analytics</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reports}
                  onChange={(e) => setPreferences(prev => ({ ...prev, reports: e.target.checked }))}
                  className="form-checkbox"
                />
              </label>

              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Reminders</div>
                    <div className="text-sm text-gray-500">Task and appointment reminders</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reminders}
                  onChange={(e) => setPreferences(prev => ({ ...prev, reminders: e.target.checked }))}
                  className="form-checkbox"
                />
              </label>
            </div>
          </div>

          {/* Frequency */}
          <div>
            <h4 className="text-md font-medium mb-3">Email Frequency</h4>
            <Select
              value={preferences.frequency}
              onChange={(e) => setPreferences(prev => ({ ...prev, frequency: e.target.value }))}
            >
              <option value="immediate">Immediate</option>
              <option value="hourly">Hourly Digest</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Digest</option>
              <option value="never">Never</option>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowPreferences(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowPreferences(false)}>
              Save Preferences
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationCenter;

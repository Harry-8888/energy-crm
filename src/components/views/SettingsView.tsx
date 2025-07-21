import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Palette,
  Moon,
  Sun,
  Globe,
  Clock,
  FileText,
  Settings as SettingsIcon
} from 'lucide-react';

const SettingsView: React.FC = () => {
  const { state, dispatch } = useCRM();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    dealReminders: true,
    activityAlerts: true,
    weeklyReports: false
  });
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/dd/yyyy',
    currency: 'USD',
    autoSave: true,
    compactView: false
  });
  const [profileData, setProfileData] = useState({
    name: state.currentUser?.name || '',
    email: state.currentUser?.email || '',
    phone: '',
    title: '',
    department: 'Sales',
    location: '',
    bio: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'Preferences', icon: SettingsIcon },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'data', name: 'Data Management', icon: Database }
  ];

  const handleSaveProfile = () => {
    if (state.currentUser) {
      const updatedUser = {
        ...state.currentUser,
        name: profileData.name,
        email: profileData.email
      };
      dispatch({ type: 'SET_CURRENT_USER', payload: updatedUser });
    }
    alert('Profile updated successfully!');
  };

  const handleExportData = () => {
    const data = {
      contacts: state.contacts,
      companies: state.companies,
      deals: state.deals,
      activities: state.activities,
      users: state.users,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energy-crm-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('energy-crm-data');
      window.location.reload();
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
          <span className="text-white font-bold text-3xl">
            {profileData.name.charAt(0) || 'U'}
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{profileData.name || 'User'}</h2>
          <p className="text-gray-600">{state.currentUser?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
          <Badge variant="success" className="mt-2">Active</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          value={profileData.name}
          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          placeholder="Harry Supasella"
        />
        <Input
          label="Email"
          type="email"
          value={profileData.email}
          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          placeholder="harry.supasella@company.com"
        />
        <Input
          label="Phone"
          value={profileData.phone}
          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          placeholder="+1-555-123-4567"
        />
        <Input
          label="Job Title"
          value={profileData.title}
          onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
          placeholder="Sales Manager"
        />
        <Select
          label="Department"
          value={profileData.department}
          onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
        >
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="Business Development">Business Development</option>
          <option value="Management">Management</option>
        </Select>
        <Input
          label="Location"
          value={profileData.location}
          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
          placeholder="Austin, TX"
        />
      </div>

      <div>
        <Input
          label="Bio"
          value={profileData.bio}
          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} className="flex items-center space-x-2">
          <Save size={16} />
          <span>Save Profile</span>
        </Button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {[
          { key: 'emailNotifications', title: 'Email Notifications', description: 'Receive notifications via email' },
          { key: 'pushNotifications', title: 'Push Notifications', description: 'Browser push notifications' },
          { key: 'dealReminders', title: 'Deal Reminders', description: 'Reminders for upcoming deal close dates' },
          { key: 'activityAlerts', title: 'Activity Alerts', description: 'Notifications for new activities and follow-ups' },
          { key: 'weeklyReports', title: 'Weekly Reports', description: 'Receive weekly performance summaries' }
        ].map((setting) => (
          <Card key={setting.key} padding="sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{setting.title}</h3>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications[setting.key as keyof typeof notifications]}
                  onChange={(e) => setNotifications({
                    ...notifications,
                    [setting.key]: e.target.checked
                  })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button className="flex items-center space-x-2">
          <Save size={16} />
          <span>Save Preferences</span>
        </Button>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Theme"
          value={preferences.theme}
          onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </Select>
        
        <Select
          label="Language"
          value={preferences.language}
          onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </Select>

        <Select
          label="Timezone"
          value={preferences.timezone}
          onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
        >
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
        </Select>

        <Select
          label="Date Format"
          value={preferences.dateFormat}
          onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
        >
          <option value="MM/dd/yyyy">MM/DD/YYYY</option>
          <option value="dd/MM/yyyy">DD/MM/YYYY</option>
          <option value="yyyy-MM-dd">YYYY-MM-DD</option>
        </Select>

        <Select
          label="Currency"
          value={preferences.currency}
          onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="CAD">CAD (C$)</option>
        </Select>
      </div>

      <div className="space-y-4">
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Auto-save</h3>
              <p className="text-sm text-gray-600">Automatically save changes as you type</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.autoSave}
              onChange={(e) => setPreferences({ ...preferences, autoSave: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </Card>

        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Compact View</h3>
              <p className="text-sm text-gray-600">Show more items in lists and tables</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.compactView}
              onChange={(e) => setPreferences({ ...preferences, compactView: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button className="flex items-center space-x-2">
          <Save size={16} />
          <span>Save Preferences</span>
        </Button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4">
          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={profileData.newPassword}
              onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
              placeholder="Enter new password"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={profileData.confirmPassword}
            onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
          />
          <Button variant="secondary">Update Password</Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600">Add an extra layer of security to your account</p>
          </div>
          <Button variant="outline">Enable 2FA</Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div>
              <p className="font-medium">Current Session</p>
              <p className="text-sm text-gray-600">Chrome on Windows • Austin, TX</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">Previous Session</p>
              <p className="text-sm text-gray-600">Chrome on Windows • Yesterday at 6:30 PM</p>
            </div>
            <Badge variant="default">Ended</Badge>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <p className="text-gray-600 mb-4">Download all your CRM data in JSON format</p>
        <div className="flex space-x-4">
          <Button onClick={handleExportData} className="flex items-center space-x-2">
            <Download size={16} />
            <span>Export All Data</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <FileText size={16} />
            <span>Export to CSV</span>
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Data</h3>
        <p className="text-gray-600 mb-4">Upload data from a previous export or other CRM system</p>
        <div className="flex space-x-4">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload size={16} />
            <span>Import from JSON</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload size={16} />
            <span>Import from CSV</span>
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Records</p>
            <p className="text-2xl font-bold text-blue-700">
              {state.contacts.length + state.companies.length + state.deals.length + state.activities.length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Data Size</p>
            <p className="text-2xl font-bold text-green-700">
              {Math.round(JSON.stringify(state).length / 1024)} KB
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
        <p className="text-red-600 mb-4">Permanently delete all your data. This action cannot be undone.</p>
        <Button onClick={handleClearData} variant="danger" className="flex items-center space-x-2">
          <Trash2 size={16} />
          <span>Clear All Data</span>
        </Button>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'preferences': return renderPreferencesTab();
      case 'security': return renderSecurityTab();
      case 'data': return renderDataTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="space-y-8">
      {/* Settings Header */}
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
          <SettingsIcon size={32} className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Settings</h1>
          <p className="text-gray-600">Manage your profile, preferences, and account settings</p>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 flex-1 justify-center
                ${activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-sm font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Icon size={18} />
              <span className="hidden sm:block">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <Card>
        {renderTabContent()}
      </Card>
    </div>
  );
};

export default SettingsView;
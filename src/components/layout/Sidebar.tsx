import React from 'react';
import { Users, Building2, Briefcase, Activity, BarChart3, Settings, User } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { state } = useCRM();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'contacts', name: 'Contacts', icon: Users },
    { id: 'companies', name: 'Companies', icon: Building2 },
    { id: 'deals', name: 'Deals', icon: Briefcase },
    { id: 'activities', name: 'Activities', icon: Activity },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Energy CRM</h1>
        <p className="text-sm text-gray-500 mt-1">Sales Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon size={18} className="mr-3" />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {state.currentUser?.name || 'Unknown User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {state.currentUser?.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Role'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
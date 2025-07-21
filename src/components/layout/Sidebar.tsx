import React from 'react';
import { Users, Building2, Briefcase, Activity, BarChart3, Settings } from 'lucide-react';
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
    <div className="w-72 sidebar-gradient shadow-2xl border-r border-gray-700/20 animate-slide-in h-screen flex flex-col">
      {/* Header */}
      <div className="p-8 border-b border-gray-600/30">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300 hover:rotate-3">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-yellow-300/20 to-transparent rounded-2xl"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-yellow-200/10 to-transparent rounded-xl animate-pulse"></div>
            <svg 
              className="w-7 h-7 text-white drop-shadow-lg relative z-10" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round"/>
            </svg>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-300/20 via-transparent to-orange-300/20 animate-pulse"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-3xl blur-sm animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Energy CRM
            </h1>
            <p className="text-sm text-blue-200/80">Professional Sales Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-8 px-4">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                w-full flex items-center px-4 py-4 text-left transition-all duration-300 rounded-xl mb-2
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-400/30 shadow-lg' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }
                animate-slide-in
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon size={22} className="mr-4" />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-600/30">
        <div className="flex items-center space-x-4 p-4 glass-effect rounded-xl border border-white/20">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
              {state.currentUser?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {state.currentUser?.name || 'User'}
            </p>
            <p className="text-xs text-blue-200/80 capitalize">
              {state.currentUser?.role?.replace('_', ' ') || 'Sales Rep'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
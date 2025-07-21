import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import Button from '../ui/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { state } = useCRM();

  return (
    <div className="card-premium border-b border-gray-200/20 px-8 py-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">{title}</h1>
          {subtitle && (
            <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search everything..."
              className="pl-12 pr-6 py-3 glass-effect border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 w-80 text-sm placeholder-gray-500 backdrop-blur-sm"
            />
          </div>
          
          {/* Notifications */}
          <Button variant="secondary" size="sm" className="hover-lift glass-effect border-white/30 relative p-3">
            <Bell size={18} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-pulse"></div>
          </Button>
          
          {/* Settings */}
          <Button variant="secondary" size="sm" className="hover-lift glass-effect border-white/30 p-3">
            <Settings size={18} />
          </Button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-4 pl-6 border-l border-gray-300/30">
            <div className="text-right">
              <span className="text-sm font-medium text-gray-600">
                Welcome back
              </span>
              <p className="text-lg font-semibold text-gray-900">
                {state.currentUser?.name?.split(' ')[0] || 'User'}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover-lift cursor-pointer">
              <span className="text-white font-bold text-lg">
                {state.currentUser?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
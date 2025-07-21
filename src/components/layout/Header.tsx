import React from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import Button from '../ui/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { state } = useCRM();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" icon={Bell} />
          
          {/* Settings */}
          <Button variant="ghost" size="sm" icon={Settings} />
          
          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <img 
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">
              {state.currentUser?.name || 'User'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
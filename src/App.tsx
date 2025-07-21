import React, { useState } from 'react';
import { CRMProvider } from './context/CRMContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/views/Dashboard';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const getViewTitle = (view: string) => {
    switch (view) {
      case 'dashboard':
        return 'Dashboard';
      case 'contacts':
        return 'Contacts';
      case 'companies':
        return 'Companies';
      case 'deals':
        return 'Deals';
      case 'activities':
        return 'Activities';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const getViewSubtitle = (view: string) => {
    switch (view) {
      case 'dashboard':
        return 'Sales performance overview';
      case 'contacts':
        return 'Manage customer relationships';
      case 'companies':
        return 'Track business accounts';
      case 'deals':
        return 'Manage sales opportunities';
      case 'activities':
        return 'Track interactions and tasks';
      case 'settings':
        return 'System configuration';
      default:
        return '';
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'contacts':
        return <div className="p-6"><h2 className="text-xl">Contacts View - Coming Soon</h2></div>;
      case 'companies':
        return <div className="p-6"><h2 className="text-xl">Companies View - Coming Soon</h2></div>;
      case 'deals':
        return <div className="p-6"><h2 className="text-xl">Deals View - Coming Soon</h2></div>;
      case 'activities':
        return <div className="p-6"><h2 className="text-xl">Activities View - Coming Soon</h2></div>;
      case 'settings':
        return <div className="p-6"><h2 className="text-xl">Settings View - Coming Soon</h2></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CRMProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title={getViewTitle(activeView)} 
            subtitle={getViewSubtitle(activeView)} 
          />
          <main className="flex-1 overflow-y-auto p-6">
            {renderView()}
          </main>
        </div>
      </div>
    </CRMProvider>
  );
}

export default App;
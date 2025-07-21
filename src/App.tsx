import React, { useState } from 'react';
import { CRMProvider } from './context/CRMContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/views/Dashboard';
import ContactsView from './components/views/ContactsView';
import ActivitiesView from './components/views/ActivitiesView';
import DealsView from './components/views/DealsView';
import CompaniesView from './components/views/CompaniesView';
import SettingsView from './components/views/SettingsView';

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
        return <ContactsView />;
      case 'companies':
        return <CompaniesView />;
      case 'deals':
        return <DealsView />;
      case 'activities':
        return <ActivitiesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CRMProvider>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title={getViewTitle(activeView)} 
            subtitle={getViewSubtitle(activeView)} 
          />
          <main className="flex-1 overflow-y-auto p-8 animate-fade-in">
            {renderView()}
          </main>
        </div>
      </div>
    </CRMProvider>
  );
}

export default App;
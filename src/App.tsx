import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Layout/Sidebar';
import { DashboardModule } from './components/Dashboard/DashboardModule';
import { ClientsModule } from './components/Clients/ClientsModule';
import { ServicesModule } from './components/Services/ServicesModule';
import { FinanceModule } from './components/Finance/FinanceModule';
import { InventoryModule } from './components/Inventory/InventoryModule';
import { TutoringModule } from './components/Tutoring/TutoringModule';
import { ProjectsModule } from './components/Projects/ProjectsModule';
import { ReportsModule } from './components/Reports/ReportsModule';
import { NotificationsModule } from './components/Notifications/NotificationsModule';
import { SettingsModule } from './components/Settings/SettingsModule';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useApp } from './context/AppContext';

function AppContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { state } = useApp();
  
  // Initialize data
  useLocalStorage();

  const renderActiveModule = () => {
    switch (state.activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'clients':
        return <ClientsModule />;
      case 'services':
        return <ServicesModule />;
      case 'finance':
        return <FinanceModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'tutoring':
        return <TutoringModule />;
      case 'projects':
        return <ProjectsModule />;
      case 'reports':
        return <ReportsModule />;
      case 'notifications':
        return <NotificationsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 overflow-hidden">
        {renderActiveModule()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
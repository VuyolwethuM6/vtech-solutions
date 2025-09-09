import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  Package, 
  BookOpen, 
  Briefcase,
  Settings,
  Bell,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'services', label: 'Services', icon: FileText },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'tutoring', label: 'Tutoring', icon: BookOpen },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { state, dispatch } = useApp();
  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  const handleMenuClick = (moduleId: string) => {
    dispatch({ type: 'SET_ACTIVE_MODULE', payload: moduleId });
  };

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">VTech Solutions</h1>
              <p className="text-sm text-slate-400">Management System</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.activeModule === item.id;
            const hasNotification = item.id === 'notifications' && unreadNotifications > 0;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="relative">
                    <Icon size={20} />
                    {hasNotification && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">
                          {unreadNotifications > 9 ? '9+' : unreadNotifications}
                        </span>
                      </div>
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      {!isCollapsed && state.currentUser && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">
                {state.currentUser.name.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{state.currentUser.name}</p>
              <p className="text-xs text-slate-400 capitalize">{state.currentUser.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect } from 'react';
import { 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  Users, 
  BookOpen, 
  Briefcase, 
  TrendingUp,
  Package
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatsCard } from './StatsCard';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { Header } from '../Layout/Header';

export function DashboardModule() {
  const { state, dispatch } = useApp();

  // Calculate dashboard stats
  useEffect(() => {
    const today = new Date().toDateString();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const todayServices = state.services.filter(
      service => new Date(service.dateCreated).toDateString() === today
    ).length;

    const todayRevenue = state.transactions
      .filter(transaction => 
        new Date(transaction.date).toDateString() === today && 
        transaction.type === 'income'
      )
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const pendingPayments = state.transactions.filter(
      transaction => transaction.status === 'pending' || transaction.status === 'overdue'
    ).length;

    const lowStockItems = state.inventory.filter(
      item => item.currentStock <= item.reorderLevel
    ).length;

    const upcomingTutoring = state.tutoringSessions.filter(session => {
      const sessionDate = new Date(session.sessionDate);
      const today = new Date();
      const diffTime = sessionDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays >= 0 && session.status === 'scheduled';
    }).length;

    const activeProjects = state.businessProjects.filter(
      project => project.status === 'in-progress' || project.status === 'planning'
    ).length;

    const monthlyRevenue = state.transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear &&
               transaction.type === 'income';
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    dispatch({
      type: 'UPDATE_DASHBOARD_STATS',
      payload: {
        todayRevenue,
        todayServices,
        pendingPayments,
        lowStockItems,
        upcomingTutoring,
        activeProjects,
        totalClients: state.clients.length,
        monthlyRevenue
      }
    });
  }, [state.services, state.transactions, state.inventory, state.tutoringSessions, state.businessProjects, state.clients, dispatch]);

  const stats = state.dashboardStats;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Business Overview" />
      
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Today's Revenue"
            value={`R${stats.todayRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="green"
            onClick={() => dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'finance' })}
          />
          
          <StatsCard
            title="Today's Services"
            value={stats.todayServices}
            icon={FileText}
            color="blue"
            onClick={() => dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'services' })}
          />
          
          <StatsCard
            title="Total Clients"
            value={stats.totalClients}
            icon={Users}
            color="purple"
            onClick={() => dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'clients' })}
          />
          
          <StatsCard
            title="Monthly Revenue"
            value={`R${stats.monthlyRevenue.toLocaleString()}`}
            icon={TrendingUp}
            color="green"
          />
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Pending Payments"
            value={stats.pendingPayments}
            icon={AlertTriangle}
            color={stats.pendingPayments > 0 ? 'red' : 'green'}
            onClick={() => dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'finance' })}
          />
          
          <StatsCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            icon={Package}
            color={stats.lowStockItems > 0 ? 'yellow' : 'green'}
            onClick={() => dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'inventory' })}
          />
          
          <StatsCard
            title="Upcoming Tutoring"
            value={stats.upcomingTutoring}
            icon={BookOpen}
            color="blue"
            onClick={() => dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'tutoring' })}
          />
          
          <StatsCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={Briefcase}
            color="purple"
            onClick={() => dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'projects' })}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Clock, FileText, Users, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ActivityItem {
  id: string;
  type: 'service' | 'client' | 'payment';
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

export function RecentActivity() {
  const { state } = useApp();

  // Generate recent activity from app state
  const generateRecentActivity = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Recent services
    state.services
      .filter(service => {
        const serviceDate = new Date(service.dateCreated);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - serviceDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      })
      .slice(0, 3)
      .forEach(service => {
        const client = state.clients.find(c => c.id === service.clientId);
        activities.push({
          id: service.id,
          type: 'service',
          title: `${service.serviceType.replace('-', ' ')} service`,
          description: `${client?.name || 'Unknown'} - ${service.status}`,
          time: formatRelativeTime(service.dateCreated),
          icon: FileText,
          color: 'text-blue-600'
        });
      });

    // Recent clients
    state.clients
      .filter(client => {
        const clientDate = new Date(client.dateRegistered);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - clientDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      })
      .slice(0, 2)
      .forEach(client => {
        activities.push({
          id: client.id,
          type: 'client',
          title: 'New client registered',
          description: `${client.name} (${client.clientType})`,
          time: formatRelativeTime(client.dateRegistered),
          icon: Users,
          color: 'text-green-600'
        });
      });

    // Recent payments
    state.transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - transactionDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && transaction.type === 'income';
      })
      .slice(0, 3)
      .forEach(transaction => {
        const client = state.clients.find(c => c.id === transaction.clientId);
        activities.push({
          id: transaction.id,
          type: 'payment',
          title: 'Payment received',
          description: `${client?.name || 'Unknown'} - R${transaction.amount}`,
          time: formatRelativeTime(transaction.date),
          icon: DollarSign,
          color: 'text-purple-600'
        });
      });

    return activities.sort((a, b) => 
      new Date(extractDateFromRelativeTime(b.time)).getTime() - 
      new Date(extractDateFromRelativeTime(a.time)).getTime()
    ).slice(0, 6);
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const extractDateFromRelativeTime = (relativeTime: string): string => {
    const now = new Date();
    if (relativeTime === 'Just now') return now.toISOString();
    if (relativeTime.includes('h ago')) {
      const hours = parseInt(relativeTime);
      return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
    }
    if (relativeTime.includes('d ago')) {
      const days = parseInt(relativeTime);
      return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
    }
    return now.toISOString();
  };

  const activities = generateRecentActivity();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <Clock size={20} className="text-gray-400" />
      </div>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity</p>
          <p className="text-sm text-gray-400 mt-2">Activity will appear here as you use the system</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`${activity.color} bg-gray-50 p-2 rounded-lg`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
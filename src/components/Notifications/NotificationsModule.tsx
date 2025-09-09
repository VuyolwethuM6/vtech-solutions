import React, { useState } from 'react';
import { Bell, AlertTriangle, Calendar, DollarSign, Package, CheckCircle, X, Filter, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../Layout/Header';
import { Notification } from '../../types';

export function NotificationsModule() {
  const { state, dispatch } = useApp();
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifications = state.notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesType = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesPriority && matchesType;
  });

  const handleMarkAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const handleMarkAllAsRead = () => {
    state.notifications.forEach(notification => {
      if (!notification.read) {
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
      }
    });
  };

  const handleDeleteNotification = (notificationId: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment-reminder': return <DollarSign className="text-yellow-500" size={20} />;
      case 'tutoring-reminder': return <Calendar className="text-blue-500" size={20} />;
      case 'inventory-alert': return <Package className="text-red-500" size={20} />;
      case 'maintenance-reminder': return <AlertTriangle className="text-orange-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
    }
  };

  const unreadCount = state.notifications.filter(n => !n.read).length;
  const highPriorityCount = state.notifications.filter(n => n.priority === 'high' && !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Notifications" />

      <div className="p-6">
        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Notifications</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">{state.notifications.length}</p>
              </div>
              <Bell className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Unread</h3>
                <p className="text-2xl font-bold text-yellow-600 mt-2">{unreadCount}</p>
              </div>
              <AlertTriangle className="text-yellow-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">High Priority</h3>
                <p className="text-2xl font-bold text-red-600 mt-2">{highPriorityCount}</p>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Action Required</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {state.notifications.filter(n => n.actionRequired && !n.read).length}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400" size={20} />
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="payment-reminder">Payment Reminders</option>
                  <option value="tutoring-reminder">Tutoring Reminders</option>
                  <option value="inventory-alert">Inventory Alerts</option>
                  <option value="maintenance-reminder">Maintenance Reminders</option>
                </select>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Bell className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {searchTerm || filterPriority !== 'all' || filterType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'You\'re all caught up! New notifications will appear here.'
                }
              </p>
            </div>
          ) : (
            filteredNotifications
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border-l-4 transition-all duration-200 ${
                    getPriorityColor(notification.priority)
                  } ${!notification.read ? 'shadow-md' : ''}`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className={`text-lg font-semibold ${
                              notification.read ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {notification.priority}
                            </span>
                            
                            {notification.actionRequired && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                Action Required
                              </span>
                            )}
                          </div>
                          
                          <p className={`text-sm mb-3 ${
                            notification.read ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="capitalize">
                                {notification.type.replace('-', ' ')}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(notification.date).toLocaleDateString()} at{' '}
                                {new Date(notification.date).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete notification"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {notification.actionRequired && !notification.read && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex space-x-3">
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                            Take Action
                          </button>
                          <button 
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Quick Actions for Common Notifications */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <DollarSign className="text-yellow-500 mb-2" size={24} />
              <h4 className="font-medium text-gray-900">Payment Reminders</h4>
              <p className="text-sm text-gray-500">Send payment reminders to clients</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Calendar className="text-blue-500 mb-2" size={24} />
              <h4 className="font-medium text-gray-900">Schedule Reminders</h4>
              <p className="text-sm text-gray-500">Set up tutoring session reminders</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <Package className="text-red-500 mb-2" size={24} />
              <h4 className="font-medium text-gray-900">Inventory Alerts</h4>
              <p className="text-sm text-gray-500">Configure low stock notifications</p>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <AlertTriangle className="text-orange-500 mb-2" size={24} />
              <h4 className="font-medium text-gray-900">Maintenance</h4>
              <p className="text-sm text-gray-500">Set maintenance reminders</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
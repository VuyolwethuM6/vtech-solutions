import React, { useState } from 'react';
import { BarChart3, Download, Calendar, DollarSign, Users, FileText, TrendingUp, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../Layout/Header';

export function ReportsModule() {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [selectedReport, setSelectedReport] = useState<string>('overview');

  // Calculate report data
  const calculateReportData = () => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const filteredTransactions = state.transactions.filter(t => 
      new Date(t.date) >= startDate && t.status === 'paid'
    );

    const filteredServices = state.services.filter(s => 
      new Date(s.dateCreated) >= startDate
    );

    const filteredClients = state.clients.filter(c => 
      new Date(c.dateRegistered) >= startDate
    );

    const revenue = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      revenue,
      expenses,
      profit: revenue - expenses,
      services: filteredServices.length,
      clients: filteredClients.length,
      transactions: filteredTransactions.length,
    };
  };

  const reportData = calculateReportData();

  // Service type breakdown
  const serviceBreakdown = state.services.reduce((acc, service) => {
    acc[service.serviceType] = (acc[service.serviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Client type breakdown
  const clientBreakdown = state.clients.reduce((acc, client) => {
    acc[client.clientType] = (acc[client.clientType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Revenue by service type
  const revenueByService = state.services.reduce((acc, service) => {
    acc[service.serviceType] = (acc[service.serviceType] || 0) + service.cost;
    return acc;
  }, {} as Record<string, number>);

  const exportReport = () => {
    const reportContent = {
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      summary: reportData,
      serviceBreakdown,
      clientBreakdown,
      revenueByService,
    };

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital-hub-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Reports & Analytics" />

      <div className="p-6">
        {/* Report Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Period
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as 'daily' | 'weekly' | 'monthly')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="overview">Overview</option>
                  <option value="financial">Financial</option>
                  <option value="services">Services</option>
                  <option value="clients">Clients</option>
                  <option value="inventory">Inventory</option>
                </select>
              </div>
            </div>

            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={20} />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Report Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">R{reportData.revenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedPeriod} total</p>
              </div>
              <DollarSign className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Expenses</h3>
                <p className="text-2xl font-bold text-red-600 mt-2">R{reportData.expenses.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedPeriod} total</p>
              </div>
              <TrendingUp className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Net Profit</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">R{reportData.profit.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedPeriod} total</p>
              </div>
              <BarChart3 className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Services</h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">{reportData.services}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedPeriod} completed</p>
              </div>
              <FileText className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* Detailed Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Breakdown */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="mr-2 text-blue-500" size={20} />
              Service Breakdown
            </h3>
            <div className="space-y-3">
              {Object.entries(serviceBreakdown).map(([service, count]) => (
                <div key={service} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700 capitalize">
                      {service.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">
                      ({Math.round((count / state.services.length) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Type Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="mr-2 text-green-500" size={20} />
              Client Distribution
            </h3>
            <div className="space-y-3">
              {Object.entries(clientBreakdown).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700 capitalize">
                      {type.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">
                      ({Math.round((count / state.clients.length) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Service */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="mr-2 text-purple-500" size={20} />
              Revenue by Service
            </h3>
            <div className="space-y-3">
              {Object.entries(revenueByService)
                .sort(([,a], [,b]) => b - a)
                .map(([service, revenue]) => (
                <div key={service} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700 capitalize">
                      {service.replace('-', ' ')}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    R{revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="mr-2 text-orange-500" size={20} />
              Inventory Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Total Items</span>
                <span className="text-sm font-medium text-gray-900">{state.inventory.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Low Stock Items</span>
                <span className="text-sm font-medium text-red-600">
                  {state.inventory.filter(item => item.currentStock <= item.reorderLevel).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Total Value</span>
                <span className="text-sm font-medium text-gray-900">
                  R{state.inventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Categories</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Set(state.inventory.map(item => item.category)).size}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="mr-2 text-blue-500" size={20} />
            Monthly Trends
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Average Transaction</p>
              <p className="text-xl font-bold text-blue-600">
                R{state.transactions.length > 0 
                  ? Math.round(state.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) / state.transactions.filter(t => t.type === 'income').length)
                  : 0
                }
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Services per Client</p>
              <p className="text-xl font-bold text-green-600">
                {state.clients.length > 0 
                  ? Math.round(state.services.length / state.clients.length * 10) / 10
                  : 0
                }
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-xl font-bold text-purple-600">
                {state.services.length > 0 
                  ? Math.round((state.services.filter(s => s.status === 'completed').length / state.services.length) * 100)
                  : 0
                }%
              </p>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Top Performing Services</h4>
              <ul className="space-y-1">
                {Object.entries(revenueByService)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([service, revenue], index) => (
                    <li key={service} className="text-sm text-gray-700">
                      {index + 1}. {service.replace('-', ' ')} - R{revenue.toLocaleString()}
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Metrics</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• {state.services.filter(s => s.status === 'pending').length} pending services</li>
                <li>• {state.transactions.filter(t => t.status === 'pending').length} pending payments</li>
                <li>• {state.inventory.filter(i => i.currentStock <= i.reorderLevel).length} items need restocking</li>
                <li>• {state.tutoringSessions.filter(s => s.status === 'scheduled').length} upcoming tutoring sessions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
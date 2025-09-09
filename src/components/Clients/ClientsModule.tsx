import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../Layout/Header';
import { Client } from '../../types';

export function ClientsModule() {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = state.clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesFilter = filterType === 'all' || client.clientType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleAddClient = () => {
    setEditingClient(null);
    setShowAddModal(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowAddModal(true);
  };

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      dispatch({ type: 'DELETE_CLIENT', payload: clientId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Clients Management" 
        onAddNew={handleAddClient}
        showAddButton={true}
      />

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="student">Students</option>
                <option value="business">Business</option>
                <option value="job-seeker">Job Seekers</option>
                <option value="community">Community</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Total Clients</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{state.clients.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Students</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {state.clients.filter(c => c.clientType === 'student').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Businesses</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {state.clients.filter(c => c.clientType === 'business').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">This Month</h3>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {state.clients.filter(c => {
                const clientDate = new Date(c.dateRegistered);
                const thisMonth = new Date();
                return clientDate.getMonth() === thisMonth.getMonth() && 
                       clientDate.getFullYear() === thisMonth.getFullYear();
              }).length}
            </p>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Client</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Total Spent</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Service</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No clients found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-900">{client.name}</p>
                          <p className="text-sm text-gray-500">
                            Registered: {new Date(client.dateRegistered).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail size={14} className="mr-2" />
                            {client.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone size={14} className="mr-2" />
                            {client.phone}
                          </div>
                          {client.address && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin size={14} className="mr-2" />
                              {client.address}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          client.clientType === 'student' ? 'bg-blue-100 text-blue-800' :
                          client.clientType === 'business' ? 'bg-green-100 text-green-800' :
                          client.clientType === 'job-seeker' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {client.clientType.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        R{client.totalSpent.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {client.lastServiceDate ? 
                          new Date(client.lastServiceDate).toLocaleDateString() : 
                          'No services yet'
                        }
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {/* View client details */}}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditClient(client)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Client"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Client"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Client Modal */}
      {showAddModal && (
        <ClientModal
          client={editingClient}
          onClose={() => setShowAddModal(false)}
          onSave={(client) => {
            if (editingClient) {
              dispatch({ type: 'UPDATE_CLIENT', payload: client });
            } else {
              dispatch({ type: 'ADD_CLIENT', payload: client });
            }
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

interface ClientModalProps {
  client: Client | null;
  onClose: () => void;
  onSave: (client: Client) => void;
}

function ClientModal({ client, onClose, onSave }: ClientModalProps) {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
    clientType: client?.clientType || 'student',
    notes: client?.notes || '',
    totalSpent: client?.totalSpent || 0,
    dateRegistered: client?.dateRegistered || new Date().toISOString(),
    lastServiceDate: client?.lastServiceDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData: Client = {
      id: client?.id || Date.now().toString(),
      name: formData.name!,
      email: formData.email!,
      phone: formData.phone!,
      address: formData.address!,
      clientType: formData.clientType as Client['clientType'],
      dateRegistered: formData.dateRegistered!,
      notes: formData.notes!,
      totalSpent: formData.totalSpent!,
      lastServiceDate: formData.lastServiceDate!,
    };

    onSave(clientData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {client ? 'Edit Client' : 'Add New Client'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Type
              </label>
              <select
                value={formData.clientType}
                onChange={(e) => setFormData({ ...formData, clientType: e.target.value as Client['clientType'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="student">Student</option>
                <option value="business">Business</option>
                <option value="job-seeker">Job Seeker</option>
                <option value="community">Community Member</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {client ? 'Update' : 'Create'} Client
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
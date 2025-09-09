import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../Layout/Header';
import { Service } from '../../types';

export function ServicesModule() {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const filteredServices = state.services.filter(service => {
    const client = state.clients.find(c => c.id === service.clientId);
    const matchesSearch = service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    const matchesType = filterType === 'all' || service.serviceType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddService = () => {
    setEditingService(null);
    setShowAddModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowAddModal(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      dispatch({ type: 'DELETE_SERVICE', payload: serviceId });
    }
  };

  const getStatusIcon = (status: Service['status']) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={16} />;
      case 'in-progress': return <AlertCircle className="text-blue-500" size={16} />;
      case 'completed': return <CheckCircle className="text-green-500" size={16} />;
      case 'cancelled': return <AlertCircle className="text-red-500" size={16} />;
    }
  };

  const serviceTypes = [
    'printing', 'photocopying', 'cv-writing', 'assignment-help', 'tutoring',
    'business-registration', 'website-development', 'laminating', 'binding', 'stationery', 'other'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Services Management" 
        onAddNew={handleAddService}
        showAddButton={true}
      />

      <div className="p-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Total Services</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{state.services.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {state.services.filter(s => s.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {state.services.filter(s => s.status === 'in-progress').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600">Completed Today</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {state.services.filter(s => 
                s.status === 'completed' && 
                s.dateCompleted && 
                new Date(s.dateCompleted).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Service</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Client</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Cost</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Staff</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No services found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => {
                    const client = state.clients.find(c => c.id === service.clientId);
                    return (
                      <tr key={service.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {service.serviceType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-500">{service.description}</p>
                            {service.details.pages && (
                              <p className="text-xs text-gray-400">{service.details.pages} pages</p>
                            )}
                            {service.details.hours && (
                              <p className="text-xs text-gray-400">{service.details.hours} hours</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-gray-900">{client?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{client?.email}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(service.status)}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              service.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              service.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              service.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {service.status.replace('-', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-gray-900">R{service.cost.toLocaleString()}</p>
                          <p className={`text-xs ${service.paid ? 'text-green-600' : 'text-red-600'}`}>
                            {service.paid ? 'Paid' : 'Unpaid'}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          {service.assignedStaff ? (
                            <div className="flex items-center">
                              <User size={14} className="mr-1 text-gray-400" />
                              <span className="text-sm text-gray-600">{service.assignedStaff}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Unassigned</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-gray-600">
                            {new Date(service.dateCreated).toLocaleDateString()}
                          </p>
                          {service.dateCompleted && (
                            <p className="text-xs text-green-600">
                              Completed: {new Date(service.dateCompleted).toLocaleDateString()}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {/* View service details */}}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditService(service)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Service"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Service"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      {showAddModal && (
        <ServiceModal
          service={editingService}
          clients={state.clients}
          onClose={() => setShowAddModal(false)}
          onSave={(service) => {
            if (editingService) {
              dispatch({ type: 'UPDATE_SERVICE', payload: service });
            } else {
              dispatch({ type: 'ADD_SERVICE', payload: service });
            }
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

interface ServiceModalProps {
  service: Service | null;
  clients: any[];
  onClose: () => void;
  onSave: (service: Service) => void;
}

function ServiceModal({ service, clients, onClose, onSave }: ServiceModalProps) {
  const [formData, setFormData] = useState<Partial<Service>>({
    clientId: service?.clientId || '',
    serviceType: service?.serviceType || 'printing',
    description: service?.description || '',
    details: service?.details || {},
    status: service?.status || 'pending',
    assignedStaff: service?.assignedStaff || '',
    dateCreated: service?.dateCreated || new Date().toISOString(),
    cost: service?.cost || 0,
    paid: service?.paid || false,
  });

  const serviceTypes = [
    { value: 'printing', label: 'Printing' },
    { value: 'photocopying', label: 'Photocopying' },
    { value: 'cv-writing', label: 'CV Writing' },
    { value: 'assignment-help', label: 'Assignment Help' },
    { value: 'tutoring', label: 'Tutoring' },
    { value: 'business-registration', label: 'Business Registration' },
    { value: 'website-development', label: 'Website Development' },
    { value: 'laminating', label: 'Laminating' },
    { value: 'binding', label: 'Binding' },
    { value: 'stationery', label: 'Stationery' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData: Service = {
      id: service?.id || Date.now().toString(),
      clientId: formData.clientId!,
      serviceType: formData.serviceType as Service['serviceType'],
      description: formData.description!,
      details: formData.details!,
      status: formData.status as Service['status'],
      assignedStaff: formData.assignedStaff,
      dateCreated: formData.dateCreated!,
      dateCompleted: formData.status === 'completed' ? new Date().toISOString() : service?.dateCompleted,
      cost: formData.cost!,
      paid: formData.paid!,
    };

    onSave(serviceData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as Service['serviceType'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {serviceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pages (if applicable)
                </label>
                <input
                  type="number"
                  value={formData.details?.pages || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    details: { ...formData.details, pages: parseInt(e.target.value) || undefined }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours (if applicable)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.details?.hours || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    details: { ...formData.details, hours: parseFloat(e.target.value) || undefined }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost (R)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Service['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Staff
                </label>
                <input
                  type="text"
                  value={formData.assignedStaff}
                  onChange={(e) => setFormData({ ...formData, assignedStaff: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Staff member name"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="paid"
                checked={formData.paid}
                onChange={(e) => setFormData({ ...formData, paid: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="paid" className="text-sm font-medium text-gray-700">
                Payment Received
              </label>
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
                {service ? 'Update' : 'Create'} Service
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
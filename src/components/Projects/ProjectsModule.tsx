import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Briefcase, Globe, FileText, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../Layout/Header';
import { BusinessProject, Milestone } from '../../types';

export function ProjectsModule() {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<BusinessProject | null>(null);

  const filteredProjects = state.businessProjects.filter(project => {
    const client = state.clients.find(c => c.id === project.clientId);
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesType = filterType === 'all' || project.projectType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddProject = () => {
    setEditingProject(null);
    setShowAddModal(true);
  };

  const handleEditProject = (project: BusinessProject) => {
    setEditingProject(project);
    setShowAddModal(true);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch({ type: 'DELETE_BUSINESS_PROJECT', payload: projectId });
    }
  };

  const getStatusIcon = (status: BusinessProject['status']) => {
    switch (status) {
      case 'planning': return <FileText className="text-blue-500" size={16} />;
      case 'in-progress': return <Clock className="text-yellow-500" size={16} />;
      case 'review': return <AlertCircle className="text-orange-500" size={16} />;
      case 'completed': return <CheckCircle className="text-green-500" size={16} />;
    }
  };

  // Calculate project stats
  const totalProjects = state.businessProjects.length;
  const activeProjects = state.businessProjects.filter(p => p.status === 'in-progress' || p.status === 'planning').length;
  const completedProjects = state.businessProjects.filter(p => p.status === 'completed').length;
  const websiteProjects = state.businessProjects.filter(p => p.projectType === 'website-development').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Business & Website Projects" 
        onAddNew={handleAddProject}
        showAddButton={true}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Projects</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">{totalProjects}</p>
              </div>
              <Briefcase className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Active Projects</h3>
                <p className="text-2xl font-bold text-yellow-600 mt-2">{activeProjects}</p>
              </div>
              <Clock className="text-yellow-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Completed</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">{completedProjects}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Website Projects</h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">{websiteProjects}</p>
              </div>
              <Globe className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
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
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="business-registration">Business Registration</option>
                <option value="website-development">Website Development</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Briefcase className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No projects found matching your criteria</p>
              <button
                onClick={handleAddProject}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const client = state.clients.find(c => c.id === project.clientId);
              const completedMilestones = project.milestones.filter(m => m.completed).length;
              const progressPercentage = project.milestones.length > 0 
                ? Math.round((completedMilestones / project.milestones.length) * 100) 
                : 0;

              return (
                <div key={project.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        {project.projectType === 'website-development' ? (
                          <Globe className="text-purple-500 mr-3" size={24} />
                        ) : (
                          <FileText className="text-blue-500 mr-3" size={24} />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.title}</h3>
                          <p className="text-sm text-gray-500">{client?.name || 'Unknown Client'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(project.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          project.status === 'review' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {project.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Project Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Milestones: {completedMilestones}/{project.milestones.length}
                      </p>
                      <div className="space-y-1">
                        {project.milestones.slice(0, 3).map((milestone) => (
                          <div key={milestone.id} className="flex items-center text-xs">
                            <CheckCircle 
                              className={`mr-2 ${milestone.completed ? 'text-green-500' : 'text-gray-300'}`} 
                              size={12} 
                            />
                            <span className={milestone.completed ? 'text-gray-600' : 'text-gray-400'}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                        {project.milestones.length > 3 && (
                          <p className="text-xs text-gray-400">+{project.milestones.length - 3} more</p>
                        )}
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500">Start Date</p>
                        <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Due Date</p>
                        <p className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Website Specific Details */}
                    {project.projectType === 'website-development' && project.websiteDetails && (
                      <div className="bg-purple-50 rounded-lg p-3 mb-4">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-purple-600 font-medium">Domain</p>
                            <p className="text-purple-800">{project.websiteDetails.domain || 'TBD'}</p>
                          </div>
                          <div>
                            <p className="text-purple-600 font-medium">Pages</p>
                            <p className="text-purple-800">{project.websiteDetails.pagesBuilt || 0}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cost and Payment */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Project Cost</p>
                        <p className="font-semibold text-lg text-gray-900">R{project.cost.toLocaleString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {project.paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {/* View project details */}}
                        className="flex-1 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm flex items-center justify-center"
                        title="View Details"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="flex-1 px-3 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm flex items-center justify-center"
                        title="Edit Project"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="flex-1 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm flex items-center justify-center"
                        title="Delete Project"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      {showAddModal && (
        <ProjectModal
          project={editingProject}
          clients={state.clients}
          onClose={() => setShowAddModal(false)}
          onSave={(project) => {
            if (editingProject) {
              dispatch({ type: 'UPDATE_BUSINESS_PROJECT', payload: project });
            } else {
              dispatch({ type: 'ADD_BUSINESS_PROJECT', payload: project });
            }
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

interface ProjectModalProps {
  project: BusinessProject | null;
  clients: any[];
  onClose: () => void;
  onSave: (project: BusinessProject) => void;
}

function ProjectModal({ project, clients, onClose, onSave }: ProjectModalProps) {
  const [formData, setFormData] = useState<Partial<BusinessProject>>({
    clientId: project?.clientId || '',
    projectType: project?.projectType || 'business-registration',
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'planning',
    startDate: project?.startDate || new Date().toISOString().split('T')[0],
    dueDate: project?.dueDate || '',
    cost: project?.cost || 0,
    paid: project?.paid || false,
    milestones: project?.milestones || [],
    websiteDetails: project?.websiteDetails || {
      domain: '',
      hosting: '',
      maintenanceSchedule: '',
      pagesBuilt: 0,
      revisions: 0,
    },
  });

  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title: '',
    description: '',
    dueDate: '',
    completed: false,
  });

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.dueDate) {
      const milestone: Milestone = {
        id: Date.now().toString(),
        title: newMilestone.title,
        description: newMilestone.description || '',
        dueDate: newMilestone.dueDate,
        completed: false,
      };
      
      setFormData({
        ...formData,
        milestones: [...(formData.milestones || []), milestone]
      });
      
      setNewMilestone({ title: '', description: '', dueDate: '', completed: false });
    }
  };

  const removeMilestone = (milestoneId: string) => {
    setFormData({
      ...formData,
      milestones: formData.milestones?.filter(m => m.id !== milestoneId) || []
    });
  };

  const toggleMilestone = (milestoneId: string) => {
    setFormData({
      ...formData,
      milestones: formData.milestones?.map(m => 
        m.id === milestoneId 
          ? { ...m, completed: !m.completed, completedDate: !m.completed ? new Date().toISOString() : undefined }
          : m
      ) || []
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData: BusinessProject = {
      id: project?.id || Date.now().toString(),
      clientId: formData.clientId!,
      projectType: formData.projectType as BusinessProject['projectType'],
      title: formData.title!,
      description: formData.description!,
      status: formData.status as BusinessProject['status'],
      startDate: formData.startDate!,
      dueDate: formData.dueDate!,
      completedDate: formData.status === 'completed' ? new Date().toISOString() : project?.completedDate,
      milestones: formData.milestones!,
      cost: formData.cost!,
      paid: formData.paid!,
      documents: project?.documents || [],
      websiteDetails: formData.projectType === 'website-development' ? formData.websiteDetails : undefined,
    };

    onSave(projectData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
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
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value as BusinessProject['projectType'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="business-registration">Business Registration</option>
                  <option value="website-development">Website Development</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
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

            {/* Dates and Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as BusinessProject['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Website Details */}
            {formData.projectType === 'website-development' && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Website Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domain
                    </label>
                    <input
                      type="text"
                      value={formData.websiteDetails?.domain || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        websiteDetails: { ...formData.websiteDetails!, domain: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hosting
                    </label>
                    <input
                      type="text"
                      value={formData.websiteDetails?.hosting || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        websiteDetails: { ...formData.websiteDetails!, hosting: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pages Built
                    </label>
                    <input
                      type="number"
                      value={formData.websiteDetails?.pagesBuilt || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        websiteDetails: { ...formData.websiteDetails!, pagesBuilt: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Revisions
                    </label>
                    <input
                      type="number"
                      value={formData.websiteDetails?.revisions || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        websiteDetails: { ...formData.websiteDetails!, revisions: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Schedule
                  </label>
                  <input
                    type="text"
                    value={formData.websiteDetails?.maintenanceSchedule || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      websiteDetails: { ...formData.websiteDetails!, maintenanceSchedule: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Monthly, Quarterly"
                  />
                </div>
              </div>
            )}

            {/* Milestones */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Milestones</h3>
              
              {/* Add New Milestone */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <input
                    type="text"
                    placeholder="Milestone title"
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Milestone
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Milestone description (optional)"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Existing Milestones */}
              <div className="space-y-2">
                {formData.milestones?.map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={milestone.completed}
                        onChange={() => toggleMilestone(milestone.id)}
                        className="rounded"
                      />
                      <div>
                        <p className={`font-medium ${milestone.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {milestone.title}
                        </p>
                        <p className="text-sm text-gray-500">Due: {new Date(milestone.dueDate).toLocaleDateString()}</p>
                        {milestone.description && (
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost and Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Cost (R)
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
                {project ? 'Update' : 'Create'} Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
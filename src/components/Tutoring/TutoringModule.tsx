import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, BookOpen, Calendar, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../Layout/Header';
import { TutoringSession, Student } from '../../types';

export function TutoringModule() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'sessions' | 'students'>('sessions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSession, setEditingSession] = useState<TutoringSession | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredSessions = state.tutoringSessions.filter(session => {
    const student = state.students.find(s => s.id === session.studentId);
    const matchesSearch = session.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student?.clientId && state.clients.find(c => c.id === student.clientId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddSession = () => {
    setEditingSession(null);
    setShowAddModal(true);
  };

  const handleEditSession = (session: TutoringSession) => {
    setEditingSession(session);
    setShowAddModal(true);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this tutoring session?')) {
      dispatch({ type: 'DELETE_TUTORING_SESSION', payload: sessionId });
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowStudentModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowStudentModal(true);
  };

  // Calculate tutoring stats
  const totalSessions = state.tutoringSessions.length;
  const completedSessions = state.tutoringSessions.filter(s => s.status === 'completed').length;
  const upcomingSessions = state.tutoringSessions.filter(s => {
    const sessionDate = new Date(s.sessionDate);
    const today = new Date();
    return sessionDate > today && s.status === 'scheduled';
  }).length;
  const totalStudents = state.students.length;

  const getStatusIcon = (status: TutoringSession['status']) => {
    switch (status) {
      case 'scheduled': return <Calendar className="text-blue-500" size={16} />;
      case 'completed': return <CheckCircle className="text-green-500" size={16} />;
      case 'cancelled': return <XCircle className="text-red-500" size={16} />;
      case 'no-show': return <XCircle className="text-orange-500" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Tutoring Management" 
        onAddNew={activeTab === 'sessions' ? handleAddSession : handleAddStudent}
        showAddButton={true}
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Sessions</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">{totalSessions}</p>
              </div>
              <BookOpen className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Completed</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">{completedSessions}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Upcoming</h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">{upcomingSessions}</p>
              </div>
              <Calendar className="text-purple-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
                <p className="text-2xl font-bold text-orange-600 mt-2">{totalStudents}</p>
              </div>
              <Users className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('sessions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sessions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tutoring Sessions
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {activeTab === 'sessions' && (
                <div className="flex items-center space-x-2">
                  <Filter className="text-gray-400" size={20} />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'sessions' ? (
          <SessionsTable 
            sessions={filteredSessions}
            students={state.students}
            clients={state.clients}
            onEdit={handleEditSession}
            onDelete={handleDeleteSession}
            getStatusIcon={getStatusIcon}
          />
        ) : (
          <StudentsTable 
            students={state.students}
            clients={state.clients}
            sessions={state.tutoringSessions}
            onEdit={handleEditStudent}
            searchTerm={searchTerm}
          />
        )}
      </div>

      {/* Add/Edit Session Modal */}
      {showAddModal && (
        <SessionModal
          session={editingSession}
          students={state.students}
          clients={state.clients}
          onClose={() => setShowAddModal(false)}
          onSave={(session) => {
            if (editingSession) {
              dispatch({ type: 'UPDATE_TUTORING_SESSION', payload: session });
            } else {
              dispatch({ type: 'ADD_TUTORING_SESSION', payload: session });
            }
            setShowAddModal(false);
          }}
        />
      )}

      {/* Add/Edit Student Modal */}
      {showStudentModal && (
        <StudentModal
          student={editingStudent}
          clients={state.clients}
          onClose={() => setShowStudentModal(false)}
          onSave={(student) => {
            if (editingStudent) {
              dispatch({ type: 'UPDATE_STUDENT', payload: student });
            } else {
              dispatch({ type: 'ADD_STUDENT', payload: student });
            }
            setShowStudentModal(false);
          }}
        />
      )}
    </div>
  );
}

// Sessions Table Component
function SessionsTable({ sessions, students, clients, onEdit, onDelete, getStatusIcon }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Student</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Subject</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Date & Time</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Duration</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Progress</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Cost</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No tutoring sessions found
                </td>
              </tr>
            ) : (
              sessions.map((session: TutoringSession) => {
                const student = students.find((s: Student) => s.id === session.studentId);
                const client = student ? clients.find((c: any) => c.id === student.clientId) : null;
                return (
                  <tr key={session.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900">{client?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{client?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{session.subject}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm text-gray-900">
                          {new Date(session.sessionDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.sessionDate).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        <span className="text-sm text-gray-600">{session.duration}h</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(session.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          session.status === 'completed' ? 'bg-green-100 text-green-800' :
                          session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {session.status.replace('-', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {session.status === 'completed' && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          session.progress === 'excellent' ? 'bg-green-100 text-green-800' :
                          session.progress === 'good' ? 'bg-blue-100 text-blue-800' :
                          session.progress === 'average' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {session.progress}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">R{session.cost}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(session)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Session"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(session.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Session"
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
  );
}

// Students Table Component
function StudentsTable({ students, clients, sessions, onEdit, searchTerm }: any) {
  const filteredStudents = students.filter((student: Student) => {
    const client = clients.find((c: any) => c.id === student.clientId);
    const matchesSearch = client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.subjects.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Student</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Subjects</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Grade</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Package</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Progress</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Sessions</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student: Student) => {
                const client = clients.find((c: any) => c.id === student.clientId);
                return (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-gray-900">{client?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{client?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1">
                        {student.subjects.map((subject, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-900">{student.grade || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.packageType === 'single-session' ? 'bg-gray-100 text-gray-800' :
                        student.packageType === 'weekly' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {student.packageType.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-900">{student.averageProgress}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-900">
                        {student.completedSessions}/{student.totalSessions}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(student)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Student"
                        >
                          <Edit size={16} />
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
  );
}

// Session Modal Component
function SessionModal({ session, students, clients, onClose, onSave }: any) {
  const [formData, setFormData] = useState<Partial<TutoringSession>>({
    studentId: session?.studentId || '',
    tutorId: session?.tutorId || '',
    subject: session?.subject || '',
    sessionDate: session?.sessionDate || new Date().toISOString().slice(0, 16),
    duration: session?.duration || 1,
    status: session?.status || 'scheduled',
    attended: session?.attended || false,
    notes: session?.notes || '',
    progress: session?.progress || 'average',
    cost: session?.cost || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sessionData: TutoringSession = {
      id: session?.id || Date.now().toString(),
      studentId: formData.studentId!,
      tutorId: formData.tutorId!,
      subject: formData.subject!,
      sessionDate: formData.sessionDate!,
      duration: formData.duration!,
      status: formData.status as TutoringSession['status'],
      attended: formData.attended!,
      notes: formData.notes!,
      progress: formData.progress as TutoringSession['progress'],
      cost: formData.cost!,
    };

    onSave(sessionData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {session ? 'Edit Tutoring Session' : 'Add New Tutoring Session'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student
                </label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student: Student) => {
                    const client = clients.find((c: any) => c.id === student.clientId);
                    return (
                      <option key={student.id} value={student.id}>
                        {client?.name || 'Unknown'}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.sessionDate}
                  onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TutoringSession['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress
                </label>
                <select
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: e.target.value as TutoringSession['progress'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="needs-improvement">Needs Improvement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost (R)
                </label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tutor ID
              </label>
              <input
                type="text"
                value={formData.tutorId}
                onChange={(e) => setFormData({ ...formData, tutorId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="attended"
                checked={formData.attended}
                onChange={(e) => setFormData({ ...formData, attended: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="attended" className="text-sm font-medium text-gray-700">
                Student Attended
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
                {session ? 'Update' : 'Create'} Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Student Modal Component
function StudentModal({ student, clients, onClose, onSave }: any) {
  const [formData, setFormData] = useState<Partial<Student>>({
    clientId: student?.clientId || '',
    subjects: student?.subjects || [],
    grade: student?.grade || '',
    packageType: student?.packageType || 'single-session',
    totalSessions: student?.totalSessions || 0,
    completedSessions: student?.completedSessions || 0,
    averageProgress: student?.averageProgress || 'average',
  });

  const [newSubject, setNewSubject] = useState('');

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects?.includes(newSubject.trim())) {
      setFormData({
        ...formData,
        subjects: [...(formData.subjects || []), newSubject.trim()]
      });
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects?.filter(s => s !== subject) || []
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const studentData: Student = {
      id: student?.id || Date.now().toString(),
      clientId: formData.clientId!,
      subjects: formData.subjects!,
      grade: formData.grade,
      packageType: formData.packageType as Student['packageType'],
      totalSessions: formData.totalSessions!,
      completedSessions: formData.completedSessions!,
      averageProgress: formData.averageProgress!,
    };

    onSave(studentData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                {clients.map((client: any) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subjects
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Add subject"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addSubject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.subjects?.map((subject, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Type
                </label>
                <select
                  value={formData.packageType}
                  onChange={(e) => setFormData({ ...formData, packageType: e.target.value as Student['packageType'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="single-session">Single Session</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Sessions
                </label>
                <input
                  type="number"
                  value={formData.totalSessions}
                  onChange={(e) => setFormData({ ...formData, totalSessions: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completed Sessions
                </label>
                <input
                  type="number"
                  value={formData.completedSessions}
                  onChange={(e) => setFormData({ ...formData, completedSessions: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Progress
              </label>
              <select
                value={formData.averageProgress}
                onChange={(e) => setFormData({ ...formData, averageProgress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="needs-improvement">Needs Improvement</option>
              </select>
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
                {student ? 'Update' : 'Create'} Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
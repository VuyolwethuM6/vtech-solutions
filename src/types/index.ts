export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientType: 'student' | 'business' | 'job-seeker' | 'community';
  dateRegistered: string;
  notes: string;
  totalSpent: number;
  lastServiceDate: string;
}

export interface Service {
  id: string;
  clientId: string;
  serviceType: 'printing' | 'photocopying' | 'cv-writing' | 'assignment-help' | 'tutoring' | 'business-registration' | 'website-development' | 'laminating' | 'binding' | 'stationery' | 'other';
  description: string;
  details: {
    pages?: number;
    hours?: number;
    assignmentType?: string;
    websitePages?: number;
    itemCount?: number;
  };
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedStaff?: string;
  dateCreated: string;
  dateCompleted?: string;
  cost: number;
  paid: boolean;
}

export interface Transaction {
  id: string;
  clientId: string;
  serviceId?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'mobile';
  status: 'pending' | 'paid' | 'overdue';
  invoiceNumber?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'paper' | 'ink' | 'laminating' | 'stationery' | 'equipment' | 'other';
  currentStock: number;
  reorderLevel: number;
  unitCost: number;
  supplier: string;
  lastPurchaseDate: string;
  usageCount: number;
}

export interface TutoringSession {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  sessionDate: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  attended: boolean;
  notes: string;
  progress: 'excellent' | 'good' | 'average' | 'needs-improvement';
  cost: number;
}

export interface Student {
  id: string;
  clientId: string;
  subjects: string[];
  grade?: string;
  packageType: 'single-session' | 'weekly' | 'monthly';
  totalSessions: number;
  completedSessions: number;
  averageProgress: string;
}

export interface BusinessProject {
  id: string;
  clientId: string;
  projectType: 'business-registration' | 'website-development';
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  startDate: string;
  dueDate: string;
  completedDate?: string;
  milestones: Milestone[];
  cost: number;
  paid: boolean;
  documents?: string[];
  websiteDetails?: {
    domain: string;
    hosting: string;
    maintenanceSchedule: string;
    pagesBuilt: number;
    revisions: number;
  };
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedDate?: string;
}

export interface DailyOperation {
  id: string;
  date: string;
  servicesCompleted: number;
  totalRevenue: number;
  staffAssignments: { [staffId: string]: number };
  inventoryUsed: { [itemId: string]: number };
  topServices: string[];
  busyHours: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'staff' | 'tutor' | 'viewer';
  permissions: string[];
  active: boolean;
}

export interface Notification {
  id: string;
  type: 'payment-reminder' | 'tutoring-reminder' | 'inventory-alert' | 'maintenance-reminder';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  read: boolean;
  actionRequired: boolean;
  relatedId?: string;
}

export interface DashboardStats {
  todayRevenue: number;
  todayServices: number;
  pendingPayments: number;
  lowStockItems: number;
  upcomingTutoring: number;
  activeProjects: number;
  totalClients: number;
  monthlyRevenue: number;
}
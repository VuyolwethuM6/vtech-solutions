import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  Client, 
  Service, 
  Transaction, 
  InventoryItem, 
  TutoringSession, 
  Student, 
  BusinessProject, 
  User, 
  Notification,
  DashboardStats 
} from '../types';

interface AppState {
  clients: Client[];
  services: Service[];
  transactions: Transaction[];
  inventory: InventoryItem[];
  tutoringSessions: TutoringSession[];
  students: Student[];
  businessProjects: BusinessProject[];
  users: User[];
  notifications: Notification[];
  currentUser: User | null;
  dashboardStats: DashboardStats;
  activeModule: string;
}

type AppAction = 
  | { type: 'SET_ACTIVE_MODULE'; payload: string }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_INVENTORY_ITEM'; payload: InventoryItem }
  | { type: 'UPDATE_INVENTORY_ITEM'; payload: InventoryItem }
  | { type: 'DELETE_INVENTORY_ITEM'; payload: string }
  | { type: 'ADD_TUTORING_SESSION'; payload: TutoringSession }
  | { type: 'UPDATE_TUTORING_SESSION'; payload: TutoringSession }
  | { type: 'DELETE_TUTORING_SESSION'; payload: string }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'ADD_BUSINESS_PROJECT'; payload: BusinessProject }
  | { type: 'UPDATE_BUSINESS_PROJECT'; payload: BusinessProject }
  | { type: 'DELETE_BUSINESS_PROJECT'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'UPDATE_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> };

const initialState: AppState = {
  clients: [],
  services: [],
  transactions: [],
  inventory: [],
  tutoringSessions: [],
  students: [],
  businessProjects: [],
  users: [],
  notifications: [],
  currentUser: null,
  dashboardStats: {
    todayRevenue: 0,
    todayServices: 0,
    pendingPayments: 0,
    lowStockItems: 0,
    upcomingTutoring: 0,
    activeProjects: 0,
    totalClients: 0,
    monthlyRevenue: 0
  },
  activeModule: 'dashboard'
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ACTIVE_MODULE':
      return { ...state, activeModule: action.payload };
    
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client => 
          client.id === action.payload.id ? action.payload : client
        )
      };
    
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload)
      };
    
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };
    
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(service => 
          service.id === action.payload.id ? action.payload : service
        )
      };
    
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter(service => service.id !== action.payload)
      };
    
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction => 
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    
    case 'ADD_INVENTORY_ITEM':
      return { ...state, inventory: [...state.inventory, action.payload] };
    
    case 'UPDATE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.map(item => 
          item.id === action.payload.id ? action.payload : item
        )
      };
    
    case 'DELETE_INVENTORY_ITEM':
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.payload)
      };
    
    case 'ADD_TUTORING_SESSION':
      return { ...state, tutoringSessions: [...state.tutoringSessions, action.payload] };
    
    case 'UPDATE_TUTORING_SESSION':
      return {
        ...state,
        tutoringSessions: state.tutoringSessions.map(session => 
          session.id === action.payload.id ? action.payload : session
        )
      };
    
    case 'DELETE_TUTORING_SESSION':
      return {
        ...state,
        tutoringSessions: state.tutoringSessions.filter(session => session.id !== action.payload)
      };
    
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload] };
    
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(student => 
          student.id === action.payload.id ? action.payload : student
        )
      };
    
    case 'ADD_BUSINESS_PROJECT':
      return { ...state, businessProjects: [...state.businessProjects, action.payload] };
    
    case 'UPDATE_BUSINESS_PROJECT':
      return {
        ...state,
        businessProjects: state.businessProjects.map(project => 
          project.id === action.payload.id ? action.payload : project
        )
      };
    
    case 'DELETE_BUSINESS_PROJECT':
      return {
        ...state,
        businessProjects: state.businessProjects.filter(project => project.id !== action.payload)
      };
    
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => 
          notification.id === action.payload ? { ...notification, read: true } : notification
        )
      };
    
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      };
    
    case 'UPDATE_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
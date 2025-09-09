import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function useLocalStorage() {
  const { state, dispatch } = useApp();

  // Load data from localStorage on app start
  useEffect(() => {
    const savedData = localStorage.getItem('digitalHubData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }

    // Initialize with demo data if no saved data exists
    if (!savedData) {
      initializeDemoData();
    }
  }, [dispatch]);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      clients: state.clients,
      services: state.services,
      transactions: state.transactions,
      inventory: state.inventory,
      tutoringSessions: state.tutoringSessions,
      students: state.students,
      businessProjects: state.businessProjects,
      users: state.users,
      notifications: state.notifications,
    };
    
    localStorage.setItem('digitalHubData', JSON.stringify(dataToSave));
  }, [state]);

  // Initialize with demo data
  const initializeDemoData = () => {
    const demoData = {
      users: [
        {
          id: '1',
          name: 'Vuyo Mabhuleka',
          email: 'vuyo@digitalhub.co.za',
          role: 'owner' as const,
          permissions: ['all'],
          active: true,
        }
      ],
      clients: [
        {
          id: '1',
          name: 'Thabo Mthembu',
          email: 'thabo@example.com',
          phone: '0712345678',
          address: '123 Main Street, Johannesburg',
          clientType: 'student' as const,
          dateRegistered: new Date(2024, 0, 15).toISOString(),
          notes: 'Regular printing and CV services',
          totalSpent: 450,
          lastServiceDate: new Date(2024, 0, 20).toISOString(),
        },
        {
          id: '2',
          name: 'Sarah Business Solutions',
          email: 'sarah@business.com',
          phone: '0813456789',
          address: '456 Business Ave, Cape Town',
          clientType: 'business' as const,
          dateRegistered: new Date(2024, 0, 10).toISOString(),
          notes: 'Website development project',
          totalSpent: 8500,
          lastServiceDate: new Date(2024, 0, 18).toISOString(),
        }
      ],
      inventory: [
        {
          id: '1',
          name: 'A4 Paper (White)',
          category: 'paper' as const,
          currentStock: 50,
          reorderLevel: 20,
          unitCost: 0.50,
          supplier: 'Office Supplies Co',
          lastPurchaseDate: new Date(2024, 0, 1).toISOString(),
          usageCount: 100,
        },
        {
          id: '2',
          name: 'Black Ink Cartridge',
          category: 'ink' as const,
          currentStock: 5,
          reorderLevel: 3,
          unitCost: 450,
          supplier: 'Print Solutions',
          lastPurchaseDate: new Date(2024, 0, 5).toISOString(),
          usageCount: 2,
        }
      ],
      services: [
        {
          id: '1',
          clientId: '1',
          serviceType: 'printing' as const,
          description: 'Print assignment documents',
          details: { pages: 15 },
          status: 'completed' as const,
          assignedStaff: 'Staff Member',
          dateCreated: new Date(2024, 0, 15).toISOString(),
          dateCompleted: new Date(2024, 0, 15).toISOString(),
          cost: 75,
          paid: true,
        },
        {
          id: '2',
          clientId: '2',
          serviceType: 'website-development' as const,
          description: 'Business website development',
          details: { websitePages: 5 },
          status: 'in-progress' as const,
          assignedStaff: 'Web Developer',
          dateCreated: new Date(2024, 0, 10).toISOString(),
          cost: 8500,
          paid: false,
        }
      ],
      transactions: [
        {
          id: '1',
          clientId: '1',
          serviceId: '1',
          type: 'income' as const,
          amount: 75,
          description: 'Printing services payment',
          category: 'Service Payment',
          date: new Date(2024, 0, 15).toISOString(),
          paymentMethod: 'cash' as const,
          status: 'paid' as const,
          invoiceNumber: 'INV-001',
        },
        {
          id: '2',
          clientId: '',
          type: 'expense' as const,
          amount: 500,
          description: 'Office supplies purchase',
          category: 'Supplies',
          date: new Date(2024, 0, 5).toISOString(),
          paymentMethod: 'card' as const,
          status: 'paid' as const,
        }
      ],
      students: [
        {
          id: '1',
          clientId: '1',
          subjects: ['Mathematics', 'Physics'],
          grade: 'Grade 12',
          packageType: 'weekly' as const,
          totalSessions: 8,
          completedSessions: 3,
          averageProgress: 'good',
        }
      ],
      tutoringSessions: [
        {
          id: '1',
          studentId: '1',
          tutorId: 'tutor-1',
          subject: 'Mathematics',
          sessionDate: new Date(2024, 0, 20, 14, 0).toISOString(),
          duration: 2,
          status: 'completed' as const,
          attended: true,
          notes: 'Good progress on algebra',
          progress: 'good' as const,
          cost: 200,
        }
      ],
      businessProjects: [
        {
          id: '1',
          clientId: '2',
          projectType: 'website-development' as const,
          title: 'Business Website Development',
          description: 'Complete business website with 5 pages',
          status: 'in-progress' as const,
          startDate: new Date(2024, 0, 10).toISOString(),
          dueDate: new Date(2024, 1, 10).toISOString(),
          milestones: [
            {
              id: '1',
              title: 'Design Mockups',
              description: 'Create initial design mockups',
              dueDate: new Date(2024, 0, 20).toISOString(),
              completed: true,
              completedDate: new Date(2024, 0, 18).toISOString(),
            },
            {
              id: '2',
              title: 'Development Phase',
              description: 'Build the website',
              dueDate: new Date(2024, 1, 5).toISOString(),
              completed: false,
            }
          ],
          cost: 8500,
          paid: false,
          documents: [],
          websiteDetails: {
            domain: 'businesssolutions.co.za',
            hosting: 'Shared Hosting',
            maintenanceSchedule: 'Monthly',
            pagesBuilt: 3,
            revisions: 2,
          }
        }
      ],
      notifications: [
        {
          id: '1',
          type: 'inventory-alert' as const,
          title: 'Low Stock Alert',
          message: 'Black Ink Cartridge is running low (5 units remaining)',
          priority: 'medium' as const,
          date: new Date().toISOString(),
          read: false,
          actionRequired: true,
          relatedId: '2',
        },
        {
          id: '2',
          type: 'payment-reminder' as const,
          title: 'Payment Reminder',
          message: 'Website development payment is pending for Sarah Business Solutions',
          priority: 'high' as const,
          date: new Date().toISOString(),
          read: false,
          actionRequired: true,
          relatedId: '2',
        }
      ]
    };

    dispatch({ type: 'LOAD_DATA', payload: demoData });
    dispatch({ type: 'SET_CURRENT_USER', payload: demoData.users[0] });
  };
}
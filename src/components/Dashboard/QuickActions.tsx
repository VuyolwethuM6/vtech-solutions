import React from 'react';
import { Plus, FileText, Users, DollarSign, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuickActionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

function QuickAction({ icon: Icon, title, description, color, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white p-5 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 w-full h-full text-left flex flex-col`}
    >
      {/* Icon top-left */}
      <div className="bg-white/20 p-3 rounded-lg w-fit">
        <Icon size={24} />
      </div>

      {/* Text stacked below */}
      <div className="">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </button>
  );
}


export function QuickActions() {
  const { dispatch } = useApp();

  const actions = [
    {
      icon: Users,
      title: 'New Client',
      description: 'Register a new client',
      color: 'bg-blue-600',
      onClick: () => dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'clients' })
    },
    {
      icon: FileText,
      title: 'New Service',
      description: 'Create a service order',
      color: 'bg-green-600',
      onClick: () => dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'services' })
    },
    {
      icon: DollarSign,
      title: 'Record Payment',
      description: 'Process transaction',
      color: 'bg-purple-600',
      onClick: () => dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'finance' })
    },
    {
      icon: Package,
      title: 'Update Inventory',
      description: 'Manage stock levels',
      color: 'bg-orange-600',
      onClick: () => dispatch({ type: 'SET_ACTIVE_MODULE', payload: 'inventory' })
    }
  ];

  return (
<div className="bg-white rounded-xl shadow-sm p-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
    <Plus size={20} className="text-gray-400" />
  </div>

  {/* Actions Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
    {actions.map((action, index) => (
      <QuickAction key={index} {...action} />
    ))}
  </div>
</div>

  );
}
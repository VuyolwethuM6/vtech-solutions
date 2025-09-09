import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Package, AlertTriangle, TrendingDown, ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../Layout/Header';
import { InventoryItem } from '../../types';

export function InventoryModule() {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const filteredItems = state.inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      dispatch({ type: 'DELETE_INVENTORY_ITEM', payload: itemId });
    }
  };

  // Calculate inventory stats
  const lowStockItems = state.inventory.filter(item => item.currentStock <= item.reorderLevel);
  const totalValue = state.inventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  const totalItems = state.inventory.reduce((sum, item) => sum + item.currentStock, 0);

  const categories = ['paper', 'ink', 'laminating', 'stationery', 'equipment', 'other'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Inventory Management" 
        onAddNew={handleAddItem}
        showAddButton={true}
      />

      <div className="p-6">
        {/* Inventory Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Items</h3>
                <p className="text-2xl font-bold text-blue-600 mt-2">{totalItems.toLocaleString()}</p>
              </div>
              <Package className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Value</h3>
                <p className="text-2xl font-bold text-green-600 mt-2">R{totalValue.toLocaleString()}</p>
              </div>
              <TrendingDown className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Low Stock Items</h3>
                <p className="text-2xl font-bold text-red-600 mt-2">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Categories</h3>
                <p className="text-2xl font-bold text-purple-600 mt-2">{state.inventory.length}</p>
              </div>
              <ShoppingCart className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-2">
              <AlertTriangle className="text-red-500 mr-2" size={20} />
              <h3 className="text-lg font-semibold text-red-800">Low Stock Alert</h3>
            </div>
            <p className="text-red-700 mb-3">The following items need to be restocked:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-red-600">
                    Stock: {item.currentStock} (Reorder at: {item.reorderLevel})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Item</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock Level</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Unit Cost</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Total Value</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Supplier</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Usage</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No inventory items found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const isLowStock = item.currentStock <= item.reorderLevel;
                    return (
                      <tr key={item.id} className={`border-b hover:bg-gray-50 ${isLowStock ? 'bg-red-50' : ''}`}>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {isLowStock && <AlertTriangle className="text-red-500 mr-2" size={16} />}
                            <div>
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-500">ID: {item.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.category === 'paper' ? 'bg-blue-100 text-blue-800' :
                            item.category === 'ink' ? 'bg-purple-100 text-purple-800' :
                            item.category === 'laminating' ? 'bg-green-100 text-green-800' :
                            item.category === 'stationery' ? 'bg-yellow-100 text-yellow-800' :
                            item.category === 'equipment' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className={`font-semibold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                              {item.currentStock}
                            </p>
                            <p className="text-xs text-gray-500">
                              Reorder at: {item.reorderLevel}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-gray-900">R{item.unitCost.toFixed(2)}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-green-600">
                            R{(item.currentStock * item.unitCost).toLocaleString()}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm text-gray-900">{item.supplier}</p>
                            <p className="text-xs text-gray-500">
                              Last purchase: {new Date(item.lastPurchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-gray-600">{item.usageCount} times</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {/* View item details */}}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Item"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Item"
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

      {/* Add/Edit Item Modal */}
      {showAddModal && (
        <InventoryModal
          item={editingItem}
          onClose={() => setShowAddModal(false)}
          onSave={(item) => {
            if (editingItem) {
              dispatch({ type: 'UPDATE_INVENTORY_ITEM', payload: item });
            } else {
              dispatch({ type: 'ADD_INVENTORY_ITEM', payload: item });
            }
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

interface InventoryModalProps {
  item: InventoryItem | null;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
}

function InventoryModal({ item, onClose, onSave }: InventoryModalProps) {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: item?.name || '',
    category: item?.category || 'paper',
    currentStock: item?.currentStock || 0,
    reorderLevel: item?.reorderLevel || 0,
    unitCost: item?.unitCost || 0,
    supplier: item?.supplier || '',
    lastPurchaseDate: item?.lastPurchaseDate || new Date().toISOString().split('T')[0],
    usageCount: item?.usageCount || 0,
  });

  const categories = [
    { value: 'paper', label: 'Paper' },
    { value: 'ink', label: 'Ink' },
    { value: 'laminating', label: 'Laminating' },
    { value: 'stationery', label: 'Stationery' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemData: InventoryItem = {
      id: item?.id || Date.now().toString(),
      name: formData.name!,
      category: formData.category as InventoryItem['category'],
      currentStock: formData.currentStock!,
      reorderLevel: formData.reorderLevel!,
      unitCost: formData.unitCost!,
      supplier: formData.supplier!,
      lastPurchaseDate: formData.lastPurchaseDate!,
      usageCount: formData.usageCount!,
    };

    onSave(itemData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
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
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as InventoryItem['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock
                </label>
                <input
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reorder Level
                </label>
                <input
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Cost (R)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier
                </label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Purchase Date
                </label>
                <input
                  type="date"
                  value={formData.lastPurchaseDate}
                  onChange={(e) => setFormData({ ...formData, lastPurchaseDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Count
              </label>
              <input
                type="number"
                value={formData.usageCount}
                onChange={(e) => setFormData({ ...formData, usageCount: parseInt(e.target.value) || 0 })}
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
                {item ? 'Update' : 'Create'} Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import ModernLayout from '../../components/layout/ModernLayout';
import { inventoryService } from '../../services/inventory.service';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [restockItem, setRestockItem] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'vegetables',
    quantity: '',
    unit: 'kg',
    minThreshold: '',
    price: '',
    supplier: '',
    expiryDate: '',
    notes: '',
  });

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, [categoryFilter, statusFilter, search]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = {};
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const response = await inventoryService.getAllItems(params);
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await inventoryService.getInventoryStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await inventoryService.updateItem(editingItem._id, formData);
        toast.success('Item updated successfully');
      } else {
        await inventoryService.createItem(formData);
        toast.success('Item created successfully');
      }
      setIsModalOpen(false);
      resetForm();
      fetchInventory();
      fetchStats();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(error.response?.data?.message || 'Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minThreshold: item.minThreshold,
      price: item.price,
      supplier: item.supplier || '',
      expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await inventoryService.deleteItem(id);
      toast.success('Item deleted successfully');
      fetchInventory();
      fetchStats();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const handleRestock = async () => {
    if (!restockQuantity || restockQuantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    try {
      await inventoryService.restockItem(restockItem._id, parseFloat(restockQuantity));
      toast.success('Item restocked successfully');
      setIsRestockModalOpen(false);
      setRestockItem(null);
      setRestockQuantity('');
      fetchInventory();
      fetchStats();
    } catch (error) {
      console.error('Error restocking item:', error);
      toast.error('Failed to restock item');
    }
  };

  const openRestockModal = (item) => {
    setRestockItem(item);
    setIsRestockModalOpen(true);
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      itemName: '',
      category: 'vegetables',
      quantity: '',
      unit: 'kg',
      minThreshold: '',
      price: '',
      supplier: '',
      expiryDate: '',
      notes: '',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'in-stock': 'badge-success',
      'low-stock': 'badge-warning',
      'out-of-stock': 'badge-danger',
    };
    return colors[status] || 'badge';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      vegetables: '🥬',
      grains: '🌾',
      dairy: '🥛',
      spices: '🌶️',
      beverages: '☕',
      other: '📦',
    };
    return icons[category] || '📦';
  };

  return (
    <ModernLayout>
      <div>
        {/* Header */}
        <div className="mb-6 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-purple-500/30">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Inventory Management 📦</h1>
              <p className="text-purple-100">Manage your hostel inventory and stock levels</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-6 py-3 bg-white text-purple-600 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Item
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary-600 dark:text-secondary-400 text-sm">Total Items</span>
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-3xl font-bold text-secondary-900 dark:text-white">{stats.totalItems}</p>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary-600 dark:text-secondary-400 text-sm">In Stock</span>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-3xl font-bold text-success-600">{stats.inStockItems}</p>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary-600 dark:text-secondary-400 text-sm">Low Stock</span>
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-3xl font-bold text-warning-600">{stats.lowStockItems}</p>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-secondary-600 dark:text-secondary-400 text-sm">Out of Stock</span>
                <span className="text-2xl">❌</span>
              </div>
              <p className="text-3xl font-bold text-danger-600">{stats.outOfStockItems}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="vegetables">Vegetables</option>
              <option value="grains">Grains</option>
              <option value="dairy">Dairy</option>
              <option value="spices">Spices</option>
              <option value="beverages">Beverages</option>
              <option value="other">Other</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        {loading ? (
          <div className="card p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto" />
            <p className="text-secondary-600 dark:text-secondary-400 mt-4">Loading inventory...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400 text-lg">No inventory items found</p>
            <p className="text-secondary-500 text-sm mt-2">Add your first item to get started</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 dark:text-white">Item</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 dark:text-white">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 dark:text-white">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 dark:text-white">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 dark:text-white">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-900 dark:text-white">Supplier</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-secondary-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                          <div>
                            <p className="font-medium text-secondary-900 dark:text-white">{item.itemName}</p>
                            {item.notes && (
                              <p className="text-xs text-secondary-500">{item.notes}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-secondary-600 dark:text-secondary-400">{item.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-white">
                            {item.quantity} {item.unit}
                          </p>
                          <p className="text-xs text-secondary-500">Min: {item.minThreshold} {item.unit}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`${getStatusColor(item.status)} capitalize`}>
                          {item.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-secondary-900 dark:text-white">₹{item.price}</p>
                        <p className="text-xs text-secondary-500">per {item.unit}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-secondary-600 dark:text-secondary-400">{item.supplier || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openRestockModal(item)}
                            className="p-2 text-success-600 hover:bg-success-50 dark:hover:bg-success-500/10 rounded-lg transition-colors"
                            title="Restock"
                          >
                            <ArrowPathIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="vegetables">Vegetables</option>
                      <option value="grains">Grains</option>
                      <option value="dairy">Dairy</option>
                      <option value="spices">Spices</option>
                      <option value="beverages">Beverages</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Unit *
                    </label>
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="input"
                      required
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="g">Grams (g)</option>
                      <option value="l">Liters (l)</option>
                      <option value="ml">Milliliters (ml)</option>
                      <option value="pieces">Pieces</option>
                      <option value="packets">Packets</option>
                      <option value="bags">Bags</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Minimum Threshold *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.minThreshold}
                      onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Price per Unit *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="input"
                      rows="3"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Restock Modal */}
        {isRestockModalOpen && restockItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
            <div className="card max-w-md w-full">
              <div className="p-6 border-b border-secondary-200 dark:border-secondary-700">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">Restock Item</h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Item</p>
                  <p className="text-lg font-semibold text-secondary-900 dark:text-white">{restockItem.itemName}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">Current Stock</p>
                  <p className="text-lg font-semibold text-secondary-900 dark:text-white">
                    {restockItem.quantity} {restockItem.unit}
                  </p>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Quantity to Add *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={restockQuantity}
                    onChange={(e) => setRestockQuantity(e.target.value)}
                    className="input"
                    placeholder={`Enter quantity in ${restockItem.unit}`}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRestockModalOpen(false);
                      setRestockItem(null);
                      setRestockQuantity('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button onClick={handleRestock} className="btn-success flex-1">
                    Restock
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModernLayout>
  );
};

export default Inventory;

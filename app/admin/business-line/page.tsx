"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Briefcase, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

type BusinessLine = {
  id: number;
  title: string;
  icon: string;
  title_business: string;
  description: string;
};

export default function BusinessLinesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<BusinessLine[]>([]);
  const [filteredData, setFilteredData] = useState<BusinessLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<BusinessLine | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/business-lines');
      const businessData = response.data.data || response.data;
      setData(businessData);
    } catch (error) {
      console.error('Error fetching business lines:', error);
      setError('Failed to fetch business lines data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title_business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, searchTerm]);

  const handleAdd = () => {
    router.push('/admin/business-lines/new');
  };

  const handleEdit = (item: BusinessLine) => {
    router.push(`/admin/business-lines/${item.id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteItem) return;
    setLoading(true);
    try {
      await api.delete(`/admin/business-lines/${confirmDeleteItem.id}`);
      setData(prev => prev.filter(item => item.id !== confirmDeleteItem.id));
      toast.success(`${confirmDeleteItem.title} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting business line:', error);
      toast.error('Failed to delete business line.');
    } finally {
      setLoading(false);
      setConfirmDeleteItem(null);
    }
  };

  const handleRefresh = () => fetchData();

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Info size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold">Business Lines</h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
          >
            <Plus size={16} />
            <span>Add Business Line</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search business lines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
            />
          </div>
        </div>

        {/* Content */}
        {!loading && filteredData.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <Briefcase size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              {searchTerm ? 'No business lines found' : 'No business lines yet'}
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Start by adding your first business line'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Add Business Line
              </button>
            )}
          </div>
        ) : !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-700 text-white text-2xl">
                  {item.icon}
                </div>

                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-blue-400 text-sm">{item.title_business}</p>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3">{item.description}</p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 text-sm"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setConfirmDeleteItem(item)}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 text-sm"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="mt-8 bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Total: {data.length} business lines</span>
              {searchTerm && (
                <span>Filtered: {filteredData.length} results</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-2">
              Delete {confirmDeleteItem.title}?
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to delete this business line? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmDeleteItem(null)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

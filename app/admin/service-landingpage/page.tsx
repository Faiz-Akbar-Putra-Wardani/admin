"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Layers, RefreshCw, AlertCircle, ArrowLeft, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import toast from 'react-hot-toast';

type ServiceItem = {
  id: number;
  title: string;
  name_service: string;
  description: string;
};

export default function ServicePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<ServiceItem[]>([]);
  const [filteredData, setFilteredData] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/services-landing-pages');
      const serviceData = response.data.data || response.data;
      setData(serviceData);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Gagal mengambil data layanan');
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
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name_service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, searchTerm]);

  const handleAdd = () => {
    router.push('/admin/service-landingpage/new');
  };

  interface EditHandler {
    (item: ServiceItem): void;
  }

  const handleEdit: EditHandler = (item) => {
    router.push(`/admin/service-landingpage/${item.id}/edit`);
  };

  interface DeleteHandler {
    (item: ServiceItem): Promise<void>;
  }

  const [confirmDeleteItem, setConfirmDeleteItem] = useState<ServiceItem | null>(null);

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteItem) return;
    setLoading(true);
    try {
      await api.delete(`/admin/services-landing-pages/${confirmDeleteItem.id}`);
      setData(prev => prev.filter(service => service.id !== confirmDeleteItem.id));
      toast.success(`${confirmDeleteItem.title} berhasil dihapus.`);
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Gagal menghapus layanan.');
    } finally {
      setLoading(false);
      setConfirmDeleteItem(null);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Info size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold">Service Landing Page</h1>
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
            <span>Add Service</span>
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
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading services...</p>
          </div>
        )}

        {/* Content */}
        {!loading && filteredData.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <Layers size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              {searchTerm ? 'No services found' : 'No services yet'}
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm 
                ? 'Coba sesuaikan kata kunci pencarian' 
                : 'Mulai dengan menambahkan layanan pertama'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Add Service
              </button>
            )}
          </div>
        ) : !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((service) => (
              <div key={service.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{service.name_service}</p>
                  <p className="text-gray-500 text-xs line-clamp-3">
                    {service.description || 'Tidak ada deskripsi'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors text-sm"
                  >
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setConfirmDeleteItem(service)}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors text-sm"
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
              <span>Total Services: {data.length}</span>
              {searchTerm && (
                <span>Showing: {filteredData.length} results</span>
              )}
            </div>
          </div>
        )}
      </div>
      {confirmDeleteItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-2">
              Delete {confirmDeleteItem.title}?
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini tidak bisa dibatalkan.
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
                {loading ? 'Menghapus...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

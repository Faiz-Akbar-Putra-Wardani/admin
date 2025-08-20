"use client";
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, AlertCircle, Layers } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import toast from 'react-hot-toast';

export default function ServiceEditPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id;

  const [formData, setFormData] = useState<{
    id: string;
    name_service: string;
    description: string;
  }>({
    id: '',
    name_service: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/services-landing-pages/${serviceId}`);
        const serviceData = response.data.data || response.data;

        setFormData({
          id: serviceData.id,
          name_service: serviceData.name_service || '',
          description: serviceData.description || '',
        });
      } catch (error) {
        console.error('Error fetching service:', error);
        setError('Gagal memuat data layanan');
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name_service.trim()) {
      setError('Nama layanan wajib diisi');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Deskripsi wajib diisi');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append('name_service', formData.name_service);
      submitData.append('description', formData.description);
      submitData.append('_method', 'PUT');

      await api.post(`/admin/services-landing-pages/${serviceId}`, submitData);

      toast.success('Layanan berhasil diperbarui!');
      setTimeout(() => {
        router.push('/admin/service-landingpage');
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || 'Terjadi kesalahan tak terduga');
      } else {
        setError('Terjadi kesalahan tak terduga');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading service data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Edit Layanan</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle size={20} className="text-red-400" />
          <span className="text-red-200">{error}</span>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Service */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nama Layanan *</label>
            <input
              type="text"
              value={formData.name_service}
              onChange={(e) => handleInputChange('name_service', e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Memperbarui...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Perbarui Layanan</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

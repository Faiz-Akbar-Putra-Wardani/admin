"use client";

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, AlertCircle, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function ServiceCreatePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  interface ServiceFormData {
    name_service: string;
    description: string;
  }

  const [formData, setFormData] = useState<ServiceFormData>({
    name_service: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ServiceFormData, value: string) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append('name_service', formData.name_service);
      submitData.append('description', formData.description);

      await api.post('/admin/services-landing-pages', submitData);

      toast.success('Layanan berhasil ditambahkan!');
      router.push('/admin/services-landing-pages');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Terjadi kesalahan tak terduga';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Layers size={24} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Tambah Layanan Baru</h1>
        </div>
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          title="Back"
        >
          <ArrowLeft size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle size={20} className="text-red-400" />
          <span className="text-red-200">{error}</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-gray-800 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name Service */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nama Layanan *
            </label>
            <input
              type="text"
              value={formData.name_service}
              onChange={(e) => handleInputChange('name_service', e.target.value)}
              placeholder="Masukkan nama layanan"
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deskripsi *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Masukkan deskripsi layanan"
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50 h-32 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Simpan Layanan</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors text-white"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

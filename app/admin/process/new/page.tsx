"use client";

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Upload, AlertCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';

export default function ProcessCreatePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  interface ProcessFormData {
    icon: File | null;
    title: string;
    description_title: string;
  }

  const [formData, setFormData] = useState<ProcessFormData>({
    icon: null,
    title: '',
    description_title: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ProcessFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      if (typeof event.target?.result === 'string') {
        setImagePreview(event.target.result);
      }
    };
    reader.readAsDataURL(file);

    setFormData(prev => ({ ...prev, icon: file }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description_title.trim()) {
      setError('Description is required');
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
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          submitData.append(key, value as any);
        }
      });

      await api.post('/admin/process', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Process added successfully!');
      router.push('/admin/process');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'An unexpected error occurred';
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
    <div className="px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
        <div className="flex items-center space-x-3">
          <Info size={24} className="text-blue-500" />
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Add New Process
          </h1>
        </div>
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="self-start sm:self-auto p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          title="Back"
        >
          <ArrowLeft size={20} className="text-gray-300" />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-start sm:items-center space-x-3">
          <AlertCircle size={20} className="text-red-400 mt-1 sm:mt-0" />
          <span className="text-red-200">{error}</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden mx-auto sm:mx-0">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Upload size={24} className="text-gray-400" />
                )}
              </div>
              <div className="text-center sm:text-left">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="hidden"
                  id="icon-upload"
                />
                <label
                  htmlFor="icon-upload"
                  className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer transition-colors inline-block ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Choose Icon
                </label>
                <p className="text-sm text-gray-400 mt-1">
                  Upload an icon (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter process title"
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description_title}
              onChange={(e) => handleInputChange('description_title', e.target.value)}
              placeholder="Enter process description"
              disabled={isSubmitting}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Process</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
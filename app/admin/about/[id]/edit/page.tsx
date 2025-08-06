"use client";

import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, AlertCircle, FileText } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import toast from 'react-hot-toast';

export default function AboutEditPage() {
  const router = useRouter();
  const params = useParams();
  const aboutId = params.id;

  interface AboutFormData {
    id: string;
    title: string;
    description: string;
    vision: string;
    mission: string;
  }

  const [formData, setFormData] = useState<AboutFormData>({
    id: '',
    title: '',
    description: '',
    vision: '',
    mission: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get(`/about-us/${aboutId}`);
        const about = response.data.data || response.data;

        setFormData({
          id: about.id,
          title: about.title || '',
          description: about.description || '',
          vision: about.vision || '',
          mission: about.mission || '',
        });
      } catch (err) {
        setError('Failed to load about info');
      } finally {
        setLoading(false);
        
      }
    };

    if (aboutId) fetchAbout();
  }, [aboutId]);

  const handleInputChange = (field: keyof AboutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.title.trim()) return setError('Title is required'), false;
    if (!formData.description.trim()) return setError('Description is required'), false;
    if (!formData.vision.trim()) return setError('Vision is required'), false;
    if (!formData.mission.trim()) return setError('Mission is required'), false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        vision: formData.vision,
        mission: formData.mission,
        _method: 'PUT',
      };

      await api.post(`/admin/about-us/${aboutId}`, payload);
      toast.success('About info updated successfully!');
      router.push('/admin/about');
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading about info...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Edit About Info</h1>
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Vision *</label>
              <textarea
                value={formData.vision}
                onChange={(e) => handleInputChange('vision', e.target.value)}
                rows={3}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mission *</label>
              <textarea
                value={formData.mission}
                onChange={(e) => handleInputChange('mission', e.target.value)}
                rows={3}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              ></textarea>
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
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Update About Info</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

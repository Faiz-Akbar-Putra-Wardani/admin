"use client";
import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Upload, AlertCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import toast from 'react-hot-toast';

export default function TeamEditPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.id;

  const [formData, setFormData] = useState<{
    id: string;
    photo: File | null;
    name: string;
    position: string;
  }>({
    id: '',
    photo: null,
    name: '',
    position: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch team member data
  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const response = await api.get(`/teams/${teamId}`);
        const teamData = response.data.data || response.data;

        setFormData({
          id: teamData.id,
          photo: null,
          name: teamData.name || '',
          position: teamData.position || ''
        });

  
        if (teamData.photo_url) {
          setImagePreview(teamData.photo_url);
        }
      } catch (error) {
        console.error('Error fetching team member:', error);
        setError('Failed to load team member data');
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamMember();
    }
  }, [teamId]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          setImagePreview(result);
        }
        setFormData(prev => ({
          ...prev,
          photo: file
        }));
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.position.trim()) {
      setError('Position is required');
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
    submitData.append('name', formData.name);
    submitData.append('position', formData.position);
    if (formData.photo) {
      submitData.append('photo', formData.photo);
    }

    submitData.append('_method', 'PUT');
    await api.post(`/admin/teams/${teamId}`, submitData);

    toast.success('Team member updated successfully!');
    setTimeout(() => {
    router.push('/admin/team');
    }, 1500);
  } catch (error) {
    console.error('Error submitting form:', error);
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'An unexpected error occurred');
    } else {
      setError('An unexpected error occurred');
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
            <p className="text-gray-400">Loading team member data...</p>
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
          <h1 className="text-2xl font-bold">Edit Team Member</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Photo</label>
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer transition-colors inline-block ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Change Photo
                  </label>
                  <p className="text-sm text-gray-400 mt-1">Upload a new photo (max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
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
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Update Team Member</span>
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
  );
}

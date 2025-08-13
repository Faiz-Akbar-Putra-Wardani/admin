"use client";

import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Upload, Briefcase } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../../lib/api";
import toast from "react-hot-toast";

export default function ServiceEditPage() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState<{
    icon: File | null;
    name: string;
    description: string;
  }>({
    icon: null,
    name: "",
    description: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchService = async () => {
      try {
        const response = await api.get(`/services/${id}`);
        const service = response.data.data || response.data;
        setFormData({
          icon: null,
          name: service.name || "",
          description: service.description || "",
        });
        if (service.icon_url) {
          setImagePreview(service.icon_url);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        setError("Failed to fetch service data");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id, router]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setImagePreview(result);
        }
        setFormData((prev) => ({
          ...prev,
          icon: file,
        }));
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
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
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      if (formData.icon) {
        submitData.append("icon", formData.icon);
      }

      await api.post(`/admin/services/${id}?_method=PUT`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Service updated successfully!");
      router.push("/admin/service");
    } catch (error: any) {
      const message = error?.response?.data?.message || "An unexpected error occurred";
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
      <div className="p-4 sm:p-6">
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">
            Edit Service
          </h1>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-900/50 border border-red-500 p-4 rounded text-red-200">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Icon Upload - Centered on Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon
            </label>
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-4">
              <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="w-full h-full object-cover"
                    alt="preview"
                  />
                ) : (
                  <Upload size={24} className="text-gray-400" />
                )}
              </div>
              <div className="mt-3 sm:mt-0 flex flex-col items-center sm:items-start">
                <input
                  id="icon-file-edit"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
                <label
                  htmlFor="icon-file-edit"
                  className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer text-white ${
                    isSubmitting ? "opacity-50" : ""
                  }`}
                >
                  Choose Icon
                </label>
                <p className="text-sm text-gray-400 mt-1">Max 5MB</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
            >
              {isSubmitting ? (
                "Updating..."
              ) : (
                <>
                  <Save size={16} />
                  <span className="ml-2">Update</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
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
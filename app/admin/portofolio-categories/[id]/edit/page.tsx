// app/admin/portofolio-categories/[id]/edit/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, FolderOpen, AlertCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../../lib/api";
import toast from "react-hot-toast";

interface PortofolioCategoryFormData {
  name: string;
}

export default function PortofolioCategoryEditPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id;

  const [formData, setFormData] = useState<PortofolioCategoryFormData>({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // cek token
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // ambil data category
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/admin/portofolio-categories/${categoryId}`);
        const categoryData = response.data.data || response.data;
        setFormData({
          name: categoryData.name || "",
        });
      } catch (error) {
        console.error("Error fetching category:", error);
        setError("Failed to load category data.");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const handleInputChange = (value: string) => {
    setFormData({ name: value });
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Category name is required.");
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
      submitData.append("name", formData.name);
      submitData.append("_method", "PUT");

      await api.post(`/admin/portofolio-categories/${categoryId}`, submitData);

      toast.success("Portofolio category updated successfully!");
      router.push("/admin/portofolio-categories");
    } catch (error: any) {
      const message = error?.response?.data?.message || "An unexpected error occurred.";
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
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading category data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FolderOpen size={24} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Edit Portofolio Category</h1>
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
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter category name"
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         text-white disabled:opacity-50"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 
                         hover:from-blue-600 hover:to-blue-700 
                         disabled:opacity-50 px-4 py-2 rounded-lg 
                         flex items-center justify-center space-x-2 
                         transition-all text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 bg-gray-600 hover:bg-gray-700 
                         disabled:opacity-50 px-4 py-2 rounded-lg 
                         transition-colors text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Upload, AlertCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../../lib/api";
import toast from "react-hot-toast";

export default function UpdatePortfolioPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState<{
    title: string;
    name_project: string;
    company_name: string;
    category_id: string;
    image_portofolio: File | null;
  }>({
    title: "",
    name_project: "",
    company_name: "",
    category_id: "",
    image_portofolio: null,
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories + existing portfolio data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, portfolioRes] = await Promise.all([
          api.get("/admin/portofolio-categories"),
          api.get(`/admin/portofolios/${id}`),
        ]);

        setCategories(catRes.data.data || []);
        const p = portfolioRes.data.data;
        setFormData({
          title: p.title,
          name_project: p.name_project,
          company_name: p.company_name,
          category_id: String(p.category_id),
          image_portofolio: null,
        });
        setImagePreview(p.image_portofolio_url || null);
      } catch (err) {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as never,
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
          image_portofolio: file,
        }));
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.name_project.trim()) {
      setError("Project name is required");
      return false;
    }
    if (!formData.company_name.trim()) {
      setError("Company name is required");
      return false;
    }
    if (!formData.category_id) {
      setError("Category is required");
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
      submitData.append("title", formData.title);
      submitData.append("name_project", formData.name_project);
      submitData.append("company_name", formData.company_name);
      submitData.append("category_id", formData.category_id);
      if (formData.image_portofolio) {
        submitData.append("image_portofolio", formData.image_portofolio);
      }

      await api.post(`/admin/portofolios/${id}?_method=PUT`, submitData);

      toast.success("Portfolio updated successfully!");
      setTimeout(() => {
        router.push("/admin/portofolio/");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { message?: string } };
        };
        setError(err.response?.data?.message || "An unexpected error occurred");
      } else {
        setError("An unexpected error occurred");
      }
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
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Update Portfolio</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle size={20} className="text-red-400" />
          <span className="text-red-200">{error}</span>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
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
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer transition-colors inline-block ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Upload Image
                </label>
                <p className="text-sm text-gray-400 mt-1">
                  Upload an image (max 5MB)
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
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={formData.name_project}
              onChange={(e) => handleInputChange("name_project", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => handleInputChange("company_name", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => handleInputChange("category_id", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
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
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Update Portfolio</span>
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

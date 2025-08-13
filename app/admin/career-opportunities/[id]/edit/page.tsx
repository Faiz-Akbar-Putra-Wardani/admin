// File: app/admin/career-opportunities/[id]/edit/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Upload, AlertCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../../lib/api";
import toast from "react-hot-toast";

interface CareerFormData {
  image: File | null;
  title: string;
  description: string;
  requirements: string;
}

export default function CareerOpportunitiesEditPage() {
  const router = useRouter();
  const params = useParams();
  const careerId = params.id;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const [formData, setFormData] = useState<CareerFormData>({
    image: null,
    title: "",
    description: "",
    requirements: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareer = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/career-opportunities/${careerId}`);
        const careerData = response.data.data || response.data;
        setFormData({
          image: null,
          title: careerData.title || "",
          description: careerData.description || "",
          requirements: careerData.requirements || "",
        });
        if (careerData.image_url) {
          setImagePreview(careerData.image_url);
        }
      } catch (error) {
        console.error("Error fetching career:", error);
        setError("Failed to load career data");
      } finally {
        setLoading(false);
      }
    };

    if (careerId) {
      fetchCareer();
    }
  }, [careerId]);

  const handleInputChange = (field: keyof CareerFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      if (typeof event.target?.result === "string") {
        setImagePreview(event.target.result);
      }
    };
    reader.readAsDataURL(file);

    setFormData((prev) => ({ ...prev, image: file }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!formData.requirements.trim()) {
      setError("Requirements are required");
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
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("requirements", formData.requirements);
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      await api.post(`/admin/career-opportunities/${careerId}?_method=PUT`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Career updated successfully!");
      router.push("/admin/career-opportunities");
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
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={20} className="text-gray-300" />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-white">Edit Career Opportunity</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle size={20} className="text-red-400" />
          <span className="text-red-200 text-sm">{error}</span>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
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
              <div className="flex-1">
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
                  className={`bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer transition-colors inline-block text-white ${
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
              placeholder="Enter career title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 resize-none placeholder-gray-400"
              placeholder="Enter career description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Requirements *
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 resize-none placeholder-gray-400"
              placeholder="Enter career requirements"
            />
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-white transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
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
              className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// File: app/admin/career-opportunities/new/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Upload, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/api";
import toast from "react-hot-toast";

interface CareerFormData {
  image: File | null;
  title: string;
  description: string;
  requirements: string;
  location: string;
  employment_type: string;
  salary_range: string;
}

export default function NewCareerOpportunityPage() {
  const router = useRouter();

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
    location: "",
    employment_type: "",
    salary_range: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          image: file,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("requirements", formData.requirements);
      submitData.append("location", formData.location);
      submitData.append("employment_type", formData.employment_type);
      submitData.append("salary_range", formData.salary_range);
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      await api.post("/admin/career-opportunities", submitData);

      toast.success("Career opportunity created successfully!");
      setTimeout(() => {
        router.push("/admin/career-opportunities");
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
      <div className="flex items-center mb-6">
        <button
          onClick={handleCancel}
          disabled={isSubmitting}
          className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={20} className="text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-white">New Career Opportunity</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle size={20} className="text-red-400" />
          <span className="text-red-200">{error}</span>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter career title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="e.g., Jakarta, Remote, Hybrid"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Employment Type
            </label>
            <select
              value={formData.employment_type}
              onChange={(e) => handleInputChange("employment_type", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="">Select employment type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Salary Range
            </label>
            <input
              type="text"
              value={formData.salary_range}
              onChange={(e) => handleInputChange("salary_range", e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              placeholder="e.g., Rp 5jt - 8jt"
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
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 resize-none"
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
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white h-32 resize-none"
              placeholder="Enter career requirements"
            />
          </div>

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
                  <span>Save Career</span>
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
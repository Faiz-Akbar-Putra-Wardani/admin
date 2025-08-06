"use client";

import React, { useState, useEffect } from "react";
import { Save, ArrowLeft, Upload, AlertCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../../lib/api";
import toast from "react-hot-toast";

export default function CareerEditPage() {
  const router = useRouter();
  const params = useParams();
  const careerId = params.id;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  interface CareerFormData {
    image: File | null;
    title: string;
    description: string;
  }

  const [formData, setFormData] = useState<CareerFormData>({
    image: null,
    title: "",
    description: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch career data
  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await api.get(`/careers/${careerId}`);
        const careerData = response.data.data || response.data;
        setFormData({
          image: null,
          title: careerData.title || "",
          description: careerData.description || "",
        });
        if (careerData.image_url) {
          setImagePreview(careerData.image_url);
        }
      } catch (error) {
        console.error("Error fetching career:", error);
        setError("Failed to load career data");
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
      if (formData.image) {
        submitData.append("image", formData.image);
      }
      submitData.append("_method", "PUT");

      await api.post(`/admin/careers/${careerId}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Career updated successfully!");
      router.push("/admin/career");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "An unexpected error occurred";
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
        {/* Kiri: Icon + Judul */}
        <div className="flex items-center space-x-3">
          <Upload size={24} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Edit Career</h1>
        </div>

        {/* Kanan: Tombol Back */}
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
                  Choose Image
                </label>
                <p className="text-sm text-gray-400 mt-1">
                  Upload an image for the career (max 5MB)
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
              placeholder="Enter career title"
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
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter career description"
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
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

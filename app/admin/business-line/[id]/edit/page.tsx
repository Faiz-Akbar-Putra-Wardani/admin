"use client";
import React, { useEffect, useState } from "react";
import { Save, ArrowLeft, Upload } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import api from "../../../../../lib/api";
import toast from "react-hot-toast";

type BusinessLine = {
  id: number;
  icon?: string;
  icon_url?: string;
  title_business: string;
  description: string;
};

export default function BusinessLineEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const [businessLine, setBusinessLine] = useState<BusinessLine | null>(null);
  const [mode, setMode] = useState<"upload" | "class">("upload");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchLine = async () => {
      try {
        const res = await api.get(`/admin/business-lines/${id}`);
        const data: BusinessLine = res.data.data || res.data;
        setBusinessLine(data);

        if (data.icon_url) {
          setMode("upload");
          setIconPreview(data.icon_url);
        } else if (data.icon) {
          setMode("class");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchLine();
  }, [id]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    setIconFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string")
        setIconPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const validate = () => {
    if (!businessLine?.title_business.trim()) {
      setError("Title Business is required");
      return false;
    }
    if (!businessLine?.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (mode === "upload" && !iconFile && !iconPreview) {
      setError("Please upload an icon or keep existing");
      return false;
    }
    if (mode === "class" && !businessLine?.icon?.trim()) {
      setError("Icon class is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !businessLine) return;
    if (!validate()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("title_business", businessLine.title_business);
      fd.append("description", businessLine.description);

      if (mode === "upload" && iconFile) {
        fd.append("icon", iconFile);
      } else if (mode === "class" && businessLine.icon) {
        fd.append("icon", businessLine.icon);
      }

      fd.append("_method", "PUT");
      await api.post(`/admin/business-lines/${id}`, fd);
      toast.success("Business line updated");
      router.push("/admin/business-lines");
      router.push("/admin/business-line");
    } catch (err: any) {
      console.error(err);
      const message =
        err?.response?.data?.message || "An unexpected error occurred";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
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
            Edit Business Line
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
      {businessLine && (
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Icon Upload - Centered on Mobile */}
            {mode === "upload" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon image
                </label>
                <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-4">
                  <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                    {iconPreview ? (
                      <img
                        src={iconPreview}
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
                      onChange={handleIconChange}
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
            )}

            {/* Icon Class */}
            {mode === "class" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon class
                </label>
                <input
                  value={businessLine.icon || ""}
                  onChange={(e) =>
                    setBusinessLine({
                      ...businessLine,
                      icon: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            )}


            {/* Title Business */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title Business
              </label>
              <input
                value={businessLine.title_business}
                onChange={(e) =>
                  setBusinessLine({
                    ...businessLine,
                    title_business: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={businessLine.description}
                onChange={(e) =>
                  setBusinessLine({
                    ...businessLine,
                    description: e.target.value,
                  })
                }
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
      )}
    </div>
  );
}

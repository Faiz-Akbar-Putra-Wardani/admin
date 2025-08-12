// app/admin/portofolio-categories/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, FolderOpen, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import toast from "react-hot-toast";

interface PortofolioCategory {
  id: number;
  name: string;
  slug: string;
}

export default function PortofolioCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<PortofolioCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      fetchCategories();
    }
  }, [router]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Endpoint yang diperbaiki
      const response = await api.get("/admin/Portofolio-categories");
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load portofolio categories.");
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        // Endpoint yang diperbaiki
        await api.delete(`/admin/Portofolio-categories/${id}`);
        toast.success("Category deleted successfully!");
        fetchCategories(); // Refresh the list
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category.");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center space-x-3 text-red-200">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FolderOpen size={24} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Portofolio Categories</h1>
        </div>
        <button
          onClick={() => router.push("/admin/portofolio-categories/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add New</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        {categories.length === 0 ? (
          <div className="text-center text-gray-400 p-8">
            <p>No portofolio categories found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div>
                  <h2 className="text-lg font-semibold text-white">{category.name}</h2>
                  <p className="text-sm text-gray-400">Slug: {category.slug}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/admin/portofolio-categories/${category.id}/edit`)}
                    className="p-2 text-blue-400 hover:text-blue-200"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-400 hover:text-red-200"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
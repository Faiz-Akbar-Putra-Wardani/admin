"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FolderOpen,
  Search,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import toast from "react-hot-toast";

interface PortofolioCategory {
  id: number;
  name: string;
}

export default function PortofolioCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<PortofolioCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<
    PortofolioCategory[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteItem, setConfirmDeleteItem] =
    useState<PortofolioCategory | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/portofolio-categories");
      const data = response.data.data || response.data;
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load portofolio categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteItem) return;
    setLoading(true);
    try {
      await api.delete(`/admin/Portofolio-categories/${confirmDeleteItem.id}`);
      setCategories((prev) =>
        prev.filter((item) => item.id !== confirmDeleteItem.id)
      );
      toast.success(`"${confirmDeleteItem.name}" deleted successfully.`);
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Failed to delete category.");
    } finally {
      setLoading(false);
      setConfirmDeleteItem(null);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <FolderOpen size={24} className="text-blue-500" />
            <h1 className="text-xl sm:text-2xl font-bold">
              Portofolio Categories
            </h1>
            <button
              onClick={fetchCategories}
              disabled={loading}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Add button responsive */}
          <button
            onClick={() => router.push("/admin/portofolio-categories/new")}
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all sm:self-auto self-start"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-400" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white disabled:opacity-50"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading categories...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCategories.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              {searchTerm ? "No categories found" : "No categories yet"}
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start by adding your first Portofolio Category"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => router.push("/admin/portofolio-categories/new")}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Add Category
              </button>
            )}
          </div>
        ) : (
          !loading && (
            <>
              {/* Table for desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-xl overflow-hidden">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Name
                      </th>
                      <th className="px-4 pr-20 py-3 text-right text-sm font-semibold text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredCategories.map((category) => (
                      <tr
                        key={category.id}
                        className="hover:bg-gray-750 transition"
                      >
                        <td className="px-4 py-3 text-sm text-gray-100">
                          {category.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="inline-flex space-x-3">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/portofolio-categories/${category.id}/edit`
                                )
                              }
                              disabled={loading}
                              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-lg flex items-center justify-center text-sm disabled:opacity-50"
                            >
                              <Edit size={14} className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => setConfirmDeleteItem(category)}
                              disabled={loading}
                              className="bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-lg flex items-center justify-center text-sm disabled:opacity-50"
                            >
                              <Trash2 size={14} className="mr-1" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card view for mobile */}
              <div className="sm:hidden space-y-4">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="bg-gray-800 p-4 rounded-lg space-y-2"
                  >
                    <p className="text-gray-100 font-semibold">
                      {category.name}
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/admin/portofolio-categories/${category.id}/edit`
                          )
                        }
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-lg flex items-center justify-center text-sm disabled:opacity-50"
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteItem(category)}
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded-lg flex items-center justify-center text-sm disabled:opacity-50"
                      >
                        <Trash2 size={14} className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )
        )}

        {/* Stats */}
        {!loading && (
          <div className="mt-8 bg-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Total Entries: {categories.length}</span>
              {searchTerm && (
                <span>Showing: {filteredCategories.length} results</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-white mb-2">
              Delete "{confirmDeleteItem.name}"?
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Are you sure you want to delete this category? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmDeleteItem(null)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={loading}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

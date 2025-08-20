"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  RefreshCw,
  AlertCircle,
  Info,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "../../../lib/api";
import toast from "react-hot-toast";

type PositionItem = {
  id: number;
  position: string;
  description: string;
};

export default function PositionPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<PositionItem[]>([]);
  const [filteredData, setFilteredData] = useState<PositionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteItem, setConfirmDeleteItem] =
    useState<PositionItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/positions");
      const positionData = response.data.data || response.data;
      setData(positionData);
    } catch (error) {
      console.error("Error fetching positions:", error);
      setError("Failed to fetch position data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(
      (item) =>
        item.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, searchTerm]);

  const handleAdd = () => {
    router.push("/admin/position/new");
  };

  const handleEdit = (item: PositionItem) => {
    router.push(`/admin/position/${item.id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteItem) return;
    setLoading(true);
    try {
      await api.delete(`/admin/positions/${confirmDeleteItem.id}`);
      setData((prev) =>
        prev.filter((position) => position.id !== confirmDeleteItem.id)
      );
      toast.success(`${confirmDeleteItem.position} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting position:", error);
      toast.error("Failed to delete position.");
    } finally {
      setLoading(false);
      setConfirmDeleteItem(null);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Info size={24} className="text-blue-500" />
            <h1 className="text-2xl font-bold">Position Management</h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Tombol Add - Desktop */}
          <button
            onClick={handleAdd}
            disabled={loading}
            className="hidden md:flex bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg items-center space-x-2 transition-all"
          >
            <Plus size={16} />
            <span>Add Position</span>
          </button>
        </div>

        {/* Tombol Add - Mobile */}
        <div className="md:hidden mb-4">
          <button
            onClick={handleAdd}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all"
          >
            <Plus size={16} />
            <span>Add Position</span>
          </button>
        </div>

        {/* Error */}
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
              placeholder="Search positions..."
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
            <p className="text-gray-400">Loading positions...</p>
          </div>
        )}

        {/* Content */}
        {!loading && filteredData.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <FileText size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              {searchTerm ? "No positions found" : "No positions yet"}
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start by adding your first position"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Add Position
              </button>
            )}
          </div>
        ) : (
          !loading && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-xl overflow-hidden">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-300 sm:px-4">
                      Position
                    </th>
                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-300 sm:px-4">
                      Description
                    </th>
                    <th className="px-2 py-3 text-center text-sm font-semibold text-gray-300 sm:px-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredData.map((position) => (
                    <tr
                      key={position.id}
                      className="hover:bg-gray-750 transition"
                    >
                      <td className="px-2 py-3 text-sm text-gray-200 sm:px-4">
                        {position.position}
                      </td>
                      <td className="px-2 py-3 text-sm text-gray-200 whitespace-pre-line sm:px-4">
                        {position.description}
                      </td>
                      <td className="px-2 py-3 text-sm text-center sm:px-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(position)}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-lg flex items-center justify-center text-xs sm:text-sm disabled:opacity-50"
                          >
                            <Edit size={12} className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmDeleteItem(position)}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded-lg flex items-center justify-center text-xs sm:text-sm disabled:opacity-50"
                          >
                            <Trash2 size={12} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Stats */}
        {!loading && (
          <div className="mt-8 bg-gray-800 rounded-xl p-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
              <span>Total Positions: {data.length}</span>
              {searchTerm && (
                <span className="mt-2 md:mt-0">
                  Showing: {filteredData.length} results
                </span>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteItem && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-xl w-full max-w-md">
              <h2 className="text-lg font-semibold text-white mb-2">
                Delete "{confirmDeleteItem.position}"?
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Are you sure you want to delete this position? This action
                cannot be undone.
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
    </div>
  );
}

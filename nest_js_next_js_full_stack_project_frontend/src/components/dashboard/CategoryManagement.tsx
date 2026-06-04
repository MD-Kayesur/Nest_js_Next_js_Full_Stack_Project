"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, Loader2, Tags, X } from "lucide-react";
import { useGetAllCategoriesQuery } from "../../redux/features/product/productApi";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/features/category/categoryApi";

export function CategoryManagement() {
  const { data: categoriesData, isLoading: isLoadingCategories, refetch } = useGetAllCategoriesQuery(undefined);
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const categories = categoriesData?.data || [];

  const initialFormState = {
    name: "",
    description: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const filteredCategories = categories.filter((c: any) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (category?: any) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name || "",
        description: category.description || "",
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory({ id: editingId, ...formData }).unwrap();
      } else {
        await addCategory(formData).unwrap();
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save category:", err);
      alert("Error saving category. Please check the fields and try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category? Products in this category might be affected.")) {
      try {
        await deleteCategory(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete category:", err);
        alert("Error deleting category.");
      }
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur rounded-3xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Tags className="w-5 h-5 text-purple-500" />
            <span>Category Management</span>
          </h3>
          <p className="text-zinc-400 text-sm mt-1">
            Manage product categories for your store.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-500 text-sm text-white placeholder-zinc-600"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold py-2 px-4 rounded-xl transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-zinc-850 rounded-2xl bg-zinc-950/30">
        {isLoadingCategories ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            <span className="text-xs text-zinc-500 mt-2">Loading Categories...</span>
          </div>
        ) : filteredCategories.length > 0 ? (
          <table className="w-full border-collapse text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/60 border-b border-zinc-850 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {filteredCategories.map((c: any) => (
                <tr key={c.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-xs text-zinc-500">Slug: {c.slug || "-"}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 max-w-xs truncate">{c.description || "-"}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      c.isActive
                        ? "bg-emerald-950/30 border border-emerald-800/40 text-emerald-400"
                        : "bg-red-950/30 border border-red-800/40 text-red-400"
                    }`}>
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(c)}
                        className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-950/20 border border-transparent hover:border-blue-900/30 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={isDeleting}
                        className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-zinc-500 text-sm">
            No categories found matching the search criteria.
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">
                {editingId ? "Edit Category" : "Add New Category"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-300">Category Name *</label>
                  <input
                    required
                    type="text"
                    minLength={3}
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-white"
                    placeholder="e.g. Electronics"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-300">Description *</label>
                  <textarea
                    required
                    rows={3}
                    minLength={10}
                    maxLength={500}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm text-white resize-none"
                    placeholder="Brief details about the category..."
                  />
                </div>

                {/* Is Active */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="catIsActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-500 bg-zinc-900 border-zinc-700 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label htmlFor="catIsActive" className="text-sm font-medium text-zinc-300 cursor-pointer">
                    Category is Active
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-4 pt-5 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl font-medium text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding || isUpdating}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-purple-500 hover:bg-purple-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {(isAdding || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

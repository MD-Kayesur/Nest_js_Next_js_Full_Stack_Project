"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, Loader2, Package, X } from "lucide-react";
import {
  useGetAllProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllCategoriesQuery,
} from "../../redux/features/product/productApi";

export function ProductManagement() {
  const { data: productsData, isLoading: isLoadingProducts, refetch } = useGetAllProductsQuery(undefined);
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetAllCategoriesQuery(undefined);
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  const initialFormState = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sku: "",
    imageUrl: "",
    categoryId: "",
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const filteredProducts = products.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (product?: any) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        stock: product.stock || 0,
        sku: product.sku || "",
        imageUrl: product.imageUrl || "",
        categoryId: product.categoryId || "",
        isActive: product.isActive !== undefined ? product.isActive : true,
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
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (editingId) {
        await updateProduct({ id: editingId, ...payload }).unwrap();
      } else {
        await addProduct(payload).unwrap();
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Error saving product. Please check the fields and try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert("Error deleting product.");
      }
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur rounded-3xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-500" />
            <span>Product Management</span>
          </h3>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your store's inventory, pricing, and details.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-950/50 border border-zinc-800 focus:border-zinc-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-500 text-sm text-white placeholder-zinc-600"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black text-sm font-bold py-2 px-4 rounded-xl transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-zinc-850 rounded-2xl bg-zinc-950/30">
        {isLoadingProducts ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            <span className="text-xs text-zinc-500 mt-2">Loading Products...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <table className="w-full border-collapse text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/60 border-b border-zinc-850 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {filteredProducts.map((p: any) => (
                <tr key={p.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-zinc-800" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <Package className="w-5 h-5 text-zinc-500" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-xs text-zinc-500">SKU: {p.sku || "-"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{p.categoryName || "-"}</td>
                  <td className="px-6 py-4 font-medium text-emerald-400">${Number(p.price).toFixed(2)}</td>
                  <td className="px-6 py-4 text-zinc-400">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      p.isActive
                        ? "bg-emerald-950/30 border border-emerald-800/40 text-emerald-400"
                        : "bg-red-950/30 border border-red-800/40 text-red-400"
                    }`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-950/20 border border-transparent hover:border-blue-900/30 rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
            No products found matching the search criteria.
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-zinc-950/90 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Product Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white"
                    placeholder="Enter product name"
                  />
                </div>

                {/* SKU */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-300">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white"
                    placeholder="e.g. PROD-001"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-300">Category *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white appearance-none"
                  >
                    <option value="" disabled>Select a category</option>
                    {isLoadingCategories ? (
                      <option disabled>Loading...</option>
                    ) : categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-300">Price (USD) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white"
                  />
                </div>

                {/* Stock */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-zinc-300">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white"
                  />
                </div>

                {/* Image URL */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white"
                    placeholder="https://..."
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-sm font-medium text-zinc-300">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm text-white resize-none"
                    placeholder="Brief details about the product..."
                  />
                </div>

                {/* Is Active */}
                <div className="flex items-center gap-3 sm:col-span-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-500 bg-zinc-900 border-zinc-700 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-zinc-300 cursor-pointer">
                    Product is Active (visible to customers)
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
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {(isAdding || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

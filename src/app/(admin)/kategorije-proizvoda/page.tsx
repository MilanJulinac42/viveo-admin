"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/layout/AdminHeader";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import {
  getProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "@/lib/api/admin";
import { formatDate } from "@/lib/utils";
import type { ProductCategory } from "@/lib/types";

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", icon: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await getProductCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ name: "", icon: "" });
    setEditingId(null);
    setShowModal(true);
  }

  function openEdit(cat: ProductCategory) {
    setForm({ name: cat.name, icon: cat.icon });
    setEditingId(cat.id);
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editingId) {
        await updateProductCategory(editingId, form);
      } else {
        await createProductCategory(form);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cat: ProductCategory) {
    if (cat.productCount > 0) {
      alert(`Ne mozete obrisati "${cat.name}" jer ima ${cat.productCount} proizvoda.`);
      return;
    }
    if (!confirm(`Da li ste sigurni da zelite da obrisete kategoriju "${cat.name}"?`)) {
      return;
    }
    try {
      await deleteProductCategory(cat.id);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <PageLoading />;

  return (
    <>
      <AdminHeader
        title="Kategorije proizvoda"
        description="Upravljanje kategorijama merch proizvoda"
        actions={<Button onClick={openCreate}>+ Nova kategorija</Button>}
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ikona
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Naziv
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proizvodi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kreirano
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-2xl">{cat.icon}</td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500 font-mono">{cat.slug}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{cat.productCount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{formatDate(cat.createdAt)}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(cat)}>
                      Izmeni
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(cat)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Obrisi
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  Nema kategorija proizvoda
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Izmeni kategoriju" : "Nova kategorija proizvoda"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Naziv
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="npr. Majice"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ikona (emoji)
            </label>
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="npr. 👕"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Otkazi
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name || !form.icon}
            >
              {saving ? "Cuvanje..." : editingId ? "Sacuvaj" : "Kreiraj"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

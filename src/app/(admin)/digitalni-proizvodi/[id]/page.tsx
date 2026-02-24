"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import Badge, { getStatusVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import { getDigitalProduct, updateDigitalProduct, deleteDigitalProduct } from "@/lib/api/admin";
import { formatPrice, formatDateTime } from "@/lib/utils";
import type { DigitalProductDetail } from "@/lib/types";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DigitalProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<DigitalProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDigitalProduct(id)
      .then((res) => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function toggleActive() {
    if (!product) return;
    setUpdating(true);
    try {
      const res = await updateDigitalProduct(product.id, { isActive: !product.isActive });
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  async function toggleFeatured() {
    if (!product) return;
    setUpdating(true);
    try {
      const res = await updateDigitalProduct(product.id, { featured: !product.featured });
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`Da li ste sigurni da zelite da obrisete digitalni proizvod "${product.name}"?`)) return;
    try {
      await deleteDigitalProduct(product.id);
      router.push("/digitalni-proizvodi");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading || !product) return <PageLoading />;

  return (
    <>
      <AdminHeader
        title={product.name}
        description={`Zvezda: ${product.celebrityName}`}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            ← Nazad
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Detalji proizvoda</h3>
              <div className="flex items-center gap-2">
                {product.isActive ? (
                  <Badge variant="success">Aktivan</Badge>
                ) : (
                  <Badge variant="default">Neaktivan</Badge>
                )}
                {product.featured && <Badge variant="warning">Istaknut</Badge>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Naziv</p>
                <p className="text-gray-900 font-medium">{product.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Slug</p>
                <p className="text-gray-900 font-mono text-xs">{product.slug}</p>
              </div>
              <div>
                <p className="text-gray-500">Kategorija</p>
                <p className="text-gray-900">{product.categoryName || "Bez kategorije"}</p>
              </div>
              <div>
                <p className="text-gray-500">Cena</p>
                <p className="text-gray-900 font-semibold">{formatPrice(product.price)}</p>
              </div>
              <div>
                <p className="text-gray-500">Tip fajla</p>
                <p className="text-gray-900 font-medium">{product.fileType.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-500">Velicina fajla</p>
                <p className="text-gray-900">{formatFileSize(product.fileSize)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Naziv fajla</p>
                <p className="text-gray-900 font-mono text-xs">{product.fileName}</p>
              </div>
            </div>

            {product.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-sm mb-1">Opis</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.description}</p>
              </div>
            )}
          </div>

          {/* Preview Image */}
          {product.previewImageUrl && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Preview slika</h3>
              <img
                src={product.previewImageUrl}
                alt={product.name}
                className="w-full max-w-sm rounded-lg object-cover border border-gray-100"
              />
            </div>
          )}

          {/* Stats */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Statistika</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{product.downloadCount}</p>
                <p className="text-sm text-gray-500 mt-1">Preuzimanja</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{product.totalOrders}</p>
                <p className="text-sm text-gray-500 mt-1">Narudzbina</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{formatPrice(product.totalRevenue)}</p>
                <p className="text-sm text-gray-500 mt-1">Prihod</p>
              </div>
            </div>
          </div>

          {/* Recent Digital Orders */}
          {product.recentOrders.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Poslednje narudzbine</h3>
              <div className="divide-y divide-gray-50">
                {product.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                    onClick={() => router.push(`/digitalne-narudzbine/${order.id}`)}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.buyerName}</p>
                      <p className="text-xs text-gray-500">{order.buyerEmail}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(order.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Akcije</h3>
            <div className="space-y-3">
              <Button
                fullWidth
                variant={product.isActive ? "outline" : "primary"}
                onClick={toggleActive}
                disabled={updating}
              >
                {product.isActive ? "Deaktiviraj" : "Aktiviraj"}
              </Button>
              <Button
                fullWidth
                variant={product.featured ? "outline" : "secondary"}
                onClick={toggleFeatured}
                disabled={updating}
              >
                {product.featured ? "Ukloni iz istaknutih" : "Istakni"}
              </Button>
              <Button
                fullWidth
                variant="danger"
                onClick={handleDelete}
              >
                Obrisi proizvod
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-gray-500">Kreirano:</span>
                <span className="text-gray-900">{formatDateTime(product.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <span className="text-gray-500">Poslednja izmena:</span>
                <span className="text-gray-900">{formatDateTime(product.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

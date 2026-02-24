"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import Badge, { getStatusVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import { getProduct, updateProduct, deleteProduct } from "@/lib/api/admin";
import { formatPrice, formatDateTime } from "@/lib/utils";
import type { ProductDetail } from "@/lib/types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function toggleActive() {
    if (!product) return;
    setUpdating(true);
    try {
      const res = await updateProduct(product.id, { isActive: !product.isActive });
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
      const res = await updateProduct(product.id, { featured: !product.featured });
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`Da li ste sigurni da zelite da obrisete proizvod "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
      router.push("/proizvodi");
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
                <p className="text-gray-500">Ukupno narudzbina</p>
                <p className="text-gray-900">{product.totalOrders}</p>
              </div>
              <div>
                <p className="text-gray-500">Ukupni prihod</p>
                <p className="text-gray-900 font-semibold">{formatPrice(product.totalRevenue)}</p>
              </div>
            </div>

            {product.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-sm mb-1">Opis</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.description}</p>
              </div>
            )}
          </div>

          {/* Images */}
          {product.images.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Slike ({product.images.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {product.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    alt={product.name}
                    className="w-full aspect-square rounded-lg object-cover border border-gray-100"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Varijante ({product.variants.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-gray-500 font-medium">Naziv</th>
                      <th className="text-left py-2 text-gray-500 font-medium">SKU</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Cena</th>
                      <th className="text-left py-2 text-gray-500 font-medium">Stanje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {product.variants.map((v) => (
                      <tr key={v.id}>
                        <td className="py-2 text-gray-900 font-medium">{v.name}</td>
                        <td className="py-2 text-gray-500 font-mono text-xs">{v.sku || "-"}</td>
                        <td className="py-2 text-gray-900">
                          {v.priceOverride ? formatPrice(v.priceOverride) : formatPrice(product.price)}
                        </td>
                        <td className="py-2">
                          {v.stock > 0 ? (
                            <span className="text-accent-700">{v.stock} kom</span>
                          ) : (
                            <Badge variant="danger">Rasprodato</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Merch Orders */}
          {product.recentOrders.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Poslednje narudzbine</h3>
              <div className="divide-y divide-gray-50">
                {product.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                    onClick={() => router.push(`/merch-narudzbine/${order.id}`)}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.buyerName}</p>
                      <p className="text-xs text-gray-500">
                        {order.variantName || "Standardna"} x{order.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      <span className="text-sm font-medium text-gray-900">
                        {formatPrice(order.totalPrice)}
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

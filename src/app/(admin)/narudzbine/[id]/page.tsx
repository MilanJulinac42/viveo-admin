"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import Badge, { getStatusVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import { getOrder, updateOrderStatus } from "@/lib/api/admin";
import { formatPrice, formatDateTime } from "@/lib/utils";
import type { OrderDetail, OrderStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Na čekanju" },
  { value: "approved", label: "Odobreno" },
  { value: "completed", label: "Završeno" },
  { value: "rejected", label: "Odbijeno" },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    getOrder(id)
      .then((res) => setOrder(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await updateOrderStatus(order.id, newStatus);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  if (loading || !order) return <PageLoading />;

  return (
    <>
      <AdminHeader
        title={`Narudžbina #${order.id.slice(0, 8)}`}
        description={`Kreirana ${formatDateTime(order.createdAt)}`}
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
              <h3 className="font-semibold text-gray-900">Detalji narudžbine</h3>
              <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Kupac</p>
                <p
                  className="text-gray-900 font-medium cursor-pointer hover:text-primary-600"
                  onClick={() => router.push(`/korisnici/${order.buyerId}`)}
                >
                  {order.buyerName}
                </p>
                <p className="text-xs text-gray-400">{order.buyerEmail}</p>
              </div>
              <div>
                <p className="text-gray-500">Zvezda</p>
                <p
                  className="text-gray-900 font-medium cursor-pointer hover:text-primary-600"
                  onClick={() => router.push(`/zvezde/${order.celebrityId}`)}
                >
                  {order.celebrityName}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Primalac</p>
                <p className="text-gray-900">{order.recipientName}</p>
              </div>
              <div>
                <p className="text-gray-500">Tip videa</p>
                <p className="text-gray-900">{order.videoType}</p>
              </div>
              <div>
                <p className="text-gray-500">Cena</p>
                <p className="text-gray-900 font-semibold">{formatPrice(order.price)}</p>
              </div>
              <div>
                <p className="text-gray-500">Rok</p>
                <p className="text-gray-900">{formatDateTime(order.deadline)}</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Instrukcije</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {order.instructions}
            </p>
          </div>

          {/* Video */}
          {order.videoUrl && order.status === "completed" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Video</h3>
              <p className="text-sm text-gray-500">
                Video je uploadovan: {order.videoUrl}
              </p>
            </div>
          )}
        </div>

        {/* Status Override */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Promeni status</h3>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  disabled={updating || order.status === opt.value}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    order.status === opt.value
                      ? "bg-primary-50 text-primary-700 border border-primary-200"
                      : "text-gray-600 hover:bg-gray-50 border border-transparent"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-gray-500">Kreirano:</span>
                <span className="text-gray-900">{formatDateTime(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <span className="text-gray-500">Poslednja izmena:</span>
                <span className="text-gray-900">{formatDateTime(order.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

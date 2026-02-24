"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import Badge, { getStatusVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import { getDigitalOrder, updateDigitalOrderStatus } from "@/lib/api/admin";
import { formatPrice, formatDateTime } from "@/lib/utils";
import type { DigitalOrderDetail, DigitalOrderStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: DigitalOrderStatus; label: string }[] = [
  { value: "pending", label: "Na cekanju" },
  { value: "confirmed", label: "Potvrdjeno" },
  { value: "completed", label: "Zavrseno" },
  { value: "cancelled", label: "Otkazano" },
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Na cekanju",
  confirmed: "Potvrdjeno",
  completed: "Zavrseno",
  cancelled: "Otkazano",
};

export default function DigitalOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<DigitalOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDigitalOrder(id)
      .then((res) => setOrder(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await updateDigitalOrderStatus(order.id, { status: newStatus });
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
        title={`Digitalna narudzbina #${order.id.slice(0, 8)}`}
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
          {/* Order Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Detalji narudzbine</h3>
              <Badge variant={getStatusVariant(order.status)}>
                {STATUS_LABELS[order.status] || order.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Kupac</p>
                <p className="text-gray-900 font-medium">{order.buyerName}</p>
                <p className="text-xs text-gray-400">{order.buyerEmail}</p>
                {order.buyerPhone && (
                  <p className="text-xs text-gray-400">{order.buyerPhone}</p>
                )}
              </div>
              <div>
                <p className="text-gray-500">Zvezda</p>
                <p className="text-gray-900 font-medium">{order.celebrityName}</p>
              </div>
              <div>
                <p className="text-gray-500">Proizvod</p>
                <p className="text-gray-900">{order.productName}</p>
              </div>
              <div>
                <p className="text-gray-500">Tip fajla</p>
                <p className="text-gray-900 font-medium">{order.fileType.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-gray-500">Cena</p>
                <p className="text-gray-900 font-semibold">{formatPrice(order.price)}</p>
              </div>
            </div>
          </div>

          {/* Download Info - only visible when completed */}
          {order.status === "completed" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Podaci o preuzimanju</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Download token</p>
                  <p className="text-gray-900 font-mono text-xs break-all">
                    {order.downloadToken || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Token istice</p>
                  <p className="text-gray-900">
                    {order.downloadTokenExpiresAt
                      ? formatDateTime(order.downloadTokenExpiresAt)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Broj preuzimanja</p>
                  <p className="text-gray-900 font-medium">{order.downloadCount}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Override */}
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

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-gray-500">Kreirano:</span>
                <span className="text-gray-900">{formatDateTime(order.createdAt)}</span>
              </div>
              {order.confirmedAt && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-gray-500">Potvrdjeno:</span>
                  <span className="text-gray-900">{formatDateTime(order.confirmedAt)}</span>
                </div>
              )}
              {order.completedAt && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-500" />
                  <span className="text-gray-500">Zavrseno:</span>
                  <span className="text-gray-900">{formatDateTime(order.completedAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-200" />
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

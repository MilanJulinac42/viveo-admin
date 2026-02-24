"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import Badge, { getStatusVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import { getMerchOrder, updateMerchOrderStatus } from "@/lib/api/admin";
import { formatPrice, formatDateTime } from "@/lib/utils";
import type { MerchOrderDetail, MerchOrderStatus } from "@/lib/types";

const STATUS_OPTIONS: { value: MerchOrderStatus; label: string }[] = [
  { value: "pending", label: "Na cekanju" },
  { value: "confirmed", label: "Potvrdjeno" },
  { value: "shipped", label: "Poslato" },
  { value: "delivered", label: "Isporuceno" },
  { value: "cancelled", label: "Otkazano" },
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Na cekanju",
  confirmed: "Potvrdjeno",
  shipped: "Poslato",
  delivered: "Isporuceno",
  cancelled: "Otkazano",
};

export default function MerchOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<MerchOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [trackingInput, setTrackingInput] = useState("");

  useEffect(() => {
    if (!id) return;
    getMerchOrder(id)
      .then((res) => {
        setOrder(res.data);
        setTrackingInput(res.data.trackingNumber || "");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!order) return;
    setUpdating(true);
    try {
      const data: { status: string; trackingNumber?: string } = { status: newStatus };
      if (newStatus === "shipped" && trackingInput) {
        data.trackingNumber = trackingInput;
      }
      const res = await updateMerchOrderStatus(order.id, data);
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
        title={`Merch narudzbina #${order.id.slice(0, 8)}`}
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
                {order.variantName && (
                  <p className="text-xs text-gray-400">Varijanta: {order.variantName}</p>
                )}
              </div>
              <div>
                <p className="text-gray-500">Kolicina</p>
                <p className="text-gray-900">{order.quantity}</p>
              </div>
              <div>
                <p className="text-gray-500">Cena po komadu</p>
                <p className="text-gray-900">{formatPrice(order.unitPrice)}</p>
              </div>
              <div>
                <p className="text-gray-500">Ukupna cena</p>
                <p className="text-gray-900 font-semibold">{formatPrice(order.totalPrice)}</p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Podaci za dostavu</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Ime primaoca</p>
                <p className="text-gray-900">{order.shippingName}</p>
              </div>
              <div>
                <p className="text-gray-500">Adresa</p>
                <p className="text-gray-900">{order.shippingAddress}</p>
              </div>
              <div>
                <p className="text-gray-500">Grad</p>
                <p className="text-gray-900">{order.shippingCity}</p>
              </div>
              <div>
                <p className="text-gray-500">Postanski broj</p>
                <p className="text-gray-900">{order.shippingPostal}</p>
              </div>
              {order.shippingNote && (
                <div className="col-span-2">
                  <p className="text-gray-500">Napomena</p>
                  <p className="text-gray-900">{order.shippingNote}</p>
                </div>
              )}
              {order.trackingNumber && (
                <div className="col-span-2">
                  <p className="text-gray-500">Broj za pracenje</p>
                  <p className="text-gray-900 font-mono">{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Override */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Promeni status</h3>

            {/* Tracking input for shipped status */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Broj za pracenje</label>
              <input
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="npr. RS123456789YU"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>

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
              {order.shippedAt && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                  <span className="text-gray-500">Poslato:</span>
                  <span className="text-gray-900">{formatDateTime(order.shippedAt)}</span>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent-500" />
                  <span className="text-gray-500">Isporuceno:</span>
                  <span className="text-gray-900">{formatDateTime(order.deliveredAt)}</span>
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

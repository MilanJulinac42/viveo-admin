"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import Badge, { getStatusVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import { getCelebrity, updateCelebrity, deleteCelebrity } from "@/lib/api/admin";
import { formatPrice, formatDate } from "@/lib/utils";
import type { CelebrityDetail } from "@/lib/types";

export default function CelebrityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [celeb, setCeleb] = useState<CelebrityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    price: 0,
    verified: false,
    acceptingRequests: true,
  });

  useEffect(() => {
    if (!id) return;
    getCelebrity(id)
      .then((res) => {
        setCeleb(res.data);
        setForm({
          name: res.data.name,
          bio: res.data.bio,
          price: res.data.price,
          verified: res.data.verified,
          acceptingRequests: res.data.acceptingRequests,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    if (!celeb) return;
    setSaving(true);
    try {
      const res = await updateCelebrity(celeb.id, form);
      setCeleb(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!celeb) return;
    if (!confirm(`Da li ste sigurni da želite da obrišete ${celeb.name}?`)) return;
    try {
      await deleteCelebrity(celeb.id);
      router.push("/zvezde");
    } catch (err) {
      console.error(err);
    }
  }

  if (loading || !celeb) return <PageLoading />;

  return (
    <>
      <AdminHeader
        title={celeb.name}
        description={`/${celeb.slug} · ${celeb.categoryName}`}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              ← Nazad
            </Button>
            {!editing ? (
              <Button onClick={() => setEditing(true)}>Izmeni</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Otkaži
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Čuvanje..." : "Sačuvaj"}
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Ukupna zarada" value={formatPrice(celeb.totalEarnings)} icon="💰" />
        <StatCard title="Narudžbine" value={celeb.totalOrders} icon="📦" />
        <StatCard title="Prosečan rejting" value={`⭐ ${celeb.rating.toFixed(1)}`} icon="⭐" />
        <StatCard title="Recenzije" value={celeb.reviewCount} icon="💬" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info / Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ime</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cena (RSD)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  min={500}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.verified}
                    onChange={(e) => setForm({ ...form, verified: e.target.checked })}
                    className="rounded"
                  />
                  Verifikovan
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.acceptingRequests}
                    onChange={(e) =>
                      setForm({ ...form, acceptingRequests: e.target.checked })
                    }
                    className="rounded"
                  />
                  Prima zahteve
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={celeb.image}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {celeb.name}
                    {celeb.verified && (
                      <span className="ml-2 text-primary-500">✓</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">{celeb.bio}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={celeb.acceptingRequests ? "success" : "default"}>
                      {celeb.acceptingRequests ? "Aktivan" : "Neaktivan"}
                    </Badge>
                    <Badge variant="purple">{formatPrice(celeb.price)}</Badge>
                  </div>
                </div>
              </div>

              {celeb.tags && celeb.tags.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase font-medium">Tagovi</p>
                  <div className="flex flex-wrap gap-1">
                    {celeb.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Video Types + Recent Orders */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Video tipovi</h3>
            <div className="space-y-2">
              {celeb.videoTypes.map((vt) => (
                <div
                  key={vt.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-sm"
                >
                  <span>{vt.emoji}</span>
                  <span className="text-gray-900 font-medium">{vt.title}</span>
                  <span className="text-gray-400 text-xs">({vt.occasion})</span>
                </div>
              ))}
              {celeb.videoTypes.length === 0 && (
                <p className="text-sm text-gray-400">Nema video tipova</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Poslednje narudžbine</h3>
            <div className="space-y-2">
              {celeb.recentOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => router.push(`/narudzbine/${order.id}`)}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.buyerName}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                </div>
              ))}
              {celeb.recentOrders.length === 0 && (
                <p className="text-sm text-gray-400">Nema narudžbina</p>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
            <h3 className="font-semibold text-red-700 mb-2">Opasna zona</h3>
            <p className="text-sm text-gray-500 mb-3">
              Brisanje zvezde je nepovratno.
            </p>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Obriši zvezdu
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

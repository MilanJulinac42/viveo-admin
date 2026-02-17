"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import Badge, { getRoleVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import { getUser, updateUser } from "@/lib/api/admin";
import { formatDate, formatPrice, getPlaceholderImage } from "@/lib/utils";
import type { UserDetail } from "@/lib/types";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    getUser(id)
      .then((res) => setUser(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleRoleChange(newRole: string) {
    if (!user) return;
    setUpdating(true);
    try {
      const res = await updateUser(user.id, { role: newRole });
      setUser(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  }

  if (loading || !user) return <PageLoading />;

  return (
    <>
      <AdminHeader
        title={user.fullName}
        description={user.email}
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            ← Nazad
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatarUrl || getPlaceholderImage(user.fullName, 80)}
              alt=""
              className="w-20 h-20 rounded-full object-cover mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-900">
              {user.fullName}
            </h2>
            <p className="text-sm text-gray-500 mb-3">{user.email}</p>
            <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Registrovan</span>
              <span className="text-gray-900">{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Narudžbine</span>
              <span className="text-gray-900">{user.ordersCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ukupno potrošeno</span>
              <span className="text-gray-900">{formatPrice(user.totalSpent)}</span>
            </div>
          </div>

          {user.celebrity && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">
                Zvezda profil
              </p>
              <button
                onClick={() => router.push(`/zvezde/${user.celebrity!.id}`)}
                className="w-full text-left p-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors cursor-pointer"
              >
                <p className="text-sm font-medium text-primary-700">
                  {user.celebrity.name}
                </p>
                <p className="text-xs text-primary-500">
                  /{user.celebrity.slug}{" "}
                  {user.celebrity.verified && "· ✓ Verifikovan"}
                </p>
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Promeni ulogu</h3>
            <div className="flex gap-3">
              {["fan", "star", "admin"].map((role) => (
                <Button
                  key={role}
                  variant={user.role === role ? "primary" : "outline"}
                  size="sm"
                  disabled={updating || user.role === role}
                  onClick={() => handleRoleChange(role)}
                >
                  {role}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

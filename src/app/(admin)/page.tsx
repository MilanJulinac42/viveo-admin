"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminHeader from "@/components/layout/AdminHeader";
import StatCard from "@/components/ui/StatCard";
import Badge, { getStatusVariant } from "@/components/ui/Badge";
import { PageLoading } from "@/components/ui/LoadingSpinner";
import { getStats } from "@/lib/api/admin";
import { formatPrice, formatDate } from "@/lib/utils";
import type { DashboardStats } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <PageLoading />;

  const maxDailyOrders = Math.max(...stats.dailyOrders.map((d) => d.count), 1);

  return (
    <>
      <AdminHeader title="Dashboard" description="Pregled platforme" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ukupno korisnika"
          value={stats.totalUsers}
          icon="👥"
        />
        <StatCard
          title="Aktivne zvezde"
          value={stats.totalCelebrities}
          icon="⭐"
        />
        <StatCard
          title="Video narudžbine"
          value={stats.totalOrders}
          icon="📦"
        />
        <StatCard
          title="Mesečni prihod (video)"
          value={formatPrice(stats.monthlyRevenue)}
          icon="💰"
        />
      </div>

      {/* Merch Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Aktivni proizvodi"
          value={stats.totalProducts}
          icon="🛍️"
        />
        <StatCard
          title="Merch narudžbine"
          value={stats.totalMerchOrders}
          icon="📬"
        />
        <StatCard
          title="Mesečni prihod (merch)"
          value={formatPrice(stats.monthlyMerchRevenue)}
          icon="👕"
        />
      </div>

      {/* Digital Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Digitalni proizvodi"
          value={stats.totalDigitalProducts ?? 0}
          icon="💾"
        />
        <StatCard
          title="Digitalne narudžbine"
          value={stats.totalDigitalOrders ?? 0}
          icon="📥"
        />
        <StatCard
          title="Mesečni prihod (digital)"
          value={formatPrice(stats.monthlyDigitalRevenue ?? 0)}
          icon="💎"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Poslednje narudžbine</h2>
            <Link
              href="/narudzbine"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Prikaži sve
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-500">
                Nema narudžbina
              </p>
            ) : (
              stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/narudzbine/${order.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {order.buyerName} → {order.celebrityName}
                    </p>
                    <p className="text-xs text-gray-500">{order.videoType}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(order.price)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">
              Prijave na čekanju
              {stats.pendingApplications > 0 && (
                <span className="ml-2 text-xs bg-secondary-100 text-secondary-700 px-2 py-0.5 rounded-full">
                  {stats.pendingApplications}
                </span>
              )}
            </h2>
            <Link
              href="/prijave"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Prikaži sve
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentApplications.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-500">
                Nema prijava na čekanju
              </p>
            ) : (
              stats.recentApplications.map((app) => (
                <Link
                  key={app.id}
                  href={`/prijave/${app.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {app.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {app.category} · {app.followers} pratilaca
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {formatDate(app.createdAt)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Daily Orders Chart */}
      {stats.dailyOrders.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Narudžbine (poslednjih 7 dana)
          </h2>
          <div className="flex items-end gap-2 h-40">
            {stats.dailyOrders.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-600">
                  {day.count}
                </span>
                <div
                  className="w-full bg-primary-500 rounded-t-md transition-all"
                  style={{
                    height: `${(day.count / maxDailyOrders) * 100}%`,
                    minHeight: day.count > 0 ? "4px" : "0",
                  }}
                />
                <span className="text-xs text-gray-400">
                  {new Date(day.date).toLocaleDateString("sr-RS", {
                    weekday: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

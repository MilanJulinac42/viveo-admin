"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import DataTable, { type Column } from "@/components/ui/DataTable";
import SearchInput from "@/components/ui/SearchInput";
import Badge, { getStatusVariant } from "@/components/ui/Badge";
import { getOrders } from "@/lib/api/admin";
import { formatPrice, formatDate } from "@/lib/utils";
import type { OrderListItem } from "@/lib/types";

const STATUSES = [
  { value: "", label: "Svi" },
  { value: "pending", label: "Na čekanju" },
  { value: "approved", label: "Odobreno" },
  { value: "completed", label: "Završeno" },
  { value: "rejected", label: "Odbijeno" },
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrders({
        page,
        pageSize: 20,
        search,
        status: statusFilter,
      });
      setOrders(res.data);
      if (res.meta) setTotalPages(res.meta.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns: Column<OrderListItem>[] = [
    {
      key: "id",
      header: "ID",
      render: (o) => (
        <span className="text-xs font-mono text-gray-500">
          {o.id.slice(0, 8)}...
        </span>
      ),
    },
    {
      key: "buyer",
      header: "Kupac",
      render: (o) => (
        <div>
          <p className="font-medium text-gray-900">{o.buyerName}</p>
          <p className="text-xs text-gray-500">{o.buyerEmail}</p>
        </div>
      ),
    },
    {
      key: "celebrity",
      header: "Zvezda",
      render: (o) => <span className="text-gray-900">{o.celebrityName}</span>,
    },
    {
      key: "videoType",
      header: "Tip",
      render: (o) => <span className="text-gray-600">{o.videoType}</span>,
    },
    {
      key: "price",
      header: "Cena",
      render: (o) => (
        <span className="font-medium text-gray-900">{formatPrice(o.price)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (o) => (
        <Badge variant={getStatusVariant(o.status)}>{o.status}</Badge>
      ),
    },
    {
      key: "date",
      header: "Datum",
      render: (o) => (
        <span className="text-gray-500">{formatDate(o.createdAt)}</span>
      ),
    },
  ];

  return (
    <>
      <AdminHeader
        title="Narudžbine"
        description="Sve narudžbine na platformi"
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="w-72">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Pretraži po imenu kupca ili zvezde..."
          />
        </div>
        <div className="flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => {
                setStatusFilter(s.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                statusFilter === s.value
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        keyExtractor={(o) => o.id}
        onRowClick={(o) => router.push(`/narudzbine/${o.id}`)}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="Nema narudžbina"
      />
    </>
  );
}

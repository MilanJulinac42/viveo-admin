"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Badge, { getStatusVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getApplications, updateApplicationStatus } from "@/lib/api/admin";
import { formatDate } from "@/lib/utils";
import type { ApplicationListItem } from "@/lib/types";

const STATUSES = [
  { value: "", label: "Sve" },
  { value: "pending", label: "Na čekanju" },
  { value: "approved", label: "Odobrene" },
  { value: "rejected", label: "Odbijene" },
];

export default function ApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<ApplicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getApplications({ page, pageSize: 20, status: statusFilter });
      setApps(res.data);
      if (res.meta) setTotalPages(res.meta.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  async function handleQuickAction(
    e: React.MouseEvent,
    id: string,
    status: "approved" | "rejected"
  ) {
    e.stopPropagation();
    try {
      await updateApplicationStatus(id, status);
      setApps((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(err);
    }
  }

  const columns: Column<ApplicationListItem>[] = [
    {
      key: "name",
      header: "Ime",
      render: (a) => (
        <div>
          <p className="font-medium text-gray-900">{a.fullName}</p>
          <p className="text-xs text-gray-500">{a.email}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategorija",
      render: (a) => <span className="text-gray-600">{a.category}</span>,
    },
    {
      key: "followers",
      header: "Pratioci",
      render: (a) => <span className="text-gray-600">{a.followers}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (a) => (
        <Badge variant={getStatusVariant(a.status)}>{a.status}</Badge>
      ),
    },
    {
      key: "date",
      header: "Datum",
      render: (a) => (
        <span className="text-gray-500">{formatDate(a.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "Akcije",
      render: (a) =>
        a.status === "pending" ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => handleQuickAction(e, a.id, "approved")}
            >
              Odobri
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => handleQuickAction(e, a.id, "rejected")}
            >
              Odbij
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <>
      <AdminHeader
        title="Prijave"
        description="Prijave za postani zvezda"
      />

      <div className="flex items-center gap-4 mb-6">
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
        data={apps}
        loading={loading}
        keyExtractor={(a) => a.id}
        onRowClick={(a) => router.push(`/prijave/${a.id}`)}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="Nema prijava"
      />
    </>
  );
}

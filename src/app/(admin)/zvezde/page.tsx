"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import DataTable, { type Column } from "@/components/ui/DataTable";
import SearchInput from "@/components/ui/SearchInput";
import Badge from "@/components/ui/Badge";
import { getCelebrities, updateCelebrity } from "@/lib/api/admin";
import { formatPrice } from "@/lib/utils";
import type { CelebrityListItem } from "@/lib/types";

export default function CelebritiesPage() {
  const router = useRouter();
  const [celebrities, setCelebrities] = useState<CelebrityListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCelebrities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCelebrities({ page, pageSize: 20, search });
      setCelebrities(res.data);
      if (res.meta) setTotalPages(res.meta.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCelebrities();
  }, [fetchCelebrities]);

  async function toggleVerified(e: React.MouseEvent, celeb: CelebrityListItem) {
    e.stopPropagation();
    try {
      await updateCelebrity(celeb.id, { verified: !celeb.verified });
      setCelebrities((prev) =>
        prev.map((c) =>
          c.id === celeb.id ? { ...c, verified: !c.verified } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  const columns: Column<CelebrityListItem>[] = [
    {
      key: "name",
      header: "Zvezda",
      render: (c) => (
        <div className="flex items-center gap-3">
          <img
            src={c.image}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">
              {c.name}
              {c.verified && (
                <span className="ml-1 text-primary-500" title="Verifikovan">
                  ✓
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500">{c.categoryName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Cena",
      render: (c) => <span className="text-gray-900">{formatPrice(c.price)}</span>,
    },
    {
      key: "rating",
      header: "Rejting",
      render: (c) => (
        <span className="text-gray-900">
          ⭐ {c.rating.toFixed(1)} ({c.reviewCount})
        </span>
      ),
    },
    {
      key: "orders",
      header: "Narudžbine",
      render: (c) => <span className="text-gray-600">{c.totalOrders}</span>,
    },
    {
      key: "earnings",
      header: "Zarada",
      render: (c) => (
        <span className="font-medium text-gray-900">{formatPrice(c.totalEarnings)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c) => (
        <Badge variant={c.acceptingRequests ? "success" : "default"}>
          {c.acceptingRequests ? "Aktivan" : "Neaktivan"}
        </Badge>
      ),
    },
    {
      key: "verified",
      header: "Verifikacija",
      render: (c) => (
        <button
          onClick={(e) => toggleVerified(e, c)}
          className={`px-3 py-1 text-xs rounded-full font-medium cursor-pointer transition-colors ${
            c.verified
              ? "bg-primary-50 text-primary-700 hover:bg-primary-100"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {c.verified ? "✓ Verifikovan" : "Verifikuj"}
        </button>
      ),
    },
  ];

  return (
    <>
      <AdminHeader
        title="Zvezde"
        description="Upravljanje profilima zvezda"
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="w-72">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Pretraži zvezde..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={celebrities}
        loading={loading}
        keyExtractor={(c) => c.id}
        onRowClick={(c) => router.push(`/zvezde/${c.id}`)}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="Nema zvezda"
      />
    </>
  );
}

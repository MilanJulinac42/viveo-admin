"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import DataTable, { type Column } from "@/components/ui/DataTable";
import SearchInput from "@/components/ui/SearchInput";
import Badge from "@/components/ui/Badge";
import { getDigitalProducts } from "@/lib/api/admin";
import { formatPrice, formatDate } from "@/lib/utils";
import type { DigitalProductListItem } from "@/lib/types";

export default function DigitalProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<DigitalProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDigitalProducts({ page, pageSize: 20, search });
      setProducts(res.data);
      if (res.meta) setTotalPages(res.meta.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const columns: Column<DigitalProductListItem>[] = [
    {
      key: "image",
      header: "Slika",
      render: (p) =>
        p.previewImageUrl ? (
          <img
            src={p.previewImageUrl}
            alt={p.name}
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
            N/A
          </div>
        ),
    },
    {
      key: "name",
      header: "Naziv",
      render: (p) => (
        <div>
          <p className="font-medium text-gray-900">{p.name}</p>
          <p className="text-xs text-gray-500">{p.categoryName || "Bez kategorije"}</p>
        </div>
      ),
    },
    {
      key: "celebrity",
      header: "Zvezda",
      render: (p) => <span className="text-gray-900">{p.celebrityName}</span>,
    },
    {
      key: "price",
      header: "Cena",
      render: (p) => (
        <span className="font-medium text-gray-900">{formatPrice(p.price)}</span>
      ),
    },
    {
      key: "fileType",
      header: "Tip fajla",
      render: (p) => (
        <Badge variant="default">{p.fileType.toUpperCase()}</Badge>
      ),
    },
    {
      key: "downloads",
      header: "Preuzimanja",
      render: (p) => <span className="text-gray-600">{p.downloadCount}</span>,
    },
    {
      key: "orders",
      header: "Narudzbine / Prihod",
      render: (p) => (
        <div>
          <span className="text-gray-600">{p.totalOrders}</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="font-medium text-gray-900">{formatPrice(p.totalRevenue)}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <div className="flex items-center gap-2">
          {p.isActive ? (
            <Badge variant="success">Aktivan</Badge>
          ) : (
            <Badge variant="default">Neaktivan</Badge>
          )}
          {p.featured && <Badge variant="warning">Istaknut</Badge>}
        </div>
      ),
    },
    {
      key: "date",
      header: "Datum",
      render: (p) => (
        <span className="text-gray-500">{formatDate(p.createdAt)}</span>
      ),
    },
  ];

  return (
    <>
      <AdminHeader
        title="Digitalni proizvodi"
        description="Svi digitalni proizvodi na platformi"
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="w-72">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Pretrazi po nazivu proizvoda ili zvezde..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        keyExtractor={(p) => p.id}
        onRowClick={(p) => router.push(`/digitalni-proizvodi/${p.id}`)}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="Nema digitalnih proizvoda"
      />
    </>
  );
}

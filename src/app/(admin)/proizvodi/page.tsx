"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import DataTable, { type Column } from "@/components/ui/DataTable";
import SearchInput from "@/components/ui/SearchInput";
import Badge from "@/components/ui/Badge";
import { getProducts } from "@/lib/api/admin";
import { formatPrice, formatDate } from "@/lib/utils";
import type { ProductListItem } from "@/lib/types";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({ page, pageSize: 20, search });
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

  const columns: Column<ProductListItem>[] = [
    {
      key: "image",
      header: "Slika",
      render: (p) =>
        p.imageUrl ? (
          <img
            src={p.imageUrl}
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
      key: "variants",
      header: "Varijanti",
      render: (p) => <span className="text-gray-600">{p.variantCount}</span>,
    },
    {
      key: "orders",
      header: "Narudzbine",
      render: (p) => <span className="text-gray-600">{p.totalOrders}</span>,
    },
    {
      key: "revenue",
      header: "Prihod",
      render: (p) => (
        <span className="font-medium text-gray-900">{formatPrice(p.totalRevenue)}</span>
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
        title="Proizvodi"
        description="Svi merch proizvodi na platformi"
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
        onRowClick={(p) => router.push(`/proizvodi/${p.id}`)}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="Nema proizvoda"
      />
    </>
  );
}

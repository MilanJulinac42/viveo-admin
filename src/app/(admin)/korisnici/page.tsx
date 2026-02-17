"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/layout/AdminHeader";
import DataTable, { type Column } from "@/components/ui/DataTable";
import SearchInput from "@/components/ui/SearchInput";
import Badge, { getRoleVariant } from "@/components/ui/Badge";
import { getUsers } from "@/lib/api/admin";
import { formatDate, getPlaceholderImage } from "@/lib/utils";
import type { UserListItem } from "@/lib/types";

const ROLES = [
  { value: "", label: "Svi" },
  { value: "fan", label: "Fanovi" },
  { value: "star", label: "Zvezde" },
  { value: "admin", label: "Admini" },
];

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({ page, pageSize: 20, search, role: roleFilter });
      setUsers(res.data);
      if (res.meta) setTotalPages(res.meta.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns: Column<UserListItem>[] = [
    {
      key: "name",
      header: "Korisnik",
      render: (user) => (
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl || getPlaceholderImage(user.fullName, 32)}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{user.fullName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Uloga",
      render: (user) => (
        <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Registrovan",
      render: (user) => (
        <span className="text-gray-500">{formatDate(user.createdAt)}</span>
      ),
    },
  ];

  return (
    <>
      <AdminHeader
        title="Korisnici"
        description={`Upravljanje korisnicima platforme`}
      />

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-72">
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Pretraži po imenu ili emailu..."
          />
        </div>
        <div className="flex gap-2">
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => {
                setRoleFilter(r.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer ${
                roleFilter === r.value
                  ? "bg-primary-50 text-primary-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        keyExtractor={(u) => u.id}
        onRowClick={(u) => router.push(`/korisnici/${u.id}`)}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="Nema korisnika"
      />
    </>
  );
}

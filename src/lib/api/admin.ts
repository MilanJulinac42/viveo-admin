/**
 * @fileoverview Admin API service functions.
 */

import { get, post, patch, del } from "./client";
import type {
  DashboardStats,
  UserListItem,
  UserDetail,
  CelebrityListItem,
  CelebrityDetail,
  OrderListItem,
  OrderDetail,
  ApplicationListItem,
  ApplicationDetail,
  Category,
} from "../types";

/* ─── Dashboard ─── */

export function getStats() {
  return get<DashboardStats>("/admin/stats");
}

/* ─── Users ─── */

export function getUsers(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
}) {
  return get<UserListItem[]>("/admin/users", params as Record<string, string | number | undefined>);
}

export function getUser(id: string) {
  return get<UserDetail>(`/admin/users/${id}`);
}

export function updateUser(id: string, data: { role?: string }) {
  return patch<UserDetail>(`/admin/users/${id}`, data);
}

/* ─── Celebrities ─── */

export function getCelebrities(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sort?: string;
}) {
  return get<CelebrityListItem[]>("/admin/celebrities", params as Record<string, string | number | undefined>);
}

export function getCelebrity(id: string) {
  return get<CelebrityDetail>(`/admin/celebrities/${id}`);
}

export function updateCelebrity(
  id: string,
  data: Partial<{
    name: string;
    bio: string;
    extendedBio: string;
    price: number;
    categoryId: string;
    verified: boolean;
    acceptingRequests: boolean;
    responseTime: number;
    tags: string[];
  }>
) {
  return patch<CelebrityDetail>(`/admin/celebrities/${id}`, data);
}

export function deleteCelebrity(id: string) {
  return del<{ message: string }>(`/admin/celebrities/${id}`);
}

/* ─── Orders ─── */

export function getOrders(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  return get<OrderListItem[]>("/admin/orders", params as Record<string, string | number | undefined>);
}

export function getOrder(id: string) {
  return get<OrderDetail>(`/admin/orders/${id}`);
}

export function updateOrderStatus(id: string, status: string) {
  return patch<OrderDetail>(`/admin/orders/${id}`, { status });
}

/* ─── Applications ─── */

export function getApplications(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}) {
  return get<ApplicationListItem[]>("/admin/applications", params as Record<string, string | number | undefined>);
}

export function getApplication(id: string) {
  return get<ApplicationDetail>(`/admin/applications/${id}`);
}

export function updateApplicationStatus(id: string, status: "approved" | "rejected") {
  return patch<ApplicationDetail>(`/admin/applications/${id}`, { status });
}

/* ─── Categories ─── */

export function getCategories() {
  return get<Category[]>("/admin/categories");
}

export function createCategory(data: { name: string; icon: string }) {
  return post<Category>("/admin/categories", data);
}

export function updateCategory(id: string, data: { name?: string; icon?: string }) {
  return patch<Category>(`/admin/categories/${id}`, data);
}

export function deleteCategory(id: string) {
  return del<{ message: string }>(`/admin/categories/${id}`);
}

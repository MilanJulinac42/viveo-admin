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
  ProductCategory,
  ProductListItem,
  ProductDetail,
  MerchOrderListItem,
  MerchOrderDetail,
  DigitalProductCategory,
  DigitalProductListItem,
  DigitalProductDetail,
  DigitalOrderListItem,
  DigitalOrderDetail,
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

/* ─── Products ─── */

export function getProducts(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  celebrity?: string;
  category?: string;
}) {
  return get<ProductListItem[]>("/admin/products", params as Record<string, string | number | undefined>);
}

export function getProduct(id: string) {
  return get<ProductDetail>(`/admin/products/${id}`);
}

export function updateProduct(
  id: string,
  data: Partial<{ isActive: boolean; featured: boolean }>
) {
  return patch<ProductDetail>(`/admin/products/${id}`, data);
}

export function deleteProduct(id: string) {
  return del<{ message: string }>(`/admin/products/${id}`);
}

/* ─── Merch Orders ─── */

export function getMerchOrders(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  return get<MerchOrderListItem[]>("/admin/merch-orders", params as Record<string, string | number | undefined>);
}

export function getMerchOrder(id: string) {
  return get<MerchOrderDetail>(`/admin/merch-orders/${id}`);
}

export function updateMerchOrderStatus(id: string, data: { status: string; trackingNumber?: string }) {
  return patch<MerchOrderDetail>(`/admin/merch-orders/${id}`, data);
}

/* ─── Product Categories ─── */

export function getProductCategories() {
  return get<ProductCategory[]>("/admin/product-categories");
}

export function createProductCategory(data: { name: string; icon: string }) {
  return post<ProductCategory>("/admin/product-categories", data);
}

export function updateProductCategory(id: string, data: { name?: string; icon?: string }) {
  return patch<ProductCategory>(`/admin/product-categories/${id}`, data);
}

export function deleteProductCategory(id: string) {
  return del<{ message: string }>(`/admin/product-categories/${id}`);
}

/* ─── Digital Products ─── */

export function getDigitalProducts(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
}) {
  return get<DigitalProductListItem[]>("/admin/digital-products", params as Record<string, string | number | undefined>);
}

export function getDigitalProduct(id: string) {
  return get<DigitalProductDetail>(`/admin/digital-products/${id}`);
}

export function updateDigitalProduct(
  id: string,
  data: Partial<{ isActive: boolean; featured: boolean }>
) {
  return patch<DigitalProductDetail>(`/admin/digital-products/${id}`, data);
}

export function deleteDigitalProduct(id: string) {
  return del<{ message: string }>(`/admin/digital-products/${id}`);
}

/* ─── Digital Orders ─── */

export function getDigitalOrders(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) {
  return get<DigitalOrderListItem[]>("/admin/digital-orders", params as Record<string, string | number | undefined>);
}

export function getDigitalOrder(id: string) {
  return get<DigitalOrderDetail>(`/admin/digital-orders/${id}`);
}

export function updateDigitalOrderStatus(id: string, data: { status: string }) {
  return patch<DigitalOrderDetail>(`/admin/digital-orders/${id}`, data);
}

/* ─── Digital Product Categories ─── */

export function getDigitalProductCategories() {
  return get<DigitalProductCategory[]>("/admin/digital-product-categories");
}

export function createDigitalProductCategory(data: { name: string; icon: string }) {
  return post<DigitalProductCategory>("/admin/digital-product-categories", data);
}

export function updateDigitalProductCategory(id: string, data: { name?: string; icon?: string }) {
  return patch<DigitalProductCategory>(`/admin/digital-product-categories/${id}`, data);
}

export function deleteDigitalProductCategory(id: string) {
  return del<{ message: string }>(`/admin/digital-product-categories/${id}`);
}

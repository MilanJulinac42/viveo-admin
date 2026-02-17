/**
 * @fileoverview Type definitions for Viveo Admin panel.
 */

/* ─── Auth ─── */
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin";
  avatarUrl?: string | null;
}

/* ─── Dashboard Stats ─── */
export interface DashboardStats {
  totalUsers: number;
  totalCelebrities: number;
  totalOrders: number;
  monthlyRevenue: number;
  pendingApplications: number;
  recentOrders: OrderListItem[];
  recentApplications: ApplicationListItem[];
  dailyOrders: { date: string; count: number }[];
}

/* ─── Users ─── */
export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  role: "fan" | "star" | "admin";
  avatarUrl: string | null;
  createdAt: string;
}

export interface UserDetail extends UserListItem {
  ordersCount: number;
  totalSpent: number;
  celebrity?: {
    id: string;
    name: string;
    slug: string;
    verified: boolean;
  } | null;
}

/* ─── Celebrities ─── */
export interface CelebrityListItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  categoryName: string;
  categoryId: string;
  price: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  acceptingRequests: boolean;
  totalOrders: number;
  totalEarnings: number;
  createdAt: string;
}

export interface CelebrityDetail extends CelebrityListItem {
  profileId: string;
  bio: string;
  extendedBio: string;
  responseTime: number;
  tags: string[];
  videoTypes: VideoType[];
  recentOrders: OrderListItem[];
}

export interface VideoType {
  id: string;
  title: string;
  occasion: string;
  emoji: string;
  accentFrom: string;
  accentTo: string;
  message: string;
}

/* ─── Orders ─── */
export type OrderStatus = "pending" | "approved" | "completed" | "rejected";

export interface OrderListItem {
  id: string;
  buyerName: string;
  buyerEmail: string;
  celebrityName: string;
  celebritySlug: string;
  videoType: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderDetail extends OrderListItem {
  buyerId: string;
  celebrityId: string;
  recipientName: string;
  instructions: string;
  videoUrl: string | null;
  deadline: string;
  updatedAt: string;
}

/* ─── Applications ─── */
export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface ApplicationListItem {
  id: string;
  fullName: string;
  email: string;
  category: string;
  followers: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface ApplicationDetail extends ApplicationListItem {
  phone: string;
  socialMedia: string;
  bio: string;
  motivation: string;
  submittedBy: string | null;
  reviewedAt: string | null;
}

/* ─── Categories ─── */
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  celebrityCount: number;
  createdAt: string;
}

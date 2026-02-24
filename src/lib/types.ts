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
  totalProducts: number;
  totalMerchOrders: number;
  monthlyMerchRevenue: number;
  totalDigitalProducts: number;
  totalDigitalOrders: number;
  monthlyDigitalRevenue: number;
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

/* ─── Product Categories ─── */
export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  createdAt: string;
}

/* ─── Products ─── */
export interface ProductImage {
  id: string;
  imagePath: string;
  imageUrl: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string | null;
  priceOverride: number | null;
  stock: number;
  sortOrder: number;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  isActive: boolean;
  featured: boolean;
  celebrityId: string;
  celebrityName: string;
  celebritySlug: string;
  categoryName: string | null;
  imageUrl: string | null;
  variantCount: number;
  totalOrders: number;
  totalRevenue: number;
  createdAt: string;
}

export interface ProductDetail extends ProductListItem {
  description: string;
  productCategoryId: string | null;
  variants: ProductVariant[];
  images: ProductImage[];
  recentOrders: MerchOrderListItem[];
  updatedAt: string;
}

/* ─── Merch Orders ─── */
export type MerchOrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface MerchOrderListItem {
  id: string;
  buyerName: string;
  buyerEmail: string;
  celebrityName: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  totalPrice: number;
  status: MerchOrderStatus;
  createdAt: string;
}

export interface MerchOrderDetail extends MerchOrderListItem {
  buyerId: string;
  buyerPhone: string;
  celebrityId: string;
  productId: string;
  productVariantId: string | null;
  unitPrice: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostal: string;
  shippingNote: string;
  trackingNumber: string | null;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  updatedAt: string;
}

/* ─── Digital Product Categories ─── */
export interface DigitalProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  createdAt: string;
}

/* ─── Digital Products ─── */
export interface DigitalProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  isActive: boolean;
  featured: boolean;
  celebrityName: string;
  celebritySlug: string;
  categoryName: string;
  previewImageUrl: string | null;
  fileType: string;
  fileSize: number;
  downloadCount: number;
  totalOrders: number;
  totalRevenue: number;
  createdAt: string;
}

export interface DigitalProductDetail extends DigitalProductListItem {
  description: string;
  digitalProductCategoryId: string | null;
  fileName: string;
  recentOrders: DigitalOrderListItem[];
  updatedAt: string;
}

/* ─── Digital Orders ─── */
export type DigitalOrderStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface DigitalOrderListItem {
  id: string;
  buyerName: string;
  buyerEmail: string;
  celebrityName: string;
  productName: string;
  fileType: string;
  price: number;
  status: DigitalOrderStatus;
  createdAt: string;
}

export interface DigitalOrderDetail extends DigitalOrderListItem {
  buyerId: string;
  buyerPhone: string;
  celebrityId: string;
  digitalProductId: string;
  downloadToken: string | null;
  downloadTokenExpiresAt: string | null;
  downloadCount: number;
  confirmedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

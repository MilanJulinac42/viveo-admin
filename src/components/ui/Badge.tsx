"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "purple";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-accent-50 text-accent-700",
  warning: "bg-secondary-50 text-secondary-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  purple: "bg-primary-50 text-primary-700",
};

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Maps order/application status to badge variant */
export function getStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "completed":
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
      return "danger";
    default:
      return "default";
  }
}

/** Maps user role to badge variant */
export function getRoleVariant(role: string): BadgeVariant {
  switch (role) {
    case "admin":
      return "purple";
    case "star":
      return "warning";
    case "fan":
      return "info";
    default:
      return "default";
  }
}

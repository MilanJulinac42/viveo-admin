"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: { value: number; label: string };
  className?: string;
}

export default function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-100 p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.value >= 0
                ? "bg-accent-50 text-accent-700"
                : "bg-red-50 text-red-700"
            )}
          >
            {trend.value >= 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
}

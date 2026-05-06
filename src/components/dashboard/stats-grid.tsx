"use client";

import { Users, BookOpen, TrendingUp } from "lucide-react";
import { StatCard } from "./stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@/types";

interface StatsGridProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-11 w-11 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Mahasiswa"
        value={stats.total_mahasiswa}
        icon={Users}
        description="Mahasiswa terdaftar"
        color="indigo"
        index={0}
      />
      <StatCard
        title="Total Jurusan"
        value={stats.total_jurusan}
        icon={BookOpen}
        description={stats.jurusan_list.join(", ")}
        color="emerald"
        index={1}
      />
      <StatCard
        title="Rata-rata IPK"
        value={stats.rata_rata_ipk.toFixed(2)}
        icon={TrendingUp}
        description="Indeks Prestasi Kumulatif"
        color="amber"
        index={2}
      />
    </div>
  );
}

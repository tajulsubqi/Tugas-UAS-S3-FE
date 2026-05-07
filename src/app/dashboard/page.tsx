"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { useMahasiswa } from "@/hooks/use-mahasiswa"
import { useAuthStore } from "@/store/auth-store"

export default function DashboardPage() {
  const { stats, chartData, fetchStats, fetchChartData, isLoading } = useMahasiswa()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchStats()
    fetchChartData()
  }, [fetchStats, fetchChartData])

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          Selamat Datang, {user?.nama || "Admin"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Berikut ringkasan data mahasiswa saat ini.
        </p>
      </motion.div>

      {/* Stats grid — reuses existing StatsGrid component */}
      <StatsGrid stats={stats} isLoading={isLoading} />

      {/* Charts section */}
      <DashboardCharts data={chartData} isLoading={isLoading} />

      {/* Algorithm info card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Algoritma yang Digunakan</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-muted/50 p-4 space-y-2">
            <h3 className="font-semibold text-sm">Sorting</h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bubble Sort</span>
                <code className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary">
                  O(n²)
                </code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Merge Sort</span>
                <code className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary">
                  O(n log n)
                </code>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 space-y-2">
            <h3 className="font-semibold text-sm">Searching</h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Linear Search</span>
                <code className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary">
                  O(n)
                </code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Binary Search</span>
                <code className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary">
                  O(log n)
                </code>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

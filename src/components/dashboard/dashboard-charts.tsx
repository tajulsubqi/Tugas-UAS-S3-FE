"use client"

import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { IpkDistributionChart } from "./charts/ipk-distribution-chart"
import { JurusanDonutChart } from "./charts/jurusan-donut-chart"
import { SemesterBarChart } from "./charts/semester-bar-chart"
import { IpkJurusanChart } from "./charts/ipk-jurusan-chart"
import type { ChartData } from "@/types"

interface Props {
  data: ChartData | null
  isLoading: boolean
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="space-y-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-40" />
      </div>
      <Skeleton className="h-44 w-full rounded-xl" />
    </div>
  )
}

export function DashboardCharts({ data, isLoading }: Props) {
  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-52 mt-1" />
          </div>
        </motion.div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-lg font-semibold tracking-tight">Analitik & Visualisasi</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Ringkasan visual data mahasiswa saat ini
        </p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <IpkDistributionChart data={data.ipk_distribution} />
        <IpkJurusanChart data={data.ipk_per_jurusan} />
        <SemesterBarChart data={data.mahasiswa_per_semester} />
        <JurusanDonutChart data={data.mahasiswa_per_jurusan} />
      </div>
    </div>
  )
}

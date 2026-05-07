"use client"

import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  data: { jurusan: string; rata_rata: number }[]
}

function shortenJurusan(name: string) {
  const map: Record<string, string> = {
    "Teknik Informatika": "T. Informatika",
    "Sistem Informasi": "Sis. Informasi",
    "Manajemen Informatika": "Man. Informatika",
    "Teknik Komputer": "T. Komputer",
  }
  return map[name] || name
}

interface TooltipProps {
  active?: boolean
  payload?: { value: number; payload: { jurusan: string; rata_rata: number } }[]
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-xl text-sm">
      <p className="font-semibold text-foreground mb-1">{item.jurusan}</p>
      <p className="text-muted-foreground">
        Rata-rata IPK{" "}
        <span className="font-bold text-foreground">{item.rata_rata.toFixed(2)}</span>
      </p>
    </div>
  )
}

export function IpkJurusanChart({ data }: Props) {
  const chartData = data.map((d) => ({ ...d, jurusan: shortenJurusan(d.jurusan) }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Perbandingan IPK
        </p>
        <h3 className="mt-0.5 text-base font-bold text-foreground">
          Rata-rata IPK per Jurusan
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={chartData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#93C5FD" stopOpacity={0.15} />
            </linearGradient>
          </defs>

          <PolarGrid stroke="hsl(var(--border))" />

          <PolarAngleAxis
            dataKey="jurusan"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          />

          <Radar
            dataKey="rata_rata"
            stroke="#60A5FA"
            strokeWidth={2}
            fill="url(#radarFill)"
            dot={{
              fill: "#3B82F6",
              strokeWidth: 0,
              r: 4,
            }}
          />

          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      {/* values row */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        {data.map((item) => (
          <div
            key={item.jurusan}
            className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2"
          >
            <p className="text-xs text-muted-foreground truncate pr-2">
              {shortenJurusan(item.jurusan)}
            </p>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
              {item.rata_rata.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { motion } from "framer-motion"

interface Props {
  data: { range: string; total: number }[]
}

// const BAR_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#6366f1"]
const BAR_COLORS = ["#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB"]

interface TooltipProps {
  active?: boolean
  payload?: { value: number; name: string }[]
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-xl text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <p className="text-muted-foreground">
        <span className="font-bold text-foreground">{payload[0].value}</span> mahasiswa
      </p>
    </div>
  )
}

export function IpkDistributionChart({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Statistik IPK
        </p>
        <h3 className="mt-0.5 text-base font-bold text-foreground">
          Ringkasan Nilai Mahasiswa
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          barSize={36}
          margin={{ left: -20, right: 4, top: 4, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border))"
          />
          <XAxis
            dataKey="range"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ radius: 8 }} />
          <Bar dataKey="total" radius={[8, 8, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      {/* <div className="mt-4 flex flex-wrap gap-2">
        {data.map((item, i) => (
          <span
            key={item.range}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{
              background: `${BAR_COLORS[i % BAR_COLORS.length]}15`,
              color: BAR_COLORS[i % BAR_COLORS.length],
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: BAR_COLORS[i % BAR_COLORS.length] }}
            />
            {item.range}
          </span>
        ))}
      </div> */}
    </motion.div>
  )
}

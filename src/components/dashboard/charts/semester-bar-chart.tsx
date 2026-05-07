"use client"

import { motion } from "framer-motion"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface Props {
  data: { semester: string; total: number }[]
}

interface TooltipProps {
  active?: boolean
  payload?: { value: number }[]
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

export function SemesterBarChart({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Siklus Akademik
        </p>
        <h3 className="mt-0.5 text-base font-bold text-foreground">
          Komposisi Mahasiswa per Semester
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          barSize={28}
          margin={{ left: -20, right: 4, top: 4, bottom: 0 }}
        >
          <defs>
            <linearGradient id="semesterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border))"
          />
          <XAxis
            dataKey="semester"
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
          <Bar dataKey="total" fill="url(#semesterGrad)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

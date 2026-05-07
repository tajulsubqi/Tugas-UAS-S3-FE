"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { motion } from "framer-motion"

interface Props {
  data: { jurusan: string; total: number }[]
}

const COLORS = [
  "#5B8FF9", // Teknik Informatika
  "#61DDAA", // Sistem Informasi
  "#65789B", // Manajemen Informatika
  "#F6BD16", // Teknik Komputer
  "#7262FD", // Teknologi Informasi
  "#78D3F8", // Data Science
]

interface TooltipProps {
  active?: boolean
  payload?: { name: string; value: number; payload: { jurusan: string; total: number } }[]
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-xl text-sm">
      <p className="font-semibold text-foreground mb-1">{item.jurusan}</p>
      <p className="text-muted-foreground">
        <span className="font-bold text-foreground">{item.total}</span> mahasiswa
      </p>
    </div>
  )
}

export function JurusanDonutChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.total, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Per Jurusan
        </p>
        <h3 className="mt-0.5 text-base font-bold text-foreground">Komposisi Jurusan</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="jurusan"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={74}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="pointer-events-none absolute z-[1] inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold leading-none">{total}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Total</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5 min-w-0">
          {data.map((item, i) => {
            const pct = total ? Math.round((item.total / total) * 100) : 0
            return (
              <div key={item.jurusan} className="flex items-center gap-2.5 min-w-0">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <p className="text-xs font-medium truncate text-foreground">
                      {item.jurusan}
                    </p>
                    <p
                      className="text-xs font-bold shrink-0"
                      style={{ color: COLORS[i % COLORS.length] }}
                    >
                      {pct}%
                    </p>
                  </div>
                  <div className="mt-1 h-1 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + i * 0.05,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

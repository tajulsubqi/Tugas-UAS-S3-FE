"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  color: "indigo" | "emerald" | "amber" | "rose";
  index?: number;
}

const colorMap = {
  indigo: {
    bg: "bg-indigo-500/10 dark:bg-indigo-400/10",
    icon: "text-indigo-600 dark:text-indigo-400",
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/10 dark:bg-emerald-400/10",
    icon: "text-emerald-600 dark:text-emerald-400",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  amber: {
    bg: "bg-amber-500/10 dark:bg-amber-400/10",
    icon: "text-amber-600 dark:text-amber-400",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  rose: {
    bg: "bg-rose-500/10 dark:bg-rose-400/10",
    icon: "text-rose-600 dark:text-rose-400",
    gradient: "from-rose-500/20 to-pink-500/20",
  },
};

export function StatCard({ title, value, icon: Icon, description, color, index = 0 }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5 h-full">
        {/* Gradient glow background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <div className="relative flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <motion.p
              className="text-3xl font-bold tracking-tight"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: index * 0.1 + 0.2 }}
            >
              {value}
            </motion.p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.bg}`}>
            <Icon className={`h-5 w-5 ${colors.icon}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

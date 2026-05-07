"use client"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import { motion } from "framer-motion"
import { BookOpen, GraduationCap, LayoutDashboard, Users2, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    {
      href: "/dashboard/mahasiswa",
      label: "Data Mahasiswa",
      icon: GraduationCap,
      show: true,
    },
    {
      href: "/dashboard/users",
      label: "Manajemen User",
      icon: Users2,
      show: user?.role === "admin",
    },
  ].filter((item) => item.show)

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-65 border-r border-border
          bg-sidebar text-sidebar-foreground
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-primary-foreground">
              <BookOpen className="h-4 w-4" />
            </div>

            <span className="text-base font-bold tracking-tight">Akademiku</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-3 mt-2">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="relative"
              >
                <div
                  className={`
                    flex items-center gap-3 rounded-xl px-3 py-2.5
                    text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-muted-foreground hover:bg-blue-100 hover:text-blue-700"
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-blue-100"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-xl bg-accent/30 p-3 border border-border/50">
            {/* Avatar Inisial */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 border border-blue-700/20">
              TS
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Created by
              </p>
              <p className="truncate text-xs font-bold text-foreground">Tajul Subqi</p>
              <p className="text-[10px] text-muted-foreground/70 leading-none mt-1">
                UAS Algoritma • Sem 3 • 2026
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

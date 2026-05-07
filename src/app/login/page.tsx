"use client"

import { LoginForm } from "@/components/auth/login-form"
import { useAuthStore } from "@/store/auth-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { isAuthenticated, hasHydrated } = useAuthStore()
  const router = useRouter()

  // Jika sudah login, redirect ke dashboard
  useEffect(() => {
    if (!hasHydrated) return

    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [hasHydrated, isAuthenticated, router])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-44 -right-44 h-112 w-md rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-44 -left-44 h-112 w-md rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border/60 bg-card/40 shadow-2xl backdrop-blur-xl lg:grid-cols-2">
        {/* Left showcase panel */}
        <div className="relative hidden min-h-155 p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-linear-to-br from-blue-100/60 via-blue-100 to-transparent" />

          <div className="relative">
            <span className="inline-flex items-center rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
              Sistem Akademik Modern
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight">
              Kelola Data Mahasiswa
              <br />
              Lebih Cepat
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Dashboard terintegrasi untuk admin, dosen, dan mahasiswa dengan visualisasi
              data yang rapi dan workflow yang efisien.
            </p>
          </div>

          <div className="relative grid gap-3">
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-xs text-muted-foreground">Created By</p>
              <p className="mt-1 text-2xl font-semibold">Tajul Subqi</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
              <p className="text-xs text-muted-foreground">Akses Role-based</p>
              <p className="mt-1 text-sm font-medium">Admin • Dosen • Mahasiswa</p>
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <div className="flex items-center justify-center p-4 sm:p-8 lg:p-10">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { RegisterForm } from "@/components/auth/register-form"
import { useAuthStore } from "@/store/auth-store"

export default function RegisterPage() {
  const { isAuthenticated, hasHydrated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!hasHydrated) return

    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [hasHydrated, isAuthenticated, router])

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-linear-to-br from-background via-background to-primary/5">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <RegisterForm />
    </div>
  )
}

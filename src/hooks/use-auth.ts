"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { useAuthStore } from "@/store/auth-store"
import type { LoginCredentials, RegisterCredentials, ResetPasswordPayload } from "@/types"

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { setAuth, logout: storeLogout } = useAuthStore()

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post("/api/auth/login", credentials)
      const { token, user } = response.data

      if (token && user) {
        setAuth(user, token)
        router.push("/dashboard")
        return { success: true, message: "Login berhasil" }
      }

      setError("Login gagal, coba lagi")
      return { success: false, message: "Login gagal" }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Email atau password salah"
      setError(message)
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (payload: RegisterCredentials) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post("/api/auth/register", payload)
      return {
        success: true,
        message: response.data?.message || "Registrasi berhasil",
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Registrasi gagal"
      setError(message)
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (payload: ResetPasswordPayload) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.post("/api/auth/reset-password", payload)
      return {
        success: true,
        message: response.data?.message || "Password berhasil diperbarui",
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal memperbarui password"
      setError(message)
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.post("/api/auth/logout")
    } catch {
      // Ignore logout errors
    } finally {
      storeLogout()
      router.push("/login")
    }
  }

  return { login, register, resetPassword, logout, isLoading, error, setError }
}

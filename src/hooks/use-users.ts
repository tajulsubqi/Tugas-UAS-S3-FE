"use client"

import { useCallback, useState } from "react"
import api from "@/lib/api"
import type { AdminUserCreatePayload, AdminUserUpdatePayload, User } from "@/types"

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get<{ success: boolean; data: User[] }>("/api/users")
      setUsers(response.data.data || [])
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; detail?: string } } })?.response
          ?.data?.message ||
        (err as { response?: { data?: { message?: string; detail?: string } } })?.response
          ?.data?.detail ||
        "Gagal memuat data user"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createUser = async (payload: AdminUserCreatePayload) => {
    setIsLoading(true)
    try {
      const response = await api.post("/api/users", payload)
      return {
        success: true,
        message: response.data?.message || "User berhasil ditambahkan",
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; detail?: string } } })?.response
          ?.data?.message ||
        (err as { response?: { data?: { message?: string; detail?: string } } })?.response
          ?.data?.detail ||
        "Gagal menambahkan user"
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (userId: number, payload: AdminUserUpdatePayload) => {
    setIsLoading(true)
    try {
      const response = await api.put(`/api/users/${userId}`, payload)
      return {
        success: true,
        message: response.data?.message || "User berhasil diperbarui",
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; detail?: string } } })?.response
          ?.data?.message ||
        (err as { response?: { data?: { message?: string; detail?: string } } })?.response
          ?.data?.detail ||
        "Gagal memperbarui user"
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUser = async (userId: number) => {
    setIsLoading(true)
    try {
      const response = await api.delete(`/api/users/${userId}`)
      return { success: true, message: response.data?.message || "User berhasil dihapus" }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string; detail?: string } } })?.response
          ?.data?.message ||
        (err as { response?: { data?: { message?: string; detail?: string } } })?.response
          ?.data?.detail ||
        "Gagal menghapus user"
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}

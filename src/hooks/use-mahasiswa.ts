"use client"

import { useState, useCallback } from "react"
import api from "@/lib/api"
import type {
  Mahasiswa,
  MahasiswaCreate,
  MahasiswaUpdate,
  MahasiswaQueryParams,
  DashboardStats,
  ChartData,
  PaginatedResponse,
} from "@/types"

export function useMahasiswa() {
  const [mahasiswaList, setMahasiswaList] = useState<Mahasiswa[]>([])
  const [totalData, setTotalData] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)

  const fetchMahasiswa = useCallback(async (params: MahasiswaQueryParams = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get<PaginatedResponse<Mahasiswa>>("/api/mahasiswa", {
        params,
      })
      setMahasiswaList(response.data.data)
      setTotalData(response.data.total)
      setTotalPages(response.data.total_pages)
      setCurrentPage(response.data.page)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal memuat data mahasiswa"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get("/api/mahasiswa/stats")
      setStats(response.data.data)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal memuat statistik"
      setError(message)
    }
  }, [])

  const fetchChartData = useCallback(async () => {
    try {
      const response = await api.get("/api/mahasiswa/charts")
      setChartData(response.data.data)
    } catch {
      // silent – chart data bersifat opsional
    }
  }, [])

  const createMahasiswa = async (data: MahasiswaCreate) => {
    setIsLoading(true)
    try {
      const response = await api.post("/api/mahasiswa", data)
      return { success: true, data: response.data.data, message: response.data.message }
    } catch (err: unknown) {
      const errData = (
        err as {
          response?: {
            data?: { message?: string; errors?: { field: string; message: string }[] }
          }
        }
      )?.response?.data
      return {
        success: false,
        message: errData?.message || "Gagal menambahkan mahasiswa",
        errors: errData?.errors,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const updateMahasiswa = async (nim: string, data: MahasiswaUpdate) => {
    setIsLoading(true)
    try {
      const response = await api.put(`/api/mahasiswa/${nim}`, data)
      return { success: true, data: response.data.data, message: response.data.message }
    } catch (err: unknown) {
      const errData = (
        err as {
          response?: {
            data?: { message?: string; errors?: { field: string; message: string }[] }
          }
        }
      )?.response?.data
      return {
        success: false,
        message: errData?.message || "Gagal memperbarui data mahasiswa",
        errors: errData?.errors,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMahasiswa = async (nim: string) => {
    setIsLoading(true)
    try {
      const response = await api.delete(`/api/mahasiswa/${nim}`)
      return { success: true, message: response.data.message }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Gagal menghapus mahasiswa"
      return { success: false, message }
    } finally {
      setIsLoading(false)
    }
  }

  const getMahasiswaByNim = async (nim: string) => {
    try {
      const response = await api.get(`/api/mahasiswa/${nim}`)
      return { success: true, data: response.data.data as Mahasiswa }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Mahasiswa tidak ditemukan"
      return { success: false, message }
    }
  }

  return {
    mahasiswaList,
    totalData,
    totalPages,
    currentPage,
    isLoading,
    error,
    stats,
    chartData,
    fetchMahasiswa,
    fetchStats,
    fetchChartData,
    createMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
    getMahasiswaByNim,
  }
}

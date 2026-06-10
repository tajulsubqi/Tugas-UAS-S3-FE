"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Filter, X, FileSpreadsheet, FileText } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchBar } from "@/components/mahasiswa/search-bar"
import { MahasiswaTable } from "@/components/mahasiswa/mahasiswa-table"
import { MahasiswaForm } from "@/components/mahasiswa/mahasiswa-form"
import { MahasiswaDetail } from "@/components/mahasiswa/mahasiswa-detail"
import { DeleteDialog } from "@/components/mahasiswa/delete-dialog"
import { useMahasiswa } from "@/hooks/use-mahasiswa"
import { useDebounce } from "@/hooks/use-debounce"
import { useAuthStore } from "@/store/auth-store"
import {
  exportMahasiswaToExcel,
  exportMahasiswaToPdf,
  fetchAllMahasiswaForExport,
} from "@/lib/export-mahasiswa"
import type { Mahasiswa, MahasiswaCreate, MahasiswaQueryParams } from "@/types"

export default function MahasiswaPage() {
  const { user } = useAuthStore()
  const canManageMahasiswa = user?.role === "admin" || user?.role === "dosen"

  // ── State ────────────────────────────────────────────────
  const [search, setSearch] = useState("")
  const [jurusanFilter, setJurusanFilter] = useState("")
  const [sortBy, setSortBy] = useState("nim")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const [isExporting, setIsExporting] = useState(false)

  // Dialog states
  const [formOpen, setFormOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  const {
    mahasiswaList,
    totalData,
    totalPages,
    currentPage,
    isLoading,
    fetchMahasiswa,
    createMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
  } = useMahasiswa()

  // ── Fetch data saat query berubah ────────────────────────
  const loadData = useCallback(() => {
    const params: MahasiswaQueryParams = {
      search: debouncedSearch || undefined,
      jurusan: jurusanFilter || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
      sort_algorithm: "merge",
      page,
      per_page: 10,
    }
    fetchMahasiswa(params)
  }, [debouncedSearch, jurusanFilter, sortBy, sortOrder, page, fetchMahasiswa])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Reset page saat search atau filter berubah
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1)
  }, [debouncedSearch, jurusanFilter])

  // ── Handlers ─────────────────────────────────────────────

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const handleCreate = () => {
    if (!canManageMahasiswa) return
    setSelectedMahasiswa(null)
    setFormOpen(true)
  }

  const handleEdit = (mhs: Mahasiswa) => {
    if (!canManageMahasiswa) return
    setSelectedMahasiswa(mhs)
    setFormOpen(true)
  }

  const handleView = (mhs: Mahasiswa) => {
    setSelectedMahasiswa(mhs)
    setDetailOpen(true)
  }

  const handleDeleteClick = (mhs: Mahasiswa) => {
    if (!canManageMahasiswa) return
    setSelectedMahasiswa(mhs)
    setDeleteOpen(true)
  }

  const handleFormSubmit = async (data: MahasiswaCreate) => {
    if (!canManageMahasiswa) {
      return { success: false, message: "Akses ditolak" }
    }

    if (selectedMahasiswa) {
      // Edit mode
      const result = await updateMahasiswa(selectedMahasiswa.nim, data)
      if (result.success) {
        toast.success(result.message || "Data mahasiswa berhasil diperbarui")
        loadData()
      } else {
        toast.error(result.message || "Gagal memperbarui data")
      }
      return result
    } else {
      // Create mode
      const result = await createMahasiswa(data)
      if (result.success) {
        toast.success(result.message || "Mahasiswa berhasil ditambahkan")
        loadData()
      } else {
        toast.error(result.message || "Gagal menambahkan mahasiswa")
      }
      return result
    }
  }

  const getExportParams = () => ({
    search: debouncedSearch || undefined,
    jurusan: jurusanFilter || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
    sort_algorithm: "merge" as const,
  })

  const handleExport = async (format: "pdf" | "excel") => {
    setIsExporting(true)
    try {
      const data = await fetchAllMahasiswaForExport(getExportParams())
      if (data.length === 0) {
        toast.error("Tidak ada data untuk diekspor")
        return
      }
      if (format === "excel") {
        exportMahasiswaToExcel(data)
        toast.success("Berhasil mengekspor data ke Excel")
      } else {
        exportMahasiswaToPdf(data)
        toast.success("Berhasil mengekspor data ke PDF")
      }
    } catch {
      toast.error("Gagal mengekspor data mahasiswa")
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!canManageMahasiswa) return
    if (!selectedMahasiswa) return

    const result = await deleteMahasiswa(selectedMahasiswa.nim)
    if (result.success) {
      toast.success(result.message || "Mahasiswa berhasil dihapus")
      setDeleteOpen(false)
      setSelectedMahasiswa(null)
      loadData()
    } else {
      toast.error(result.message || "Gagal menghapus mahasiswa")
    }
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Data Mahasiswa
          </h1>
          <p className="text-muted-foreground mt-1">
            {canManageMahasiswa
              ? "Kelola data mahasiswa — tambah, edit, hapus, dan cari data."
              : "Lihat data mahasiswa dan lakukan pencarian data."}
          </p>
        </div>
        {canManageMahasiswa && (
          <Button onClick={handleCreate} className="rounded-xl gap-2">
            <Plus className="h-4 w-4" />
            Tambah Mahasiswa
          </Button>
        )}
      </motion.div>

      {/* Search & table card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-4 lg:p-6"
      >
        {/* Search & filter bar */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <SearchBar value={search} onChange={setSearch} />

          {/* Jurusan filter */}
          <Select value={jurusanFilter} onValueChange={(v) => setJurusanFilter(v ?? "")}>
            <SelectTrigger
              className={`!h-10 w-56 rounded-xl transition-all duration-200 ${
                jurusanFilter
                  ? " bg-primary/5 text-primary ring-1 ring-primary"
                  : "bg-card hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Filter
                  className={`h-4 w-4 shrink-0 ${jurusanFilter ? "text-primary" : "text-muted-foreground"}`}
                />
                <SelectValue placeholder="Semua Program Studi" />
              </div>
            </SelectTrigger>

            <SelectContent className="rounded-xl border-border shadow-2xl">
              <SelectItem value="" className="text-sm">
                Semua Program Studi
              </SelectItem>
              <SelectItem value="Teknik Informatika" className="text-sm">
                Teknik Informatika
              </SelectItem>
              <SelectItem value="Sistem Informasi" className="text-sm">
                Sistem Informasi
              </SelectItem>
              <SelectItem value="Teknik Komputer" className="text-sm">
                Teknik Komputer
              </SelectItem>
              <SelectItem value="Manajemen" className="text-sm">
                Manajemen
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Active filter badge */}
          {jurusanFilter && (
            <div className="flex h-10 items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-1 text-sm text-primary">
              <span className="">Filter: {jurusanFilter}</span>
              <button
                onClick={() => setJurusanFilter("")}
                className="ml-1 rounded-lg bg-primary/20 hover:bg-primary/30 p-1 transition-all"
                aria-label="Hapus filter jurusan"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2"
              onClick={() => handleExport("excel")}
              disabled={isExporting}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-xl gap-2"
              onClick={() => handleExport("pdf")}
              disabled={isExporting}
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Table — reuses existing MahasiswaTable component */}
        <MahasiswaTable
          data={mahasiswaList}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          canManage={canManageMahasiswa}
          currentPage={currentPage}
          totalPages={totalPages}
          totalData={totalData}
          onPageChange={setPage}
        />
      </motion.div>

      {/* Dialogs — reuse existing components */}
      <MahasiswaForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setSelectedMahasiswa(null)
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedMahasiswa}
        isLoading={isLoading}
      />

      <MahasiswaDetail
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false)
          setSelectedMahasiswa(null)
        }}
        mahasiswa={selectedMahasiswa}
      />

      <DeleteDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setSelectedMahasiswa(null)
        }}
        onConfirm={handleDeleteConfirm}
        mahasiswa={selectedMahasiswa}
        isLoading={isLoading}
      />
    </div>
  )
}

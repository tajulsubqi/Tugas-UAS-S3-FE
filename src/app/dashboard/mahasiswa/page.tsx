"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/mahasiswa/search-bar";
import { MahasiswaTable } from "@/components/mahasiswa/mahasiswa-table";
import { MahasiswaForm } from "@/components/mahasiswa/mahasiswa-form";
import { MahasiswaDetail } from "@/components/mahasiswa/mahasiswa-detail";
import { DeleteDialog } from "@/components/mahasiswa/delete-dialog";
import { useMahasiswa } from "@/hooks/use-mahasiswa";
import { useDebounce } from "@/hooks/use-debounce";
import type { Mahasiswa, MahasiswaCreate, MahasiswaQueryParams } from "@/types";

export default function MahasiswaPage() {
  // ── State ────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("nim");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);

  const debouncedSearch = useDebounce(search, 300);

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
  } = useMahasiswa();

  // ── Fetch data saat query berubah ────────────────────────
  const loadData = useCallback(() => {
    const params: MahasiswaQueryParams = {
      search: debouncedSearch || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
      sort_algorithm: "merge",
      page,
      per_page: 10,
    };
    fetchMahasiswa(params);
  }, [debouncedSearch, sortBy, sortOrder, page, fetchMahasiswa]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page saat search berubah
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // ── Handlers ─────────────────────────────────────────────

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleCreate = () => {
    setSelectedMahasiswa(null);
    setFormOpen(true);
  };

  const handleEdit = (mhs: Mahasiswa) => {
    setSelectedMahasiswa(mhs);
    setFormOpen(true);
  };

  const handleView = (mhs: Mahasiswa) => {
    setSelectedMahasiswa(mhs);
    setDetailOpen(true);
  };

  const handleDeleteClick = (mhs: Mahasiswa) => {
    setSelectedMahasiswa(mhs);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: MahasiswaCreate) => {
    if (selectedMahasiswa) {
      // Edit mode
      const result = await updateMahasiswa(selectedMahasiswa.nim, data);
      if (result.success) {
        toast.success(result.message || "Data mahasiswa berhasil diperbarui");
        loadData();
      } else {
        toast.error(result.message || "Gagal memperbarui data");
      }
      return result;
    } else {
      // Create mode
      const result = await createMahasiswa(data);
      if (result.success) {
        toast.success(result.message || "Mahasiswa berhasil ditambahkan");
        loadData();
      } else {
        toast.error(result.message || "Gagal menambahkan mahasiswa");
      }
      return result;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMahasiswa) return;

    const result = await deleteMahasiswa(selectedMahasiswa.nim);
    if (result.success) {
      toast.success(result.message || "Mahasiswa berhasil dihapus");
      setDeleteOpen(false);
      setSelectedMahasiswa(null);
      loadData();
    } else {
      toast.error(result.message || "Gagal menghapus mahasiswa");
    }
  };

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
            Kelola data mahasiswa — tambah, edit, hapus, dan cari data.
          </p>
        </div>
        <Button onClick={handleCreate} className="rounded-xl gap-2">
          <Plus className="h-4 w-4" />
          Tambah Mahasiswa
        </Button>
      </motion.div>

      {/* Search & table card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-4 lg:p-6"
      >
        {/* Search bar */}
        <div className="mb-4">
          <SearchBar value={search} onChange={setSearch} />
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
          setFormOpen(false);
          setSelectedMahasiswa(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedMahasiswa}
        isLoading={isLoading}
      />

      <MahasiswaDetail
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedMahasiswa(null);
        }}
        mahasiswa={selectedMahasiswa}
      />

      <DeleteDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedMahasiswa(null);
        }}
        onConfirm={handleDeleteConfirm}
        mahasiswa={selectedMahasiswa}
        isLoading={isLoading}
      />
    </div>
  );
}

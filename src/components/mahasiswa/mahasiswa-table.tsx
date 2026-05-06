"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Eye,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Mahasiswa } from "@/types"

interface MahasiswaTableProps {
  data: Mahasiswa[]
  isLoading: boolean
  sortBy: string
  sortOrder: "asc" | "desc"
  onSort: (field: string) => void
  onView: (mahasiswa: Mahasiswa) => void
  onEdit: (mahasiswa: Mahasiswa) => void
  onDelete: (mahasiswa: Mahasiswa) => void
  currentPage: number
  totalPages: number
  totalData: number
  onPageChange: (page: number) => void
}

function SortIcon({
  field,
  sortBy,
  sortOrder,
}: {
  field: string
  sortBy: string
  sortOrder: string
}) {
  if (sortBy !== field) return <ChevronUp className="h-3 w-3 text-muted-foreground/30" />
  return sortOrder === "asc" ? (
    <ChevronUp className="h-3 w-3 text-primary" />
  ) : (
    <ChevronDown className="h-3 w-3 text-primary" />
  )
}

function getIpkBadge(ipk: number) {
  if (ipk >= 3.5)
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border-0 font-semibold">
        {ipk.toFixed(2)}
      </Badge>
    )
  if (ipk >= 3.0)
    return (
      <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 border-0 font-semibold">
        {ipk.toFixed(2)}
      </Badge>
    )
  if (ipk >= 2.5)
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border-0 font-semibold">
        {ipk.toFixed(2)}
      </Badge>
    )
  return (
    <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 border-0 font-semibold">
      {ipk.toFixed(2)}
    </Badge>
  )
}

export function MahasiswaTable({
  data,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  totalData,
  onPageChange,
}: MahasiswaTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">Belum ada data</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-xs">
          Data mahasiswa belum tersedia. Klik tombol &quot;Tambah Mahasiswa&quot; untuk
          menambahkan data baru.
        </p>
      </div>
    )
  }

  const sortableHeaders = [
    { key: "nim", label: "NIM" },
    { key: "nama", label: "Nama" },
    { key: "jurusan", label: "Jurusan" },
    { key: "semester", label: "Semester" },
    { key: "ipk", label: "IPK" },
  ]

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {sortableHeaders.map((header, index) => (
                <TableHead
                  key={index}
                  className={`cursor-pointer select-none hover:text-foreground transition-colors ${index === 3 ? "text-center flex justify-center" : ""}`}
                  onClick={() => onSort(header.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {header.label}
                    <SortIcon field={header.key} sortBy={sortBy} sortOrder={sortOrder} />
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-[80px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {data.map((mhs, i) => (
                <motion.tr
                  key={mhs.nim}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={`border-b border-border transition-colors ${hoveredRow === mhs.nim ? "bg-accent/50" : ""}`}
                  onMouseEnter={() => setHoveredRow(mhs.nim)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell className="font-mono text-sm">{mhs.nim}</TableCell>
                  <TableCell className="font-medium">{mhs.nama}</TableCell>
                  <TableCell className="w-[20%]">
                    <Badge variant="secondary" className="rounded-lg font-normal">
                      {mhs.jurusan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{mhs.semester}</TableCell>
                  <TableCell>{getIpkBadge(mhs.ipk)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(mhs)}>
                          <Eye className="mr-2 h-4 w-4" /> Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(mhs)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(mhs)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        <AnimatePresence>
          {data.map((mhs, i) => (
            <motion.div
              key={mhs.nim}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{mhs.nama}</p>
                  <p className="text-sm text-muted-foreground font-mono">{mhs.nim}</p>
                </div>
                {getIpkBadge(mhs.ipk)}
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="rounded-lg font-normal text-xs">
                  {mhs.jurusan}
                </Badge>
                <span>Semester {mhs.semester}</span>
              </div>
              <div className="flex gap-2 pt-1 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => onView(mhs)}
                >
                  <Eye className="mr-1 h-3 w-3" /> Detail
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => onEdit(mhs)}
                >
                  <Pencil className="mr-1 h-3 w-3" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-destructive hover:text-destructive"
                  onClick={() => onDelete(mhs)}
                >
                  <Trash2 className="mr-1 h-3 w-3" /> Hapus
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Menampilkan {data.length} dari {totalData} data
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

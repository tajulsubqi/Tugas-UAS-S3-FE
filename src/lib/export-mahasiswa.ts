import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import api from "@/lib/api"
import type { Mahasiswa, MahasiswaQueryParams, PaginatedResponse } from "@/types"

const COLUMNS = ["No", "Nama", "NIM", "Jurusan", "Semester", "IPK", "No HP"] as const

function formatDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function toRows(data: Mahasiswa[]): (string | number)[][] {
  return data.map((m, index) => [
    index + 1,
    `${m.nama}\n${m.email}`,
    m.nim,
    m.jurusan,
    m.semester,
    m.ipk,
    m.no_hp,
  ])
}

export async function fetchAllMahasiswaForExport(
  params: Omit<MahasiswaQueryParams, "page" | "per_page">,
): Promise<Mahasiswa[]> {
  const perPage = 100
  let page = 1
  let totalPages = 1
  const allData: Mahasiswa[] = []

  do {
    const response = await api.get<PaginatedResponse<Mahasiswa>>("/api/mahasiswa", {
      params: { ...params, page, per_page: perPage },
    })
    allData.push(...response.data.data)
    totalPages = response.data.total_pages
    page++
  } while (page <= totalPages)

  return allData
}

export function exportMahasiswaToExcel(data: Mahasiswa[]): void {
  const rows = toRows(data)
  const worksheet = XLSX.utils.aoa_to_sheet([COLUMNS as unknown as string[], ...rows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Mahasiswa")
  XLSX.writeFile(workbook, `data-mahasiswa-${formatDate()}.xlsx`)
}

export function exportMahasiswaToPdf(data: Mahasiswa[]): void {
  const doc = new jsPDF({ orientation: "landscape" })
  const rows = toRows(data)

  doc.setFontSize(16)
  doc.text("Data Mahasiswa", 14, 15)

  autoTable(doc, {
    head: [COLUMNS as unknown as string[]],
    body: rows,
    startY: 22,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  })

  const exportedAt = new Date().toLocaleString("id-ID")
  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 22
  doc.setFontSize(8)
  doc.text(`Diekspor pada: ${exportedAt}`, 14, finalY + 8)

  doc.save(`data-mahasiswa-${formatDate()}.pdf`)
}

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { validateMahasiswaForm, ValidationError } from "@/lib/validations"
import type { Mahasiswa, MahasiswaCreate } from "@/types"

interface MahasiswaFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: MahasiswaCreate) => Promise<{
    success: boolean
    message?: string
    errors?: { field: string; message: string }[]
  }>
  initialData?: Mahasiswa | null
  isLoading: boolean
}

const jurusanOptions = [
  "Teknik Informatika",
  "Sistem Informasi",
  "Manajemen Informatika",
  "Teknik Komputer",
]

const emptyForm = {
  nim: "",
  nama: "",
  jurusan: "",
  semester: "",
  ipk: "",
  email: "",
  no_hp: "",
}

export function MahasiswaForm({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: MahasiswaFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<ValidationError[]>([])

  const isEdit = !!initialData

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        nim: initialData.nim,
        nama: initialData.nama,
        jurusan: initialData.jurusan,
        semester: String(initialData.semester),
        ipk: String(initialData.ipk),
        email: initialData.email,
        no_hp: initialData.no_hp,
      })
    } else {
      setForm(emptyForm)
    }
    setErrors([])
  }, [initialData, open])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => prev.filter((e) => e.field !== field))
  }

  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateMahasiswaForm(form)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    const data: MahasiswaCreate = {
      nim: form.nim,
      nama: form.nama,
      jurusan: form.jurusan,
      semester: parseInt(form.semester),
      ipk: parseFloat(form.ipk),
      email: form.email,
      no_hp: form.no_hp,
    }

    const result = await onSubmit(data)
    if (result.success) {
      onClose()
    } else if (result.errors) {
      setErrors(result.errors.map((e) => ({ field: e.field, message: e.message })))
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui data mahasiswa di bawah ini."
              : "Isi form di bawah ini untuk menambahkan mahasiswa baru."}
          </DialogDescription>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* NIM */}
          <div className="space-y-1.5">
            <Label htmlFor="nim">NIM</Label>
            <Input
              id="nim"
              placeholder="Contoh: 2024001"
              value={form.nim}
              onChange={(e) => handleChange("nim", e.target.value)}
              disabled={isEdit}
              className={`rounded-xl ${getFieldError("nim") ? "border-destructive" : ""}`}
            />
            {getFieldError("nim") && (
              <p className="text-xs text-destructive">{getFieldError("nim")}</p>
            )}
          </div>

          {/* Nama */}
          <div className="space-y-1.5">
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              id="nama"
              placeholder="Contoh: Ahmad Fauzan"
              value={form.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              className={`rounded-xl ${getFieldError("nama") ? "border-destructive" : ""}`}
            />
            {getFieldError("nama") && (
              <p className="text-xs text-destructive">{getFieldError("nama")}</p>
            )}
          </div>

          {/* Jurusan */}
          <div className="space-y-1.5">
            <Label htmlFor="jurusan">Jurusan</Label>
            <Select
              value={form.jurusan}
              onValueChange={(v) => handleChange("jurusan", v ?? "")}
            >
              <SelectTrigger
                className={`rounded-xl ${getFieldError("jurusan") ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Pilih jurusan" />
              </SelectTrigger>
              <SelectContent>
                {jurusanOptions.map((j) => (
                  <SelectItem key={j} value={j}>
                    {j}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError("jurusan") && (
              <p className="text-xs text-destructive">{getFieldError("jurusan")}</p>
            )}
          </div>

          {/* Semester + IPK */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                type="number"
                min={1}
                max={14}
                placeholder="1-14"
                value={form.semester}
                onChange={(e) => handleChange("semester", e.target.value)}
                className={`rounded-xl ${getFieldError("semester") ? "border-destructive" : ""}`}
              />
              {getFieldError("semester") && (
                <p className="text-xs text-destructive">{getFieldError("semester")}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ipk">IPK</Label>
              <Input
                id="ipk"
                type="number"
                step="0.01"
                min={0}
                max={4}
                placeholder="0.00 - 4.00"
                value={form.ipk}
                onChange={(e) => handleChange("ipk", e.target.value)}
                className={`rounded-xl ${getFieldError("ipk") ? "border-destructive" : ""}`}
              />
              {getFieldError("ipk") && (
                <p className="text-xs text-destructive">{getFieldError("ipk")}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contoh@email.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`rounded-xl ${getFieldError("email") ? "border-destructive" : ""}`}
            />
            {getFieldError("email") && (
              <p className="text-xs text-destructive">{getFieldError("email")}</p>
            )}
          </div>

          {/* No HP */}
          <div className="space-y-1.5">
            <Label htmlFor="no_hp">Nomor HP</Label>
            <Input
              id="no_hp"
              placeholder="081234567890"
              value={form.no_hp}
              onChange={(e) => handleChange("no_hp", e.target.value)}
              className={`rounded-xl ${getFieldError("no_hp") ? "border-destructive" : ""}`}
            />
            {getFieldError("no_hp") && (
              <p className="text-xs text-destructive">{getFieldError("no_hp")}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Simpan Perubahan" : "Tambah Mahasiswa"}
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}

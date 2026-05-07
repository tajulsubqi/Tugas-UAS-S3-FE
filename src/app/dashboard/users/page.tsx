"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteUserDialog } from "@/components/users/delete-user-dialog"
import { useUsers } from "@/hooks/use-users"
import { useAuthStore } from "@/store/auth-store"
import type { UserRole } from "@/types"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "mahasiswa" as "dosen" | "mahasiswa",
}

export default function UsersPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { users, isLoading, error, fetchUsers, createUser, updateUser, deleteUser } =
    useUsers()

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(initialForm)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<{
    id: number
    nama: string
    email: string
  } | null>(null)

  const isAdmin = user?.role === "admin"

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/dashboard")
      return
    }

    fetchUsers()
  }, [isAdmin, fetchUsers, router])

  const formTitle = useMemo(() => (editingId ? "Edit User" : "Tambah User"), [editingId])

  const handleOpenCreate = () => {
    setEditingId(null)
    setForm(initialForm)
    setOpen(true)
  }

  const handleOpenEdit = (id: number) => {
    const selected = users.find((u) => u.id === id)
    if (!selected) return

    setEditingId(selected.id)
    setForm({
      name: selected.nama,
      email: selected.email,
      password: "",
      role: selected.role === "dosen" ? "dosen" : "mahasiswa",
    })
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error("Nama wajib diisi")
      return
    }
    if (!form.email.trim()) {
      toast.error("Email wajib diisi")
      return
    }

    if (editingId) {
      const payload: { name: string; email: string; role: UserRole; password?: string } =
        {
          name: form.name,
          email: form.email,
          role: form.role,
        }

      if (form.password.trim()) {
        payload.password = form.password
      }

      const result = await updateUser(editingId, payload)
      if (result.success) {
        toast.success(result.message)
        setOpen(false)
        fetchUsers()
      } else {
        toast.error(result.message)
      }
      return
    }

    if (!form.password.trim()) {
      toast.error("Password wajib diisi")
      return
    }

    const result = await createUser({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    })

    if (result.success) {
      toast.success(result.message)
      setOpen(false)
      fetchUsers()
      return
    }

    toast.error(result.message)
  }

  const handleDeleteClick = (id: number) => {
    const selected = users.find((u) => u.id === id)
    if (!selected) return

    setSelectedDeleteUser({
      id: selected.id,
      nama: selected.nama,
      email: selected.email,
    })
    setDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteUser) return

    const result = await deleteUser(selectedDeleteUser.id)
    if (result.success) {
      toast.success(result.message)
      setDeleteOpen(false)
      setSelectedDeleteUser(null)
      fetchUsers()
      return
    }

    toast.error(result.message)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Manajemen User
          </h1>
          <p className="text-muted-foreground mt-1">
            Admin dapat membuat, melihat, mengubah, dan menghapus user.
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="rounded-xl gap-2"
          disabled={!isAdmin}
        >
          <Plus className="h-4 w-4" />
          Tambah User
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 lg:p-6">
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Badge variant={item.role === "admin" ? "default" : "secondary"}>
                      {item.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.id !== user?.id && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
                          onClick={() => handleOpenEdit(item.id)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-lg"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {!isLoading && users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Belum ada data user
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-125 rounded-2xl">
          <DialogHeader>
            <DialogTitle>{formTitle}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Perbarui data user sesuai kebutuhan."
                : "Admin hanya bisa membuat user dengan role dosen atau mahasiswa."}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, role: value as "dosen" | "mahasiswa" }))
                }
              >
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dosen">Dosen</SelectItem>
                  <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password {editingId ? "(opsional)" : ""}</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-xl"
              >
                Batal
              </Button>
              <Button type="submit" className="rounded-xl" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteUserDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setSelectedDeleteUser(null)
        }}
        onConfirm={handleDeleteConfirm}
        user={selectedDeleteUser}
        isLoading={isLoading}
      />
    </div>
  )
}

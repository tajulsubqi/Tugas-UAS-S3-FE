"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Loader2, BookOpen, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"dosen" | "mahasiswa">("mahasiswa")
  const [showPassword, setShowPassword] = useState(false)

  const { register, isLoading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Nama wajib diisi")
      return
    }

    if (!email.trim()) {
      toast.error("Email wajib diisi")
      return
    }

    if (!password.trim()) {
      toast.error("Password wajib diisi")
      return
    }

    const result = await register({ name, email, password, role })
    if (result.success) {
      toast.success(result.message)
      setName("")
      setEmail("")
      setPassword("")
      setRole("mahasiswa")
      return
    }

    toast.error(result.message)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Akun</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Buat akun dosen atau mahasiswa
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Masukkan nama"
                className="pl-10 h-11 rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email"
                className="pl-10 h-11 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as "dosen" | "mahasiswa")}
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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 h-11 rounded-xl"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Daftar"
            )}
          </Button>
        </form>

        <p className="mt-5 text-sm text-center text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

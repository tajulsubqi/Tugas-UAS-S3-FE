"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Loader2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { login, isLoading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Email wajib diisi")
      return
    }
    if (!password) {
      toast.error("Password wajib diisi")
      return
    }

    const result = await login({ email, password })
    if (result.success) {
      toast.success("Login berhasil! Selamat datang 👋")
    } else {
      toast.error(result.message)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="rounded-3xl border border-border/70 bg-card/90 p-8 shadow-xl shadow-black/10 backdrop-blur-xl dark:shadow-black/30">
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-blue-500 text-primary-foreground shadow-lg shadow-primary/20">
            <BookOpen className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Akademiku</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Masuk untuk melanjutkan ke dashboard
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3"
            >
              <p className="text-sm text-destructive font-medium">{error}</p>
            </motion.div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border-border/70 pl-10 focus-visible:ring-primary/40"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border-border/70 pl-10 pr-10 focus-visible:ring-primary/40"
                autoComplete="current-password"
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

          {/* Remember me */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-muted-foreground font-normal cursor-pointer"
              >
                Ingat saya
              </Label>
            </div>
            <Link href="/reset-password" className="text-xs text-primary hover:underline">
              Lupa password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full rounded-xl bg-linear-to-r from-primary to-blue-500 text-base font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>

        {/* Hint */}
        {/* <div className="mt-6 rounded-xl bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground text-center">
            Demo:{" "}
            <span className="font-mono font-medium text-foreground">admin@mail.com</span>{" "}
            / <span className="font-mono font-medium text-foreground">password</span>
          </p>
        </div> */}

        {/* <p className="mt-4 text-sm text-center text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Register
          </Link>
        </p> */}
      </div>
    </motion.div>
  )
}

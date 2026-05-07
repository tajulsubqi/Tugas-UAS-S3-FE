"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    const saved = localStorage.getItem("theme")

    // PERUBAHAN UTAMA:
    // Kita cek apakah user pernah set manual ke 'dark'.
    // Jika tidak ada data di storage, kita paksa ke false (light).
    const shouldBeDark = saved === "dark"

    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newDark = !isDark
    setIsDark(newDark)
    document.documentElement.classList.toggle("dark", newDark)
    localStorage.setItem("theme", newDark ? "dark" : "light")
  }

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-xl hover:bg-accent transition-colors hover:cursor-pointer"
      aria-label="Ubah Tema"
    >
      <Sun
        className={`h-4 w-4 text-gray-600 transition-all ${
          isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 text-blue-400 transition-all ${
          isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
        }`}
      />
    </Button>
  )
}

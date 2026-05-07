"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  hasHydrated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  setHasHydrated: (state: boolean) => void
}

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       hasHydrated: false,

//       setHasHydrated: (state: boolean) => {
//         set({ hasHydrated: state })
//       },

//       setAuth: (user: User, token: string) => {
//         localStorage.setItem("token", token)
//         set({ user, token, isAuthenticated: true })
//       },

//       logout: () => {
//         localStorage.removeItem("token")
//         set({ user: null, token: null, isAuthenticated: false })
//       },
//     }),
//     {
//       name: "auth-storage",
//       onRehydrateStorage: () => (state) => {
//         state?.setHasHydrated(true)
//       },
//     },
//   ),
// )

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,

      setHasHydrated: (state: boolean) => {
        set({ hasHydrated: state })
      },

      setAuth: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

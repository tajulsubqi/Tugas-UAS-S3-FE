import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://akademiku-api.vercel.app"
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function getStoredToken() {
  if (typeof window === "undefined") return null

  const persistedAuth = localStorage.getItem("auth-storage")
  if (!persistedAuth) return null

  try {
    const parsed = JSON.parse(persistedAuth) as {
      state?: { token?: string | null }
    }
    return parsed.state?.token || null
  } catch {
    return null
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("auth-storage")

//         if (!window.location.pathname.includes("/login")) {
//           window.location.href = "/login"
//         }
//       }
//     }
//     return Promise.reject(error)
//   },
// )

export default api

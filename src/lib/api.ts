import axios from "axios"

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://akademiku-api.vercel.app"

function getStoredToken() {
  if (typeof window === "undefined") return null

  const persistedAuth = localStorage.getItem("auth-storage")
  if (!persistedAuth) return null

  try {
    const parsed = JSON.parse(persistedAuth)
    return parsed.state?.token || null
  } catch (error) {
    console.error("Error parsing auth-storage:", error)
    return null
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token expired, tapi kita tetap di halaman ini.")
    }
    return Promise.reject(error)
  },
)

export default api

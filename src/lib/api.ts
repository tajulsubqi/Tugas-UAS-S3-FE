import axios from "axios"
import { getAuthToken } from "./auth"

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://akademiku-api.vercel.app"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") {
      return config
    }
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
    }
    return Promise.reject(error)
  },
)

export default api

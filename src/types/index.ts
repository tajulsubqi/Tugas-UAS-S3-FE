// ── Types untuk Mahasiswa ─────────────────────────────
export interface Mahasiswa {
  nim: string
  nama: string
  jurusan: string
  semester: number
  ipk: number
  email: string
  no_hp: string
}

export interface MahasiswaCreate {
  nim: string
  nama: string
  jurusan: string
  semester: number
  ipk: number
  email: string
  no_hp: string
}

export interface MahasiswaUpdate {
  nama?: string
  jurusan?: string
  semester?: number
  ipk?: number
  email?: string
  no_hp?: string
}

// ── Types untuk Authentication ────────────────────────
export type UserRole = "admin" | "dosen" | "mahasiswa"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  role: Exclude<UserRole, "admin">
}

export interface ResetPasswordPayload {
  email: string
  new_password: string
}

export interface User {
  id: number
  nama: string
  email: string
  role: UserRole
}

export interface AdminUserCreatePayload {
  name: string
  email: string
  password: string
  role: Exclude<UserRole, "admin">
}

export interface AdminUserUpdatePayload {
  name?: string
  email?: string
  password?: string
  role?: UserRole
}

export interface LoginResponse {
  success: boolean
  message: string
  token: string | null
  user: User | null
}

// ── Types untuk API Response ──────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  errors?: { field: string; message: string }[]
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// ── Types untuk Dashboard Stats ───────────────────────
export interface DashboardStats {
  total_mahasiswa: number
  total_jurusan: number
  rata_rata_ipk: number
  jurusan_list: string[]
}
export interface ChartData {
  ipk_distribution: { range: string; total: number }[]
  mahasiswa_per_jurusan: { jurusan: string; total: number }[]
  mahasiswa_per_semester: { semester: string; total: number }[]
  ipk_per_jurusan: { jurusan: string; rata_rata: number }[]
}
// ── Types untuk Query Parameters ──────────────────────
export interface MahasiswaQueryParams {
  search?: string
  jurusan?: string
  sort_by?: string
  sort_order?: "asc" | "desc"
  sort_algorithm?: "bubble" | "merge"
  search_algorithm?: "linear" | "binary"
  page?: number
  per_page?: number
}

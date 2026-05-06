// ── Types untuk Mahasiswa ─────────────────────────────
export interface Mahasiswa {
  nim: string;
  nama: string;
  jurusan: string;
  semester: number;
  ipk: number;
  email: string;
  no_hp: string;
}

export interface MahasiswaCreate {
  nim: string;
  nama: string;
  jurusan: string;
  semester: number;
  ipk: number;
  email: string;
  no_hp: string;
}

export interface MahasiswaUpdate {
  nama?: string;
  jurusan?: string;
  semester?: number;
  ipk?: number;
  email?: string;
  no_hp?: string;
}

// ── Types untuk Authentication ────────────────────────
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string | null;
  user: User | null;
}

// ── Types untuk API Response ──────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ── Types untuk Dashboard Stats ───────────────────────
export interface DashboardStats {
  total_mahasiswa: number;
  total_jurusan: number;
  rata_rata_ipk: number;
  jurusan_list: string[];
}

// ── Types untuk Query Parameters ──────────────────────
export interface MahasiswaQueryParams {
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  sort_algorithm?: "bubble" | "merge";
  search_algorithm?: "linear" | "binary";
  page?: number;
  per_page?: number;
}

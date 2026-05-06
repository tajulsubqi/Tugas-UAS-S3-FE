/**
 * Regex validasi untuk form mahasiswa.
 * Semua pesan error dalam bahasa Indonesia.
 */

export interface ValidationError {
  field: string;
  message: string;
}

export function validateMahasiswaForm(data: {
  nim: string;
  nama: string;
  jurusan: string;
  semester: string | number;
  ipk: string | number;
  email: string;
  no_hp: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  // NIM — hanya angka
  if (!data.nim) {
    errors.push({ field: "nim", message: "NIM wajib diisi" });
  } else if (!/^\d+$/.test(data.nim)) {
    errors.push({ field: "nim", message: "NIM hanya boleh berisi angka" });
  }

  // Nama — hanya huruf dan spasi
  if (!data.nama) {
    errors.push({ field: "nama", message: "Nama wajib diisi" });
  } else if (!/^[a-zA-Z\s]+$/.test(data.nama)) {
    errors.push({ field: "nama", message: "Nama hanya boleh berisi huruf dan spasi" });
  }

  // Jurusan
  if (!data.jurusan) {
    errors.push({ field: "jurusan", message: "Jurusan wajib diisi" });
  }

  // Semester — angka positif 1-14
  const semester = Number(data.semester);
  if (!data.semester && data.semester !== 0) {
    errors.push({ field: "semester", message: "Semester wajib diisi" });
  } else if (isNaN(semester) || semester < 1 || semester > 14) {
    errors.push({ field: "semester", message: "Semester harus antara 1 hingga 14" });
  }

  // IPK — 0 sampai 4
  const ipk = Number(data.ipk);
  if (data.ipk === "" || data.ipk === undefined || data.ipk === null) {
    errors.push({ field: "ipk", message: "IPK wajib diisi" });
  } else if (isNaN(ipk) || ipk < 0 || ipk > 4) {
    errors.push({ field: "ipk", message: "IPK harus antara 0 hingga 4" });
  }

  // Email — format valid
  if (!data.email) {
    errors.push({ field: "email", message: "Email wajib diisi" });
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
    errors.push({ field: "email", message: "Format email tidak valid" });
  }

  // Nomor HP — format Indonesia
  if (!data.no_hp) {
    errors.push({ field: "no_hp", message: "Nomor HP wajib diisi" });
  } else if (!/^08[1-9][0-9]{7,11}$/.test(data.no_hp)) {
    errors.push({ field: "no_hp", message: "Format nomor HP tidak valid (contoh: 081234567890)" });
  }

  return errors;
}

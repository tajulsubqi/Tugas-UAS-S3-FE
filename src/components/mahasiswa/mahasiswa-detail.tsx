"use client";

import { Mail, Phone, BookOpen, Hash, GraduationCap, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Mahasiswa } from "@/types";

interface MahasiswaDetailProps {
  open: boolean;
  onClose: () => void;
  mahasiswa: Mahasiswa | null;
}

export function MahasiswaDetail({ open, onClose, mahasiswa }: MahasiswaDetailProps) {
  if (!mahasiswa) return null;

  const fields = [
    { label: "NIM", value: mahasiswa.nim, icon: Hash },
    { label: "Nama Lengkap", value: mahasiswa.nama, icon: GraduationCap },
    { label: "Jurusan", value: mahasiswa.jurusan, icon: BookOpen },
    { label: "Semester", value: `Semester ${mahasiswa.semester}`, icon: BookOpen },
    { label: "IPK", value: mahasiswa.ipk.toFixed(2), icon: TrendingUp },
    { label: "Email", value: mahasiswa.email, icon: Mail },
    { label: "Nomor HP", value: mahasiswa.no_hp, icon: Phone },
  ];

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[440px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Mahasiswa</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-1">
          {/* Profile header */}
          <div className="flex items-center gap-4 pb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl">
              {mahasiswa.nama
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{mahasiswa.nama}</h3>
              <Badge variant="secondary" className="rounded-lg mt-1">{mahasiswa.jurusan}</Badge>
            </div>
          </div>

          <Separator />

          {/* Detail fields */}
          <div className="space-y-3 pt-3">
            {fields.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Mahasiswa } from "@/types";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mahasiswa: Mahasiswa | null;
  isLoading: boolean;
}

export function DeleteDialog({ open, onClose, onConfirm, mahasiswa, isLoading }: DeleteDialogProps) {
  if (!mahasiswa) return null;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl">
        <DialogHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mx-auto mb-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl">Hapus Mahasiswa?</DialogTitle>
          <DialogDescription className="text-center">
            Data mahasiswa <span className="font-semibold text-foreground">{mahasiswa.nama}</span> ({mahasiswa.nim})
            akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 sm:justify-center pt-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl flex-1">
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl flex-1"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ya, Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

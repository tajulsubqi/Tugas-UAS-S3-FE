"use client"

import { AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UserToDelete {
  id: number
  nama: string
  email: string
}

interface DeleteUserDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  user: UserToDelete | null
  isLoading: boolean
}

export function DeleteUserDialog({
  open,
  onClose,
  onConfirm,
  user,
  isLoading,
}: DeleteUserDialogProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-100 rounded-2xl">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl">Hapus User?</DialogTitle>
          <DialogDescription className="text-center">
            User <span className="font-semibold text-foreground">{user.nama}</span> (
            {user.email}) akan dihapus secara permanen. Tindakan ini tidak dapat
            dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 pt-2 sm:justify-center">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ya, Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

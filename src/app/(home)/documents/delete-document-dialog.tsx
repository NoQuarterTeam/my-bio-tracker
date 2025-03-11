import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

interface DeleteDocumentDialogProps {
  documentId: string
  onDelete: (formData: FormData) => Promise<void>
}

export function DeleteDocumentDialog({ documentId, onDelete }: DeleteDocumentDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Document</DialogTitle>
          <DialogDescription>Are you sure you want to delete this document? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form action={onDelete}>
            <input type="hidden" name="documentId" value={documentId} />
            <div className="flex justify-end gap-2">
              <DialogTrigger asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogTrigger>
              <Button variant="destructive" type="submit">
                Delete
              </Button>
            </div>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

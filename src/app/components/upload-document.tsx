"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { FileIcon, UploadIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import useSWRMutation from "swr/mutation"

async function sendDocuments(url: string, { arg }: { arg: FormData }) {
  return fetch(url, { method: "POST", body: arg }).then((res) => res.json()) as Promise<
    { success: true } | { success: false; error: string }
  >
}

export function UploadDocument() {
  const { trigger, isMutating, error } = useSWRMutation("/api/upload", sendDocuments, {
    onSuccess: (data) => {
      if (!data.success) return toast.error(data.error)
      toast.success("Documents uploaded successfully")
      setFiles([])
    },
  })
  const [files, setFiles] = useState<File[]>([])
  const dropzone = useDropzone({ onDrop: setFiles })

  const handleConfirm = () => {
    console.log("do stuff")
    const formData = new FormData()
    for (const file of files) {
      formData.append("files", file)
    }

    trigger(formData)
  }

  return (
    <div>
      <div {...dropzone.getRootProps()}>
        <input {...dropzone.getInputProps()} />
        <Button variant="outline">
          <UploadIcon />
          <span>Upload</span>
        </Button>
      </div>

      <Dialog
        open={files.length > 0}
        onOpenChange={(open) => {
          if (!open) setFiles([])
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uploading documents</DialogTitle>
            <DialogDescription>Uploading {files.length} files</DialogDescription>
          </DialogHeader>
          <div className="divide-y border">
            {files.map((file) => (
              <div key={file.name} className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4" />
                  <span className="w-[300px] truncate text-sm">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFiles(files.filter((f) => f !== file))}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          {error && <div className="text-red-500">{error.message}</div>}
          <DialogFooter>
            <Button type="button" onClick={handleConfirm} disabled={isMutating}>
              {isMutating ? "Uploading..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

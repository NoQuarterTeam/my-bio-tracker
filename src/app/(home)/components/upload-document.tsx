"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { FileIcon, Loader2Icon, UploadIcon, XIcon } from "lucide-react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const { trigger, isMutating, error } = useSWRMutation("/api/upload", sendDocuments, {
    onSuccess: (data) => {
      if (!data.success) return toast.error(data.error)
      toast.success("Documents uploaded successfully")
      setFiles([])
      router.refresh()
    },
  })
  const [files, setFiles] = useState<File[]>([])
  const dropzone = useDropzone({ onDrop: setFiles })

  const handleConfirm = () => {
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
          <span>Upload documents</span>
        </Button>
      </div>

      <Dialog
        open={files.length > 0}
        onOpenChange={(open) => {
          if (!open && !isMutating) setFiles([])
        }}
      >
        <DialogContent>
          {isMutating ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2Icon className="mb-4 h-10 w-10 animate-spin text-primary" />
              <h3 className="mb-2 font-semibold text-lg">Processing Documents</h3>
              <p className="mb-4 text-center text-muted-foreground">
                We're extracting all relevant information from your documents.
              </p>
              <Card className="w-full">
                <CardContent className="pt-6">
                  <CardDescription className="text-center">
                    This process may take a minute. Please don't close this window.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
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
                <Button type="button" onClick={handleConfirm}>
                  Confirm
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

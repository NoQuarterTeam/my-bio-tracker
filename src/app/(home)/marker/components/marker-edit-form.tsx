"use client"

import { FormButton } from "@/components/form-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { markerSelectSchema } from "@/lib/server/db/tests"
import { format } from "date-fns"
import { TrashIcon } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"
import type { z } from "zod"
import { deleteMarker, updateMarker } from "./actions"

type Marker = z.infer<typeof markerSelectSchema> & {
  document: { title: string } | null
}

interface MarkerEditFormProps {
  marker: Marker
}

export function MarkerEditForm({ marker }: MarkerEditFormProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteMarker(marker.id)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to delete the marker. Please try again."
        toast.error("Error", {
          description: errorMessage,
        })
      }
    })
  }

  const handleUpdate = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await updateMarker(formData)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to update the marker. Please try again."
        toast.error("Error", { description: errorMessage })
      }
    })
  }

  return (
    <Card className="flex flex-row items-center gap-4 p-4">
      <form action={handleUpdate} className="flex w-full items-center gap-4">
        <input type="hidden" name="id" value={marker.id} />

        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              className="w-[200px] pr-10"
              id={`value-${marker.id}`}
              name="value"
              defaultValue={marker.value}
              required
              disabled={isPending}
            />
            {marker.unit && (
              <div className="absolute top-0 right-4 bottom-0 flex w-10 items-center justify-center">
                <span className="text-muted-foreground text-sm">{marker.unit}</span>
              </div>
            )}
          </div>

          <div className="relative">
            <Input
              className="w-[200px] pr-10"
              id={`date-${marker.id}`}
              name="date"
              type="date"
              defaultValue={format(new Date(marker.createdAt), "yyyy-MM-dd")}
              required
              disabled={isPending}
            />
            <div className="absolute top-0 right-4 bottom-0 flex w-10 items-center justify-center">
              <span className="text-muted-foreground text-sm">Date</span>
            </div>
          </div>

          <FormButton>Update</FormButton>
        </div>
      </form>
      <div className="flex items-center gap-2">
        {marker.document && <Badge>{marker.document.title}</Badge>}
        <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isPending}>
          <TrashIcon />
        </Button>
      </div>
    </Card>
  )
}

"use client"

import { FormButton } from "@/components/form-button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addMarker } from "./action"
import { markerDefaults } from "./static"

export function AddManualMarker() {
  return (
    <form action={addMarker} className="flex gap-2">
      <Select name="name" defaultValue="Blood Pressure">
        <SelectTrigger>
          <SelectValue placeholder="Select marker" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(markerDefaults).map((marker) => (
            <SelectItem key={marker} value={marker}>
              {marker}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input name="value" placeholder="Enter value" required />

      <FormButton>Add</FormButton>
    </form>
  )
}

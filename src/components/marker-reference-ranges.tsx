import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { HealthMarker } from "@/lib/types"

interface MarkerReferenceRangesProps {
  marker: HealthMarker
}

export function MarkerReferenceRanges({ marker }: MarkerReferenceRangesProps) {
  // Example reference ranges by age and gender
  const referenceRanges = [
    {
      group: "Adult Male (18-50)",
      min: marker.range.min - 5,
      max: marker.range.max - 5,
      unit: marker.unit,
    },
    {
      group: "Adult Female (18-50)",
      min: marker.range.min,
      max: marker.range.max,
      unit: marker.unit,
    },
    {
      group: "Senior Male (50+)",
      min: marker.range.min + 5,
      max: marker.range.max + 5,
      unit: marker.unit,
    },
    {
      group: "Senior Female (50+)",
      min: marker.range.min + 2,
      max: marker.range.max + 2,
      unit: marker.unit,
    },
    {
      group: "Children (6-17)",
      min: marker.range.min - 10,
      max: marker.range.max - 10,
      unit: marker.unit,
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Group</TableHead>
          <TableHead>Minimum</TableHead>
          <TableHead>Maximum</TableHead>
          <TableHead>Unit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referenceRanges.map((range) => (
          <TableRow key={range.group}>
            <TableCell className="font-medium">{range.group}</TableCell>
            <TableCell>{range.min}</TableCell>
            <TableCell>{range.max}</TableCell>
            <TableCell>{range.unit}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


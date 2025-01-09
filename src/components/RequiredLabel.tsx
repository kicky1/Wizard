import { Label } from "@/components/ui/label"

interface Props {
    name: string
    label: string
}

export const RequiredLabel = ({ name, label }: Props) => {
  return (
    <Label htmlFor={name} className="flex items-center space-x-1 mb-1.5" aria-required>
      <span>{label}</span>
      <span className="text-red-500" aria-hidden="true">*</span>
    </Label>
  )
}
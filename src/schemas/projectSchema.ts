import * as z from 'zod'

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(32, "Name must be 32 characters or less"),
  description: z.string().optional(),
  dateRange: z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required")
  }),
  areaOfInterest: z.instanceof(File, { message: "Area of Interest file is required" })
})
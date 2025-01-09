export type ProjectFormData = {
  name: string
  description?: string
  dateRange: {
    startDate: string
    endDate: string
  }
  areaOfInterest?: File
}

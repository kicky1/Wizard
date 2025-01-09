import { DatePicker } from '@/components/DatePicker'
import { ErrorText } from '@/components/ErrorText'
import { RequiredLabel } from '@/components/RequiredLabel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ProjectFormData } from '@/types/project'
import { UseFormReturn, useWatch } from 'react-hook-form'

interface Props {
  step: number
  form: UseFormReturn<ProjectFormData>
}

export const WizardSteps = ({ step, form }: Props) => {
  const { register, formState: { errors }, control } = form
  const areaOfInterest = useWatch({
    control,
    name: "areaOfInterest"
  });

  switch (step) {
    case 1:
      return (
        <div className="space-y-4">
          <div>
            <RequiredLabel name="name" label="Project name"/>
            <Input 
              id="name" 
              {...register("name")}
              maxLength={32} 
            />
            {errors.name && <ErrorText message={errors.name.message} />}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              className='mt-0.5'
              id="description" 
              {...register("description")}
            />
          </div>
        </div>
      )
    case 2:
      return (
        <div className="space-y-4">
          <div>
            <RequiredLabel name="dateRange" label="Date range"/>
            <DatePicker 
              control={control}
              startDateName="dateRange.startDate"
              endDateName="dateRange.endDate"
              defaultStartDate={form.getValues("dateRange.startDate")}
              defaultEndDate={form.getValues("dateRange.endDate")}
            />
            {errors.dateRange?.startDate && <ErrorText message={errors.dateRange.startDate.message} />}
            {errors.dateRange?.endDate && <ErrorText message={errors.dateRange.endDate.message} />}
          </div>
        </div>
      )
    case 3:
      return (
        <div>
        <RequiredLabel name="areaOfInterest" label="Area of interest"/>
        {areaOfInterest ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">{areaOfInterest.name}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.setValue("areaOfInterest", undefined)}
            >
              Change file
            </Button>
          </div>
        ) : (
          <Input
            className="title:none p-0 pe-3 file:me-3 file:border-0 file:border-e file:h-full file:bg-primary file:text-primary-foreground hover:cursor-pointer"
            id="areaOfInterest" 
            type="file" 
            accept=".geojson" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                form.setValue("areaOfInterest", file, { shouldValidate: true });
              }
            }}
          />
        )}
        {errors.areaOfInterest && <ErrorText message={errors.areaOfInterest.message} />}
      </div>
      )
    default:
      return null
  }
}
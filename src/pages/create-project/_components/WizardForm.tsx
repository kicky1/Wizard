import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { projectSchema } from '@/schemas/projectSchema'
import { Stepper } from '@/components/Stepper'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useIsMutating } from '@tanstack/react-query'
import { WizardSteps } from './WizardSteps'
import { ProjectFormData } from '@/types/project'
import { usePostProject } from '@/actions/project/post-project'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Props {
  onSuccess: (data: ProjectFormData) => void;
}

export const WizardForm = ({ onSuccess }: Props) => {
  const [step, setStep] = useState(1)
  const postProjectMutation = usePostProject()
  const isMutating = useIsMutating()
  const { toast } = useToast()

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      dateRange: {
        startDate: '',
        endDate: ''
      }
    }
  })

  const { handleSubmit } = form

  const onSubmit: SubmitHandler<ProjectFormData> = (data) => {
      postProjectMutation.mutate(data, {
        onSuccess: () => {
          onSuccess(data)
        }
      })
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, (errors) => {
      if (errors) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly.",
          variant: "destructive",
        })
      }
    })}>
      <CardHeader className='bg-primary rounded-t-xl'>
      <CardTitle className='text-xl lg:text-2xl text-secondary text-left'>Create New Project</CardTitle>
        <div className='mx-auto w-full pb-2'>
          <div className='text-secondary text-right mb-2'>{step}/3</div>
          <Stepper currentStep={step} totalSteps={3} />
        </div>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            exit={{ opacity: 0}}
            transition={{ duration: 0.3 }}
          >
            <WizardSteps step={step} form={form} />
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter className={cn("flex justify-between p-4 lg:p-6", step === 1 && "justify-end")}>
        {step > 1 && <Button type="button" onClick={handlePrevious} className='pl-2'><ChevronLeft/> Previous</Button>}
        {step < 3 && <Button type="button" onClick={handleNext} className='pr-2'>Next<ChevronRight/></Button>}
        {step === 3 && <Button type="submit" loading={!!isMutating} loadingText='Creating...'>
          Create
        </Button>}
      </CardFooter>
    </form>
  )
}
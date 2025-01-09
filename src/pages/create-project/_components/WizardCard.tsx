import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { WizardForm } from './WizardForm'
import { ProjectDetails } from './ProjectDetails'
import { ProjectFormData } from '@/types/project'

export const WizardCard = () => {
  const [showMap, setShowMap] = useState(false)
  const [projectData, setProjectData] = useState<ProjectFormData | null>(null)

  const handleSuccess = (data: ProjectFormData) => {
    setProjectData(data)
    setShowMap(true)
  }

  const handleReset = () => {
    setProjectData(null)
    setShowMap(false)
  }

  return (
    <Card className="w-full max-w-sm lg:max-w-xl mx-auto">
      {!showMap ? (
        <WizardForm onSuccess={handleSuccess} />
      ) : (
        projectData && <ProjectDetails project={projectData} handleReset={handleReset}/>
      )}
    </Card>
  )
}
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { MapComponent } from '@/components/MapComponent/MapComponent'
import { ProjectFormData } from '@/types/project';
import { Button } from '@/components/ui/button';

interface Props {
  project: ProjectFormData;
  handleReset: () => void;
}

export const ProjectDetails = ({ project, handleReset }: Props) => {
  return (
    <>
      <CardHeader className="bg-primary rounded-t-xl p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 lg:gap-4">
          <div className="w-full lg:w-2/3">
            <CardTitle className="text-xl lg:text-2xl text-secondary break-words">{project.name}</CardTitle>
            <CardDescription className="mt-1 text-sm lg:text-base line-clamp-2 lg:line-clamp-none">
              {project.description}
            </CardDescription>
          </div>
          <div className="w-full lg:w-1/3 text-left lg:text-right text-secondary text-sm lg:text-base">
            <p>From: {project.dateRange.startDate}</p>
            <p>To: {project.dateRange.endDate}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-0 relative'>
        {project.areaOfInterest && (
          <div className="w-full h-full">
            <MapComponent file={project.areaOfInterest as File} />
          </div>
        )}
      <div className="absolute bottom-0 right-4">
        <Button  className='mb-4' onClick={handleReset}>
          Create New
        </Button>
      </div>
      </CardContent>
    </>
  )
}
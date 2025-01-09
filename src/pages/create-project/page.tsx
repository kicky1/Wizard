import { WizardCard } from './_components/WizardCard'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function CreateProjectPage() {
  return (
    <div className="container mx-auto p-4">
      <Link to="/">
        <Button size={"icon"} variant={"link"} className='mb-4' asChild>
          <ArrowLeft className='hover:text-[#34ad6f]'/>
        </Button>
      </Link>
      <WizardCard />
    </div>
  )
}
interface Props {
  currentStep: number
  totalSteps: number
}

export const Stepper = ({ currentStep, totalSteps }: Props) => {
  return (
    <div className="w-full bg-gray-200 rounded-full">
      <div
        className="bg-[#34ad6f] h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${(currentStep / totalSteps) * 100}%` }}
      ></div>
    </div>
  )
}
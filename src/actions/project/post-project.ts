import { useToast } from '@/hooks/use-toast';
import { ProjectFormData } from '@/types/project';
import { useMutation, UseMutationResult } from '@tanstack/react-query'

type ApiResponse = {
  success: boolean;
  message: string;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockPostProject = async (data: ProjectFormData): Promise<ApiResponse> => {
  await delay(2000);

  if (data.areaOfInterest) {
    const fileExtension = data.areaOfInterest.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'geojson') {
      throw new Error('Wrong file type. Only .geojson files are allowed.');
    }
  }

  return { success: true, message: 'Project created successfully!' };
};

export const usePostProject = (): UseMutationResult<
  ApiResponse,
  Error,
  ProjectFormData
> => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: mockPostProject,
    onSuccess: (data) => {
      toast({
        variant: "success",
        title: "Success",
        description: data.message,
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error ? error.message : "Failed to create project.",
        variant: "destructive",
      })
    },
  });
};
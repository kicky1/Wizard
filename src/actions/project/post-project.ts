import { validateGeoJSON } from '@/helpers/validateGeoJSON';
import { useToast } from '@/hooks/use-toast';
import { ProjectFormData } from '@/types/project';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

type ApiResponse = {
  success: boolean;
  message: string;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockPostProject = async (data: ProjectFormData): Promise<ApiResponse> => {
  await delay(2000);

  if (!data.areaOfInterest) {
    throw new Error('Area of interest file is required.');
  }

  const fileExtension = data.areaOfInterest.name.split('.').pop()?.toLowerCase();
  if (fileExtension !== 'geojson') {
    throw new Error('Wrong file type. Only .geojson files are allowed.');
  }

  try {
    const fileContent = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(data.areaOfInterest as File);
    });

    const geoJSON = JSON.parse(fileContent);
    const error = validateGeoJSON(geoJSON);
    
    if (error) {
      throw new Error(error);
    }

    return { success: true, message: 'Project created successfully!' };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format in the file');
    }
    throw error;
  }
};

export const usePostProject = (): UseMutationResult<
  ApiResponse,
  Error,
  ProjectFormData
> => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: mockPostProject,
    onSuccess: (data) => {
      toast({
        variant: "success",
        title: "Success",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error ? error.message : "Failed to create project.",
        variant: "destructive",
      });
    },
  });
};
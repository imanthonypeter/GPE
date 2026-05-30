import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CreatePhasePayload } from '@/types';

export function usePhases(projectId: string | number) {
  return useQuery({
    queryKey: ['phases', projectId],
    queryFn: () => api.getPhasesByProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreatePhase(projectId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePhasePayload) => api.createPhase({ ...data, project_id: projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases', projectId] });
    },
  });
}

export function useUpdatePhaseStatus(projectId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ phaseId, status }: { phaseId: string | number; status: string }) => api.updatePhaseStatus(phaseId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases', projectId] });
    },
  });
}

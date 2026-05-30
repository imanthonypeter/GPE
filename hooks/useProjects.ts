import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Project, CreateProjectPayload, AddMemberPayload, UpdateMemberPayload } from '@/types';

export function useProjects(userId: string | number | undefined) {
  return useQuery({
    queryKey: ['projects', userId],
    queryFn: async () => {
      if (!userId) return { projects: [] };
      const data = await api.getUserProjects(userId);
      return data;
    },
    enabled: !!userId,
  });
}

export function useProject(projectId: string | number) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => api.getProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectPayload) => api.createProject(data),
    onSuccess: () => {
      // Invalidate projects queries so it refetches the list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useFinishProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string | number) => api.finishProject(projectId),
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
}

export function useAddMember(projectId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberPayload) => api.addProjectMember(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
}

export function useUpdateMember(projectId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ memberId, data }: { memberId: string | number; data: UpdateMemberPayload }) => 
      api.updateProjectMember(projectId, memberId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
}

export function useRemoveMember(projectId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string | number) => api.removeProjectMember(projectId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LoginPayload } from '@/types';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['currentUser'],
    queryFn: () => {
      const currentUser = api.getCurrentUser();
      return currentUser;
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) => api.login(data, true),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
      router.push('/dashboard');
    },
  });

  const logout = () => {
    api.logout();
    queryClient.setQueryData(['currentUser'], null);
    queryClient.clear();
    router.push('/');
  };

  return {
    user,
    isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout,
  };
}

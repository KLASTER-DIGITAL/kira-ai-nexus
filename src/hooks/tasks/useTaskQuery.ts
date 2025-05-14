
import { useQuery } from '@tanstack/react-query';
import { TaskFilter } from '@/types/tasks';
import { fetchTasks } from '@/services/taskService';
import { useAuth } from '@/context/auth';

export const useTaskQuery = (filter?: TaskFilter) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      return fetchTasks(user.id, filter);
    },
    enabled: !!user
  });
};

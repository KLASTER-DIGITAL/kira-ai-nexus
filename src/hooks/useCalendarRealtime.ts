
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';

export const useCalendarRealtime = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    console.log('Setting up calendar real-time subscriptions');

    const channel = supabase
      .channel('calendar-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Calendar event change detected:', payload);
          
          // Invalidate queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['calendar'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up calendar real-time subscriptions');
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
};

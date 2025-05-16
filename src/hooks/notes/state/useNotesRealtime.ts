
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook for setting up realtime subscriptions for notes
 */
export const useNotesRealtime = () => {
  // Setup realtime subscription
  const setupRealtimeSubscription = () => {
    console.log("Setting up realtime subscription for notes");
    const channel = supabase
      .channel('notes-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'nodes', filter: "type=eq.note" }, 
        (payload) => {
          console.log('Notes change detected:', payload);
          if (payload.eventType === 'INSERT' && payload.new) {
            toast.info("Новая заметка", {
              description: "Создана новая заметка"
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            toast.info("Заметка обновлена", {
              description: "Заметка была изменена"
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            toast.info("Заметка удалена", {
              description: "Заметка была удалена"
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    setupRealtimeSubscription
  };
};

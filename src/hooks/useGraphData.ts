
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NodeBasicInfo } from './notes/links/types';

export interface GraphLink {
  id: string;
  source_id: string;
  target_id: string;
  type?: string;
}

export function useGraphData() {
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Fetch all nodes (notes, tasks, events)
  const { data: nodes = [], isLoading: isLoadingNodes } = useQuery({
    queryKey: ['graph-nodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nodes')
        .select('id, title, content, tags, type, created_at, updated_at');
        
      if (error) {
        throw error;
      }
      
      // Convert to NodeBasicInfo with optional fields
      return data.map(node => ({
        id: node.id,
        title: node.title,
        type: node.type as "note" | "task" | "event",
        content: node.content,
        tags: node.tags,
        created_at: node.created_at,
        updated_at: node.updated_at
      }));
    }
  });
  
  // Fetch all links between nodes
  const { data: links = [], isLoading: isLoadingLinks } = useQuery({
    queryKey: ['graph-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('links')
        .select('id, source_id, target_id, type');
        
      if (error) {
        throw error;
      }
      
      return data as GraphLink[];
    }
  });
  
  const isLoading = isLoadingNodes || isLoadingLinks || isFiltering;
  
  return {
    nodes,
    links,
    isLoading,
  };
}

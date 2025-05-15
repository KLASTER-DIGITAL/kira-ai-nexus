
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LinkData } from "./notes/links/types";

export interface GraphNode {
  id: string;
  title: string;
  type: string;
  content?: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const useGraphData = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ['graphData'],
    queryFn: async () => {
      // Fetch all notes
      const { data: nodes, error: nodesError } = await supabase
        .from('nodes')
        .select('id, title, type, content, created_at, updated_at')
        .eq("type", "note");
      
      if (nodesError) {
        console.error('Error fetching nodes:', nodesError);
        throw nodesError;
      }
      
      // Fetch all links
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('id, source_id, target_id');
      
      if (linksError) {
        console.error('Error fetching links:', linksError);
        throw linksError;
      }
      
      // Format data for graph visualization
      const formattedNodes: GraphNode[] = nodes.map((node: any) => ({
        id: node.id,
        title: node.title || "",
        type: node.type || "note",
        content: typeof node.content === 'object' ? (node.content as any)?.content : node.content,
        tags: typeof node.content === 'object' ? (node.content as any)?.tags || [] : [],
        created_at: node.created_at,
        updated_at: node.updated_at,
      }));
      
      const formattedLinks: GraphLink[] = links.map((link: any) => ({
        id: link.id,
        source: link.source_id,
        target: link.target_id,
      }));
      
      return {
        nodes: formattedNodes,
        links: formattedLinks,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return {
    graphData: data,
    isLoading: isPending,
    error,
  };
};

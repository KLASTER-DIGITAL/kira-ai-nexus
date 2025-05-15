
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";
import { NodeBasicInfo, NodeLink, GraphViewFilters } from "@/hooks/notes/links/types";
import { useToast } from "@/hooks/use-toast";

export interface GraphData {
  nodes: NodeBasicInfo[];
  links: NodeLink[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useGraphData = (filters?: GraphViewFilters) => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch all nodes (notes, tasks, events)
  const {
    data: nodes,
    isLoading: isLoadingNodes,
    error: nodesError,
    refetch: refetchNodes
  } = useQuery({
    queryKey: ["graph-nodes", filters?.nodeTypes, filters?.searchTerm, filters?.tags],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from("nodes")
        .select("id, title, type, content, tags")
        .order("created_at", { ascending: false });
      
      // Filter by node types if specified
      if (filters?.nodeTypes && filters.nodeTypes.length > 0) {
        query = query.in("type", filters.nodeTypes);
      }
      
      // Filter by search term if provided
      if (filters?.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,content.ilike.%${filters.searchTerm}%`);
      }
      
      // Filter by tags if specified
      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains("tags", filters.tags);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching graph nodes:", error);
        throw error;
      }

      return data as NodeBasicInfo[];
    },
    enabled: !!user,
  });

  // Fetch all links between nodes
  const {
    data: links,
    isLoading: isLoadingLinks,
    error: linksError,
    refetch: refetchLinks
  } = useQuery({
    queryKey: ["graph-links", nodes?.map(n => n.id).join(",")],
    queryFn: async () => {
      if (!user || !nodes || nodes.length === 0) return [];

      const nodeIds = nodes.map((node) => node.id);
      
      const { data, error } = await supabase
        .from("links")
        .select("id, source_id, target_id, type")
        .or(`source_id.in.(${nodeIds.join(",")}),target_id.in.(${nodeIds.join(",")})`);

      if (error) {
        console.error("Error fetching graph links:", error);
        throw error;
      }

      // Only return links where both source and target are in our fetched nodes
      return data.filter(
        link => 
          nodeIds.includes(link.source_id) && 
          nodeIds.includes(link.target_id)
      ) as NodeLink[];
    },
    enabled: !!user && !!nodes && nodes.length > 0,
  });

  // Set up realtime subscriptions for graph updates
  useEffect(() => {
    if (!user) return;

    const nodesChannel = supabase
      .channel('graph-nodes-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'nodes' 
      }, () => {
        refetchNodes();
      })
      .subscribe();

    const linksChannel = supabase
      .channel('graph-links-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'links'
      }, () => {
        refetchLinks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(nodesChannel);
      supabase.removeChannel(linksChannel);
    };
  }, [user, refetchNodes, refetchLinks]);

  // Apply the isolated nodes filter if specified
  const filteredData = useMemo(() => {
    if (!nodes || !links) return { nodes: [], links: [] };

    let filteredNodes = [...nodes];
    let filteredLinks = [...links];

    // Filter out isolated nodes if that option is specified
    if (filters?.showIsolatedNodes === false) {
      const connectedNodeIds = new Set<string>();
      
      filteredLinks.forEach(link => {
        connectedNodeIds.add(link.source_id);
        connectedNodeIds.add(link.target_id);
      });

      filteredNodes = filteredNodes.filter(node => connectedNodeIds.has(node.id));
    }

    return { 
      nodes: filteredNodes, 
      links: filteredLinks 
    };
  }, [nodes, links, filters?.showIsolatedNodes]);

  return {
    nodes: filteredData.nodes,
    links: filteredData.links,
    isLoading: isLoadingNodes || isLoadingLinks,
    error: nodesError || linksError,
    refetch: () => {
      refetchNodes();
      refetchLinks();
    }
  };
};

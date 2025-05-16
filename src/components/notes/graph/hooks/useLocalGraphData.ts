
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LayoutType } from '@/hooks/useGraphSettings';
import { useGraphDataFiltering } from './useGraphDataFiltering';
import { extractTags } from '../utils/dataUtils';

export const useLocalGraphData = () => {
  const { applyLayout } = useGraphDataFiltering();

  // Process graph data specifically for a single node and its connections
  const processGraphData = useCallback(async (
    nodeId: string,
    searchQuery: string,
    selectedTags: string[],
    showIsolatedNodes: boolean,
    layoutType: LayoutType = 'force'
  ) => {
    try {
      // Fetch the central node
      const { data: nodeData, error: nodeError } = await supabase
        .from('nodes')
        .select('*')
        .eq('id', nodeId)
        .single();
        
      if (nodeError) throw nodeError;
      
      // Since we don't have a get_connected_nodes RPC function, 
      // let's use a direct query to get connected nodes
      const { data: linkData, error: linkError } = await supabase
        .from('links')
        .select('source_id, target_id')
        .or(`source_id.eq.${nodeId},target_id.eq.${nodeId}`);
        
      if (linkError) throw linkError;
      
      // Process the result to extract node IDs
      const connectedNodeIds = new Set<string>();
      
      if (linkData && Array.isArray(linkData)) {
        linkData.forEach(link => {
          if (link.source_id === nodeId) {
            connectedNodeIds.add(link.target_id);
          } else {
            connectedNodeIds.add(link.source_id);
          }
        });
      }
      
      // Always include the central node
      connectedNodeIds.add(nodeId);
      
      const connectedNodesArray = Array.from(connectedNodeIds);
      
      // Efficiently fetch all related nodes
      const { data: relatedNodes, error: relatedError } = await supabase
        .from('nodes')
        .select('*')
        .in('id', connectedNodesArray);
        
      if (relatedError) throw relatedError;
      
      // Get links between these nodes
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('*')
        .or(`source_id.in.(${connectedNodesArray.join(',')}),target_id.in.(${connectedNodesArray.join(',')})`);
        
      if (linksError) throw linksError;
      
      // Format nodes and links for graph layout
      const formattedLinks = links.map(link => ({
        sourceId: link.source_id,
        targetId: link.target_id,
        id: link.id
      }));
      
      // Combine central node with related nodes
      const allNodes = [nodeData, ...relatedNodes]
        .filter((node, index, self) => 
          // Remove duplicates
          index === self.findIndex(n => n.id === node.id)
        )
        .map(node => {
          // Extract tags from content safely
          const nodeTags = extractTags(node.content);
          
          return {
            ...node,
            tags: nodeTags
          };
        });
      
      // Apply filters and layout
      return applyLayout(
        allNodes,
        formattedLinks,
        searchQuery,
        selectedTags,
        showIsolatedNodes,
        layoutType
      );
    } catch (error) {
      console.error("Error fetching local graph data:", error);
      return { nodes: [], edges: [] };
    }
  }, [applyLayout]);

  return {
    processGraphData
  };
};

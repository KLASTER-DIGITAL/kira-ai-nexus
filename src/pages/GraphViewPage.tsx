
import React, { useState, useEffect } from "react";
import { ReactFlowProvider } from '@xyflow/react';
import GraphView from "@/components/graph/GraphView";
import { useGraphData } from "@/hooks/useGraphData";

const GraphViewPage: React.FC = () => {
  const { graphData, isLoading } = useGraphData();
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    // Extract all unique tags from nodes
    if (graphData && graphData.nodes && graphData.nodes.length > 0) {
      const tagsSet = new Set<string>();
      graphData.nodes.forEach(node => {
        if (node.tags && Array.isArray(node.tags)) {
          node.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      setAvailableTags(Array.from(tagsSet));
    }
  }, [graphData]);

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Загрузка данных графа...</p>
        </div>
      </div>
    );
  }

  // Transform data to match GraphView expectations
  const formattedData = graphData 
    ? { 
        nodes: graphData.nodes,
        edges: graphData.links.map(link => ({
          id: link.id,
          source: link.source,
          target: link.target
        }))
      } 
    : { nodes: [], edges: [] };

  return (
    <div className="container mx-auto">
      <ReactFlowProvider>
        <GraphView data={formattedData} availableTags={availableTags} />
      </ReactFlowProvider>
    </div>
  );
};

export default GraphViewPage;

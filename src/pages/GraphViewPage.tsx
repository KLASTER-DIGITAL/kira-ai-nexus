
import React, { useState, useEffect } from "react";
import { ReactFlowProvider } from '@xyflow/react';
import Layout from "@/components/layout/Layout";
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
      <Layout title="Граф связей">
        <div className="container mx-auto flex items-center justify-center h-64">
          <p className="text-lg">Загрузка данных графа...</p>
        </div>
      </Layout>
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
    <Layout title="Граф связей">
      <div className="container mx-auto">
        <ReactFlowProvider>
          <GraphView data={formattedData} availableTags={availableTags} />
        </ReactFlowProvider>
      </div>
    </Layout>
  );
};

export default GraphViewPage;

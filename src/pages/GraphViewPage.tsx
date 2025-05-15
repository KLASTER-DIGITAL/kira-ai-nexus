
import React, { useState, useEffect } from "react";
import { ReactFlowProvider } from '@xyflow/react';
import Layout from "@/components/layout/Layout";
import GraphView from "@/components/graph/GraphView";
import { useGraphData } from "@/hooks/useGraphData";

const GraphViewPage: React.FC = () => {
  const { nodes, links, isLoading } = useGraphData();
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    // Extract all unique tags from nodes
    if (nodes && nodes.length > 0) {
      const tagsSet = new Set<string>();
      nodes.forEach(node => {
        if (node.tags && Array.isArray(node.tags)) {
          node.tags.forEach(tag => tagsSet.add(tag));
        }
      });
      setAvailableTags(Array.from(tagsSet));
    }
  }, [nodes]);

  if (isLoading) {
    return (
      <Layout title="Граф связей">
        <div className="container mx-auto flex items-center justify-center h-64">
          <p className="text-lg">Загрузка данных графа...</p>
        </div>
      </Layout>
    );
  }

  // Prepare data for GraphView
  const graphData = {
    nodes,
    edges: links
  };

  return (
    <Layout title="Граф связей">
      <div className="container mx-auto">
        <ReactFlowProvider>
          <GraphView data={graphData} availableTags={availableTags} />
        </ReactFlowProvider>
      </div>
    </Layout>
  );
};

export default GraphViewPage;

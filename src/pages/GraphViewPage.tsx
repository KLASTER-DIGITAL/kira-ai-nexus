
import React, { useState, useEffect } from "react";
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

  // Convert data to the format expected by GraphView
  const graphData = {
    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: { x: Math.random() * 800, y: Math.random() * 600 }, // Default random positions
      data: {
        label: node.title,
        content: node.content,
        tags: node.tags || []
      }
    })),
    edges: links.map(link => ({
      id: link.id || `${link.source_id}-${link.target_id}`,
      source: link.source_id,
      target: link.target_id,
      type: link.type || 'default'
    }))
  };

  return (
    <Layout title="Граф связей">
      <div className="container mx-auto">
        <GraphView data={graphData} availableTags={availableTags} />
      </div>
    </Layout>
  );
};

export default GraphViewPage;

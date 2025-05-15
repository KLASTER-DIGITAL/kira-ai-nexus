
import { Node, Edge } from "@xyflow/react";
import { NodeBasicInfo, NodeLink } from "@/hooks/notes/links/types";

export function getRandomPosition() {
  return {
    x: Math.random() * 800,
    y: Math.random() * 600,
  };
}

export function getNodeType(node: NodeBasicInfo): string {
  switch (node.type) {
    case 'note': return 'noteNode';
    case 'task': return 'taskNode';
    case 'event': return 'eventNode';
    default: return 'noteNode';
  }
}

export function getLinkColor(type: string): string {
  switch (type) {
    case 'wikilink': return '#9d5cff';
    case 'tasklink': return '#00a3ff';
    case 'eventlink': return '#ff6b6b';
    case 'reference': return '#00d085';
    default: return '#888888';
  }
}

export function generateGraphElements(
  nodes: NodeBasicInfo[],
  links: NodeLink[],
  savedPositions: Record<string, {x: number, y: number}>
): { nodes: Node[], edges: Edge[] } {
  
  if (!nodes || !links) return { nodes: [], edges: [] };

  // Create nodes for React Flow
  const reactFlowNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    type: getNodeType(node),
    data: { node },
    position: savedPositions[node.id] || getRandomPosition(),
  }));

  // Create edges for React Flow
  const reactFlowEdges: Edge[] = links.map((link) => ({
    id: `e-${link.source_id}-${link.target_id}`,
    source: link.source_id,
    target: link.target_id,
    animated: true,
    style: {
      stroke: getLinkColor(link.type),
      strokeWidth: 2
    },
  }));

  return { 
    nodes: reactFlowNodes, 
    edges: reactFlowEdges 
  };
}

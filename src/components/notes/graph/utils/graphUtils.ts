
import { Node, Edge } from "@xyflow/react";
import { Note } from "@/types/notes";
import { LinksData } from "@/components/notes/graph/types";

export function getRandomPosition() {
  return {
    x: Math.random() * 800,
    y: Math.random() * 600,
  };
}

export function generateNodesAndEdges(
  notes: Note[] | undefined,
  links: LinksData[] | undefined,
  showIsolatedNodes: boolean
): { nodes: Node[], edges: Edge[] } {
  
  if (!notes || !links) return { nodes: [], edges: [] };

  const nodesMap = new Map<string, Note>(
    notes.map((note) => [note.id, note])
  );

  // Get connected nodes
  const connectedNodeIds = new Set<string>();
  if (links) {
    links.forEach(link => {
      if (nodesMap.has(link.sourceId)) connectedNodeIds.add(link.sourceId);
      if (nodesMap.has(link.targetId)) connectedNodeIds.add(link.targetId);
    });
  }

  // Create nodes for each note
  const nodes: Node[] = notes
    .filter(note => showIsolatedNodes || connectedNodeIds.has(note.id))
    .map((note) => ({
      id: note.id,
      type: "noteNode",
      data: { note },
      position: getRandomPosition(),
    }));

  // Create edges for each link
  const edges: Edge[] = [];
  
  if (links) {
    links.forEach((link) => {
      if (nodesMap.has(link.sourceId) && nodesMap.has(link.targetId)) {
        // Only create edges between nodes that exist in our filtered set
        const sourceIndex = nodes.findIndex((n) => n.id === link.sourceId);
        const targetIndex = nodes.findIndex((n) => n.id === link.targetId);
        
        if (sourceIndex >= 0 && targetIndex >= 0) {
          edges.push({
            id: `e-${link.sourceId}-${link.targetId}`,
            source: link.sourceId,
            target: link.targetId,
            animated: true,
            style: { stroke: "#9d5cff", strokeWidth: 2 },
          });
        }
      }
    });
  }

  return { nodes, edges };
}

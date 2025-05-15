
import { Edge, Node } from "@xyflow/react";
import { Note } from "@/types/notes";
import { Task } from "@/types/tasks";

export interface NodeLink {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export const generateNodesAndEdges = (
  notes: Note[],
  tasks: Task[],
  links: NodeLink[]
): GraphData => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Add note nodes
  notes.forEach(note => {
    nodes.push({
      id: note.id,
      data: { label: note.title, type: 'note', note },
      position: { x: Math.random() * 800, y: Math.random() * 600 },
      type: 'noteNode',
    });
  });
  
  // Add task nodes
  tasks.forEach(task => {
    nodes.push({
      id: task.id,
      data: { label: task.title, type: 'task', task },
      position: { x: Math.random() * 800, y: Math.random() * 600 },
      type: 'taskNode',
    });
  });
  
  // Add edges based on links
  links.forEach(link => {
    edges.push({
      id: link.id,
      source: link.source,
      target: link.target,
      type: 'default',
      animated: true,
    });
  });
  
  return { nodes, edges };
};

export const getNodeColor = (nodeType: string): string => {
  switch (nodeType) {
    case 'note':
      return '#9b87f5'; // purple
    case 'task':
      return '#10B981'; // green
    case 'event':
      return '#60A5FA'; // blue
    default:
      return '#6B7280'; // gray
  }
};

export const getNodeBorderColor = (nodeType: string): string => {
  switch (nodeType) {
    case 'note':
      return '#8b77e5'; // darker purple
    case 'task':
      return '#0AA971'; // darker green
    case 'event':
      return '#5095EA'; // darker blue
    default:
      return '#5B6270'; // darker gray
  }
};

export const filterNodesByType = (
  nodes: Node[],
  showNotes: boolean,
  showTasks: boolean,
  showEvents: boolean
): Node[] => {
  return nodes.filter(node => {
    const nodeType = node.data?.type;
    
    if (nodeType === 'note' && showNotes) return true;
    if (nodeType === 'task' && showTasks) return true;
    if (nodeType === 'event' && showEvents) return true;
    
    return false;
  });
};

export const filterNodesBySearch = (nodes: Node[], searchTerm: string): Node[] => {
  if (!searchTerm) return nodes;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  return nodes.filter(node => {
    const nodeLabel = node.data?.label?.toLowerCase();
    return nodeLabel && nodeLabel.includes(lowercaseSearch);
  });
};

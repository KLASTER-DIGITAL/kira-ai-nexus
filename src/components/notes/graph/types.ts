
import { Node } from '@xyflow/react';
import { Note } from '@/types/notes';

export interface LinksData {
  sourceId: string;
  targetId: string;
  id?: string;
  type?: string;
}

export interface NotesGraphProps {
  nodeId?: string;
  onNodeClick?: (nodeId: string) => void;
}

export interface GraphNode extends Node {
  id: string;
  type: string;
  data: {
    label: string;
    content?: string;
    tags?: string[];
  };
}

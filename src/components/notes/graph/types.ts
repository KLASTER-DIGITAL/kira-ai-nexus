
import { Note } from "@/types/notes";

export interface LinksData {
  sourceId: string;
  targetId: string;
}

export interface NotesGraphProps {
  nodeId?: string;
  onNodeClick?: (nodeId: string) => void;
}

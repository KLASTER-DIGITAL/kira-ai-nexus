
import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import NoteNode from "./NoteNode";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";
import { Note } from "@/types/notes";

const nodeTypes: NodeTypes = {
  noteNode: NoteNode,
};

interface LinksData {
  sourceId: string;
  targetId: string;
}

const NotesGraph: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { notes, isLoading: isLoadingNotes } = useNotes();
  const navigate = useNavigate();

  // Fetch links
  const { data: links, isLoading: isLoadingLinks } = useQuery({
    queryKey: ["note-links-graph"],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("links")
        .select("source_id, target_id")
        .eq("type", "wikilink");

      if (error) {
        throw error;
      }

      return data as LinksData[];
    },
    enabled: !!user,
  });

  const isLoading = isLoadingNotes || isLoadingLinks;

  // Generate nodes and edges for ReactFlow
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!notes || !links) return { initialNodes: [], initialEdges: [] };

    const nodesMap = new Map<string, Note>(
      notes.map((note) => [note.id, note])
    );

    // Create nodes for each note
    const nodes: Node[] = notes
      .filter(
        (note) =>
          !searchTerm ||
          note.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((note) => ({
        id: note.id,
        type: "noteNode",
        data: { note },
        position: getRandomPosition(), // Random position initially
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

    return { initialNodes: nodes, initialEdges: edges };
  }, [notes, links, searchTerm]);

  // Setup ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when data changes
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Handle node click to navigate to note
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      // Find the note and open it in the edit dialog
      const noteId = node.id;
      navigate(`/notes?note=${noteId}`);
    },
    [navigate]
  );

  function getRandomPosition() {
    return {
      x: Math.random() * 800,
      y: Math.random() * 600,
    };
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Загрузка графа заметок...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-150px)] w-full">
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск заметок в графе..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => navigate("/notes")}
          >
            <span>К заметкам</span>
          </Button>
        </div>
      </Card>

      <div className="h-full w-full rounded-md border bg-background">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-right"
        >
          <Background />
          <Controls />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default NotesGraph;


import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  NodeTypes,
  useReactFlow,
  ReactFlowProvider
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useNotes } from "@/hooks/useNotes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";
import GraphToolbar from "./components/GraphToolbar";
import GraphControls from "./components/GraphControls";
import NoteNode from "./NoteNode";
import { useGraphHotkeys } from "./hooks/useGraphHotkeys";
import { generateNodesAndEdges } from "./utils/graphUtils";
import { LinksData, NotesGraphProps } from "./types";

const nodeTypes: NodeTypes = {
  noteNode: NoteNode,
};

const NotesGraphContent: React.FC<NotesGraphProps> = ({ nodeId, onNodeClick: externalOnNodeClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showIsolatedNodes, setShowIsolatedNodes] = useState(true);
  const { user } = useAuth();
  const { notes, isLoading: isLoadingNotes } = useNotes();
  const navigate = useNavigate();
  const reactFlowInstance = useReactFlow();

  // Горячие клавиши для управления графом
  const hotKeyActions = useMemo(() => ({
    zoomIn: () => reactFlowInstance.zoomIn({ duration: 300 }),
    zoomOut: () => reactFlowInstance.zoomOut({ duration: 300 }),
    fitView: () => reactFlowInstance.fitView({ duration: 500 }),
    reset: () => {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setTimeout(() => reactFlowInstance.fitView({ duration: 500 }), 50);
    }
  }), [reactFlowInstance]);

  useGraphHotkeys(hotKeyActions);

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

      // Transform the data to match our interface
      return (data || []).map(link => ({
        sourceId: link.source_id,
        targetId: link.target_id
      })) as LinksData[];
    },
    enabled: !!user,
  });

  // Set up realtime subscriptions for graph updates
  useEffect(() => {
    if (!user) return;

    const linksChannel = supabase
      .channel('graph-links-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'links'
      }, () => {
        // Invalidate the query to refresh the graph data
        // Just refreshing the query will update our graph via reactivity
      })
      .subscribe();

    const notesChannel = supabase
      .channel('graph-notes-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'nodes',
        filter: "type=eq.note" 
      }, () => {
        // Invalidate the query to refresh the graph data
      })
      .subscribe();

    return () => {
      supabase.removeChannel(linksChannel);
      supabase.removeChannel(notesChannel);
    };
  }, [user]);

  const isLoading = isLoadingNotes || isLoadingLinks;

  // Extract all unique tags from notes
  const allTags = useMemo(() => {
    if (!notes) return [];
    const tagSet = new Set<string>();
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [notes]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (tag === "") {
      // Reset all tags when empty tag is passed
      setSelectedTags([]);
      return;
    }
    
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Filter notes by search term and tags
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    
    let filtered = notes;
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(lowerSearch) || 
        (note.content && note.content.toLowerCase().includes(lowerSearch))
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note => 
        note.tags && selectedTags.some(tag => note.tags.includes(tag))
      );
    }
    
    return filtered;
  }, [notes, searchTerm, selectedTags]);

  // Generate nodes and edges for ReactFlow
  const { initialNodes, initialEdges } = useMemo(() => {
    const { nodes, edges } = generateNodesAndEdges(filteredNotes, links, showIsolatedNodes);
    return { initialNodes: nodes, initialEdges: edges };
  }, [filteredNotes, links, showIsolatedNodes]);

  // Setup ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when data changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Handle node click to navigate to note
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      // Find the note and open it in the edit dialog
      const noteId = node.id;
      
      if (externalOnNodeClick) {
        externalOnNodeClick(noteId);
      } else {
        navigate(`/notes?note=${noteId}`);
      }
    },
    [navigate, externalOnNodeClick]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Загрузка графа заметок...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-150px)] w-full">
      <GraphToolbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        allTags={allTags}
        showIsolatedNodes={showIsolatedNodes}
        setShowIsolatedNodes={setShowIsolatedNodes}
      />

      <div className="h-full w-full rounded-md border bg-background relative">
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
          
          <GraphControls 
            onZoomIn={hotKeyActions.zoomIn}
            onZoomOut={hotKeyActions.zoomOut}
            onFitView={hotKeyActions.fitView}
            onReset={hotKeyActions.reset}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

// Wrapper component to provide ReactFlow context
const NotesGraph: React.FC<NotesGraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <NotesGraphContent {...props} />
    </ReactFlowProvider>
  );
};

export default NotesGraph;

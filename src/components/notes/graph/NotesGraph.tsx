
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
  Edge,
  NodeTypes,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import "reactflow/dist/style.css";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Search, ZoomIn, ZoomOut, Maximize2, ArrowLeft, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import NoteNode from "./NoteNode";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";
import { Note } from "@/types/notes";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const nodeTypes: NodeTypes = {
  noteNode: NoteNode,
};

interface LinksData {
  sourceId: string;
  targetId: string;
}

// Дополнительно добавим поддержку горячих клавиш для графа
const useHotkeys = (onActions: {
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  reset: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        if (event.key === '+' || event.key === '=') {
          event.preventDefault();
          onActions.zoomIn();
        } else if (event.key === '-') {
          event.preventDefault();
          onActions.zoomOut();
        } else if (event.key === '0') {
          event.preventDefault();
          onActions.fitView();
        } else if (event.key === 'r') {
          event.preventDefault();
          onActions.reset();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onActions]);
};

const NotesGraph: React.FC = () => {
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

  useHotkeys(hotKeyActions);

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
    if (!filteredNotes || !links) return { initialNodes: [], initialEdges: [] };

    const nodesMap = new Map<string, Note>(
      filteredNotes.map((note) => [note.id, note])
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
    const nodes: Node[] = filteredNotes
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
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[200px]">
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
            
            <Popover>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <Filter className="h-4 w-4 mr-1" />
                        <span>Фильтры</span>
                        {selectedTags.length > 0 && (
                          <Badge variant="secondary" className="ml-1">{selectedTags.length}</Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Фильтровать по тегам</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <PopoverContent className="w-[200px] p-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Фильтры графа</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="showIsolated" 
                        checked={showIsolatedNodes} 
                        onCheckedChange={(checked) => 
                          setShowIsolatedNodes(checked === true)
                        } 
                      />
                      <Label htmlFor="showIsolated">Показывать изолированные</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground">Теги</h5>
                    <div className="flex flex-wrap gap-1">
                      {allTags.map((tag) => (
                        <Badge 
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {selectedTags.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 h-7 text-xs"
                        onClick={() => setSelectedTags([])}
                      >
                        Сбросить фильтры
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => navigate("/notes")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>К заметкам</span>
            </Button>
          </div>
        </CardContent>
      </Card>

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
          
          <Panel position="top-right" className="bg-card shadow-sm rounded-md p-2">
            <div className="flex flex-col gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => hotKeyActions.zoomIn()}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Увеличить (Alt+Plus)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => hotKeyActions.zoomOut()}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Уменьшить (Alt+Minus)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => hotKeyActions.fitView()}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>По размеру экрана (Alt+0)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => hotKeyActions.reset()}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Сбросить (Alt+R)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default NotesGraph;

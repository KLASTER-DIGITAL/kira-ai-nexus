
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
import { Button } from "@/components/ui/button";
import { Search, ZoomIn, ZoomOut, Maximize2, ArrowLeft, RotateCcw, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useGraphData } from "@/hooks/useGraphData";
import { useGraphSettings } from "@/hooks/useGraphSettings";
import { NodeBasicInfo, NodeShape } from "@/hooks/notes/links/types";
import NoteNode from "../notes/graph/NoteNode";
import TaskNode from "./nodes/TaskNode";
import EventNode from "./nodes/EventNode";

const nodeTypes: NodeTypes = {
  noteNode: NoteNode,
  taskNode: TaskNode,
  eventNode: EventNode,
};

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

interface GraphViewProps {
  nodeId?: string; // If provided, will show a local graph around this node
  onNodeClick?: (nodeId: string, nodeType: string) => void;
}

const GraphView: React.FC<GraphViewProps> = ({ nodeId, onNodeClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();
  const reactFlowInstance = useReactFlow();
  const { settings, toggleNodeTypeVisibility, toggleIsolatedNodes, savedPositions, resetPositions } = useGraphSettings(nodeId);

  // Calculate which node types to show based on settings
  const nodeTypesToShow = useMemo(() => {
    const types: string[] = [];
    if (settings.showNotes) types.push("note");
    if (settings.showTasks) types.push("task");
    if (settings.showEvents) types.push("event");
    return types;
  }, [settings.showNotes, settings.showTasks, settings.showEvents]);

  // Create filters object for data fetching
  const filters = useMemo(() => ({
    nodeTypes: nodeTypesToShow,
    searchTerm,
    tags: selectedTags,
    showIsolatedNodes: settings.showIsolatedNodes
  }), [nodeTypesToShow, searchTerm, selectedTags, settings.showIsolatedNodes]);

  // Fetch graph data
  const { nodes: graphNodes, links: graphLinks, isLoading } = useGraphData(filters);
  
  // If nodeId is provided, filter data for local graph
  const { filteredNodes, filteredLinks } = useMemo(() => {
    if (!nodeId || !graphNodes || !graphLinks) {
      return { filteredNodes: graphNodes || [], filteredLinks: graphLinks || [] };
    }
    
    // Find direct connections (depth 1)
    const connectedNodeIds = new Set<string>([nodeId]);
    graphLinks.forEach(link => {
      if (link.source_id === nodeId) connectedNodeIds.add(link.target_id);
      if (link.target_id === nodeId) connectedNodeIds.add(link.source_id);
    });

    const relevantLinks = graphLinks.filter(
      link => connectedNodeIds.has(link.source_id) && connectedNodeIds.has(link.target_id)
    );
    
    const relevantNodes = graphNodes.filter(node => connectedNodeIds.has(node.id));
    
    return {
      filteredNodes: relevantNodes,
      filteredLinks: relevantLinks
    };
  }, [nodeId, graphNodes, graphLinks]);

  // Горячие клавиши для управления графом
  const hotKeyActions = useMemo(() => ({
    zoomIn: () => reactFlowInstance.zoomIn({ duration: 300 }),
    zoomOut: () => reactFlowInstance.zoomOut({ duration: 300 }),
    fitView: () => reactFlowInstance.fitView({ duration: 500 }),
    reset: () => {
      setNodes(initialNodes);
      setEdges(initialEdges);
      resetPositions();
      setTimeout(() => reactFlowInstance.fitView({ duration: 500 }), 50);
    }
  }), [reactFlowInstance, resetPositions]);

  useHotkeys(hotKeyActions);
  
  // Extract all unique tags from nodes
  const allTags = useMemo(() => {
    if (!graphNodes) return [];
    const tagSet = new Set<string>();
    graphNodes.forEach(node => {
      if (node.tags) {
        node.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  }, [graphNodes]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Map node types to shapes and colors
  const getNodeType = (node: NodeBasicInfo): string => {
    switch (node.type) {
      case 'note': return 'noteNode';
      case 'task': return 'taskNode';
      case 'event': return 'eventNode';
      default: return 'noteNode';
    }
  };

  // Generate nodes and edges for ReactFlow
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!filteredNodes || !filteredLinks) return { initialNodes: [], initialEdges: [] };

    // Create nodes for each filtered node
    const nodes: Node[] = filteredNodes.map((node) => ({
      id: node.id,
      type: getNodeType(node),
      data: { node },
      position: savedPositions[node.id] || getRandomPosition(),
    }));

    // Create edges for each link
    const edges: Edge[] = filteredLinks.map((link) => ({
      id: `e-${link.source_id}-${link.target_id}`,
      source: link.source_id,
      target: link.target_id,
      animated: true,
      style: {
        stroke: getLinkColor(link.type),
        strokeWidth: 2
      },
    }));

    return { initialNodes: nodes, initialEdges: edges };
  }, [filteredNodes, filteredLinks, savedPositions]);

  // Setup ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when data changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Handle node click to navigate to appropriate page
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const nodeId = node.id;
      const nodeType = node.data.node.type;
      
      if (onNodeClick) {
        onNodeClick(nodeId, nodeType);
        return;
      }
      
      // Navigate based on node type
      switch (nodeType) {
        case 'note':
          navigate(`/notes?note=${nodeId}`);
          break;
        case 'task':
          navigate(`/tasks?task=${nodeId}`);
          break;
        case 'event':
          navigate(`/calendar?event=${nodeId}`);
          break;
        default:
          navigate(`/notes?note=${nodeId}`);
      }
    },
    [navigate, onNodeClick]
  );

  function getRandomPosition() {
    return {
      x: Math.random() * 800,
      y: Math.random() * 600,
    };
  }
  
  function getLinkColor(type: string): string {
    switch (type) {
      case 'wikilink': return '#9d5cff';
      case 'tasklink': return '#00a3ff';
      case 'eventlink': return '#ff6b6b';
      case 'reference': return '#00d085';
      default: return '#888888';
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Загрузка графа связей...</p>
      </div>
    );
  }

  return (
    <div className={nodeId ? "h-[400px] w-full" : "h-[calc(100vh-150px)] w-full"}>
      <Card className="p-4 mb-4">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск в графе..."
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
                        {(selectedTags.length > 0 || !settings.showIsolatedNodes || !settings.showNotes || !settings.showTasks || !settings.showEvents) && (
                          <Badge variant="secondary" className="ml-1">!</Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Фильтровать граф</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <PopoverContent className="w-[280px] p-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Фильтры графа</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="showNotes" 
                        checked={settings.showNotes} 
                        onCheckedChange={() => toggleNodeTypeVisibility('notes')} 
                      />
                      <Label htmlFor="showNotes">Показывать заметки</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="showTasks" 
                        checked={settings.showTasks} 
                        onCheckedChange={() => toggleNodeTypeVisibility('tasks')} 
                      />
                      <Label htmlFor="showTasks">Показывать задачи</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="showEvents" 
                        checked={settings.showEvents} 
                        onCheckedChange={() => toggleNodeTypeVisibility('events')} 
                      />
                      <Label htmlFor="showEvents">Показывать события</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="showIsolated" 
                        checked={settings.showIsolatedNodes} 
                        onCheckedChange={() => toggleIsolatedNodes()} 
                      />
                      <Label htmlFor="showIsolated">Показывать изолированные узлы</Label>
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
                        Сбросить фильтры по тегам
                      </Button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {!nodeId && (
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => navigate("/notes")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>К заметкам</span>
              </Button>
            )}
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
          onNodeClick={handleNodeClick}
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

export default GraphView;

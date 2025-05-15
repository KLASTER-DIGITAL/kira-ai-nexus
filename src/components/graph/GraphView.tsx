
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
  NodeTypes,
  useReactFlow,
} from "@xyflow/react";
import "reactflow/dist/style.css";

// Components
import GraphToolbar from "./components/GraphToolbar";
import GraphControlPanel from "./components/GraphControlPanel";
import NoteNode from "../notes/graph/NoteNode";
import TaskNode from "./nodes/TaskNode";
import EventNode from "./nodes/EventNode";

// Hooks
import { useGraphData } from "@/hooks/useGraphData";
import { useGraphSettings } from "@/hooks/useGraphSettings";
import { useGraphHotkeys } from "./hooks/useGraphHotkeys";

// Utils
import { generateGraphElements } from "./utils/graphUtils";

// Define node types for the graph
const nodeTypes: NodeTypes = {
  noteNode: NoteNode,
  taskNode: TaskNode,
  eventNode: EventNode,
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

  // Define hot key actions
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

  // Set up keyboard shortcuts
  useGraphHotkeys(hotKeyActions);

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
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
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

  // Generate nodes and edges for ReactFlow
  const { initialNodes, initialEdges } = useMemo(() => {
    return generateGraphElements(filteredNodes, filteredLinks, savedPositions);
  }, [filteredNodes, filteredLinks, savedPositions]);

  // Setup ReactFlow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Загрузка графа связей...</p>
      </div>
    );
  }

  return (
    <div className={nodeId ? "h-[400px] w-full" : "h-[calc(100vh-150px)] w-full"}>
      <GraphToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        allTags={allTags}
        settings={settings}
        toggleNodeTypeVisibility={toggleNodeTypeVisibility}
        toggleIsolatedNodes={toggleIsolatedNodes}
        setSelectedTags={setSelectedTags}
        nodeId={nodeId}
      />

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
          
          <GraphControlPanel
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

export default GraphView;

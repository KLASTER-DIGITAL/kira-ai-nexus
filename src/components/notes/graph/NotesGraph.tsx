import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  Panel,
  Background,
  BackgroundVariant,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NoteNode from './NoteNode';
import { Note } from '@/types/notes';
import { graphLayout } from './utils/graphUtils';
import GraphFilterPopover from './components/GraphFilterPopover';
import GraphSearchBar from './components/GraphSearchBar';
import GraphControls from './components/GraphControls';
import GraphToolbar from './components/GraphToolbar';
import { useGraphHotkeys } from './hooks/useGraphHotkeys';

// Получение контента для поиска
const getNoteSearchContent = (note: Note): string => {
  let textContent = '';
  
  if (typeof note.content === 'object') {
    textContent = note.content.text || '';
  } else if (typeof note.content === 'string') {
    textContent = note.content;
  }
  
  return textContent;
};

interface NotesGraphProps {
  nodeId?: string;
  onNodeClick?: (nodeId: string) => void;
}

const NotesGraph: React.FC<NotesGraphProps> = ({ nodeId, onNodeClick }) => {
  const { disableHotkeys } = useGraphHotkeys();
  const [isLayouting, setIsLayouting] = useState(false);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [notesData, setNotesData] = useState<Note[]>([]);
  const [linksData, setLinksData] = useState<Edge[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const reactFlowInstance = useReactFlow();

  // Load graph data from local storage on mount
  useEffect(() => {
    const storedNotes = localStorage.getItem('graphNotes');
    const storedLinks = localStorage.getItem('graphLinks');
    const storedTags = localStorage.getItem('graphTags');
    
    if (storedNotes) setNotesData(JSON.parse(storedNotes));
    if (storedLinks) setLinksData(JSON.parse(storedLinks));
    if (storedTags) setAllTags(JSON.parse(storedTags));
  }, []);

  // Save graph data to local storage on changes
  useEffect(() => {
    localStorage.setItem('graphNotes', JSON.stringify(notesData));
    localStorage.setItem('graphLinks', JSON.stringify(linksData));
    localStorage.setItem('graphTags', JSON.stringify(allTags));
  }, [notesData, linksData, allTags]);

  // Load initial data if nodeId is provided
  useEffect(() => {
    if (!nodeId) return;
    
    const fetchInitialData = async () => {
      try {
        const notesResponse = await fetch(`/api/graph/nodes?nodeId=${nodeId}`);
        const notesData = await notesResponse.json();
        setNotesData(notesData);
        
        const linksResponse = await fetch(`/api/graph/links?nodeId=${nodeId}`);
        const linksData = await linksResponse.json();
        setLinksData(linksData);
        
        // Extract all unique tags from nodes
        if (notesData && notesData.length > 0) {
          const tagsSet = new Set<string>();
          notesData.forEach(node => {
            if (node.tags && Array.isArray(node.tags)) {
              node.tags.forEach(tag => tagsSet.add(tag));
            }
          });
          setAllTags(Array.from(tagsSet));
        }
      } catch (error) {
        console.error("Failed to fetch initial graph data:", error);
      }
    };
    
    fetchInitialData();
  }, [nodeId]);

  // Set up the flow data
  const setupFlowData = useCallback((notes: Note[], links: Edge[]) => {
    // Create nodes from notes
    const noteNodes: Node[] = notes.map((note) => {
      // Extract tags for filtering
      const tags = note.tags || [];
      
      // Apply tag filtering if any tags are selected
      if (selectedTags.length > 0 && !tags.some(tag => selectedTags.includes(tag))) {
        return null; // Skip this note if it doesn't have any of the selected tags
      }
      
      // Apply search filtering
      if (searchQuery) {
        const noteTitle = note.title.toLowerCase();
        const noteContent = getNoteSearchContent(note);
        const searchLower = searchQuery.toLowerCase();
        
        // Skip if neither title nor content match the search
        if (!noteTitle.includes(searchLower) && !noteContent.toLowerCase().includes(searchLower)) {
          return null;
        }
      }
      
      return {
        id: note.id,
        type: 'noteNode',
        position: { x: 0, y: 0 }, // Will be calculated by layout algorithm
        data: { note }
      };
    }).filter(Boolean) as Node[];
    
    // Filter edges to only include visible nodes
    const visibleNodeIds = noteNodes.map(node => node.id);
    const visibleEdges = links.filter(
      edge => visibleNodeIds.includes(edge.source) && visibleNodeIds.includes(edge.target)
    );
    
    // Apply layout algorithm
    const { nodes: layoutedNodes, edges: layoutedEdges } = graphLayout(noteNodes, visibleEdges);
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [selectedTags, searchQuery, setNodes, setEdges]);

  // Effect to set up flow data when notes or links change
  useEffect(() => {
    if (notesData && linksData) {
      setupFlowData(notesData, linksData);
    }
  }, [notesData, linksData, setupFlowData]);

  // Tag filtering
  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedTags([]);
    setSearchQuery('');
  }, []);

  // Graph view centering
  const centerGraph = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.setCenter(center.x, center.y, { zoom });
    }
  }, [reactFlowInstance, center, zoom]);

  // Reset view
  const resetView = useCallback(() => {
    setZoom(1);
    setCenter({ x: 0, y: 0 });
    centerGraph();
  }, [centerGraph]);

  // Apply layout
  const applyLayout = useCallback(() => {
    if (notesData && linksData) {
      setIsLayouting(true);
      setupFlowData(notesData, linksData);
      setIsLayouting(false);
    }
  }, [notesData, linksData, setupFlowData]);

  const nodeTypes = { noteNode: NoteNode };

  return (
    <div className="w-full h-full">
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick && onNodeClick(node.id)}
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Panel position="top-left">
          <GraphSearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            clearSearch={() => setSearchQuery('')}
          />
        </Panel>
        
        <Panel position="top-right">
          <GraphFilterPopover 
            tags={allTags}
            selectedTags={selectedTags}
            onSelectTag={toggleTag}
            onClearFilters={clearFilters}
          />
        </Panel>
        
        <Panel position="bottom-center">
          <GraphToolbar
            onCenterGraph={centerGraph}
            onResetView={resetView}
            onLayoutGraph={applyLayout}
          />
        </Panel>
        
        <Panel position="bottom-right">
          <GraphControls />
        </Panel>
        
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={12} 
          size={1} 
          color="#88888833" 
        />
      </ReactFlow>
    </div>
  );
};

export default NotesGraph;

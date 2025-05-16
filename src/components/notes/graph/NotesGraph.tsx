
import React, { useCallback, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Controls, MiniMap, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraphData } from '@/hooks/useGraphData';
import { useGraphFiltering } from './hooks/useGraphFiltering';
import NoteNode from './NoteNode';
import GraphToolbar from './components/GraphToolbar';

const nodeTypes = {
  noteNode: NoteNode,
};

export interface NotesGraphProps {
  onNodeClick: (nodeId: string) => void;
  nodeId?: string; // Добавлен опциональный параметр для использования в LocalGraphView
}

export const NotesGraph: React.FC<NotesGraphProps> = ({ onNodeClick, nodeId }) => {
  const { graphData, isLoading } = useGraphData();
  
  // Используем хук для фильтрации данных
  const {
    selectedTags,
    searchQuery,
    showIsolatedNodes,
    setSelectedTags,
    setSearchQuery,
    setShowIsolatedNodes,
    toggleTag,
    clearFilters,
    hasFilters
  } = useGraphFiltering();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Обрабатываем данные графа, когда они загружены
  React.useEffect(() => {
    if (graphData && !isLoading) {
      // Если nodeId указан, значит мы в режиме локального графа для конкретной заметки
      // Иначе показываем полный граф
      const filteredData = nodeId 
        ? filterDataForNode(graphData, nodeId, searchQuery, selectedTags, showIsolatedNodes)
        : filterAllData(graphData, searchQuery, selectedTags, showIsolatedNodes);
        
      setNodes(filteredData.nodes || []);
      setEdges(filteredData.edges || []);
    }
  }, [graphData, isLoading, searchQuery, selectedTags, showIsolatedNodes, nodeId]);

  // Функция для фильтрации данных для одной заметки и её связей
  const filterDataForNode = (data, nodeId, searchQuery, tags, showIsolated) => {
    // Упрощённая логика для демонстрации
    // В реальном приложении здесь была бы более сложная логика фильтрации
    const centralNode = data?.nodes?.find(n => n.id === nodeId);
    const connectedLinks = data?.links?.filter(l => 
      l.source === nodeId || l.target === nodeId
    );
    
    const connectedNodeIds = new Set([nodeId]);
    connectedLinks?.forEach(link => {
      connectedNodeIds.add(link.source);
      connectedNodeIds.add(link.target);
    });
    
    const filteredNodes = data?.nodes?.filter(node => connectedNodeIds.has(node.id));
    
    return {
      nodes: formatNodes(filteredNodes || []),
      edges: formatEdges(connectedLinks || [])
    };
  };

  // Функция для фильтрации всех данных графа
  const filterAllData = (data, searchQuery, tags, showIsolated) => {
    // Здесь будет логика фильтрации полного графа
    // В данном примере просто форматируем данные для отображения
    return {
      nodes: formatNodes(data?.nodes || []),
      edges: formatEdges(data?.links || [])
    };
  };

  // Форматирование узлов для ReactFlow
  const formatNodes = (nodes) => {
    return nodes.map(node => ({
      id: node.id,
      type: 'noteNode',
      position: { x: Math.random() * 500, y: Math.random() * 500 }, // В реальном приложении использовали бы алгоритм расположения
      data: { note: node }
    }));
  };

  // Форматирование связей для ReactFlow
  const formatEdges = (links) => {
    return links.map(link => ({
      id: `e-${link.source || link.source_id}-${link.target || link.target_id}`,
      source: link.source || link.source_id,
      target: link.target || link.target_id,
      animated: false,
      style: { stroke: "#9d5cff", strokeWidth: 2 },
    }));
  };

  // Обработка клика по узлу
  const handleNodeClick = useCallback(
    (event, node) => {
      onNodeClick(node.id);
    },
    [onNodeClick]
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-primary rounded-full" aria-hidden="true"></div>
          <p className="mt-2 text-sm text-muted-foreground">Загрузка графа заметок...</p>
        </div>
      </div>
    );
  }

  // Получаем все уникальные теги из данных
  const allTags = Array.from(new Set(graphData?.nodes?.flatMap(node => node.tags || []) || []));

  return (
    <div className="h-full relative">
      {!nodeId && (
        <div className="absolute top-2 left-2 right-2 z-10">
          <GraphToolbar
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            allTags={allTags}
            showIsolatedNodes={showIsolatedNodes}
            setShowIsolatedNodes={setShowIsolatedNodes}
            hasFilters={hasFilters}
            clearFilters={clearFilters}
          />
        </div>
      )}
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default NotesGraph;

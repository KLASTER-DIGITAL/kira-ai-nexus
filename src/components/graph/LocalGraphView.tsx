
import React, { useCallback, useState, useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import NotesGraph from '@/components/notes/graph/NotesGraph';
import { useNoteLinks } from '@/hooks/notes/links/useNoteLinks';

interface LocalGraphViewProps {
  nodeId: string;
  onNodeClick?: (nodeId: string, nodeType?: string) => void;
}

const LocalGraphView: React.FC<LocalGraphViewProps> = ({ nodeId, onNodeClick }) => {
  const [isGraphReady, setIsGraphReady] = useState(false);
  const { links, isLoading } = useNoteLinks(nodeId);
  
  useEffect(() => {
    if (!isLoading && links) {
      setIsGraphReady(true);
    }
  }, [isLoading, links]);

  const handleNodeClick = useCallback((clickedNodeId: string) => {
    console.log("Выбрана заметка в графе:", clickedNodeId);
    if (onNodeClick) {
      onNodeClick(clickedNodeId);
    }
  }, [onNodeClick]);

  if (isLoading) {
    return (
      <Card className="h-[300px] relative flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка графа связей...</p>
      </Card>
    );
  }

  if (!isGraphReady || !links || (links.incomingLinks.length === 0 && links.outgoingLinks.length === 0)) {
    return (
      <Card className="h-[300px] relative flex items-center justify-center">
        <p className="text-muted-foreground">У этой заметки пока нет связей</p>
      </Card>
    );
  }

  return (
    <Card className="h-[300px] relative mt-4">
      <div className="absolute inset-0">
        <ReactFlowProvider>
          <NotesGraph 
            nodeId={nodeId} 
            onNodeClick={handleNodeClick}
          />
        </ReactFlowProvider>
      </div>
    </Card>
  );
};

export default LocalGraphView;

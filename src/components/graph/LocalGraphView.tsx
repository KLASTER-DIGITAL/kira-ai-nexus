
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import NotesGraph from '@/components/notes/graph/NotesGraph';

interface LocalGraphViewProps {
  nodeId: string;
  onNodeClick?: (nodeId: string, nodeType?: string) => void;
}

const LocalGraphView: React.FC<LocalGraphViewProps> = ({ nodeId, onNodeClick }) => {
  const handleNodeClick = useCallback((clickedNodeId: string) => {
    if (onNodeClick) {
      onNodeClick(clickedNodeId);
    }
  }, [onNodeClick]);

  return (
    <Card className="h-[400px] relative">
      <div className="absolute inset-0">
        <NotesGraph 
          nodeId={nodeId} 
          onNodeClick={handleNodeClick}
        />
      </div>
    </Card>
  );
};

export default LocalGraphView;

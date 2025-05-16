
import React from 'react';
import { useReactFlow } from '@xyflow/react';
import GraphControls from './GraphControls';

interface GraphControlsWrapperProps {
  onReset: () => void;
}

const GraphControlsWrapper: React.FC<GraphControlsWrapperProps> = ({ onReset }) => {
  const reactFlowInstance = useReactFlow();
  
  return (
    <GraphControls 
      onZoomIn={() => reactFlowInstance.zoomIn()}
      onZoomOut={() => reactFlowInstance.zoomOut()}
      onFitView={() => reactFlowInstance.fitView()}
      onReset={onReset}
    />
  );
};

export default GraphControlsWrapper;

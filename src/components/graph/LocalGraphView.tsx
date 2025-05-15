
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GraphView from "./GraphView";

interface LocalGraphViewProps {
  nodeId: string;
  title?: string;
  onNodeClick?: (nodeId: string, nodeType: string) => void;
}

const LocalGraphView: React.FC<LocalGraphViewProps> = ({ 
  nodeId, 
  title = "Связи", 
  onNodeClick 
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <GraphView nodeId={nodeId} onNodeClick={onNodeClick} />
      </CardContent>
    </Card>
  );
};

export default LocalGraphView;

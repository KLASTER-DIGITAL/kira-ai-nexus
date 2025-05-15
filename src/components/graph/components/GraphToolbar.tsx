
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import GraphSearchInput from "./GraphSearchInput";
import { GraphFilterPanel } from "./GraphFilterPanel";

interface GraphToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allTags: string[];
  settings: {
    showNotes: boolean;
    showTasks: boolean;
    showEvents: boolean;
    showIsolatedNodes: boolean;
  };
  toggleNodeTypeVisibility: (type: 'notes' | 'tasks' | 'events') => void;
  toggleIsolatedNodes: () => void;
  setSelectedTags: (tags: string[]) => void;
  nodeId?: string;
}

const GraphToolbar: React.FC<GraphToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedTags,
  toggleTag,
  allTags,
  settings,
  toggleNodeTypeVisibility,
  toggleIsolatedNodes,
  setSelectedTags,
  nodeId,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="p-4 mb-4">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center gap-2">
          <GraphSearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <GraphFilterPanel 
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            allTags={allTags}
            settings={settings}
            toggleNodeTypeVisibility={toggleNodeTypeVisibility}
            toggleIsolatedNodes={toggleIsolatedNodes}
          />
          
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
  );
};

export default GraphToolbar;

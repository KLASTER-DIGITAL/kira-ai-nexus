
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import GraphSearchBar from "./GraphSearchBar";
import GraphFilterPopover from "./GraphFilterPopover";

interface GraphToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allTags: string[];
  showIsolatedNodes: boolean;
  setShowIsolatedNodes: (value: boolean) => void;
}

const GraphToolbar: React.FC<GraphToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedTags,
  toggleTag,
  allTags,
  showIsolatedNodes,
  setShowIsolatedNodes,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="p-4 mb-4">
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center gap-2">
          <GraphSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          
          <GraphFilterPopover 
            selectedTags={selectedTags}
            toggleTag={toggleTag}
            allTags={allTags}
            showIsolatedNodes={showIsolatedNodes}
            setShowIsolatedNodes={setShowIsolatedNodes}
          />
          
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
  );
};

export default GraphToolbar;

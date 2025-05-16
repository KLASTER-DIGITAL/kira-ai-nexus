
import React from 'react';
import GraphSearchBar from './GraphSearchBar';
import GraphFilterPopover from './GraphFilterPopover';
import GraphToolbar from './GraphToolbar';

interface GraphFilteringControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allTags: string[];
  showIsolatedNodes: boolean;
  setShowIsolatedNodes: (show: boolean) => void;
  clearFilters: () => void;
}

const GraphFilteringControls: React.FC<GraphFilteringControlsProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTags,
  toggleTag,
  allTags,
  showIsolatedNodes,
  setShowIsolatedNodes,
  clearFilters,
}) => {
  return (
    <>
      <GraphSearchBar searchTerm={searchQuery} setSearchTerm={setSearchQuery} />
      
      <GraphFilterPopover 
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        allTags={allTags}
        showIsolatedNodes={showIsolatedNodes}
        setShowIsolatedNodes={setShowIsolatedNodes}
      />
      
      <GraphToolbar 
        searchTerm={searchQuery}
        setSearchTerm={setSearchQuery}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        allTags={allTags}
        showIsolatedNodes={showIsolatedNodes}
        setShowIsolatedNodes={setShowIsolatedNodes}
      />
    </>
  );
};

export default GraphFilteringControls;

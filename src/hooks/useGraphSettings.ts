
import { useState, useEffect } from "react";
import { GraphViewSettings } from "@/hooks/notes/links/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth";

const DEFAULT_SETTINGS: GraphViewSettings = {
  showNotes: true,
  showTasks: true,
  showEvents: true,
  showIsolatedNodes: true,
  selectedTags: [],
  layout: 'force',
  savedPositions: {}
};

export const useGraphSettings = (nodeId?: string) => {
  const { user } = useAuth();
  const [isLocalGraph, setIsLocalGraph] = useState(!!nodeId);
  
  // Use local storage for settings persistence between sessions
  const [settings, setSettings] = useLocalStorage<GraphViewSettings>(
    "graph-view-settings",
    DEFAULT_SETTINGS
  );

  // State for node positions that can be saved
  const [savedPositions, setSavedPositions] = useState<Record<string, {x: number, y: number}>>(
    settings.savedPositions || {}
  );

  // Update saved positions in settings when they change
  useEffect(() => {
    if (Object.keys(savedPositions).length > 0) {
      setSettings({
        ...settings,
        savedPositions
      });
    }
  }, [savedPositions]);

  // Save node position
  const saveNodePosition = (nodeId: string, position: {x: number, y: number}) => {
    setSavedPositions(prev => ({
      ...prev,
      [nodeId]: position
    }));
  };

  // Reset all saved positions
  const resetPositions = () => {
    setSavedPositions({});
  };

  // Toggle visibility for different node types
  const toggleNodeTypeVisibility = (type: 'notes' | 'tasks' | 'events') => {
    setSettings((prev: GraphViewSettings) => ({
      ...prev,
      [`show${type.charAt(0).toUpperCase() + type.slice(1)}`]: !prev[`show${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof GraphViewSettings]
    }));
  };

  // Toggle showing isolated nodes
  const toggleIsolatedNodes = () => {
    setSettings((prev: GraphViewSettings) => ({
      ...prev,
      showIsolatedNodes: !prev.showIsolatedNodes
    }));
  };

  // Update selected tags
  const updateSelectedTags = (tags: string[]) => {
    setSettings((prev: GraphViewSettings) => ({
      ...prev,
      selectedTags: tags
    }));
  };

  // Toggle between global and local graph view
  const toggleGraphMode = () => {
    setIsLocalGraph(prev => !prev);
  };

  // Change graph layout type
  const changeLayout = (layout: 'force' | 'radial' | 'hierarchical') => {
    setSettings((prev: GraphViewSettings) => ({
      ...prev,
      layout
    }));
  };

  return {
    settings,
    isLocalGraph,
    savedPositions,
    saveNodePosition,
    resetPositions,
    toggleNodeTypeVisibility,
    toggleIsolatedNodes,
    updateSelectedTags,
    toggleGraphMode,
    changeLayout
  };
};

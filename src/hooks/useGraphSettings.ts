
import { useState, useEffect } from 'react';
import { useLocalStorage } from './use-local-storage';

export type LayoutType = "force" | "radial" | "hierarchical";

export interface NodePosition {
  x: number;
  y: number;
}

export interface GraphViewSettings {
  showNotes: boolean;
  showTasks: boolean;
  showEvents: boolean;
  showIsolatedNodes: boolean;
  selectedTags: string[];
  layout: LayoutType;
  savedPositions: Record<string, NodePosition>;
}

const DEFAULT_SETTINGS: GraphViewSettings = {
  showNotes: true,
  showTasks: true,
  showEvents: true,
  showIsolatedNodes: false,
  selectedTags: [],
  layout: 'force',
  savedPositions: {},
};

export function useGraphSettings() {
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useLocalStorage<GraphViewSettings>(
    'graph-view-settings',
    DEFAULT_SETTINGS
  );

  // Local state for current view settings that mirrors the persisted settings
  const [viewSettings, setViewSettings] = useState<GraphViewSettings>(settings);

  // Update local state when persisted settings change
  useEffect(() => {
    setViewSettings(settings);
  }, [settings]);

  // Save node positions
  const saveNodePositions = (positions: Record<string, NodePosition>) => {
    setSettings({
      ...settings,
      savedPositions: {
        ...settings.savedPositions,
        ...positions,
      },
    });
  };

  // Toggle node type visibility
  const toggleNotesVisibility = () => {
    setSettings({
      ...settings,
      showNotes: !settings.showNotes,
    });
  };

  const toggleTasksVisibility = () => {
    setSettings({
      ...settings,
      showTasks: !settings.showTasks,
    });
  };

  const toggleEventsVisibility = () => {
    setSettings({
      ...settings,
      showEvents: !settings.showEvents,
    });
  };

  const toggleIsolatedNodesVisibility = () => {
    setSettings({
      ...settings,
      showIsolatedNodes: !settings.showIsolatedNodes,
    });
  };

  // Update selected tags
  const updateSelectedTags = (tags: string[]) => {
    setSettings({
      ...settings,
      selectedTags: tags,
    });
  };

  // Change layout type
  const changeLayout = (layout: LayoutType) => {
    setSettings({
      ...settings,
      layout,
    });
  };

  return {
    settings: viewSettings,
    saveNodePositions,
    toggleNotesVisibility,
    toggleTasksVisibility,
    toggleEventsVisibility,
    toggleIsolatedNodesVisibility,
    updateSelectedTags,
    changeLayout,
  };
}

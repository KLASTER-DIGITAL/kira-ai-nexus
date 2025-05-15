
import { useHotkeys } from 'react-hotkeys-hook';

export interface HotKeyActions {
  zoomIn?: () => void;
  zoomOut?: () => void;
  fitView?: () => void;
  reset?: () => void;
  search?: () => void;
}

export function useGraphHotkeys(actions: HotKeyActions) {
  // Zoom In: + or =
  useHotkeys(['+=', 'ctrl+=', 'meta+='], (e) => {
    e.preventDefault();
    actions.zoomIn?.();
  });

  // Zoom Out: -
  useHotkeys(['-', 'ctrl+-', 'meta+-'], (e) => {
    e.preventDefault();
    actions.zoomOut?.();
  });

  // Fit View: f
  useHotkeys(['f'], (e) => {
    e.preventDefault();
    actions.fitView?.();
  });

  // Reset: r
  useHotkeys(['r'], (e) => {
    e.preventDefault();
    actions.reset?.();
  });

  // Search: ctrl+f / cmd+f
  useHotkeys(['ctrl+f', 'meta+f'], (e) => {
    e.preventDefault();
    actions.search?.();
  });

  return null;
}


import { useEffect } from "react";

export interface HotKeyActions {
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  reset: () => void;
}

export const useGraphHotkeys = (onActions: HotKeyActions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        if (event.key === '+' || event.key === '=') {
          event.preventDefault();
          onActions.zoomIn();
        } else if (event.key === '-') {
          event.preventDefault();
          onActions.zoomOut();
        } else if (event.key === '0') {
          event.preventDefault();
          onActions.fitView();
        } else if (event.key === 'r') {
          event.preventDefault();
          onActions.reset();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onActions]);
};

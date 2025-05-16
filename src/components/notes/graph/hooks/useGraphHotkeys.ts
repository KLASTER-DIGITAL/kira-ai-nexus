
import { useEffect } from "react";

export interface HotKeyActions {
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  reset: () => void;
}

// Export as a named export for consistency
export const useGraphHotkeys = (actions: HotKeyActions): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        if (event.key === '+' || event.key === '=') {
          event.preventDefault();
          actions.zoomIn();
        } else if (event.key === '-') {
          event.preventDefault();
          actions.zoomOut();
        } else if (event.key === '0') {
          event.preventDefault();
          actions.fitView();
        } else if (event.key === 'r') {
          event.preventDefault();
          actions.reset();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [actions]);
};

// Also provide a default export for backward compatibility
export default useGraphHotkeys;

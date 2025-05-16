
import { useEffect } from "react";

interface HotKeyActions {
  zoomIn: () => void;
  zoomOut: () => void;
  fitView: () => void;
  reset: () => void;
}

// Changed to use a default export
const useGraphHotkeys = (actions: HotKeyActions): void => {
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

export default useGraphHotkeys;

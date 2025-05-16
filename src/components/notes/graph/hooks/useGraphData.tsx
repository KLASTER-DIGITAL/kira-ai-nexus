
import { useCallback } from 'react';
import { LayoutType } from '@/hooks/useGraphSettings';
import { useGraphDataFiltering } from './useGraphDataFiltering';
import { useLocalGraphData } from './useLocalGraphData';

export const useGraphData = () => {
  const { applyLayout } = useGraphDataFiltering();
  const { processGraphData } = useLocalGraphData();

  return {
    applyLayout,
    processGraphData
  };
};

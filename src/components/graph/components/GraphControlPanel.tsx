
import React from 'react';
import { LayoutGrid, Network, GitGraph } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutType } from '@/hooks/useGraphSettings';

interface GraphControlPanelProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export default function GraphControlPanel({
  currentLayout,
  onLayoutChange
}: GraphControlPanelProps) {
  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-xs font-medium mb-1">Тип раскладки</h3>
      <ToggleGroup type="single" value={currentLayout} onValueChange={(value: LayoutType) => {
        if (value) onLayoutChange(value);
      }}>
        <ToggleGroupItem value="force" aria-label="Force layout">
          <Network className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="radial" aria-label="Radial layout">
          <GitGraph className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="hierarchical" aria-label="Hierarchical layout">
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

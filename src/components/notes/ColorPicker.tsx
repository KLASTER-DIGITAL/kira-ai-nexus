
import React from "react";
import { Palette } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { NOTE_COLORS } from "@/types/notes";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  selectedColor,
  onColorChange
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 h-8 px-2 hover:bg-muted"
        >
          <Palette size={16} />
          <span className="text-sm">
            {selectedColor ? NOTE_COLORS[selectedColor as keyof typeof NOTE_COLORS]?.label || 'Цвет' : 'Цвет'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="grid grid-cols-5 gap-1">
          {Object.entries(NOTE_COLORS).map(([key, { bg, label }]) => (
            <Button
              key={key}
              variant="ghost"
              className={cn(
                "h-8 w-8 rounded-md p-0 border",
                bg,
                selectedColor === key && "ring-2 ring-primary ring-offset-2"
              )}
              title={label}
              onClick={() => onColorChange(key === 'default' ? '' : key)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;

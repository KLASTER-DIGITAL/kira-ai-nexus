
import React from "react";
import { Editor } from "@tiptap/react";
import { Bold, Italic, Underline, Strikethrough, Palette } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TextFormattingGroupProps {
  editor: Editor;
}

// Color options for text formatting
const TEXT_COLORS = [
  { color: '#000000', label: 'Черный' },
  { color: '#0066cc', label: 'Синий' },
  { color: '#10B981', label: 'Зеленый' },
  { color: '#EF4444', label: 'Красный' },
  { color: '#7E69AB', label: 'Фиолетовый' },
  { color: '#F97316', label: 'Оранжевый' },
  { color: '#FBBF24', label: 'Желтый' },
  { color: '#EC4899', label: 'Розовый' },
];

export const TextFormattingGroup: React.FC<TextFormattingGroupProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };
  
  const colorTooltip = editor.isActive('textStyle') ? 
    `Текущий цвет: ${editor.getAttributes('textStyle').color || 'По умолчанию'}` : 
    'Выбрать цвет';

  return (
    <div className="flex flex-wrap gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
        title="Жирный"
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
        title="Курсив"
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        aria-label="Underline"
        title="Подчеркнутый"
      >
        <Underline className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        aria-label="Strike"
        title="Зачеркнутый"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <Popover>
        <PopoverTrigger asChild>
          <Toggle
            size="sm"
            pressed={editor.isActive('textStyle')}
            className={cn(
              editor.isActive('textStyle') && 
              "border-primary"
            )}
            aria-label="Text color"
            title={colorTooltip}
          >
            <Palette className="h-4 w-4" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <div className="grid grid-cols-4 gap-1">
            {TEXT_COLORS.map(({ color, label }) => (
              <button
                key={color}
                className={cn(
                  "h-8 w-full rounded border border-muted",
                  editor.getAttributes('textStyle').color === color && 
                  "ring-2 ring-primary ring-offset-1"
                )}
                style={{ backgroundColor: color }}
                onClick={() => setTextColor(color)}
                title={label}
                aria-label={`Установить цвет текста: ${label}`}
                type="button"
              />
            ))}
            <button
              className="h-8 w-full rounded border border-muted flex items-center justify-center bg-background"
              onClick={() => editor.chain().focus().unsetColor().run()}
              title="По умолчанию"
              aria-label="Сбросить цвет текста"
              type="button"
            >
              <span className="text-xs">Сброс</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

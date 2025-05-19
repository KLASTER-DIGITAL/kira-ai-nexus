
import React from "react";
import { Editor } from "@tiptap/react";
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, 
  Code, CodeSquare, 
  ImageIcon, Link, Table,
  Heading1, Heading2, Heading3,
  Palette
} from "lucide-react";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { NOTE_COLORS } from "@/types/notes";

interface EnhancedMenuBarProps {
  editor: Editor;
  onColorSelect?: (color: string) => void;
}

const EnhancedMenuBar: React.FC<EnhancedMenuBarProps> = ({ 
  editor,
  onColorSelect
}) => {
  if (!editor) return null;

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-background border-b p-1 rounded-t-md flex flex-wrap items-center gap-1">
        {/* Текстовые форматирования */}
        <ToggleGroup type="multiple" className="flex flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="bold"
                size="sm"
                data-state={editor.isActive('bold') ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleBold().run()}
                className="h-8 w-8 p-0"
                aria-label="Жирный текст"
              >
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Жирный текст</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="italic"
                size="sm"
                data-state={editor.isActive('italic') ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className="h-8 w-8 p-0"
                aria-label="Курсив"
              >
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Курсив</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="underline"
                size="sm"
                data-state={editor.isActive('underline') ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className="h-8 w-8 p-0"
                aria-label="Подчеркнутый текст"
              >
                <Underline className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Подчеркнутый текст</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="strike"
                size="sm"
                data-state={editor.isActive('strike') ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className="h-8 w-8 p-0"
                aria-label="Зачеркнутый текст"
              >
                <Strikethrough className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Зачеркнутый текст</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        
        <span className="w-px h-6 bg-border mx-1" />
        
        {/* Выравнивание */}
        <ToggleGroup type="single" className="flex flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="left"
                size="sm"
                data-state={editor.isActive({ textAlign: 'left' }) ? "on" : "off"}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className="h-8 w-8 p-0"
                aria-label="По левому краю"
              >
                <AlignLeft className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>По левому краю</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="center"
                size="sm"
                data-state={editor.isActive({ textAlign: 'center' }) ? "on" : "off"}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className="h-8 w-8 p-0"
                aria-label="По центру"
              >
                <AlignCenter className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>По центру</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="right"
                size="sm"
                data-state={editor.isActive({ textAlign: 'right' }) ? "on" : "off"}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className="h-8 w-8 p-0"
                aria-label="По правому краю"
              >
                <AlignRight className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>По правому краю</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="justify"
                size="sm"
                data-state={editor.isActive({ textAlign: 'justify' }) ? "on" : "off"}
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className="h-8 w-8 p-0"
                aria-label="По ширине"
              >
                <AlignJustify className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>По ширине</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        
        <span className="w-px h-6 bg-border mx-1" />
        
        {/* Заголовки */}
        <ToggleGroup type="single" className="flex flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="h1"
                size="sm"
                data-state={editor.isActive('heading', { level: 1 }) ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className="h-8 px-2"
                aria-label="Заголовок 1"
              >
                <Heading1 className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Заголовок 1</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="h2"
                size="sm"
                data-state={editor.isActive('heading', { level: 2 }) ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className="h-8 px-2"
                aria-label="Заголовок 2"
              >
                <Heading2 className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Заголовок 2</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="h3"
                size="sm"
                data-state={editor.isActive('heading', { level: 3 }) ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className="h-8 px-2"
                aria-label="Заголовок 3"
              >
                <Heading3 className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Заголовок 3</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        
        <span className="w-px h-6 bg-border mx-1" />
        
        {/* Списки */}
        <ToggleGroup type="single" className="flex flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="bulletList"
                size="sm"
                data-state={editor.isActive('bulletList') ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className="h-8 w-8 p-0"
                aria-label="Маркированный список"
              >
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Маркированный список</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="orderedList"
                size="sm"
                data-state={editor.isActive('orderedList') ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className="h-8 w-8 p-0"
                aria-label="Нумерованный список"
              >
                <ListOrdered className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Нумерованный список</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        
        <span className="w-px h-6 bg-border mx-1" />
        
        {/* Код и вставки */}
        <ToggleGroup type="multiple" className="flex flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="code"
                size="sm"
                data-state={editor.isActive('code') ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleCode().run()}
                className="h-8 w-8 p-0"
                aria-label="Встроенный код"
              >
                <Code className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Встроенный код</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="codeBlock"
                size="sm"
                data-state={editor.isActive('codeBlock') ? "on" : "off"}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className="h-8 w-8 p-0"
                aria-label="Блок кода"
              >
                <CodeSquare className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>Блок кода</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  const url = window.prompt('URL изображения')
                  if (url) editor.chain().focus().setImage({ src: url }).run()
                }}
                className="h-8 w-8 p-0"
                aria-label="Вставить изображение"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Вставить изображение</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  const url = window.prompt('URL')
                  if (url) editor.chain().focus().setLink({ href: url }).run()
                }}
                className="h-8 w-8 p-0"
                aria-label="Вставить ссылку"
              >
                <Link className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Вставить ссылку</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => editor.chain().focus().insertTable({
                  rows: 3,
                  cols: 3,
                  withHeaderRow: true
                }).run()}
                className="h-8 w-8 p-0"
                aria-label="Вставить таблицу"
              >
                <Table className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Вставить таблицу</TooltipContent>
          </Tooltip>
        </ToggleGroup>
        
        <span className="w-px h-6 bg-border mx-1" />
        
        {/* Цветовая палитра */}
        <Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Выбрать цвет текста">
                    <Palette className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Цвет текста</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PopoverContent className="w-64">
            <div className="flex flex-wrap gap-2 p-2">
              {/* Предопределенные цвета текста */}
              <button 
                className="w-6 h-6 rounded-full bg-black"
                onClick={() => setTextColor('#000000')}
                aria-label="Черный"
              />
              <button 
                className="w-6 h-6 rounded-full bg-red-500"
                onClick={() => setTextColor('#ef4444')}
                aria-label="Красный"
              />
              <button 
                className="w-6 h-6 rounded-full bg-yellow-500"
                onClick={() => setTextColor('#eab308')}
                aria-label="Желтый"
              />
              <button 
                className="w-6 h-6 rounded-full bg-green-500"
                onClick={() => setTextColor('#22c55e')}
                aria-label="Зеленый"
              />
              <button 
                className="w-6 h-6 rounded-full bg-blue-500"
                onClick={() => setTextColor('#3b82f6')}
                aria-label="Синий"
              />
              <button 
                className="w-6 h-6 rounded-full bg-purple-500"
                onClick={() => setTextColor('#a855f7')}
                aria-label="Фиолетовый"
              />
              <button 
                className="w-6 h-6 rounded-full bg-pink-500"
                onClick={() => setTextColor('#ec4899')}
                aria-label="Розовый"
              />
              <button 
                className="w-6 h-6 rounded-full bg-gray-500"
                onClick={() => setTextColor('#6b7280')}
                aria-label="Серый"
              />
            </div>
            {onColorSelect && (
              <>
                <div className="px-2 pt-2 font-medium text-sm">Цвет заметки</div>
                <div className="flex flex-wrap gap-2 p-2">
                  {Object.entries(NOTE_COLORS).map(([key, value]) => (
                    <button
                      key={key}
                      className={`w-6 h-6 rounded-full ${value.bg || 'bg-background border border-input'}`}
                      onClick={() => onColorSelect(value.bg)}
                      title={value.label}
                      aria-label={value.label}
                    />
                  ))}
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
};

export default EnhancedMenuBar;

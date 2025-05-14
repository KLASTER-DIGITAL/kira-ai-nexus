import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  ListOrdered,
  List,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Image,
  Undo,
  Redo,
  Hash,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWikiLinks } from "@/hooks/notes/useWikiLinks";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Command, 
  CommandInput, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";

interface MenuBarProps {
  editor: Editor;
  noteId?: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({ editor, noteId }) => {
  const [wikiLinkPopoverOpen, setWikiLinkPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { allNotes } = useWikiLinks(noteId);
  
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  const addImage = () => {
    const url = window.prompt('URL изображения');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };
  
  const insertWikiLink = (title: string) => {
    editor
      .chain()
      .focus()
      .insertContent(`[[${title}]]`)
      .run();
    
    setWikiLinkPopoverOpen(false);
  };

  const filteredNotes = searchQuery
    ? allNotes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allNotes;

  return (
    <div className="border-b flex flex-wrap gap-1 p-2 bg-muted/20">
      <Button
        size="sm"
        variant="ghost"
        className={editor.isActive("bold") ? "bg-muted" : ""}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Жирный (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={editor.isActive("italic") ? "bg-muted" : ""}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Курсив (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={editor.isActive("underline") ? "bg-muted" : ""}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Подчеркнутый (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={editor.isActive("strike") ? "bg-muted" : ""}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Зачеркнутый"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      
      <span className="h-6 w-px bg-muted mx-1"></span>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={addLink}
        className={editor.isActive("link") ? "bg-muted" : ""}
        title="Ссылка"
      >
        <Link className="h-4 w-4" />
      </Button>
      
      <Popover open={wikiLinkPopoverOpen} onOpenChange={setWikiLinkPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className={editor.isActive("wikiLink") ? "bg-muted" : ""}
            title="Wiki-ссылка [[название]]"
          >
            <Hash className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" side="bottom">
          <Command>
            <CommandInput 
              placeholder="Найти заметку..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>Заметки не найдены</CommandEmpty>
              <CommandGroup heading="Заметки">
                {filteredNotes.map((note) => (
                  <CommandItem
                    key={note.id}
                    value={note.title}
                    onSelect={() => insertWikiLink(note.title)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {note.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      <span className="h-6 w-px bg-muted mx-1"></span>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-muted" : ""}
        title="Маркированный список"
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-muted" : ""}
        title="Нумерованный список"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <span className="h-6 w-px bg-muted mx-1"></span>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
        title="Заголовок 1"
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
        title="Заголовок 2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
        title="Заголовок 3"
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "bg-muted" : ""}
        title="Цитата"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "bg-muted" : ""}
        title="Блок кода"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={addImage}
        title="Добавить изображение"
      >
        <Image className="h-4 w-4" />
      </Button>
      
      <span className="h-6 w-px bg-muted mx-1"></span>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Отменить"
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Повторить"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};


import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { MenuButton, MenuDivider } from "./utils";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Command, 
  CommandInput, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/types/notes";

// Text formatting buttons group
export const TextFormattingGroup: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <MenuButton
        editor={editor}
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Жирный (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Курсив (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Подчеркнутый (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Зачеркнутый"
      >
        <Strikethrough className="h-4 w-4" />
      </MenuButton>
    </>
  );
};

// Link related buttons group
export const LinkGroup: React.FC<{ editor: Editor; noteId?: string }> = ({ editor, noteId }) => {
  const [wikiLinkPopoverOpen, setWikiLinkPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { notes } = useNotes({ pageSize: 100 });

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
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

  const filteredNotes = searchQuery && notes
    ? notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes || [];

  return (
    <>
      <MenuButton
        editor={editor}
        isActive={editor.isActive("link")}
        onClick={addLink}
        title="Ссылка"
      >
        <Link className="h-4 w-4" />
      </MenuButton>
      
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
                {filteredNotes.map((note: Note) => (
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
    </>
  );
};

// List buttons group
export const ListGroup: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <MenuButton
        editor={editor}
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Маркированный список"
      >
        <List className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Нумерованный список"
      >
        <ListOrdered className="h-4 w-4" />
      </MenuButton>
    </>
  );
};

// Headings and formatting group
export const HeadingsGroup: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <MenuButton
        editor={editor}
        isActive={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Заголовок 1"
      >
        <Heading1 className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Заголовок 2"
      >
        <Heading2 className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Заголовок 3"
      >
        <Heading3 className="h-4 w-4" />
      </MenuButton>
      
      <MenuButton
        editor={editor}
        isActive={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Цитата"
      >
        <Quote className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        isActive={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Блок кода"
      >
        <Code className="h-4 w-4" />
      </MenuButton>
    </>
  );
};

// Media buttons group
export const MediaGroup: React.FC<{ editor: Editor }> = ({ editor }) => {
  const addImage = () => {
    const url = window.prompt('URL изображения');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <MenuButton
      editor={editor}
      onClick={addImage}
      title="Добавить изображение"
    >
      <Image className="h-4 w-4" />
    </MenuButton>
  );
};

// History buttons group
export const HistoryGroup: React.FC<{ editor: Editor }> = ({ editor }) => {
  return (
    <>
      <MenuButton
        editor={editor}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Отменить"
      >
        <Undo className="h-4 w-4" />
      </MenuButton>

      <MenuButton
        editor={editor}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Повторить"
      >
        <Redo className="h-4 w-4" />
      </MenuButton>
    </>
  );
};

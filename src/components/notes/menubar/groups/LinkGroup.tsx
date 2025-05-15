
import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { MenuButton } from "../utils";
import { Link, Hash, BookOpen } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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

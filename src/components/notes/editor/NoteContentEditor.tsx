
import React, { useState, useEffect } from "react";
import TipTapEditor from "@/components/notes/TipTapEditor";
import BacklinksList from "@/components/notes/BacklinksList";
import TagManager from "@/components/notes/TagManager";
import ColorPicker from "@/components/notes/ColorPicker";
import { Button } from "@/components/ui/button";
import { FileText, ListTodo } from "lucide-react";
import TemplateSelector from "@/components/notes/templates/TemplateSelector";
import { applyTemplate } from "@/components/notes/templates/NoteTemplate";
import { LinkData } from "@/hooks/notes/links/types";
import TaskExtractor from "@/components/notes/TaskExtractor";
import { containsTasks } from "@/utils/notes/taskExtractor";

interface NoteContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  noteId?: string;
  onNoteSelect?: (noteId: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  color: string;
  onColorChange: (color: string) => void;
  links?: {
    incomingLinks: Array<{
      id: string;
      nodes: {
        id: string;
        title: string;
      };
    }>;
    outgoingLinks: LinkData[];
  };
  title?: string;
  onTitleChange?: (title: string) => void;
}

const NoteContentEditor: React.FC<NoteContentEditorProps> = ({
  content,
  onContentChange,
  noteId,
  onNoteSelect,
  tags,
  onTagsChange,
  color,
  onColorChange,
  links,
  title,
  onTitleChange
}) => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [hasTasks, setHasTasks] = useState(false);
  
  const hasBacklinks = links?.incomingLinks && links.incomingLinks.length > 0;

  const handleTemplateSelect = (template) => {
    const result = applyTemplate(template, title);
    if (onTitleChange) {
      onTitleChange(result.title);
    }
    onContentChange(result.content);
    onTagsChange(result.tags);
    if (result.color) {
      onColorChange(result.color);
    }
    setIsTemplateDialogOpen(false);
  };
  
  // Check for tasks in the content
  useEffect(() => {
    setHasTasks(containsTasks(content));
  }, [content]);

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <ColorPicker 
            selectedColor={color} 
            onColorChange={onColorChange} 
          />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsTemplateDialogOpen(true)}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Шаблоны</span>
          </Button>
          
          {hasTasks && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {}}
            >
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Задачи</span>
            </Button>
          )}
        </div>
      </div>
      
      <TipTapEditor 
        content={content} 
        onChange={onContentChange} 
        placeholder="Содержание заметки..."
        autoFocus={false}
        noteId={noteId}
        onLinkClick={onNoteSelect}
        onColorChange={onColorChange}
      />
      
      {hasTasks && noteId && (
        <TaskExtractor content={content} noteId={noteId} />
      )}
      
      {hasBacklinks && (
        <div className="mt-4">
          <BacklinksList links={links?.incomingLinks || []} onLinkClick={onNoteSelect || (() => {})} />
        </div>
      )}
      
      <div className="mt-4">
        <TagManager tags={tags} onTagsChange={onTagsChange} />
      </div>
      
      <TemplateSelector 
        open={isTemplateDialogOpen}
        onOpenChange={setIsTemplateDialogOpen}
        onSelectTemplate={handleTemplateSelect}
      />
    </>
  );
};

export default NoteContentEditor;

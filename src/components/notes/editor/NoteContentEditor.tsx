
import React from "react";
import TipTapEditor from "@/components/notes/TipTapEditor";
import BacklinksList from "@/components/notes/BacklinksList";
import TagManager from "@/components/notes/TagManager";
import { LinkData } from "@/hooks/notes/links/types";

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
  links
}) => {
  const hasBacklinks = links?.incomingLinks && links.incomingLinks.length > 0;

  return (
    <>
      <TipTapEditor 
        content={content} 
        onChange={onContentChange} 
        placeholder="Содержание заметки..."
        autoFocus={false}
        noteId={noteId}
        onLinkClick={onNoteSelect}
      />
      
      {hasBacklinks && (
        <div className="mt-4">
          <BacklinksList links={links?.incomingLinks || []} onLinkClick={onNoteSelect || (() => {})} />
        </div>
      )}
      
      <div className="mt-4">
        <TagManager tags={tags} onTagsChange={onTagsChange} />
      </div>
    </>
  );
};

export default NoteContentEditor;

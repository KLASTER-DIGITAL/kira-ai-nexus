
import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { MenuBar } from "./TipTapMenuBar";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  editable?: boolean;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  content,
  onChange,
  placeholder = "Начните писать...",
  autoFocus = false,
  editable = true,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
      }),
      Underline,
      Image,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    autofocus: autoFocus,
  });

  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  return (
    <div className="tiptap-editor border rounded-md bg-background">
      {editor && editable && <MenuBar editor={editor} />}
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4"
      />
    </div>
  );
};

export default TipTapEditor;


import React from "react";
import { Editor } from "@tiptap/react";
import { ListTodo, ListChecks } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface TaskGroupProps {
  editor: Editor;
}

export const TaskGroup: React.FC<TaskGroupProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("taskList")}
        onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
        title="Список задач"
      >
        <ListTodo className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={() => {
          if (!editor.isActive("taskItem")) {
            editor.chain().focus().toggleTaskList().run();
          }
          
          // Select the current task item and set priority
          const { state } = editor;
          const { from } = state.selection;
          const pos = editor.state.doc.resolve(from);
          const node = pos.node();
          
          if (node && editor.isActive("taskItem")) {
            editor.chain().focus().updateAttributes("taskItem", { 
              priority: "high" 
            }).run();
          }
        }}
        title="Важная задача"
      >
        <ListChecks className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

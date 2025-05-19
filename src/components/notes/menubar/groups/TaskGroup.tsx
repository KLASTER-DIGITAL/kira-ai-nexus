
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
        onPressedChange={() => editor.chain().focus().toggleList('taskList', 'taskItem').run()}
        title="Список задач"
      >
        <ListTodo className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={false}
        onPressedChange={() => {
          const { state } = editor;
          const { from, to } = state.selection;
          
          // Set task priority
          editor.chain().focus().setTaskItem(false).run();
          
          // Set priority to high as example
          const transaction = editor.state.tr.setNodeMarkup(
            from - 1, // Position of the task item node
            undefined,
            { checked: false, priority: 'high' }
          );
          
          editor.view.dispatch(transaction);
        }}
        title="Добавить приоритет"
      >
        <ListChecks className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

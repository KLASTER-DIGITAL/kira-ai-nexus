
import React from "react";
import { Task } from "@/types/tasks";
import TaskItem from "./TaskItem";
import { Card } from "@/components/ui/card";

interface TaskListContainerProps {
  tasks: Task[];
  isSearching: boolean;
  toggleTaskCompletion: (taskId: string) => void;
  updateTask: (task: Partial<Task> & { id: string }) => void;
  deleteTask: (taskId: string) => void;
}

const TaskListContainer: React.FC<TaskListContainerProps> = ({
  tasks,
  isSearching,
  toggleTaskCompletion,
  updateTask,
  deleteTask,
}) => {
  const [editingTask, setEditingTask] = React.useState<string | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="text-center p-6 border rounded-md bg-muted/20">
        {isSearching ? (
          <p className="text-muted-foreground">Задачи не найдены. Попробуйте изменить параметры поиска.</p>
        ) : (
          <p className="text-muted-foreground">У вас пока нет задач. Создайте первую!</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleCompletion={toggleTaskCompletion}
          onEdit={(taskId) => setEditingTask(taskId)}
          onDelete={deleteTask}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          updateTask={updateTask}
        />
      ))}
    </div>
  );
};

export default TaskListContainer;

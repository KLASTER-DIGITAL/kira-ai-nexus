
import React, { useState } from "react";
import { Check, Plus, Calendar, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Создать MVP для KIRA AI",
      completed: false,
      priority: "high",
      dueDate: "2025-05-20",
    },
    {
      id: "2",
      title: "Добавить интеграцию с OpenAI API",
      completed: false,
      priority: "medium",
      dueDate: "2025-05-25",
    },
    {
      id: "3",
      title: "Разработать документацию API",
      completed: true,
      priority: "low",
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: "medium" as const,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-500";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          placeholder="Добавить новую задачу..."
          className="kira-input flex-1 focus:ring-kira-purple/50 transition-all duration-200"
        />
        <Button 
          onClick={addTask} 
          disabled={!newTaskTitle.trim()}
          className="bg-kira-purple hover:bg-kira-purple-dark text-white transition-colors"
        >
          <Plus size={16} className="mr-1" /> Добавить
        </Button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 border rounded-md transition-all duration-200 transform hover:translate-y-[-2px] ${
              task.completed
                ? "bg-muted/50 border-muted"
                : "bg-card border-border hover:shadow-sm"
            }`}
          >
            <button
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                task.completed
                  ? "bg-kira-purple border-kira-purple text-white"
                  : "border-muted-foreground hover:border-kira-purple"
              }`}
              onClick={() => toggleTask(task.id)}
            >
              {task.completed && <Check size={12} />}
            </button>
            <span
              className={`flex-1 ${
                task.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </span>
            <div className="flex items-center gap-2">
              <AlertCircle
                size={14}
                className={getPriorityColor(task.priority)}
                aria-label={`Приоритет: ${task.priority}`}
              />
              {task.dueDate && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock size={12} className="mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

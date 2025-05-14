
import React, { useState } from "react";
import { Check, Plus, Clock, AlertCircle, Trash2, CalendarIcon, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskPriority } from "@/types/tasks";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/auth";

interface TaskFormValues {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
}

const TaskList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { tasks, isLoading, toggleTaskCompletion, createTask, updateTask, deleteTask } = useTasks();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const form = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium" as TaskPriority,
    }
  });
  
  const onSubmit = (data: TaskFormValues) => {
    createTask({
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined,
      completed: false,
    });
    
    form.reset();
    setIsCreateDialogOpen(false);
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
  
  if (!isAuthenticated) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/50">
        <p>Необходимо войти в систему для просмотра задач</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-kira-purple rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Мои задачи</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-kira-purple hover:bg-kira-purple-dark text-white transition-colors"
            >
              <Plus size={16} className="mr-1" /> Добавить задачу
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новую задачу</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название задачи</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите название задачи" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Описание</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Добавьте описание (опционально)" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Приоритет</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите приоритет" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Низкий</SelectItem>
                          <SelectItem value="medium">Средний</SelectItem>
                          <SelectItem value="high">Высокий</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Срок выполнения</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Выберите дату</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Создать задачу</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 border rounded-md transition-all duration-200 transform hover:translate-y-[-2px] ${
                task.completed
                  ? "bg-muted/50 border-muted"
                  : "bg-card border-border hover:shadow-sm"
              }`}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
                className={`h-5 w-5 rounded-full transition-colors ${
                  task.completed
                    ? "bg-kira-purple border-kira-purple text-white"
                    : "border-muted-foreground hover:border-kira-purple"
                }`}
              />
              <div className="flex-1 flex flex-col">
                <span
                  className={`${
                    task.completed ? "line-through text-muted-foreground" : "font-medium"
                  }`}
                >
                  {task.title}
                </span>
                {task.description && (
                  <span className="text-sm text-muted-foreground line-clamp-1">
                    {task.description}
                  </span>
                )}
              </div>
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-6 border rounded-md bg-muted/20">
            <p className="text-muted-foreground">У вас пока нет задач. Создайте первую!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;

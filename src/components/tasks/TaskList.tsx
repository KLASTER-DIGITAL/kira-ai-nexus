
import React, { useState } from "react";
import { 
  Check, Plus, Clock, AlertCircle, Trash2, 
  CalendarIcon, Edit, Search, Filter, Tag, ArrowUp, ArrowDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskPriority, TaskFilter } from "@/types/tasks";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";

interface TaskFormValues {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
}

const TaskList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<TaskFilter>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  const { tasks, isLoading, toggleTaskCompletion, createTask, updateTask, deleteTask } = useTasks(filter);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  
  const form = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium" as TaskPriority,
    }
  });
  
  const editForm = useForm<TaskFormValues>({
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
  
  const onEditSubmit = (data: TaskFormValues) => {
    if (!editingTask) return;
    
    const task = tasks?.find(t => t.id === editingTask);
    if (!task) return;
    
    updateTask({
      id: editingTask,
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined,
    });
    
    setEditingTask(null);
  };
  
  const handleEdit = (taskId: string) => {
    const task = tasks?.find(t => t.id === taskId);
    if (!task) return;
    
    editForm.reset({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    });
    
    setEditingTask(taskId);
  };
  
  const getPriorityColor = (priority: TaskPriority) => {
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
  
  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "";
    }
  };
  
  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "Высокий";
      case "medium":
        return "Средний";
      case "low":
        return "Низкий";
      default:
        return "";
    }
  };
  
  const handleToggleSort = (sortField: "dueDate" | "priority") => {
    if (sortBy === sortField) {
      // Toggle direction if already sorting by this field
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      // Set new field and reset to ascending
      setSortBy(sortField);
      setSortDirection("asc");
    }
  };
  
  const getFilteredAndSortedTasks = () => {
    if (!tasks) return [];
    
    let filteredTasks = tasks;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    if (sortBy) {
      filteredTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === "dueDate") {
          // Handle tasks without due dates
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return sortDirection === "asc" ? 1 : -1;
          if (!b.dueDate) return sortDirection === "asc" ? -1 : 1;
          
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          return sortDirection === "asc" 
            ? dateA.getTime() - dateB.getTime() 
            : dateB.getTime() - dateA.getTime();
        }
        
        if (sortBy === "priority") {
          const priorityValues = {
            "high": 3,
            "medium": 2,
            "low": 1
          };
          
          const valueA = priorityValues[a.priority] || 0;
          const valueB = priorityValues[b.priority] || 0;
          
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }
        
        return 0;
      });
    }
    
    return filteredTasks;
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
  
  const filteredTasks = getFilteredAndSortedTasks();

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
                                "pl-3 text-left font-normal w-full",
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
                            onSelect={(date) => {
                              field.onChange(date);
                            }}
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

      {/* Поиск и фильтрация */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск задач..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              >
                <Filter size={16} className="mr-2" />
                Фильтры
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleToggleSort("dueDate")}
              >
                <Clock size={16} className="mr-2" />
                По сроку
                {sortBy === "dueDate" && (
                  sortDirection === "asc" ? 
                    <ArrowUp size={14} className="ml-1" /> : 
                    <ArrowDown size={14} className="ml-1" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => handleToggleSort("priority")}
              >
                <AlertCircle size={16} className="mr-2" />
                По приоритету
                {sortBy === "priority" && (
                  sortDirection === "asc" ? 
                    <ArrowUp size={14} className="ml-1" /> : 
                    <ArrowDown size={14} className="ml-1" />
                )}
              </Button>
            </div>
            
            {isFiltersOpen && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <FormLabel className="text-sm mb-2 block">Статус</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      if (value === "all") {
                        setFilter(prev => ({ ...prev, completed: undefined }));
                      } else {
                        setFilter(prev => ({ ...prev, completed: value === "completed" }));
                      }
                    }}
                    defaultValue="all"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Все задачи" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все задачи</SelectItem>
                      <SelectItem value="completed">Завершенные</SelectItem>
                      <SelectItem value="active">Активные</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <FormLabel className="text-sm mb-2 block">Приоритет</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      if (value === "all") {
                        setFilter(prev => {
                          const newFilter = {...prev};
                          delete newFilter.priority;
                          return newFilter;
                        });
                      } else {
                        setFilter(prev => ({ 
                          ...prev, 
                          priority: value as TaskPriority
                        }));
                      }
                    }}
                    defaultValue="all"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Любой приоритет" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Любой приоритет</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="low">Низкий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
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
                <span 
                  className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeClass(task.priority)}`}
                >
                  {getPriorityLabel(task.priority)}
                </span>
                
                {task.dueDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock size={12} className="mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
                
                <Dialog open={editingTask === task.id} onOpenChange={() => setEditingTask(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleEdit(task.id)}
                    >
                      <Edit size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Редактировать задачу</DialogTitle>
                    </DialogHeader>
                    <Form {...editForm}>
                      <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                        <FormField
                          control={editForm.control}
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
                          control={editForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Описание</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Добавьте описание (опционально)" 
                                  {...field} 
                                  value={field.value || ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={editForm.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Приоритет</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                value={field.value}
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
                          control={editForm.control}
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
                                        "pl-3 text-left font-normal w-full",
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
                                    onSelect={(date) => {
                                      field.onChange(date);
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormItem>
                          )}
                        />
                        
                        <DialogFooter>
                          <Button type="submit">Сохранить изменения</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                
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
            {searchQuery || Object.keys(filter).length > 0 ? (
              <p className="text-muted-foreground">Задачи не найдены. Попробуйте изменить параметры поиска.</p>
            ) : (
              <p className="text-muted-foreground">У вас пока нет задач. Создайте первую!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;

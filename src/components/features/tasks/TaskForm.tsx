
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskPriority } from "@/types/tasks";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const formSchema = z.object({
  title: z.string().min(1, "Название задачи обязательно"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).default([]),
  reminder: z.boolean().default(false),
  category: z.string().optional(),
  recurring: z.boolean().default(false),
  recurring_type: z.enum(["daily", "weekly", "monthly"]).optional(),
});

export type TaskFormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  defaultValues: Partial<TaskFormValues>;
  onSubmit: (data: TaskFormValues) => void;
  submitLabel: string;
  categories?: string[];
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default: return "";
  }
};

const getPriorityLabel = (priority: TaskPriority) => {
  switch (priority) {
    case "low": return "Низкий";
    case "medium": return "Средний";
    case "high": return "Высокий";
    default: return "";
  }
};

const TaskForm: React.FC<TaskFormProps> = ({ 
  defaultValues, 
  onSubmit, 
  submitLabel,
  categories = []
}) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      tags: [],
      reminder: false,
      recurring: false,
      ...defaultValues,
    },
  });

  const priority = form.watch("priority");
  const recurring = form.watch("recurring");
  const [tagInput, setTagInput] = React.useState("");

  const addTag = () => {
    if (!tagInput.trim()) return;
    
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-fade-in">
        <div className="grid gap-4 md:grid-cols-6">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название задачи</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите название задачи" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-6">
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
                      value={field.value || ""}
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-6 md:col-span-3">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Приоритет</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите приоритет">
                          {field.value && (
                            <div className="flex items-center">
                              <Badge variant="outline" className={cn("mr-2", getPriorityColor(field.value as TaskPriority))}>
                                {getPriorityLabel(field.value as TaskPriority)}
                              </Badge>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low" className="flex items-center">
                        <Badge variant="outline" className={cn("mr-2", getPriorityColor("low"))}>Низкий</Badge>
                      </SelectItem>
                      <SelectItem value="medium">
                        <Badge variant="outline" className={cn("mr-2", getPriorityColor("medium"))}>Средний</Badge>
                      </SelectItem>
                      <SelectItem value="high">
                        <Badge variant="outline" className={cn("mr-2", getPriorityColor("high"))}>Высокий</Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-6 md:col-span-3">
            {categories.length > 0 && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          <div className="col-span-6 md:col-span-3">
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
                            <span className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(field.value, "dd MMMM yyyy", { locale: ru })}
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>Выберите дату</span>
                            </span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        initialFocus
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-6 md:col-span-3">
            <FormField
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Напоминание</FormLabel>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Получить уведомление
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="col-span-6 md:col-span-3">
            <FormField
              control={form.control}
              name="recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Повторение</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Повторять задачу
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {recurring && (
            <div className="col-span-6 md:col-span-3">
              <FormField
                control={form.control}
                name="recurring_type"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Периодичность</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="daily" />
                          </FormControl>
                          <FormLabel className="font-normal">Ежедневно</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="weekly" />
                          </FormControl>
                          <FormLabel className="font-normal">Еженедельно</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="monthly" />
                          </FormControl>
                          <FormLabel className="font-normal">Ежемесячно</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Теги</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {field.value?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button 
                          type="button"
                          onClick={() => removeTag(tag)} 
                          className="ml-1 rounded-full hover:bg-muted w-4 h-4 inline-flex items-center justify-center"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Добавить тег..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={addTag} 
                      variant="outline"
                      disabled={!tagInput.trim()}
                    >
                      Добавить
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" className="transition-all">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
};

export default TaskForm;

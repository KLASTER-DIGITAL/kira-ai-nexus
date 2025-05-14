
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Notebook, ListChecks, MessageSquareText, Check, CheckCircle, Plus } from "lucide-react";
import { ANIMATIONS } from "@/lib/animations";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface WidgetOption {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const widgetOptions: WidgetOption[] = [
  {
    id: "chat",
    title: "Чат с KIRA AI",
    icon: MessageSquareText,
    description: "Задавайте вопросы и получайте помощь от ИИ-ассистента",
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
  },
  {
    id: "tasks",
    title: "Мои задачи",
    icon: ListChecks,
    description: "Управляйте задачами и отслеживайте их выполнение",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600"
  },
  {
    id: "notes",
    title: "Заметки",
    icon: Notebook,
    description: "Создавайте и управляйте заметками",
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
  },
  {
    id: "calendar",
    title: "Календарь",
    icon: Calendar,
    description: "Просматривайте и управляйте своими событиями",
    color: "bg-green-100 dark:bg-green-900/30 text-green-600"
  }
];

interface AddWidgetDialogProps {
  onAddWidget: (widgetType: string) => void;
  children?: React.ReactNode;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ onAddWidget, children }) => {
  const [selectedWidget, setSelectedWidget] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleAddWidget = () => {
    if (selectedWidget) {
      onAddWidget(selectedWidget);
      setSelectedWidget(null);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button 
            className="flex items-center gap-2 bg-kira-purple hover:bg-kira-purple-dark text-white transition-colors"
          >
            <Plus size={16} />
            <span>Добавить виджет</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Выберите виджет для добавления</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          {widgetOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedWidget === option.id;
            
            return (
              <div 
                key={option.id}
                className={cn(
                  "relative p-4 rounded-lg border-2 cursor-pointer transition-all",
                  isSelected ? 'border-kira-purple bg-kira-purple/5 dark:bg-kira-purple/10' : 'border-border hover:border-kira-purple/30',
                  ANIMATIONS.fadeIn
                )}
                onClick={() => setSelectedWidget(option.id)}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-kira-purple text-white">
                    <Check size={12} />
                  </div>
                )}
                <div className="flex flex-col items-center text-center gap-3">
                  <AspectRatio ratio={1/1} className="w-16">
                    <div className={cn("rounded-full w-full h-full flex items-center justify-center", option.color)}>
                      <Icon size={24} />
                    </div>
                  </AspectRatio>
                  <div>
                    <h3 className="font-medium text-base">{option.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedWidget(null);
              setOpen(false);
            }}
          >
            Отмена
          </Button>
          <Button 
            disabled={!selectedWidget}
            onClick={handleAddWidget}
            className="bg-kira-purple hover:bg-kira-purple-dark text-white transition-colors"
          >
            Добавить виджет
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;

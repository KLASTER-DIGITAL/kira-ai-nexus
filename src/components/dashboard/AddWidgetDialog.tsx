
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle, Calendar, Notebook, ListChecks, MessageSquareText } from "lucide-react";
import { ANIMATIONS } from "@/lib/animations";

interface WidgetOption {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const widgetOptions: WidgetOption[] = [
  {
    id: "chat",
    title: "Чат с KIRA AI",
    icon: MessageSquareText,
    description: "Задавайте вопросы и получайте помощь от ИИ-ассистента"
  },
  {
    id: "tasks",
    title: "Мои задачи",
    icon: ListChecks,
    description: "Управляйте задачами и отслеживайте их выполнение"
  },
  {
    id: "notes",
    title: "Заметки",
    icon: Notebook,
    description: "Создавайте и управляйте заметками"
  },
  {
    id: "calendar",
    title: "Календарь",
    icon: Calendar,
    description: "Просматривайте и управляйте своими событиями"
  }
];

interface AddWidgetDialogProps {
  onAddWidget: (widgetType: string) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ onAddWidget }) => {
  const [selectedWidget, setSelectedWidget] = React.useState<string | null>(null);

  const handleAddWidget = () => {
    if (selectedWidget) {
      onAddWidget(selectedWidget);
      setSelectedWidget(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center gap-2 bg-kira-purple hover:bg-kira-purple-dark text-white transition-colors"
        >
          <PlusCircle size={18} />
          <span>Добавить виджет</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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
                className={`
                  relative p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${isSelected ? 'border-kira-purple bg-kira-purple/5' : 'border-border hover:border-kira-purple/30'}
                  ${ANIMATIONS.fadeIn}
                `}
                onClick={() => setSelectedWidget(option.id)}
              >
                {isSelected && (
                  <CheckCircle 
                    size={18} 
                    className="absolute top-2 right-2 text-kira-purple" 
                  />
                )}
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-2 rounded-full bg-kira-purple/10">
                    <Icon size={24} className="text-kira-purple" />
                  </div>
                  <div>
                    <h3 className="font-medium">{option.title}</h3>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-end gap-2">
          <DialogTrigger asChild>
            <Button variant="outline">Отмена</Button>
          </DialogTrigger>
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


import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DashboardWidget, useDashboardStore } from '@/store/dashboardStore';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth';

const DashboardConfigDialog: React.FC = () => {
  const { user } = useAuth();
  const { 
    widgets, 
    isConfigDialogOpen, 
    setConfigDialogOpen, 
    toggleWidgetVisibility,
    resetLayout,
    saveUserLayout
  } = useDashboardStore();

  const handleClose = () => {
    setConfigDialogOpen(false);
  };

  const handleReset = () => {
    resetLayout();
    toast({
      title: "Настройки дашборда сброшены",
      description: "Дашборд возвращен к исходной конфигурации",
    });
    handleClose();
  };

  const handleSave = () => {
    if (user?.id) {
      saveUserLayout(user.id);
      toast({
        title: "Настройки сохранены",
        description: "Конфигурация дашборда успешно сохранена",
      });
    }
    handleClose();
  };

  return (
    <Dialog open={isConfigDialogOpen} onOpenChange={setConfigDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Настроить дашборд</DialogTitle>
          <DialogDescription>
            Выберите, какие виджеты будут отображаться на вашей панели управления.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {widgets.map((widget) => (
            <div key={widget.id} className="flex items-center justify-between">
              <Label htmlFor={`widget-${widget.id}`} className="flex-1">
                {widget.title}
              </Label>
              <Switch
                id={`widget-${widget.id}`}
                checked={widget.isVisible}
                onCheckedChange={() => toggleWidgetVisibility(widget.id)}
              />
            </div>
          ))}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleReset}>
            Сбросить
          </Button>
          <Button onClick={handleSave}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardConfigDialog;

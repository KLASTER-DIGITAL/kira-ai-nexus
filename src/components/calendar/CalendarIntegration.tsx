
import React from "react";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ANIMATIONS } from "@/lib/animations";

const CalendarIntegration: React.FC = () => {
  const handleAddGoogleCalendar = () => {
    // In a real implementation, this would initiate the OAuth flow with Google
    // For now, we'll just show a toast message
    toast({
      title: "Google Calendar",
      description: "Интеграция с Google Calendar будет доступна в ближайшее время.",
    });
  };

  return (
    <div className={`${ANIMATIONS.fadeIn} flex flex-col items-center justify-center h-full`}>
      <Card className="w-full max-w-md mx-auto bg-background/50 backdrop-blur">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="mb-4">
            <Calendar size={48} className="text-muted-foreground" />
          </div>
          
          <h3 className="text-lg font-medium mb-1">Повестка дня</h3>
          <p className="text-center text-muted-foreground mb-4">
            События из ваших календарей будут отображаться здесь.
          </p>
          
          <Button 
            onClick={handleAddGoogleCalendar}
            className="bg-emerald-500 hover:bg-emerald-600 text-white w-full flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Добавить интеграцию календаря
          </Button>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            <a href="#" className="text-primary hover:underline">Узнать больше</a> о том, как интегрировать календари
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarIntegration;


import React from "react";
import { NoteTemplate, DEFAULT_TEMPLATES } from "./NoteTemplate";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: NoteTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  open,
  onOpenChange,
  onSelectTemplate
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Выберите шаблон</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_TEMPLATES.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md ${template.color || ''}`}
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-xs">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-xs text-muted-foreground overflow-hidden text-ellipsis h-12">
                    {/* Display preview of the template content without HTML */}
                    {template.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                  {template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] px-1.5 py-0.5 bg-muted rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button size="sm" variant="secondary" className="text-xs">
                    Использовать
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelector;

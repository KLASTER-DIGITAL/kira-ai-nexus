
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  onNewChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onNewChat }) => {
  const { toast } = useToast();

  const handleNewChat = () => {
    onNewChat();
    toast({
      title: "Новый чат",
      description: "Создана новая сессия чата"
    });
  };

  return (
    <div className="flex justify-end mb-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 text-xs"
        onClick={handleNewChat}
      >
        <RotateCcw size={14} />
        <span>Новый чат</span>
      </Button>
    </div>
  );
};

export default ChatHeader;


import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Send } from "lucide-react";
import { useSendNotification } from "@/hooks/notifications/useSendNotification";

const TestNotificationButton: React.FC = () => {
  const sendNotification = useSendNotification();

  const handleTestNotification = () => {
    sendNotification.mutate({
      title: "Тестовое уведомление",
      body: "Это тестовое push-уведомление из KIRA AI",
      icon: "/favicon.ico",
      tag: "test"
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleTestNotification}
      disabled={sendNotification.isPending}
      className="flex items-center gap-2"
    >
      <Send className="h-4 w-4" />
      {sendNotification.isPending ? 'Отправка...' : 'Тест уведомления'}
    </Button>
  );
};

export default TestNotificationButton;


import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Settings, Smartphone, AlertTriangle, CheckCircle } from "lucide-react";
import { useNotificationSettings } from "@/hooks/notifications/useNotificationSettings";
import { usePushNotifications } from "@/hooks/notifications/usePushNotifications";

interface NotificationSettingsDialogProps {
  children: React.ReactNode;
}

const NotificationSettingsDialog: React.FC<NotificationSettingsDialogProps> = ({ children }) => {
  const { settings, updateSettings, isUpdating } = useNotificationSettings();
  const { 
    subscriptions, 
    isPushSupported, 
    supportIssues,
    subscribeToPush, 
    unsubscribeFromPush,
    isSubscribing 
  } = usePushNotifications();

  const handleSettingChange = (key: string, value: boolean | string) => {
    updateSettings({ [key]: value });
  };

  const hasPushSubscription = subscriptions && subscriptions.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Настройки уведомлений
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Push-уведомления */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Push-уведомления
              </CardTitle>
              <CardDescription>
                Получайте уведомления прямо в браузере даже когда сайт закрыт
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isPushSupported ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Push-уведомления недоступны:</p>
                      <ul className="list-disc list-inside text-sm">
                        {supportIssues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : hasPushSubscription ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Push-уведомления успешно настроены и активны
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">
                    {hasPushSubscription ? 'Push-уведомления включены' : 'Включить push-уведомления'}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {hasPushSubscription 
                      ? 'Вы будете получать уведомления в браузере'
                      : 'Нажмите для включения уведомлений в браузере'
                    }
                  </p>
                </div>
                {isPushSupported && (
                  hasPushSubscription ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => subscriptions[0] && unsubscribeFromPush(subscriptions[0].id)}
                    >
                      Отключить
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => subscribeToPush()}
                      disabled={isSubscribing}
                    >
                      {isSubscribing ? 'Включение...' : 'Включить'}
                    </Button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Основные настройки */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Типы уведомлений
              </CardTitle>
              <CardDescription>
                Выберите, какие уведомления вы хотите получать
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email уведомления</Label>
                  <p className="text-sm text-muted-foreground">
                    Получать уведомления на электронную почту
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings?.email_notifications || false}
                  onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
                  disabled={isUpdating}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="task-notifications">Уведомления о задачах</Label>
                  <p className="text-sm text-muted-foreground">
                    Новые задачи, изменения статуса, приближающиеся дедлайны
                  </p>
                </div>
                <Switch
                  id="task-notifications"
                  checked={settings?.task_notifications || false}
                  onCheckedChange={(checked) => handleSettingChange('task_notifications', checked)}
                  disabled={isUpdating}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="calendar-notifications">Календарные уведомления</Label>
                  <p className="text-sm text-muted-foreground">
                    События, встречи и календарные изменения
                  </p>
                </div>
                <Switch
                  id="calendar-notifications"
                  checked={settings?.calendar_notifications || false}
                  onCheckedChange={(checked) => handleSettingChange('calendar_notifications', checked)}
                  disabled={isUpdating}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminder-notifications">Напоминания</Label>
                  <p className="text-sm text-muted-foreground">
                    Персональные напоминания и алерты
                  </p>
                </div>
                <Switch
                  id="reminder-notifications"
                  checked={settings?.reminder_notifications || false}
                  onCheckedChange={(checked) => handleSettingChange('reminder_notifications', checked)}
                  disabled={isUpdating}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-digest">Ежедневная сводка</Label>
                  <p className="text-sm text-muted-foreground">
                    Получать сводку дня с предстоящими задачами
                  </p>
                </div>
                <Switch
                  id="daily-digest"
                  checked={settings?.daily_digest || false}
                  onCheckedChange={(checked) => handleSettingChange('daily_digest', checked)}
                  disabled={isUpdating}
                />
              </div>
            </CardContent>
          </Card>

          {/* Время уведомлений */}
          {settings?.daily_digest && (
            <Card>
              <CardHeader>
                <CardTitle>Время ежедневной сводки</CardTitle>
                <CardDescription>
                  Выберите время получения ежедневной сводки
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Label htmlFor="notification-time">Время:</Label>
                  <Input
                    id="notification-time"
                    type="time"
                    value={settings.notification_time || '09:00'}
                    onChange={(e) => handleSettingChange('notification_time', e.target.value)}
                    className="w-32"
                    disabled={isUpdating}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettingsDialog;


import React from "react";
import { useAuth } from "@/context/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Bell, Settings, Smartphone, ArrowLeft } from "lucide-react";
import { useNotificationSettings } from "@/hooks/notifications/useNotificationSettings";
import { usePushNotifications } from "@/hooks/notifications/usePushNotifications";

const NotificationSettingsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { settings, updateSettings, isUpdating } = useNotificationSettings();
  const { 
    subscriptions, 
    isPushSupported, 
    subscribeToPush, 
    unsubscribeFromPush,
    isSubscribing 
  } = usePushNotifications();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center p-8 border rounded-md bg-muted/10">
            <h2 className="text-xl font-semibold mb-2">Необходимо войти в систему</h2>
            <p className="text-muted-foreground mb-4">
              Для управления настройками уведомлений необходимо авторизоваться
            </p>
            <Button onClick={() => navigate("/auth")}>
              Войти в систему
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSettingChange = (key: string, value: boolean | string) => {
    updateSettings({ [key]: value });
  };

  const hasPushSubscription = subscriptions && subscriptions.length > 0;

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
          </div>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Настройки уведомлений
          </h1>
          <p className="text-muted-foreground">
            Управляйте типами уведомлений и способами их получения
          </p>
        </div>

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
                <p className="text-sm text-muted-foreground">
                  Ваш браузер не поддерживает push-уведомления
                </p>
              ) : (
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
                  {hasPushSubscription ? (
                    <Button
                      variant="outline"
                      onClick={() => subscriptions[0] && unsubscribeFromPush(subscriptions[0].id)}
                    >
                      Отключить
                    </Button>
                  ) : (
                    <Button
                      onClick={() => subscribeToPush()}
                      disabled={isSubscribing}
                    >
                      {isSubscribing ? 'Включение...' : 'Включить'}
                    </Button>
                  )}
                </div>
              )}
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
            <CardContent className="space-y-6">
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
                <div className="flex items-center gap-4">
                  <Label htmlFor="notification-time">Время:</Label>
                  <Input
                    id="notification-time"
                    type="time"
                    value={settings.notification_time || '09:00'}
                    onChange={(e) => handleSettingChange('notification_time', e.target.value)}
                    className="w-32"
                    disabled={isUpdating}
                  />
                  <p className="text-sm text-muted-foreground">
                    Время указано в вашем часовом поясе
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;

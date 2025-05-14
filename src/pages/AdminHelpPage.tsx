
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import DeployDocButton from '@/components/help/DeployDocButton';

const AdminHelpPage: React.FC = () => {
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [lastDeployTime, setLastDeployTime] = useState<string | null>(null);

  useEffect(() => {
    // Проверяем время последней синхронизации документации
    const lastSync = localStorage.getItem('docsLastSync');
    if (lastSync) {
      const syncDate = new Date(parseInt(lastSync));
      setLastUpdateTime(syncDate.toLocaleString());
    } else {
      // Устанавливаем текущее время как время первого посещения
      const currentTime = Date.now().toString();
      localStorage.setItem('docsLastSync', currentTime);
      setLastUpdateTime(new Date(parseInt(currentTime)).toLocaleString());
    }

    // Проверяем время последнего деплоя документации
    const lastDeploy = localStorage.getItem('docsLastDeploy');
    if (lastDeploy) {
      const deployDate = new Date(parseInt(lastDeploy));
      setLastDeployTime(deployDate.toLocaleString());
    }
  }, []);

  const handleSyncUpdate = () => {
    const currentTime = Date.now().toString();
    localStorage.setItem('docsLastSync', currentTime);
    setLastUpdateTime(new Date(parseInt(currentTime)).toLocaleString());
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Руководство администратора</h1>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Управление документацией</span>
            <DeployDocButton />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm mb-4">
            <p className="mb-2">
              <strong>Последнее обновление документации:</strong>{" "}
              {lastUpdateTime || "Нет данных"}
            </p>
            <p>
              <strong>Последний деплой в Mintlify:</strong>{" "}
              {lastDeployTime || "Деплой не выполнялся"}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            При нажатии на кнопку "Деплой в Mintlify" документация будет автоматически собрана и опубликована.
            Также деплой происходит автоматически при пуше в ветку main, если изменения затрагивают файлы документации.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="user-management">Управление пользователями</TabsTrigger>
          <TabsTrigger value="ai-settings">Настройки AI</TabsTrigger>
          <TabsTrigger value="system">Система</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Обзор панели администратора</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <p>
                    Как суперадминистратор KIRA AI, вы имеете доступ к расширенным функциям:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Управление пользователями и правами доступа</li>
                    <li>Настройка параметров AI-ассистента</li>
                    <li>Мониторинг системы и аналитика использования</li>
                    <li>Управление интеграциями и API</li>
                  </ul>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="text-lg font-semibold mb-2">Использование документации Mintlify</h3>
                  <p className="mb-4">
                    Документация автоматически синхронизируется с вашими изменениями в коде.
                    При изменении файлов в директории docs/ или файлов справки в приложении,
                    документация будет автоматически обновлена при следующем деплое.
                  </p>
                  <p>
                    Для ручного деплоя документации нажмите кнопку "Деплой в Mintlify" выше.
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="user-management" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление пользователями</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Создание и редактирование пользователей</h3>
                  <p>
                    Вы можете создавать новых пользователей, редактировать их данные и назначать роли.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-6">Роли доступа</h3>
                  <p>Система поддерживает следующие роли:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>Пользователь (user)</strong> — стандартный доступ к функциям платформы</li>
                    <li><strong>Суперадмин (superadmin)</strong> — полный доступ ко всем функциям и настройкам</li>
                  </ul>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai-settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройка AI-ассистента</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Параметры AI</h3>
                  <p>Настройте поведение AI-ассистента:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Выберите модель языка (GPT-4, GPT-3.5)</li>
                    <li>Настройте контекстный промпт для AI</li>
                    <li>Управляйте доступными командами</li>
                    <li>Настройте ограничения запросов</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mt-6">MiniApps</h3>
                  <p>
                    Управление миниприложениями для расширения функциональности платформы.
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Системные настройки</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Интеграции</h3>
                  <p>Настройка внешних интеграций:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>OpenAI API</li>
                    <li>Google Calendar</li>
                    <li>Telegram</li>
                    <li>GitHub и др.</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mt-6">Мониторинг</h3>
                  <p>
                    Отслеживайте производительность системы, использование ресурсов и активность пользователей.
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHelpPage;

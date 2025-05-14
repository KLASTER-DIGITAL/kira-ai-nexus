
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const UserHelpPage: React.FC = () => {
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

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
  }, []);

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Руководство пользователя</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Добро пожаловать в KIRA AI</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            KIRA AI — это персональный AI-ассистент с встроенным управлением задачами, заметками и календарем.
          </p>
          <p className="text-sm text-muted-foreground">
            Последнее обновление документации: {lastUpdateTime || "Нет данных"}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Общая информация</TabsTrigger>
          <TabsTrigger value="tasks">Задачи</TabsTrigger>
          <TabsTrigger value="notes">Заметки</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI-ассистент</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Общая информация</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <p>
                    KIRA AI — это персональный AI-ассистент с встроенным управлением задачами, заметками и календарем.
                  </p>

                  <h3 className="text-lg font-semibold mt-6">Навигация</h3>
                  <p>Используйте боковую панель для перехода между разделами приложения:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><strong>Дашборд</strong> — сводка ваших текущих задач и событий</li>
                    <li><strong>Чат</strong> — общение с AI-ассистентом</li>
                    <li><strong>Задачи</strong> — управление вашими задачами</li>
                    <li><strong>Заметки</strong> — создание и редактирование заметок</li>
                    <li><strong>Календарь</strong> — просмотр и планирование событий</li>
                  </ul>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Работа с задачами</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Создание задач</h3>
                  <p>
                    Чтобы создать новую задачу, нажмите кнопку "Создать задачу" в разделе Задачи.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-6">Управление задачами</h3>
                  <p>Вы можете:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Отмечать задачи как выполненные</li>
                    <li>Устанавливать приоритеты</li>
                    <li>Добавлять сроки выполнения</li>
                    <li>Группировать задачи по проектам</li>
                  </ul>
                  
                  <Separator className="my-6" />
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Совет</h4>
                    <p className="text-sm">
                      Для быстрого создания задач вы также можете использовать команду "/task" в чате с AI-ассистентом.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Работа с заметками</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Создание заметок</h3>
                  <p>
                    Создавайте заметки с помощью встроенного редактора. Поддерживается Markdown форматирование.
                  </p>
                  
                  <h3 className="text-lg font-semibold mt-6">Связи между заметками</h3>
                  <p>
                    Вы можете связывать заметки между собой, создавая Wiki-ссылки. Для просмотра связей используйте Graph View.
                  </p>
                  
                  <Separator className="my-6" />
                  
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Совет</h4>
                    <p className="text-sm">
                      Используйте двойные квадратные скобки [[название заметки]] для создания ссылок между заметками.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai-assistant" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Использование AI-ассистента</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Возможности AI-ассистента</h3>
                  <p>KIRA AI может:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Отвечать на вопросы</li>
                    <li>Помогать с планированием задач</li>
                    <li>Создавать заметки по вашим запросам</li>
                    <li>Искать информацию в ваших данных</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mt-6">Команды</h3>
                  <p>Используйте специальные команды для управления приложением через чат:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li><code>/task</code> — создать задачу</li>
                    <li><code>/note</code> — создать заметку</li>
                    <li><code>/event</code> — создать событие в календаре</li>
                    <li><code>/help</code> — показать список команд</li>
                  </ul>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserHelpPage;

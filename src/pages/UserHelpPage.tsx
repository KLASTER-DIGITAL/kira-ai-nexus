
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const UserHelpPage: React.FC = () => {
  const { toast } = useToast();
  
  const handleViewDocs = () => {
    // Open documentation in a new tab
    window.open("/docs/help/user-guide", "_blank");
    
    toast({
      title: "Документация открыта",
      description: "Полная документация открыта в новом окне.",
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Помощь пользователю</h1>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Эта документация синхронизирована с Mintlify. 
                Последнее обновление: {new Date().toLocaleDateString()}
              </p>
              <Button variant="outline" onClick={handleViewDocs}>
                <ExternalLink size={16} className="mr-2" />
                Полная документация
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Общая информация</TabsTrigger>
            <TabsTrigger value="tasks">Задачи</TabsTrigger>
            <TabsTrigger value="notes">Заметки</TabsTrigger>
            <TabsTrigger value="chat">Чат с AI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Общая информация</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-medium">Добро пожаловать в KIRA AI</h3>
                    <p>KIRA AI — это персональный AI-ассистент с встроенным управлением задачами, заметками и календарем.</p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Навигация</h3>
                    <p>Используйте боковую панель для перехода между разделами приложения:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Дашборд — сводка ваших текущих задач и событий</li>
                      <li>Чат — общение с AI-ассистентом</li>
                      <li>Задачи — управление вашими задачами</li>
                      <li>Заметки — создание и редактирование заметок</li>
                      <li>Календарь — просмотр и планирование событий</li>
                    </ul>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Работа с задачами</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-medium">Создание задач</h3>
                    <p>Чтобы создать новую задачу, нажмите кнопку "Создать задачу" в разделе Задачи.</p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Управление задачами</h3>
                    <p>Вы можете:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Отмечать задачи как выполненные</li>
                      <li>Устанавливать приоритеты</li>
                      <li>Добавлять сроки выполнения</li>
                      <li>Группировать задачи по проектам</li>
                    </ul>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Работа с заметками</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-medium">Создание заметок</h3>
                    <p>Создавайте заметки с помощью встроенного редактора. Поддерживается Markdown форматирование.</p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Связи между заметками</h3>
                    <p>Вы можете связывать заметки между собой, создавая Wiki-ссылки. Для просмотра связей используйте Graph View.</p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Использование AI-ассистента</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-medium">Возможности AI-ассистента</h3>
                    <p>KIRA AI может:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Отвечать на вопросы</li>
                      <li>Помогать с планированием задач</li>
                      <li>Создавать заметки по вашим запросам</li>
                      <li>Искать информацию в ваших данных</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Команды</h3>
                    <p>Используйте специальные команды для управления приложением через чат:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li><code>/task</code> — создать задачу</li>
                      <li><code>/note</code> — создать заметку</li>
                      <li><code>/event</code> — создать событие в календаре</li>
                      <li><code>/help</code> — показать список команд</li>
                    </ul>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserHelpPage;


import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminHelpPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Обзор</TabsTrigger>
            <TabsTrigger value="users">Управление пользователями</TabsTrigger>
            <TabsTrigger value="ai">Настройка AI</TabsTrigger>
            <TabsTrigger value="system">Системные настройки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Обзор панели администратора</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-medium">Возможности супер-администратора</h3>
                    <p>Как супер-администратор KIRA AI, вы имеете доступ к расширенным функциям:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Управление пользователями и правами доступа</li>
                      <li>Настройка параметров AI-ассистента</li>
                      <li>Мониторинг системы и аналитика использования</li>
                      <li>Управление интеграциями и API</li>
                    </ul>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-medium">Создание и редактирование пользователей</h3>
                    <p>Вы можете создавать новых пользователей, редактировать их данные и назначать роли.</p>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Роли доступа</h3>
                    <p>Система поддерживает следующие роли:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li><strong>Пользователь (user)</strong> — стандартный доступ к функциям платформы</li>
                      <li><strong>Суперадмин (superadmin)</strong> — полный доступ ко всем функциям и настройкам</li>
                    </ul>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>Настройка AI-ассистента</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-medium">Параметры AI</h3>
                    <p>Настройте поведение AI-ассистента:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Выберите модель языка (GPT-4, GPT-3.5)</li>
                      <li>Настройте контекстный промпт для AI</li>
                      <li>Управляйте доступными командами</li>
                      <li>Настройте ограничения запросов</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">MiniApps</h3>
                    <p>Управление миниприложениями для расширения функциональности платформы.</p>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Системные настройки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="text-lg font-medium">Интеграции</h3>
                    <p>Настройка внешних интеграций:</p>
                    <ul className="list-disc pl-5 mt-2">
                      <li>OpenAI API</li>
                      <li>Google Calendar</li>
                      <li>Telegram</li>
                      <li>GitHub и др.</li>
                    </ul>
                  </section>
                  
                  <section>
                    <h3 className="text-lg font-medium">Мониторинг</h3>
                    <p>Отслеживайте производительность системы, использование ресурсов и активность пользователей.</p>
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

export default AdminHelpPage;

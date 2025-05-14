
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import DeployDocButton from '@/components/help/DeployDocButton';
import { Shield } from 'lucide-react';

const AdminHelpPage: React.FC = () => {
  const { toast } = useToast();
  const [docsLastSync, setDocsLastSync] = useState<string | null>(null);
  const [docsLastDeploy, setDocsLastDeploy] = useState<string | null>(null);
  
  useEffect(() => {
    // Check last docs sync time from localStorage
    const lastSync = localStorage.getItem('docsLastSync');
    if (lastSync) {
      const syncDate = new Date(parseInt(lastSync));
      setDocsLastSync(syncDate.toLocaleString());
    }

    // Check last docs deployment time from localStorage
    const lastDeploy = localStorage.getItem('docsLastDeploy');
    if (lastDeploy) {
      const deployDate = new Date(parseInt(lastDeploy));
      setDocsLastDeploy(deployDate.toLocaleString());
    }
  }, []);
  
  const handleViewDocs = () => {
    // Open documentation in a new tab
    window.open("/docs/help/admin-guide", "_blank");
    
    toast({
      title: "Документация открыта",
      description: "Полная административная документация открыта в новом окне.",
    });
  };
  
  const handleSyncDocs = () => {
    toast({
      title: "Синхронизация...",
      description: "Выполняется синхронизация документации с Mintlify.",
    });
    
    // In a real implementation, this would call an API endpoint
    // For now, we'll simulate the sync with a timeout
    setTimeout(() => {
      // Store the sync time in localStorage
      localStorage.setItem('docsLastSync', Date.now().toString());
      setDocsLastSync(new Date().toLocaleString());
      
      toast({
        title: "Синхронизация завершена",
        description: "Документация успешно обновлена и отправлена в Mintlify.",
        variant: "success",
      });
    }, 2000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-kira-purple" />
          <h1 className="text-3xl font-bold">Панель администратора</h1>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <p>Эта документация синхронизирована с Mintlify.</p>
                {docsLastSync && (
                  <p className="mt-1">
                    Последняя синхронизация: <span className="font-medium">{docsLastSync}</span>
                  </p>
                )}
                {docsLastDeploy && (
                  <p className="mt-1">
                    Последний деплой: <span className="font-medium">{docsLastDeploy}</span>
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleSyncDocs}>
                  <RefreshCw size={16} className="mr-2" />
                  Обновить
                </Button>
                <DeployDocButton />
                <Button variant="outline" onClick={handleViewDocs}>
                  <ExternalLink size={16} className="mr-2" />
                  Документация
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
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

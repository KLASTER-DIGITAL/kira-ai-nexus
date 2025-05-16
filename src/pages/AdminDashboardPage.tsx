
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/context/auth';
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { Search, UserX, Shield, ShieldCheck, RefreshCw, BarChart3, Users, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/dashboard/widgets/StatCard";

const AdminDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("users");

  // Статистические данные
  const stats = [
    { 
      title: "Всего пользователей", 
      value: users.length, 
      icon: <Users className="h-4 w-4" />, 
      change: "+12% с прошлого месяца", 
      trend: "up" as const,
      className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
    },
    { 
      title: "Активных сессий", 
      value: "24", 
      icon: <Activity className="h-4 w-4" />, 
      change: "+8% с прошлого месяца", 
      trend: "up" as const,
      className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
    },
    { 
      title: "Новых пользователей", 
      value: "7", 
      icon: <UserX className="h-4 w-4" />, 
      change: "+22% с прошлого месяца", 
      trend: "up" as const,
      className: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
    },
    { 
      title: "Всего заметок", 
      value: "356", 
      icon: <BarChart3 className="h-4 w-4" />, 
      change: "+35% с прошлого месяца", 
      trend: "up" as const,
      className: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
    },
  ];

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось загрузить пользователей",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'superadmin' ? 'user' : 'superadmin';
    
    setIsUpdating(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Update the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Роль обновлена",
        description: `Пользователь теперь ${newRole === 'superadmin' ? 'администратор' : 'обычный пользователь'}`,
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить роль пользователя",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              trend={stat.trend}
              className={stat.className}
            />
          ))}
        </div>

        {/* Табы для разных разделов */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="system">Система</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-2 animate-fade-in">
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Пользователи системы</CardTitle>
                  <CardDescription>
                    Всего пользователей: {users.length}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchUsers}
                  disabled={isLoading}
                  className="shadow-sm hover:shadow"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Обновить
                </Button>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    placeholder="Поиск по email или имени..." 
                    className="pl-10 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Имя</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Дата регистрации</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Загрузка пользователей...</p>
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            <UserX className="h-10 w-10 mx-auto text-muted-foreground" />
                            <p className="mt-2 text-muted-foreground">
                              {searchQuery ? "По вашему запросу ничего не найдено" : "Пользователи не найдены"}
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-mono text-xs">{user.id.slice(0, 8)}...</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.display_name || '—'}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role === 'superadmin' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }`}>
                                {user.role === 'superadmin' ? (
                                  <>
                                    <Shield className="w-3 h-3 mr-1" />
                                    Админ
                                  </>
                                ) : (
                                  'Пользователь'
                                )}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleUserRole(user.id, user.role)}
                                disabled={isUpdating === user.id || user.id === profile?.id}
                                className={user.id === profile?.id ? "opacity-50 cursor-not-allowed" : ""}
                              >
                                {isUpdating === user.id ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : user.role === 'superadmin' ? (
                                  <>
                                    <Shield className="w-4 h-4 mr-2" />
                                    Сделать пользователем
                                  </>
                                ) : (
                                  <>
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    Сделать админом
                                  </>
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system" className="mt-2 animate-fade-in">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Системная информация</CardTitle>
                <CardDescription>
                  Информация о состоянии системы и логи
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted/50 p-4 border">
                  <h3 className="text-lg font-medium mb-2">Состояние системы</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Версия</span>
                      <span>1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Последнее обновление</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Статус</span>
                      <span className="text-green-500">Онлайн</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;

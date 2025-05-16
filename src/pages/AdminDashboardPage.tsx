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

const AdminDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Статистические данные
  const stats = [
    { title: "Всего пользователей", value: users.length, icon: <Users className="h-4 w-4" />, change: "+12%" },
    { title: "Активных сессий", value: "24", icon: <Activity className="h-4 w-4" />, change: "+8%" },
    { title: "Новых пользователей", value: "7", icon: <UserX className="h-4 w-4" />, change: "+22%" },
    { title: "Всего заметок", value: "356", icon: <BarChart3 className="h-4 w-4" />, change: "+35%" },
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
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change} с прошлого месяца</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Табы для разных разделов */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="system">Система</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-4">
            <Card>
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
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
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
          
          <TabsContent value="system" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Системная информация</CardTitle>
                <CardDescription>
                  Информация о состоянии системы и логи
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  В этом разделе будет отображаться информация о работе системы,
                  логи и другие данные, необходимые для администрирования.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;

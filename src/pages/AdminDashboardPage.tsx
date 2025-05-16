
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/context/auth';
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats, UsersManagement, SystemInfoCard } from "@/components/dashboard/admin";

const AdminDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Статистика */}
        <AdminStats users={users} />

        {/* Табы для разных разделов */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="system">Система</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="mt-2 animate-fade-in">
            <UsersManagement 
              users={users} 
              isLoading={isLoading} 
              fetchUsers={fetchUsers}
              profile={profile}
            />
          </TabsContent>
          
          <TabsContent value="system" className="mt-2 animate-fade-in">
            <SystemInfoCard />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;

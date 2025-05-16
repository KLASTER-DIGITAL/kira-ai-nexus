
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { Shield, ShieldCheck, RefreshCw } from "lucide-react";
import { DataTable, Column } from "./data-table";

interface UsersManagementTableProps {
  users: UserProfile[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchUsers: () => Promise<void>;
  profile: UserProfile | null;
}

const UsersManagementTable: React.FC<UsersManagementTableProps> = ({
  users,
  isLoading,
  searchQuery,
  setSearchQuery,
  fetchUsers,
  profile
}) => {
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null);

  // Handle toggling user role
  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'superadmin' ? 'user' : 'superadmin';
    
    setIsUpdating(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // Refresh user data
      await fetchUsers();

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

  // Define columns for DataTable
  const columns: Column<UserProfile>[] = [
    {
      key: "id",
      header: "ID",
      cell: (user) => (
        <span className="font-mono text-xs">{user.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: "email",
      header: "Email",
      cell: (user) => <span>{user.email}</span>,
    },
    {
      key: "display_name",
      header: "Имя",
      cell: (user) => <span>{user.display_name || '—'}</span>,
    },
    {
      key: "role",
      header: "Роль",
      cell: (user) => (
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
      ),
    },
    {
      key: "created_at",
      header: "Дата регистрации",
      cell: (user) => (
        <span className="text-sm text-muted-foreground">
          {new Date(user.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: <div className="text-right">Действия</div>,
      cell: (user) => (
        <div className="text-right">
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
        </div>
      ),
      className: "w-[220px]",
    },
  ];

  // Custom search function
  const searchUsers = (items: UserProfile[], query: string) => {
    return items.filter(user => 
      user.email?.toLowerCase().includes(query.toLowerCase()) ||
      user.display_name?.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <DataTable
      data={users}
      columns={columns}
      isLoading={isLoading}
      searchable={true}
      pagination={true}
      pageSize={10}
      searchKey="email"
      searchPlaceholder="Поиск по email или имени..."
      searchFunction={searchUsers}
      emptyMessage={searchQuery ? "По вашему запросу ничего не найдено" : "Пользователи не найдены"}
    />
  );
};

export default UsersManagementTable;

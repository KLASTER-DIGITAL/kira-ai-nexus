
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";
import { Search, UserX, Shield, ShieldCheck, RefreshCw } from "lucide-react";

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

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      );

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

  return (
    <>
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
    </>
  );
};

export default UsersManagementTable;

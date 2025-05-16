
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import UsersManagementTable from "./UsersManagementTable";
import { UserProfile } from "@/types/auth";

interface UsersManagementProps {
  users: UserProfile[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  profile: UserProfile | null;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ 
  users, 
  isLoading, 
  fetchUsers,
  profile 
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
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
        <UsersManagementTable 
          users={users} 
          isLoading={isLoading} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fetchUsers={fetchUsers}
          profile={profile}
        />
      </CardContent>
    </Card>
  );
};

export default UsersManagement;

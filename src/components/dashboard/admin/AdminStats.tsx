
import React from "react";
import StatCard from "@/components/dashboard/widgets/StatCard";
import { Users, Activity, UserX, BarChart3 } from "lucide-react";
import { UserProfile } from "@/types/auth";

interface AdminStatsProps {
  users: UserProfile[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ users }) => {
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

  return (
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
  );
};

export default AdminStats;

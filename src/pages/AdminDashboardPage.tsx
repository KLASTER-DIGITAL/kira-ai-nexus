
import React from "react";
import { useAuth } from "@/context/auth";
import { 
  Users,
  Database,
  Activity,
  Settings,
  Plus,
  ArrowRight,
  BarChart3,
  CheckSquare,
  Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/dashboard/cards/StatCard";
import ChartCard from "@/components/dashboard/cards/ChartCard";
import OverviewCard from "@/components/dashboard/cards/OverviewCard";

const usersData = [
  { name: "Jan", value: 10 },
  { name: "Feb", value: 15 },
  { name: "Mar", value: 25 },
  { name: "Apr", value: 35 },
  { name: "May", value: 42 },
  { name: "Jun", value: 55 },
  { name: "Jul", value: 70 },
];

const systemData = [
  { name: "Mon", value: 20 },
  { name: "Tue", value: 30 },
  { name: "Wed", value: 10 },
  { name: "Thu", value: 15 },
  { name: "Fri", value: 25 },
  { name: "Sat", value: 5 },
  { name: "Sun", value: 8 },
];

const AdminDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  
  const usersContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">New User Registration</p>
            <p className="text-xs text-muted-foreground">2 hours ago</p>
          </div>
        </div>
        <Button variant="outline" size="sm">View</Button>
      </div>
      <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">User Role Updated</p>
            <p className="text-xs text-muted-foreground">Yesterday</p>
          </div>
        </div>
        <Button variant="outline" size="sm">View</Button>
      </div>
      <Button variant="link" className="px-0 h-auto font-semibold flex items-center w-full justify-end">
        View All Users
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
  
  const systemContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <Database className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">Database Backup Completed</p>
            <p className="text-xs text-muted-foreground">3 hours ago</p>
          </div>
        </div>
        <Button variant="outline" size="sm">Details</Button>
      </div>
      <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">High CPU Usage Alert</p>
            <p className="text-xs text-muted-foreground">Yesterday</p>
          </div>
        </div>
        <Button variant="outline" size="sm">Resolve</Button>
      </div>
    </div>
  );
  
  const settingsContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
            <Settings className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">AI Settings Updated</p>
            <p className="text-xs text-muted-foreground">1 day ago</p>
          </div>
        </div>
        <Button variant="outline" size="sm">View</Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            System overview and management
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New User
        </Button>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value="85"
          icon={<Users className="h-4 w-4" />}
          description="Active accounts"
          change={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="System Load"
          value="42%"
          icon={<Activity className="h-4 w-4" />}
          description="Average usage"
          change={{ value: 8, isPositive: false }}
        />
        <StatCard
          title="Storage"
          value="1.2GB"
          icon={<Database className="h-4 w-4" />}
          description="Of 10GB used"
          change={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Response Time"
          value="124ms"
          icon={<Clock className="h-4 w-4" />}
          description="Average"
          change={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ChartCard
          title="User Growth"
          description="Monthly new user registrations"
          data={usersData}
          valueKey="value"
          type="area"
          color="#8B5CF6"
          className="col-span-4"
        />
        
        <ChartCard
          title="System Activity" 
          data={systemData}
          valueKey="value"
          type="line"
          color="#3B82F6"
          height={150}
          className="col-span-3"
        />
      </div>

      {/* Tab cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <OverviewCard
          title="System Overview"
          tabs={[
            { value: "users", label: "Users", content: usersContent },
            { value: "system", label: "System", content: systemContent },
            { value: "settings", label: "Settings", content: settingsContent },
          ]}
          defaultTab="users"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequent administrative actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Database Settings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              AI Configuration
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="mr-2 h-4 w-4" />
              View System Logs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

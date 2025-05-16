
import React from "react";
import { useAuth } from "@/context/auth";
import { 
  NotepadText, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Clock, 
  BarChart3, 
  Star, 
  Plus,
  ArrowRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/cards/StatCard";
import ChartCard from "@/components/dashboard/cards/ChartCard";
import OverviewCard from "@/components/dashboard/cards/OverviewCard";

const activityData = [
  { name: "Mon", value: 4 },
  { name: "Tue", value: 6 },
  { name: "Wed", value: 8 },
  { name: "Thu", value: 5 },
  { name: "Fri", value: 10 },
  { name: "Sat", value: 3 },
  { name: "Sun", value: 2 },
];

const notesData = [
  { name: "Week 1", value: 5 },
  { name: "Week 2", value: 8 },
  { name: "Week 3", value: 12 },
  { name: "Week 4", value: 10 },
];

const UserDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  
  const recentNotes = (
    <div className="space-y-2">
      <div className="flex items-center p-2 rounded-md hover:bg-muted">
        <NotepadText className="h-4 w-4 mr-2" />
        <div className="flex-1">
          <p className="font-medium">Project Notes</p>
          <p className="text-xs text-muted-foreground">Updated 2 hours ago</p>
        </div>
      </div>
      <div className="flex items-center p-2 rounded-md hover:bg-muted">
        <NotepadText className="h-4 w-4 mr-2" />
        <div className="flex-1">
          <p className="font-medium">Development Ideas</p>
          <p className="text-xs text-muted-foreground">Updated yesterday</p>
        </div>
      </div>
      <div className="flex items-center p-2 rounded-md hover:bg-muted">
        <NotepadText className="h-4 w-4 mr-2" />
        <div className="flex-1">
          <p className="font-medium">Weekly Plan</p>
          <p className="text-xs text-muted-foreground">Updated 3 days ago</p>
        </div>
      </div>
      <Button variant="link" className="px-0 h-auto font-semibold flex items-center w-full justify-end">
        View All Notes
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
  
  const favoritesContent = (
    <div className="space-y-2">
      <div className="flex items-center p-2 rounded-md hover:bg-muted">
        <Star className="h-4 w-4 text-amber-500 mr-2" />
        <div className="flex-1">
          <p className="font-medium">Important Document</p>
          <p className="text-xs text-muted-foreground">Note</p>
        </div>
      </div>
      <div className="flex items-center p-2 rounded-md hover:bg-muted">
        <Star className="h-4 w-4 text-amber-500 mr-2" />
        <div className="flex-1">
          <p className="font-medium">Client Meeting</p>
          <p className="text-xs text-muted-foreground">Event</p>
        </div>
      </div>
    </div>
  );
  
  const activityContent = (
    <div className="space-y-4">
      <div className="border-l-2 border-primary pl-4 ml-2">
        <p className="text-sm">Created new task: "Prepare report"</p>
        <p className="text-xs text-muted-foreground">15:30, today</p>
      </div>
      <div className="border-l-2 border-primary pl-4 ml-2">
        <p className="text-sm">Updated note: "Quarterly Plans"</p>
        <p className="text-xs text-muted-foreground">12:45, today</p>
      </div>
      <div className="border-l-2 border-primary pl-4 ml-2">
        <p className="text-sm">Added event: "Weekly Meeting"</p>
        <p className="text-xs text-muted-foreground">09:15, today</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.display_name || 'User'}!</h2>
          <p className="text-muted-foreground">
            Here's what's happening in your workspace today.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New
        </Button>
      </div>
      
      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Notes"
          value="12"
          icon={<NotepadText className="h-4 w-4" />}
          description="3 new this week"
          change={{ value: 10, isPositive: true }}
        />
        <StatCard
          title="Tasks"
          value="8"
          icon={<CheckSquare className="h-4 w-4" />}
          description="5 active tasks"
          change={{ value: 20, isPositive: true }}
        />
        <StatCard
          title="Events"
          value="3"
          icon={<CalendarIcon className="h-4 w-4" />}
          description="Today"
          change={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Work Time"
          value="3.5h"
          icon={<Clock className="h-4 w-4" />}
          description="Today"
          change={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Charts and overviews */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ChartCard
          title="Activity"
          description="Your activity over time"
          data={activityData}
          valueKey="value"
          type="area"
          color="hsl(var(--primary))"
          className="col-span-4"
        />
        
        <ChartCard
          title="Notes Created" 
          data={notesData}
          valueKey="value"
          type="line"
          color="#8B5CF6"
          height={150}
          className="col-span-3"
        />
      </div>

      {/* Tab cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <OverviewCard
          title="Your Content"
          tabs={[
            { value: "recent", label: "Recent", content: recentNotes },
            { value: "favorites", label: "Favorites", content: favoritesContent },
            { value: "activity", label: "Activity", content: activityContent },
          ]}
          defaultTab="recent"
        />
        
        <Card>
          <CardHeader>
            <CardTitle>What's New</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Star className="text-amber-500 h-4 w-4 mr-2" /> New Feature
              </div>
              <p className="text-sm mt-1">Graph View now supports filtering by tags and content type.</p>
              <Button variant="link" className="px-0 h-6 mt-1">Learn more</Button>
            </div>
            <div className="border rounded-lg p-3">
              <div className="font-semibold flex items-center">
                <Star className="text-amber-500 h-4 w-4 mr-2" /> Tip
              </div>
              <p className="text-sm mt-1">Use keyboard shortcuts for faster navigation. Press "?" to see all available shortcuts.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboardPage;

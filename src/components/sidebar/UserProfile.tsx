
import React from "react";
import { useAuth } from "@/context/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  collapsed?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ collapsed }) => {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full h-auto p-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="bg-kira-purple text-white">
                {profile?.display_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {profile?.display_name || profile?.email || "User"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url || ""} />
          <AvatarFallback className="bg-kira-purple text-white">
            {profile?.display_name?.charAt(0) || profile?.email?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{profile?.display_name || profile?.email || "User"}</p>
          <p className="text-xs text-muted-foreground">{profile?.role === "superadmin" ? "Admin" : "User"}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserProfile;

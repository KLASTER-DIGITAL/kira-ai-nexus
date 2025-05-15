
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, FileText, CheckSquare, Calendar, MessageSquare, BarChart3, Network, GitFork } from "lucide-react";

interface NavItemProps {
  title: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const NavItem: React.FC<NavItemProps> = ({ title, href, icon, color }) => {
  return (
    <li>
      <Link
        to={href}
        className="flex items-center space-x-2 p-2 text-sm font-medium hover:underline"
      >
        <span className={color}>{icon}</span>
        <span>{title}</span>
      </Link>
    </li>
  );
};

const navItems = [
  {
    title: "Дашборд",
    href: "/dashboard",
    icon: <BarChart3 className="h-5 w-5" />,
    color: "text-violet-500",
  },
  {
    title: "Заметки",
    href: "/notes",
    icon: <FileText className="h-5 w-5" />,
    color: "text-emerald-500",
  },
  {
    title: "Задачи",
    href: "/tasks",
    icon: <CheckSquare className="h-5 w-5" />,
    color: "text-blue-500",
  },
  {
    title: "Календарь",
    href: "/calendar",
    icon: <Calendar className="h-5 w-5" />,
    color: "text-amber-500",
  },
  {
    title: "Чат",
    href: "/chat",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "text-pink-500",
  },
  {
    title: "Граф связей",
    href: "/graph",
    icon: <Network className="h-5 w-5" />,
    color: "text-purple-500",
  },
];

const Sidebar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <GitFork className="h-[1.2rem] w-[1.2rem] rotate-90" />
          <span className="sr-only">Открыть боковое меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64">
        <SheetHeader className="text-left">
          <SheetTitle>Меню</SheetTitle>
          <SheetDescription>
            Здесь вы можете управлять своей учетной записью и настройками.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="mt-4">
          <div className="mb-4 flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{user?.email}</p>
              <p className="text-sm text-muted-foreground">
                {user?.email ? "Подключен" : "Не подключен"}
              </p>
            </div>
          </div>
          <Separator />
          <nav className="grid gap-6">
            <ul className="grid gap-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                  icon={item.icon}
                  color={item.color}
                />
              ))}
            </ul>
          </nav>
          <Separator />
          <div className="mt-4 flex flex-col space-y-2">
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;

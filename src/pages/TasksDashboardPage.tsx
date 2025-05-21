
import React from "react";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { TasksDashboard } from "@/components/features/tasks/analytics";
import { CheckSquare } from "lucide-react";

const TasksDashboardPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center p-8 border rounded-md bg-muted/10">
            <h2 className="text-xl font-semibold mb-2">Необходимо войти в систему</h2>
            <p className="text-muted-foreground mb-4">
              Для просмотра и управления задачами необходимо авторизоваться
            </p>
            <Button onClick={() => navigate("/auth")}>
              Войти в систему
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Аналитика задач</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to="/tasks">
            <CheckSquare className="h-4 w-4 mr-2" />
            Вернуться к задачам
          </Link>
        </Button>
      </div>
      <div className="max-w-5xl mx-auto">
        <TasksDashboard />
      </div>
    </div>
  );
};

export default TasksDashboardPage;

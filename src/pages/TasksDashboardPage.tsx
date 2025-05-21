
import React from "react";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TasksDashboard } from "@/components/features/tasks/analytics";

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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Аналитика задач</h1>
        <TasksDashboard />
      </div>
    </div>
  );
};

export default TasksDashboardPage;

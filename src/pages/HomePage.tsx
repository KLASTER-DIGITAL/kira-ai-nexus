
import React from "react";
import Layout from "@/components/layout/Layout";

const HomePage: React.FC = () => {
  return (
    <Layout title="Главная">
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Добро пожаловать в KIRA AI</h1>
        <p className="mb-4">
          AI-ассистент с задачами, заметками, календарем и интеграциями.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-2">Заметки</h2>
            <p className="text-muted-foreground">
              Создавайте заметки с поддержкой Markdown и связывайте их между собой.
            </p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-2">Задачи</h2>
            <p className="text-muted-foreground">
              Управляйте задачами, устанавливайте сроки и отслеживайте прогресс.
            </p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-2">Календарь</h2>
            <p className="text-muted-foreground">
              Синхронизируйте события из Google Calendar и планируйте день.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

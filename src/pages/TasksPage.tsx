
import React from "react";
import Layout from "@/components/layout/Layout";
import TaskList from "@/components/tasks/TaskList";

const TasksPage: React.FC = () => {
  return (
    <Layout title="Задачи">
      <div className="max-w-4xl mx-auto">
        <TaskList />
      </div>
    </Layout>
  );
};

export default TasksPage;

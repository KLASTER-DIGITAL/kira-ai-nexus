
import React from "react";
import NotesGraph from "@/components/notes/graph/NotesGraph";
import { PageHeader } from "@/components/layouts/PageHeader";

const NotesGraphPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Граф заметок" 
        description="Визуализация связей между заметками"
      />
      <NotesGraph />
    </div>
  );
};

export default NotesGraphPage;

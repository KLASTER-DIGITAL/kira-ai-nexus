
import React from "react";
import Layout from "@/components/layout/Layout";
import NotesGraph from "@/components/notes/graph/NotesGraph";

const NotesGraphPage: React.FC = () => {
  return (
    <Layout title="Граф заметок">
      <div className="container mx-auto">
        <NotesGraph />
      </div>
    </Layout>
  );
};

export default NotesGraphPage;

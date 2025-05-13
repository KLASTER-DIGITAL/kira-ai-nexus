
import React from "react";
import Layout from "@/components/layout/Layout";
import NotesList from "@/components/notes/NotesList";

const NotesPage: React.FC = () => {
  return (
    <Layout title="Заметки">
      <div className="max-w-4xl mx-auto">
        <NotesList />
      </div>
    </Layout>
  );
};

export default NotesPage;

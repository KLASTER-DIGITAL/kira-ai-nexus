
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import NotesList from "@/components/notes/NotesList";
import { Button } from "@/components/ui/button";
import { Network } from "lucide-react";

const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Layout 
      title="Заметки"
      actions={
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => navigate("/notes/graph")}
        >
          <Network size={16} />
          <span>Граф связей</span>
        </Button>
      }
    >
      <div className="container mx-auto">
        <NotesList />
      </div>
    </Layout>
  );
};

export default NotesPage;


import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import NotesContent from "@/components/notes/content/NotesContent";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Проверим, какие пропсы принимает NotesContent
// Если NotesContent ожидает другие пропсы, мы должны адаптироваться
// Здесь предполагаем, что компонент из /components/features/notes/content/NotesContent.tsx

const NotesPage: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const actions = (
    <Button 
      variant="default" 
      onClick={() => setShowCreateDialog(true)}
      className="flex items-center gap-1"
    >
      <PlusCircle className="h-4 w-4" /> 
      Создать заметку
    </Button>
  );

  return (
    <DashboardLayout title="Заметки" actions={actions}>
      <div className="container mx-auto pb-20">
        <NotesContent />
      </div>
    </DashboardLayout>
  );
};

export default NotesPage;

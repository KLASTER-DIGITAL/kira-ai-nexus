
import React, { useState } from "react";
import { MoreVertical, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}

const NotesList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "План разработки KIRA AI",
      content: "1. Создать MVP версию\n2. Добавить интеграцию с OpenAI\n3. Разработать MiniApps Marketplace",
      date: "2025-05-13",
      color: "bg-yellow-100",
    },
    {
      id: "2",
      title: "Функции для следующего релиза",
      content: "- Голосовой интерфейс\n- Интеграция с календарем\n- Расширенная аналитика",
      date: "2025-05-13",
      color: "bg-blue-100",
    },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Мои заметки</h3>
        <Button size="sm" variant="outline" className="flex items-center gap-1">
          <Plus size={14} />
          <span>Новая заметка</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-3 rounded-md border ${note.color} cursor-pointer hover:shadow-md transition-shadow`}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-medium">{note.title}</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="-mr-2">
                    <MoreVertical size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Редактировать</DropdownMenuItem>
                  <DropdownMenuItem>Поделиться</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm whitespace-pre-line mb-2">{note.content}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar size={12} className="mr-1" />
              {new Date(note.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesList;

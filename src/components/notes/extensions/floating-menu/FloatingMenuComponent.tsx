
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { 
  Heading1,
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Table,
  CheckSquare
} from 'lucide-react';

interface FloatingMenuComponentProps {
  editor: Editor;
}

const FloatingMenuComponent: React.FC<FloatingMenuComponentProps> = ({ editor }) => {
  const menuItems = [
    {
      icon: Heading1,
      label: 'Заголовок 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 })
    },
    {
      icon: Heading2,
      label: 'Заголовок 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 })
    },
    {
      icon: Heading3,
      label: 'Заголовок 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 })
    },
    {
      icon: List,
      label: 'Маркированный список',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList')
    },
    {
      icon: ListOrdered,
      label: 'Нумерованный список',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList')
    },
    {
      icon: CheckSquare,
      label: 'Список задач',
      action: () => editor.chain().focus().toggleList('taskList', 'taskItem').run(),
      isActive: () => editor.isActive('taskList')
    },
    {
      icon: Quote,
      label: 'Цитата',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote')
    },
    {
      icon: Code,
      label: 'Код',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock')
    }
  ];

  return (
    <div className="floating-menu flex flex-col gap-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
      {menuItems.map((item, index) => (
        <Button
          key={index}
          variant={item.isActive() ? 'default' : 'ghost'}
          size="sm"
          onClick={item.action}
          className="justify-start h-8 w-8 p-0"
          title={item.label}
        >
          <item.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};

export default FloatingMenuComponent;

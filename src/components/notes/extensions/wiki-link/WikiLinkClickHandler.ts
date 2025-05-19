
import { Editor } from '@tiptap/react';

/**
 * Добавляет обработчики клика к вики-ссылкам в режиме чтения
 */
export const addWikiLinkClickHandlers = (
  editor: Editor,
  onLinkClick: (href: string) => void
) => {
  // Получаем DOM-контейнер редактора
  const editorElement = editor.view.dom;
  
  // Функция обработки клика
  const handleClick = (event: MouseEvent) => {
    const element = event.target as HTMLElement;
    
    // Проверяем, был ли клик по ссылке с классом wiki-link
    if (element.closest('.wiki-link')) {
      event.preventDefault();
      const href = element.getAttribute('href') || '';
      onLinkClick(href);
    }
  };
  
  // Добавляем обработчик событий
  editorElement.addEventListener('click', handleClick);
  
  // Возвращаем функцию для удаления обработчика (cleanup)
  return () => {
    editorElement.removeEventListener('click', handleClick);
  };
};

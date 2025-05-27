
import { Extension } from '@tiptap/core';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';

export const CustomBubbleMenu = BubbleMenu.configure({
  element: document.createElement('div'),
  tippyOptions: {
    duration: 100,
    placement: 'top',
    interactive: true,
    trigger: 'manual',
    hideOnClick: false,
  },
  shouldShow: ({ editor, view, state, oldState, from, to }) => {
    // Показываем только если есть выделение текста
    const { selection } = state;
    const { empty } = selection;
    
    // Не показываем если нет выделения или выделен только один символ
    if (empty || to - from < 2) {
      return false;
    }
    
    // Не показываем в режиме редактирования кода
    if (editor.isActive('codeBlock')) {
      return false;
    }
    
    return true;
  },
});

export default CustomBubbleMenu;

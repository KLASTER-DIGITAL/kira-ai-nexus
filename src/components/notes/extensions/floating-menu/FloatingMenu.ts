
import { Extension } from '@tiptap/core';
import { FloatingMenu } from '@tiptap/extension-floating-menu';

export const CustomFloatingMenu = FloatingMenu.configure({
  element: document.createElement('div'),
  tippyOptions: {
    duration: 100,
    placement: 'left-start',
    interactive: true,
    trigger: 'manual',
    hideOnClick: false,
  },
  shouldShow: ({ editor, view, state, oldState }) => {
    const { selection } = state;
    const { $anchor, empty } = selection;
    
    // Показываем только если курсор в пустой строке
    if (!empty) {
      return false;
    }
    
    // Проверяем, что мы в пустом параграфе
    const isRootDepth = $anchor.depth === 1;
    const isEmptyTextBlock = $anchor.parent.isTextblock && 
                            !$anchor.parent.type.spec.code && 
                            !$anchor.parent.textContent;
    
    return isRootDepth && isEmptyTextBlock;
  },
});

export default CustomFloatingMenu;

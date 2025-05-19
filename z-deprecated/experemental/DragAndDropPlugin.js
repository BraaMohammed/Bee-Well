import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

function DragAndDropPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleDragStart = (event) => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const content = range.cloneContents();

      event.dataTransfer.setData('text/html', content.outerHTML);
      event.dataTransfer.setData('text/plain', content.textContent);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const handleDrop = (event) => {
      event.preventDefault();
      const content = event.dataTransfer.getData('text/html');
      
      editor.update(() => {
        const selection = window.getSelection();
        if (selection.rangeCount) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const fragment = range.createContextualFragment(content);
          range.insertNode(fragment);
        }
      });
    };

    editor.getRootElement().addEventListener('dragstart', handleDragStart);
    editor.getRootElement().addEventListener('dragover', handleDragOver);
    editor.getRootElement().addEventListener('drop', handleDrop);

    return () => {
      editor.getRootElement().removeEventListener('dragstart', handleDragStart);
      editor.getRootElement().removeEventListener('dragover', handleDragOver);
      editor.getRootElement().removeEventListener('drop', handleDrop);
    };
  }, [editor]);

  return null;
}

export default DragAndDropPlugin;
import { createEditor, $getRoot } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

export function convertEditorStateToHtml(editorStateJson) {
  console.log('Editor State JSON:', editorStateJson); // Log the input JSON

  const editor = createEditor();
  let htmlString = '';

  try {
    const editorState = editor.parseEditorState(editorStateJson);
    console.log('Parsed Editor State:', editorState); // Log the parsed editor state

    editor.update(() => {
      editor.setEditorState(editorState);
      const root = $getRoot();
      htmlString = $generateHtmlFromNodes(editor, root);
      console.log('Generated HTML:', htmlString); // Log the generated HTML
    });
  } catch (error) {
    console.error('Error converting editor state to HTML:', error); // Log any errors
  }

  return htmlString;
}

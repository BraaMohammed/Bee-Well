export function convertStateToHtml(stateJson) {
  const state = typeof stateJson === 'string' ? JSON.parse(stateJson) : stateJson;

  function nodeToHtml(node, parentNode = null) {
    switch (node.type) {
      case 'paragraph':
        return `<p>${node.children.map(child => nodeToHtml(child, node)).join('')}</p>`;
      case 'text':
        let text = node.text;
        if (node.format & 1) text = `<strong>${text}</strong>`;
        if (node.format & 2) text = `<em>${text}</em>`;
        if (node.format & 4) text = `<u>${text}</u>`;
        if (node.format & 8) text = `<del>${text}</del>`;
        if (node.style) text = `<span style="${node.style}">${text}</span>`;
        return text;
      case 'heading':
        const level = node.tag.slice(1); // 'h1' -> '1'
        return `<h${level}>${node.children.map(child => nodeToHtml(child, node)).join('')}</h${level}>`;
      case 'list':
        const listClass = node.listType === 'check' ? 'list-none' : (node.listType === 'number' ? 'list-decimal' : 'list-disc');
        return `<ul class="list-inside ${listClass}">${node.children.map(child => nodeToHtml(child, node)).join('')}</ul>`;
      case 'listitem':
        let listItemContent = node.children.map(child => nodeToHtml(child, node)).join('');
        if (parentNode && parentNode.listType === 'check') {
          const checkedIcon = node.value ? '✅' : '⬜';
          return `<li class="flex items-center"><span class="mr-2">${checkedIcon}</span>${listItemContent}</li>`;
        }
        return `<li>${listItemContent}</li>`;
      case 'quote':
        return `<blockquote class="border-l-4 border-gray-300 pl-4 italic">${node.children.map(child => nodeToHtml(child, node)).join('')}</blockquote>`;
      case 'code':
        return `<pre><code>${node.children.map(child => child.text).join('\n')}</code></pre>`;
      case 'image':
        return `<img src="${node.src}" alt="${node.altText || ''}" class="max-w-full h-auto" />`;
      case 'table':
        return `<table class="w-full border-collapse border border-gray-300">${node.children.map(child => nodeToHtml(child, node)).join('')}</table>`;
      case 'tablerow':
        return `<tr>${node.children.map(child => nodeToHtml(child, node)).join('')}</tr>`;
      case 'tablecell':
        const cellType = node.headerState !== 0 ? 'th' : 'td';
        const cellClass = cellType === 'th' ? 'font-bold' : '';
        return `<${cellType} class="border border-gray-300 p-2 ${cellClass}">${node.children.map(child => nodeToHtml(child, node)).join('')}</${cellType}>`;
      case 'youtube':
        return `<div class="aspect-w-16 aspect-h-9"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${node.videoID}" frameborder="0" allowfullscreen></iframe></div>`;
      default:
     //   console.warn(`Unhandled node type: ${node.type}`);
        return '';
    }
  }
  if (!state || !state.root || !state.root.children) {
    return '';
  }
  return state.root.children.map(child => nodeToHtml(child)).join('');
}

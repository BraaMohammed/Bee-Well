
'use client'
import parse from 'html-react-parser';

function addTailwindClasses(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    function processNode(node) {
        switch (node.nodeName) {
            case 'P':
                node.className = 'mb-2 text-red';
                break;
            case 'H1':
                node.className = 'text-4xl font-bold mb-4';
                break;
            case 'H2':
                node.className = 'text-3xl font-semibold mb-3';
                break;
            case 'H3':
                node.className = 'text-2xl font-medium mb-2';
                break;
            case 'UL':
                node.className = 'list-disc list-inside mb-4';
                break;
            case 'OL':
                node.className = 'list-decimal list-inside mb-4';
                break;
            case 'LI':
                if (node.querySelector('input[type="checkbox"]')) {
                    node.className = 'flex items-center gap-2 mb-2';
                }
                break;
            case 'TABLE':
                node.className = 'w-full border-collapse mb-4';
                break;
            case 'TD':
            case 'TH':
                node.className = 'border border-gray-300 px-4 py-2';
                break;
            case 'BLOCKQUOTE':
                node.className = 'border-l-4 border-gray-300 pl-4 italic mb-4';
                break;
            case 'PRE':
                node.className = 'bg-gray-100 p-4 rounded mb-4';
                break;
            case 'CODE':
                node.className = 'font-mono bg-gray-100 px-1 rounded';
                break;
            case 'EM':
                node.className = 'italic';
                break;
            case 'STRONG':
                node.className = 'font-bold';
                break;
            case 'U':
                node.className = 'underline';
                break;
            case 'S':
                node.className = 'line-through';
                break;
            case 'SPAN':
                const textColor = node.getAttribute('data-text-color');
                if (textColor) {
                    let tailwindClass;
                    switch (textColor.toLowerCase()) {
                        case 'gray':
                            tailwindClass = 'text-gray-500';
                            break;
                        case 'brown':
                            tailwindClass = 'text-yellow-800';
                            break;
                        case 'red':
                            tailwindClass = 'text-red-500';
                            break;
                        case 'orange':
                            tailwindClass = 'text-orange-500';
                            break;
                        case 'yellow':
                            tailwindClass = 'text-yellow-500';
                            break;
                        case 'green':
                            tailwindClass = 'text-green-500';
                            break;
                        case 'blue':
                            tailwindClass = 'text-blue-500';
                            break;
                        case 'purple':
                            tailwindClass = 'text-purple-500';
                            break;
                        case 'pink':
                            tailwindClass = 'text-pink-500';
                            break;
                        default:
                            tailwindClass = 'text-black'; // Fallback or default color
                    }
                    node.className = tailwindClass;
                    node.removeAttribute('data-text-color'); // Remove the attribute
                }
                break;
        }

        node.childNodes.forEach((child) => {
            if (child.nodeType === 1) {
                processNode(child);
            }
        });
    }

    processNode(doc.body);

    // Convert the modified DOM back to a string
    return parse(doc.body.innerHTML.replace(/class=/g, 'className='));
}

export default addTailwindClasses;

//    return doc.body.innerHTML.replace(/class=/g, 'className=');

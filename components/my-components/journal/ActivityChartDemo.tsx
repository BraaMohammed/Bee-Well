import React from 'react';
import { JournalActivityChart } from './JournalActivityChart';
import { subDays } from 'date-fns';

// Demo component to showcase the improved JournalActivityChart
export function ActivityChartDemo() {
  const today = new Date();
  
  // Mock template content
  const mockTemplate = {
    content: [
      {
        type: 'paragraph',
        content: [{ text: 'How are you feeling today?' }],
        props: {}
      },
      {
        type: 'paragraph', 
        content: [{ text: 'What are you grateful for?' }],
        props: {}
      }
    ]
  };

  // Mock entries with some that match template and some that don't
  const mockEntries = [
    {
      id: '1',
      date: subDays(today, 1),
      content: [
        {
          type: 'paragraph',
          content: [{ text: 'How are you feeling today?' }],
          props: {}
        },
        {
          type: 'paragraph',
          content: [{ text: 'What are you grateful for?' }],
          props: {}
        }
      ]
    },
    {
      id: '2', 
      date: subDays(today, 3),
      content: [
        {
          type: 'paragraph',
          content: [{ text: 'How are you feeling today? I feel amazing today!' }],
          props: {}
        },
        {
          type: 'paragraph',
          content: [{ text: 'What are you grateful for? I\'m grateful for my family and good health.' }],
          props: {}
        }
      ]
    },
    {
      id: '3',
      date: subDays(today, 7), 
      content: [
        {
          type: 'paragraph',
          content: [{ text: 'Today was a challenging but rewarding day. I learned so much!' }],
          props: {}
        }
      ]
    }
  ];

  const mockWrittenDates = mockEntries.map(entry => entry.date);

  return (
    <div className="p-8 bg-neutral-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-neutral-900">Journal Activity Chart Demo</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-neutral-800">Key Improvements:</h2>
        <ul className="list-disc list-inside space-y-2 text-neutral-700 mb-6">
          <li><strong>Smart Template Comparison:</strong> Only shows activity when entries differ meaningfully from the template</li>
          <li><strong>Modern Glassmorphism Design:</strong> Beautiful gradient backgrounds with backdrop blur effects</li>
          <li><strong>Enhanced Visual Elements:</strong> Improved hover effects, shadows, and color scheme</li>
          <li><strong>Better Typography:</strong> Gradient text effects and improved font weights</li>
          <li><strong>Responsive Design:</strong> Better spacing and layout for all screen sizes</li>
        </ul>
      </div>

      <JournalActivityChart 
        writtenDates={mockWrittenDates}
        entries={mockEntries}
        template={mockTemplate}
        className="max-w-4xl"
      />
      
      <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-3 text-neutral-800">How it Works:</h3>
        <div className="space-y-2 text-sm text-neutral-600">
          <p><strong>Entry 1 (yesterday):</strong> Matches template exactly → No activity shown</p>
          <p><strong>Entry 2 (3 days ago):</strong> Has meaningful additions to template → Activity shown</p>
          <p><strong>Entry 3 (7 days ago):</strong> Completely different from template → Activity shown</p>
        </div>
      </div>
    </div>
  );
}
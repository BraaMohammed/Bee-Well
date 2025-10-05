import { useState, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, isSameDay, subDays } from 'date-fns';
import { cn } from "@/lib/utils";

interface JournalActivityChartProps {
  writtenDates: Date[];
  entries?: any[]; // Array of journal entries for content checking
  template?: any; // Journal template to compare against
  className?: string;
}

export function JournalActivityChart({ writtenDates, entries = [], template, className }: JournalActivityChartProps) {
  const today = new Date();
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  
  // Create a map of entries by date for easy lookup
  const entriesByDate = useMemo(() => {
    const map = new Map<string, any>();
    entries.forEach(entry => {
      if (entry && entry.date) {
        const dateStr = new Date(entry.date).toISOString().split('T')[0];
        map.set(dateStr, entry);
      }
    });
    return map;
  }, [entries]);

  // Helper function to check if entry content is significantly different from template
  const isContentDifferentFromTemplate = useCallback((entryContent: any[], templateContent?: any[]): boolean => {
    if (!templateContent || templateContent.length === 0) {
      // If no template, consider any non-empty content as different
      return entryContent && entryContent.length > 0 && 
             entryContent.some(block => 
               block.content && 
               Array.isArray(block.content) && 
               block.content.some((item: any) => 
                 item.text && item.text.trim().length > 0
               )
             );
    }

    if (!entryContent || entryContent.length === 0) return false;

    // Extract text content from blocks for comparison
    const extractTextContent = (blocks: any[]): string => {
      return blocks.map(block => {
        if (block.content && Array.isArray(block.content)) {
          return block.content.map((item: any) => item.text || '').join(' ');
        }
        return '';
      }).join(' ').trim();
    };

    const entryText = extractTextContent(entryContent);
    const templateText = extractTextContent(templateContent);

    // Consider content different if:
    // 1. Entry has significantly more text than template (user added content)
    // 2. Entry text is substantially different from template text
    return entryText.length > templateText.length * 1.1 || // 10% more content
           (entryText.length > 0 && entryText !== templateText);
  }, []);

  // Generate last 365 days
  const days = useMemo(() => {
    const result: Date[] = [];
    for (let i = 0; i < 365; i++) {
      result.unshift(subDays(today, i));
    }
    return result;
  }, [today]);

  // Group days by week for the grid
  const weeks = useMemo(() => {
    const result: Date[][] = [];
    let currentWeek: Date[] = [];

    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [days]);  // Calculate activity level (0-4) for a given date
  const getActivityLevel = useCallback((date: Date): number => {
    // Check if the date matches any of our written dates
    const matchingDate = writtenDates.find(d => isSameDay(d, date));
    
    if (matchingDate) {
      // If we have a matching date, check if the entry content differs from template
      const dateStr = matchingDate.toISOString().split('T')[0];
      const entry = entriesByDate.get(dateStr);
      
      if (entry && entry.content && Array.isArray(entry.content)) {
        // Check if the entry content is different from the template
        const isDifferent = isContentDifferentFromTemplate(entry.content, template?.content);
        return isDifferent ? 4 : 0;
      }
    }
    
    return 0; // No entry found for this date or entry is same as template
  }, [writtenDates, entriesByDate, template, isContentDifferentFromTemplate]);
  // Get tooltip text for a date
  const getTooltipText = useCallback((date: Date): string => {
    const matchingDate = writtenDates.find(d => isSameDay(d, date));
    
    if (matchingDate) {
      const dateStr = matchingDate.toISOString().split('T')[0];
      const entry = entriesByDate.get(dateStr);
      
      if (entry && entry.content && Array.isArray(entry.content)) {
        const isDifferent = isContentDifferentFromTemplate(entry.content, template?.content);
        return `${format(date, 'MMM d, yyyy')}: ${isDifferent ? 'Journal written' : 'No changes from template'}`;
      }
      
      return `${format(date, 'MMM d, yyyy')}: Empty entry`;
    }
    
    return `${format(date, 'MMM d, yyyy')}: No entry`;
  }, [writtenDates, entriesByDate, template, isContentDifferentFromTemplate]);

  return (
    <Card className={cn("bg-neutral-600 border-none shadow-xl shadow-neutral-600 rounded-xl p-6 flex flex-col items-center w-full", className)}>
      <CardHeader className="w-full text-neutral-200 pb-4">
        <CardTitle className="text-xl font-semibold mb-2">Journal Activity</CardTitle>
        <CardDescription className="text-neutral-300 text-sm">Your meaningful writing activity over the past year</CardDescription>
      </CardHeader>      <CardContent className="w-full">
        <div className="w-full overflow-x-auto">
          <div className="flex flex-col gap-2 w-full min-w-[700px]"> {/* Added min-w-[700px] or appropriate width */}
            {/* Month labels */}
            <div className="flex justify-between text-xs font-medium text-neutral-300 pl-8 mb-3">
              {Array.from({ length: 12 }, (_, i) => {
                const date = subDays(today, 365 - (i * 30));
                return (
                  <div key={i}>
                    {format(date, 'MMM')}
                  </div>
                );
              })}
            </div>            <div className="flex w-full">
              {/* Day of week labels */}
              <div className="flex flex-col justify-around text-xs mr-2 text-neutral-300 w-8 font-medium">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>{/* Activity grid */}
              <div className="flex gap-1 flex-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1 flex-1">
                    {week.map((day) => {
                      const activityLevel = getActivityLevel(day);
                      return (
                        <div
                          key={day.toISOString()}
                          className={cn(
                            "w-3 h-3 rounded-sm border cursor-pointer",
                            {
                              "bg-neutral-700 border-neutral-600": activityLevel === 0,
                              "bg-green-300 border-green-300 shadow-sm": activityLevel === 4,
                            }
                          )}
                          onMouseEnter={() => setHoveredDate(day)}
                          onMouseLeave={() => setHoveredDate(null)}
                          title={getTooltipText(day)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Tooltip */}
            {hoveredDate && (
              <div 
                className="absolute bg-neutral-800 text-neutral-200 px-3 py-2 rounded-md text-xs shadow-lg z-50 mt-2"
                style={{
                  transform: 'translateY(-100%)',
                  pointerEvents: 'none'
                }}
              >
                {getTooltipText(hoveredDate)}
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 text-xs mt-4 text-neutral-300">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-neutral-700 border border-neutral-600" />
                <div className="w-3 h-3 rounded-sm bg-green-300 border border-green-300" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

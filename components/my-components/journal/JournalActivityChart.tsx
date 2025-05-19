import { useState, useMemo, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addDays, format, isSameDay, subDays } from 'date-fns';
import { cn } from "@/lib/utils";

interface JournalActivityChartProps {
  writtenDates: Date[];
  entries?: any[]; // Array of journal entries for content checking
  className?: string;
}

export function JournalActivityChart({ writtenDates, entries = [], className }: JournalActivityChartProps) {
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
      // If we have a matching date, check if the entry has non-empty content
      const dateStr = matchingDate.toISOString().split('T')[0];
      const entry = entriesByDate.get(dateStr);
      
      // Entry is considered non-empty if it has content with at least one block with text
      const hasContent = entry && 
                         entry.content && 
                         Array.isArray(entry.content) && 
                         entry.content.some((block: any) => {
                            // Check if block has content with text
                            return block.content && 
                                   Array.isArray(block.content) && 
                                   block.content.some((item: any) => 
                                     item.text && item.text.trim().length > 0
                                   );
                         });
      
      return hasContent ? 4 : 0; // Only mark as active if there's actual content
    }
    
    return 0; // No entry found for this date
  }, [writtenDates, entriesByDate]);
  // Get tooltip text for a date
  const getTooltipText = useCallback((date: Date): string => {
    // Check for a matching date with non-empty content, using the same logic as getActivityLevel
    const matchingDate = writtenDates.find(d => isSameDay(d, date));
    
    if (matchingDate) {
      const dateStr = matchingDate.toISOString().split('T')[0];
      const entry = entriesByDate.get(dateStr);
      
      const hasContent = entry && 
                         entry.content && 
                         Array.isArray(entry.content) && 
                         entry.content.some((block: any) => {
                            return block.content && 
                                   Array.isArray(block.content) && 
                                   block.content.some((item: any) => 
                                     item.text && item.text.trim().length > 0
                                   );
                         });
      
      return `${format(date, 'MMM d, yyyy')}: ${hasContent ? 'Wrote entry' : 'Empty entry'}`;
    }
    
    return `${format(date, 'MMM d, yyyy')}: No entry`;
  }, [writtenDates, entriesByDate]);

  return (
    <Card className={cn("bg-neutral-700 border-none  shadow-2xl z-10 shadow-neutral-700 hover:shadow-neutral-100 ease-in-out duration-500 rounded-2xl p-6 flex flex-col items-center w-full", className)}>
      <CardHeader className="w-full text-white">
        <CardTitle className="text-lg font-bold">Journal Activity</CardTitle>
        <CardDescription className="text-neutral-200">Your writing activity over the past year</CardDescription>
      </CardHeader>      <CardContent className="w-full">
        <div className="w-full overflow-x-auto">
          <div className="flex flex-col gap-2 w-full min-w-[700px]"> {/* Added min-w-[700px] or appropriate width */}
            {/* Month labels */}
            <div className="flex justify-between text-xs text-neutral-300 pl-8">
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
              <div className="flex flex-col justify-around text-xs mr-2 text-neutral-400 w-8">
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
                            "w-3 h-3 rounded-[4px] transition-colors duration-200 border border-neutral-800",
                            {
                              "bg-neutral-800 hover:bg-neutral-600": activityLevel === 0,
                              "bg-green-700 hover:bg-green-600": activityLevel === 4,
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
                className="absolute bg-neutral-900 text-white px-3 py-1 rounded-md text-xs shadow-lg z-50 mt-2"
                style={{
                  transform: 'translateY(-100%)',
                  pointerEvents: 'none'
                }}
              >
                {getTooltipText(hoveredDate)}
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-2 text-xs mt-4 text-neutral-300">
              <span>Less</span>
              <div className="w-3 h-3 rounded-[4px] bg-neutral-800 border border-neutral-700" />
              <div className="w-3 h-3 rounded-[4px] bg-green-700 border border-green-800" />
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

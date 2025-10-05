"use client"
import { Activity, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import HabbitPicker from "./HabbitPicker"
import { useEffect, useState } from "react"
import IntervalPicker from "./IntervalPicker"
import { useRef } from "react"
import { dayEntry, habitTemplateType, habitEntry, CheckboxHabitType, SelectHabitType, NumberHabitType, TextAreaHabitType } from "@/types/new-habit-tracker"

const chartData = [
  { month: "dumb data , select a habit to display its chart", desktop: 186 },
  { month: "dumb data , select a habit to display its chart", desktop: 305 },
  { month: "dumb data , select a habit to display its chart", desktop: 237 },
  { month: "dumb data , select a habit to display its chart", desktop: 73 },
  { month: "dumb data , select a habit to display its chart", desktop: 209 },
  { month: "dumb data , select a habit to display its chart", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#22c55e ",
    icon: Activity,
  },
}


type ChartData = {
  date: string;
  score: number;
  displayValue: string;
}[];  

type SelectedHabitsAnalyticsProps = {
  dailyEntriesFromDb: dayEntry[];
  trackedHabitsFromDb: habitTemplateType | null;
}

const SelectedHabitsAnalytics = ({ dailyEntriesFromDb, trackedHabitsFromDb }: SelectedHabitsAnalyticsProps) => {

  const [selectedHabitAnalytics, setSelectedHabitAnalytics] = useState("")
  const [analyticsArr, setAnalyticsArr] = useState<habitEntry[]>([])
  const [selectedCategoryAnalytics, setSelectedCategoryAnalytics] = useState("")
  const [currentPlotData, setCurrentPlotData] = useState<ChartData>([])
  const [currentInterval, setCurrentInterval] = useState(3)

  const isFirstRender = useRef(true)




  const getAnalyticsArr = (dailyEntries: dayEntry[]) => {
    if (Array.isArray(dailyEntries) && selectedHabitAnalytics !== "") {
      const filteredEntries: habitEntry[] = [];
      
      dailyEntries.forEach(dayEntry => {
        const habitEntries = dayEntry.habits.filter(habit => 
          habit.habitId === selectedHabitAnalytics
        );
        
        // Add date to each habit entry for plotting
        habitEntries.forEach(entry => {
          filteredEntries.push({
            ...entry,
            date: dayEntry.date
          });
        });
      });
      
      setAnalyticsArr(filteredEntries);
    }
  };


  const getHabitType = (habitId: string): string | null => {
    if (!trackedHabitsFromDb) return null;
    
    for (const category of trackedHabitsFromDb.categories) {
      const habit = category.categoryHabits.find(h => h.id === habitId);
      if (habit) {
        return habit.habitType;
      }
    }
    return null;
  };

  const getHabitTarget = (habitId: string): number | string | boolean | null => {
    if (!trackedHabitsFromDb) return null;
    
    for (const category of trackedHabitsFromDb.categories) {
      const habit = category.categoryHabits.find(h => h.id === habitId);
      if (habit) {
        switch (habit.habitType) {
          case 'checkbox':
            return (habit as CheckboxHabitType).shouldBeDone ?? true;
          case 'select':
            return (habit as SelectHabitType).bestOption ?? '';
          case 'number':
            return (habit as NumberHabitType).targetValue ?? 0;
          default:
            return null;
        }
      }
    }
    return null;
  };

  const plotingFunction = (arr: habitEntry[]) => {
    console.log(arr);
    if (Array.isArray(arr) && arr.length > 0) {
      const habitType = getHabitType(arr[0].habitId);
      
      arr.forEach(entry => {
        switch (habitType) {
          case "checkbox":
            setCurrentPlotData(prev => {
              if (prev.length > 30) {
                return prev;
              }
              const dateExists = prev.some(p => p.date === entry.date);
              if (!dateExists) {
                const completed = entry.value === true;
                return [...prev, { 
                  date: entry.date, 
                  score: completed ? 100 : 0, 
                  displayValue: completed ? "100%" : "0%" 
                }];
              } else {
                return prev;
              }
            });
            break;
          case "select":
            setCurrentPlotData(prev => {
              if (prev.length > 30) {
                return prev;
              }
              const dateExists = prev.some(p => p.date === entry.date);
              if (!dateExists) {
                const target = getHabitTarget(entry.habitId);
                const completed = entry.value === target;
                return [...prev, {
                  date: entry.date,
                  score: completed ? 100 : 0,
                  displayValue: completed ? "100%" : "0%"
                }];
              } else {
                return prev;
              }
            });
            break;
          case "number":
            const userValue = typeof entry.value === 'number' ? entry.value : parseFloat(entry.value as string);
            setCurrentPlotData(prev => {
              if (prev.length > 30) {
                return prev;
              }
              return [...prev, {
                date: entry.date,
                score: isNaN(userValue) ? 0 : userValue,
                displayValue: userValue.toString()
              }];
            });
            break;
        }
      });
    }
  };


  const handleAddingMissingDay = (arr: ChartData) => {
    if (dailyEntriesFromDb) {
      // Calculate the date 31 days ago
      const today = new Date();
      const thirtyOneDaysAgo = new Date();
      thirtyOneDaysAgo.setDate(today.getDate() - 31);
  
      // Sort the daily entries by date
      const arrangedArray = dailyEntriesFromDb.sort((a: dayEntry, b: dayEntry) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
  
      // Create an array of dates from arrangedArray (only for last 31 days)
      let daysArr: string[] = [];
      arrangedArray.forEach((d: dayEntry) => {
        const entryDate = new Date(d.date);
        if (entryDate >= thirtyOneDaysAgo) {
          daysArr.push(d.date);
        }
      });
  
      // Create a set of dates from arr for quick lookup
      const existingDates = new Set(arr.map((a: {date: string, score: number, displayValue: string}) => a.date));
  
      // Create an array to collect all missing days
      let updatedData = [...arr];
      
      // Iterate over daysArr to find and add missing dates
      daysArr.forEach((d: string) => {
        if (!existingDates.has(d)) {
          updatedData.push({ date: d, score: 0, displayValue: "0%" });
        }
      });
      
      // Sort and filter to only include last 31 days
      updatedData = updatedData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      
      // Filter to only include entries from last 31 days
      updatedData = updatedData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= thirtyOneDaysAgo;
      });
      
      // Set the state just once with all updates
      setCurrentPlotData(updatedData);
    }
  };

  useEffect(
    () => {
      if (selectedHabitAnalytics !== "" && dailyEntriesFromDb) {
        setAnalyticsArr([])
        getAnalyticsArr(dailyEntriesFromDb)
      }

    }, [selectedHabitAnalytics, dailyEntriesFromDb]
  )

  useEffect(
    () => {
      if (analyticsArr.length > 0) {
        setCurrentPlotData([])
        plotingFunction(analyticsArr)
      }

    }, [analyticsArr, dailyEntriesFromDb]
  )

  useEffect(() => {
    if (currentPlotData.length > 0 && isFirstRender.current) {
      isFirstRender.current = false
      handleAddingMissingDay(currentPlotData)
    }
  }, [currentPlotData])

  function cleanAndFormatDate(value: string): string {
    if (value) {
      // Create a Date object from ISO string
      const date = new Date(value);

      if (isNaN(date.getTime())) {
        return value; // Return the original value if date parsing fails
      }

      // Extract the month and day
      const month = date.toLocaleString('en-US', { month: 'short' });
      const day = date.getDate();

      return `${month} ${day}`;
    }
    return value;
  }



  const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isNumberInput = selectedHabitAnalytics ? getHabitType(selectedHabitAnalytics) === "number" : false;
      return (
        <div className="custom-tooltip rounded-xl bg-neutral-600 text-white p-2">
          <p className="label">{`Date: ${cleanAndFormatDate(data.date)}`}</p>
          {isNumberInput ? (
            <p className="value">{`Value: ${data.displayValue == undefined || isNaN(data.displayValue) ? 0 : data.displayValue}`}</p>
          ) : (
            <>
              <p className="percentage">{`Score: ${data.displayValue == undefined ? 0 : data.displayValue}`}</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const getHabitName = (habitId: string): string => {
    if (!trackedHabitsFromDb) return '';
    
    for (const category of trackedHabitsFromDb.categories) {
      const habit = category.categoryHabits.find(h => h.id === habitId);
      if (habit) {
        return habit.name;
      }
    }
    return '';
  };



  return (
    <Card className="lg:w-2/3 h-full flex flex-col self-center rounded-xl bg-neutral-200 border-[1px] shadow-2xl z-10 shadow-neutral-500 hover:shadow-neutral-100 ease-in-out duration-300 border-neutral-800">
      <CardHeader className="flex flex-row gap-2 justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle>Single Habit Analytics</CardTitle>
          <CardDescription>
            the graph will show the last month records of the habit
          </CardDescription>
        </div>
        <HabbitPicker 
          habitTemplate={trackedHabitsFromDb} 
          setSelectedHabbitsAnalytics={setSelectedHabitAnalytics} 
          setSelectedCategoryAnalytics={setSelectedCategoryAnalytics} 
        />
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer className="md:h-[200px] lg:h-[200px] w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={currentPlotData.length > 0 ? currentPlotData : chartData} //default chartData
            margin={{
              left: 12,
              right: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={currentPlotData.length > 0 ? "date" : "month"} //default month
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              tickFormatter={(value) => cleanAndFormatDate(value)}
              interval={currentInterval}
              padding={{ left: 5, right: 5 }}
            />
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip />}
            />
            <Area
              dataKey={currentPlotData.length > 0 ? "score" : "desktop"}  //default desktop
              type="step"
              fill="#22c55e"
              fillOpacity={0.1}
              stroke="#15803d"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-5 font-medium">
              {analyticsArr.length > 0 && selectedHabitAnalytics ? 
                `Displaying ${getHabitName(selectedHabitAnalytics)}, type: ${getHabitType(selectedHabitAnalytics)}${
                  getHabitType(selectedHabitAnalytics) !== 'checkbox' ? `, target: ${getHabitTarget(selectedHabitAnalytics)}` : ""
                }` : 
                'Select a habit to see its numbers'
              }
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              seeing last month analytics
            </div>
          </div>
        </div>
        <div className="flex flex-col text-center justify-center gap-1 text-sm">
          Pick An Interval
          <IntervalPicker currentInterval={currentInterval} setCurrentInterval={setCurrentInterval} />
        </div>
      </CardFooter>
    </Card>
  )
}

export default SelectedHabitsAnalytics

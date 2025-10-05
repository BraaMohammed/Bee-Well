"use client"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { dayEntry , habitEntry } from "@/types/new-habit-tracker"

const chartData = [
  { month: "dumb data , your data is loading", desktop: 186, mobile: 80, percentage: 47 },
  { month: "dumb data , your data is loading", desktop: 305, mobile: 200, percentage: 85 },
  { month: "dumb data , your data is loading", desktop: 237, mobile: 120, percentage: 62 },
  { month: "dumb data , your data is loading", desktop: 73, mobile: 190, percentage: 29 },
  { month: "dumb data , your data is loading", desktop: 209, mobile: 130, percentage: 74 },
  { month: "dumb data , your data is loading", desktop: 214, mobile: 140, percentage: 55 },
  { month: "dumb data , your data is loading", desktop: 250, mobile: 160, percentage: 91 },
  { month: "dumb data , your data is loading", desktop: 220, mobile: 180, percentage: 36 },
  { month: "dumb data , your data is loading", desktop: 195, mobile: 150, percentage: 78 },
  { month: "dumb data , your data is loading", desktop: 280, mobile: 170, percentage: 49 },
  { month: "dumb data , your data is loading", desktop: 320, mobile: 190, percentage: 66 },
  { month: "dumb data , your data is loading", desktop: 275, mobile: 210, percentage: 82 }
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#22c55e ",
  },
  mobile: {
    label: "Mobile",
    color: "rgb(0 , 0 , 0 )",
  },
} satisfies ChartConfig

interface TotalSuccessAnalyticsProps {
  habitEntries: dayEntry[]
}

const TotalSuccessAnalytics = ({ habitEntries }: TotalSuccessAnalyticsProps) => {
  const [plotData, setPlotData] = useState<Array<{ date: string; score: number }>>([])

  const calculateDailySuccessPercentage = (entry: dayEntry): number => {
    if (!entry.habits || Object.keys(entry.habits).length === 0) return 0;
    
    let totalHabits = 0;
    let completedHabits = 0;
    
    Object.values(entry.habits).forEach((habit:habitEntry) => {
      totalHabits++;
      
      // For checkbox habits, check if value is true
      if (typeof habit.value === 'boolean' && habit.value) {
        completedHabits++;
      }
      // For number habits, check if value is greater than 0
      else if (typeof habit.value === 'number' && habit.value > 0) {
        completedHabits++;
      }
      // For select/text habits, check if value is not empty
      else if (typeof habit.value === 'string' && habit.value.trim() !== '') {
        completedHabits++;
      }
    });
    
    return totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
  };

  const handleCreatingPlotingData = (entries: dayEntry[]) => {
    const arr: Array<{ date: string; score: number }> = [];
    
    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    for (const entry of sortedEntries) {
      const score = calculateDailySuccessPercentage(entry);
      
      if (!arr.some(a => a.date === entry.date) && arr.length < 31) {
        arr.push({ date: entry.date, score: isNaN(score) ? 0 : score });
      }
    }
    
    // Sort again to ensure proper order
    arr.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    setPlotData(arr);
  };

  useEffect(() => {
    if (habitEntries && habitEntries.length > 0) {
      setPlotData([]);
      handleCreatingPlotingData(habitEntries);
    }
  }, [habitEntries]);

  function cleanAndFormatDate(value: string) {
    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return value; // Return the original value if date parsing fails
    }

    // Extract the month and day
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();

    return `${month} ${day}`;
  }

  const calcAverage = (data: Array<{ date: string; score: number }>) => {
    if (data.length === 0) return 0;
    
    let sum = 0;
    data.forEach(d => {
      sum = sum + Number(d.score);
    });
    
    const length = Number(data.length);
    const res = sum / length;
    return Math.round(res);
  };

  return (
    <Card className="opacity-0 md:opacity-100 lg:opacity-100 lg:w-full self-center bg-neutral-200 rounded-xl border-[1px] shadow-2xl shadow-neutral-500 hover:shadow-neutral-100 ease-in-out duration-300 border-neutral-800">
      <CardHeader>
        <CardTitle>Past Month Success</CardTitle>
        <CardDescription>showing analytics for the past month</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <ChartContainer className="h-full w-full" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={plotData.length > 0 ? plotData : chartData}
              margin={{
                top: 25,
                left: 0,
                right: 60,
                bottom: 0
              }}
            >
              <CartesianGrid stroke="#404040" vertical={false} />
              <XAxis
                dataKey={plotData.length > 0 ? "date" : "month"}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => cleanAndFormatDate(value)}
                fill="#404040"
              />
              <YAxis
                dataKey={plotData.length > 0 ? "score" : "percentage"}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                allowDataOverflow={false}
                fill="#404040"
              />
              <ChartTooltip
              //@ts-ignore
                className="bg-green-600 text-white rounded-xl"
                cursor={false}
                content={<ChartTooltipContent className="bg-blue-300" indicator="line" />}
              />
              <Line
                dataKey={plotData.length > 0 ? "score" : "percentage"}
                type="monotone"
                stroke="#404040"
                strokeWidth={2}
                dot={{
                  fill: "#404040",
                  r: 4
                }}
                activeDot={{
                  r: 6,
                }}
              >
                <LabelList
                  dataKey={plotData.length > 0 ? "score" : "desktop"}
                  position="top"
                  offset={15}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none text-green-500">
          Average Success on the last month is {plotData.length > 0 && calcAverage(plotData)}% <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing the percentage of done habits for the last month
        </div>
      </CardFooter>
    </Card>
  );
};

export default TotalSuccessAnalytics;

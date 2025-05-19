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
import calculateDailyRating from "@/app/actions/calcDaySuccesPercent"
import { useEffect, useState } from "react"


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
}

const TotalSuccessAnalytics = ({ dailyEntriesFromDb , trackedHabbitsFromDb }) => {
  const [plotData, setPlotData] = useState([])


  const handleCreatingPlotingData = async (entries) => {
    const arr = [];
    const sortedEntries = entries.sort((a, b) => {
      const dateA = new Date(a.date.replace(/(st|nd|rd|th),/, ','));
      const dateB = new Date(b.date.replace(/(st|nd|rd|th),/, ','));
      return dateB - dateA;
    })
    let score
    for (const e of sortedEntries) {
      if(trackedHabbitsFromDb)
       { score = await calculateDailyRating(e , trackedHabbitsFromDb);} // Await the result if it's a promise
      if (!arr.some(a => a.date == e.date) && arr.length < 31 ) {
        arr.push({ date: e.date, score: isNaN(score) ? 0 : score });

      }
    }
    arr.sort((a, b) => {
      const dateA = new Date(a.date.replace(/(st|nd|rd|th),/, ','));
      const dateB = new Date(b.date.replace(/(st|nd|rd|th),/, ','));
      return dateB - dateA;
    })

    setPlotData(arr);
  };

  useEffect(
    () => {
      if (dailyEntriesFromDb) {
        setPlotData([])
        handleCreatingPlotingData(dailyEntriesFromDb)

      }
    }, [dailyEntriesFromDb]
  )

  function cleanAndFormatDate(value) {
    // Remove day of the week and 'th' or similar suffix from the input string
    const cleanedValue = value.replace(/^\w+, |\b(\d+)(st|nd|rd|th)\b/g, '$1');

    // Create a Date object
    const date = new Date(cleanedValue);

    if (isNaN(date)) {
      return value; // Return the original value if date parsing fails
    }

    // Extract the month and day
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();

    return `${month} ${day}`;
  }

  const calcAvarege = (data)=>{
    let sum =0 
    data.forEach(
      d =>{
        sum = sum + Number(d.score)
      }
    )
    const length=  Number(data.length)
    const res = sum/length
    return Math.round(res)
  }


  return (
    <Card className=" opacity-0 md:opacity-100 lg:opacity-100 lg:w-full   self-center bg-neutral-200 rounded-xl border-[1px] shadow-2xl shadow-neutral-500 hover:shadow-neutral-100 ease-in-out duration-300 border-neutral-800">
      <CardHeader>
        <CardTitle>Past Month Success </CardTitle>
        <CardDescription>showing analytics for the past month</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] w-full">
        <ChartContainer className="h-full w-full" config={chartConfig}>
          <ResponsiveContainer  width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={plotData.length > 0 ? plotData : chartData} //default chartConfig
              margin={{
                top: 25,
                left: 0,
                right: 60,
                bottom: 0
              }}
            >
              <CartesianGrid stroke="#404040" vertical={false} />
              <XAxis
                dataKey={plotData.length > 0 ? "date" : "month"} //default month 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                //   interval={3}
                tickFormatter={(value) => cleanAndFormatDate(value)}
                fill="#404040"
              />
              <YAxis
                dataKey={plotData.length > 0 ? "score" : "percentage"} //default percentage
                tickLine={false}
                axisLine={false}
                //    tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                allowDataOverflow={false}
                fill="#404040"
              />
              <ChartTooltip
                className="bg-green-600 text-white rounded-xl"
                cursor={false}
                content={<ChartTooltipContent className="bg-blue-300" indicator="line" />}
              />
              <Line
                dataKey={plotData.length > 0 ? "score" : "percentage"} //default percentage
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
                  dataKey={plotData.length > 0 ? "score" : "desktop"}//default desktop
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
          Avarege Success on the last month is {plotData.length > 0 && calcAvarege(plotData)} % <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground ">
          Showing the percentage of done habbits for the last month
        </div>
      </CardFooter>
    </Card>
  );


}

export default TotalSuccessAnalytics

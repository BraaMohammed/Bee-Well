"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import CalendarPicker from "../habbitTracker/CalendarPicker"
import { useState } from "react"
import { useEffect } from "react"
import calculateDailyRating from "@/app/actions/calcDaySuccesPercent"




const SelectedDayAnalytics = ({ dailyEntriesFromDb ,  trackedHabbitsFromDb }) => {
  


  const chartData = [
    { name: "day", percentage: 76, fill: "#16a34a" },
  ]

  const [selectedDayFromCalender, setSelectedDayFromCalender] = useState(null)
  const [selectedDailyEntry, setSelectedDailyEntry] = useState(null)
  const [currentPercent , setCurrentPercentage ] = useState(0)


  useEffect(() => {
    if (dailyEntriesFromDb && dailyEntriesFromDb.length > 0) {
      const sortedEntries = [...dailyEntriesFromDb].sort((a, b) => {
        const dateA = new Date(a.date.replace(/(st|nd|rd|th),/, ','));
        const dateB = new Date(b.date.replace(/(st|nd|rd|th),/, ','));
        return dateB - dateA;
      });
      setSelectedDailyEntry(sortedEntries[0].date);
      trackedHabbitsFromDb && handlePercentCalc(sortedEntries[0])
    }
  }, [dailyEntriesFromDb]);


  const handlePercentCalc = async (d ) => {
    const p = await calculateDailyRating(d ,trackedHabbitsFromDb)
   // console.log(p)
    setCurrentPercentage(p)
    
  }


  useEffect(
    () => {
      if (selectedDayFromCalender && dailyEntriesFromDb && trackedHabbitsFromDb) {
        const day = dailyEntriesFromDb.find(d => d.date == selectedDayFromCalender)
        setSelectedDailyEntry(day)
        handlePercentCalc(day )
      }

    }, [selectedDayFromCalender]
  )


  


  






  const chartConfig = {
    day: {
      label: "day",
      color: "#16a34a",
    }
  }

  return (
    <Card className="lg:w-1/3 h-full flex gap-3 flex-col self-center rounded-xl bg-neutral-200 border-[1px] shadow-2xl z-10 shadow-neutral-500 hover:shadow-neutral-100 ease-in-out duration-300 border-neutral-800">
      <CardHeader className="flex flex-row pb-0 justify-around">
        <div className=" flex flex-col gap-2">
          <CardTitle>Single Day Analytics</CardTitle>
          <CardDescription>select a day from the calender to see its analytics</CardDescription>
        </div>
        <CalendarPicker onSelectDay={setSelectedDayFromCalender} dailyEntriesFromDb={dailyEntriesFromDb} />
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="w-full lg:min-h-[13rem] md:min-h-[13rem]    max-w-full "
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={!isNaN(currentPercent)? Number(currentPercent)*3.6 : 0}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="fill-neutral-600  text-white"
              polarRadius={[86, 74]}

            />
            <RadialBar dataKey="percentage" className="fill-neutral-600 " background cornerRadius={10} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-white"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-neutral-300 text-4xl text-white font-bold"
                        >
                          {!isNaN(currentPercent)?currentPercent:0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-neutral-300"
                        >
                          Percent Done
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-auto">
        <div className="flex items-center gap-2 font-medium leading-none">
          You Have Achieved {!isNaN(currentPercent)?currentPercent:0}%  <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          showing analytics of {selectedDayFromCalender ? selectedDayFromCalender : selectedDailyEntry}
        </div>
      </CardFooter>
    </Card>

  )
}
export default SelectedDayAnalytics


/*



"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
const chartData = [
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function Component() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}






*/
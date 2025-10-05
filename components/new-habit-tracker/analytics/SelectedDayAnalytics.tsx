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
import { useState } from "react"
import { useEffect } from "react"
import { dayEntry, habitTemplateType } from "@/types/new-habit-tracker"
import CalendarPicker from "@/components/new-habit-tracker/analytics/CalendarPicker"
import { calculateDailyRating } from "@/lib/utilis/calculateDailyRating"


type SelectedDayAnalyticsProps = {
  dailyEntriesFromDb: dayEntry[]
  trackedHabbitsFromDb: habitTemplateType | null
}


const SelectedDayAnalytics = ({ dailyEntriesFromDb ,  trackedHabbitsFromDb }: SelectedDayAnalyticsProps) => {
  


  const chartData = [
    { name: "day", percentage: 76, fill: "#16a34a" },
  ]

  const [selectedDayFromCalender, setSelectedDayFromCalender] = useState<string | null>(null)
  const [selectedDailyEntry, setSelectedDailyEntry] = useState<dayEntry | null>(null)
  const [currentPercent , setCurrentPercentage ] = useState(0)


  useEffect(() => {
    if (dailyEntriesFromDb && dailyEntriesFromDb.length > 0) {
      const sortedEntries = [...dailyEntriesFromDb].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      setSelectedDailyEntry(sortedEntries[0]);
      if (trackedHabbitsFromDb) {
        handlePercentCalc(sortedEntries[0])
      }
    }
  }, [dailyEntriesFromDb, trackedHabbitsFromDb]);


  const handlePercentCalc = async (d: dayEntry ) => {
    if (!trackedHabbitsFromDb) return;
    const p = await calculateDailyRating(d ,trackedHabbitsFromDb)
    setCurrentPercentage(p)
    
  }


  useEffect(
    () => {
      if (selectedDayFromCalender && dailyEntriesFromDb && trackedHabbitsFromDb) {
        const day = dailyEntriesFromDb.find(d => d.date == selectedDayFromCalender)
        if (day) {
          setSelectedDailyEntry(day)
          handlePercentCalc(day)
        }
      }

    }, [selectedDayFromCalender, dailyEntriesFromDb, trackedHabbitsFromDb]
  )

  const chartConfig: ChartConfig = {
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
        <CalendarPicker selectedDay={selectedDayFromCalender} onSelectDay={setSelectedDayFromCalender} dailyEntriesFromDb={dailyEntriesFromDb} />
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
                          {!isNaN(currentPercent)?currentPercent.toFixed(0):0}%
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
          You Have Achieved {!isNaN(currentPercent)?currentPercent.toFixed(0):0}%  <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          showing analytics of {selectedDayFromCalender ? selectedDayFromCalender : (selectedDailyEntry ? selectedDailyEntry.date : 'No date selected')}
        </div>
      </CardFooter>
    </Card>

  )
}
export default SelectedDayAnalytics

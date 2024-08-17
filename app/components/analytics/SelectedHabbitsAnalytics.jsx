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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import HabbitPicker from "./HabbitPicker"
import { useEffect, useState } from "react"
import IntervalPicker from "./IntervalPicker"



const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]



const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#22c55e ",
    icon: Activity,
  },
}
const SelectedHabbitsAnalytics = ({ dailyEntriesFromDb, trackedHabbitsFromDb }) => {

  const [selectedHabbitsAnalytics, setSelectedHabbitsAnalytics] = useState("")
  const [analyticsArr, setAnalyticsArr] = useState([])
  const [selectedCategoryAnalytics, setSelectedCategoryAnalytics] = useState("")
  const [currentPlotData, setCurrentPlotData] = useState([])
  const [currentInterval, setCurrentInterval] = useState(3)





  const getAnalyticsArr = (dailyEntries) => {
    if (Array.isArray(dailyEntries)) {
      dailyEntries.forEach(entryObject => {
        const entryDate = entryObject.date; // Get the date from the parent object

        if (Array.isArray(entryObject.entries)) {
          entryObject.entries.forEach(entry => {
            if (entry.categoryName === selectedCategoryAnalytics && Array.isArray(entry.elements)) {
              entry.elements.forEach(h => {
                if (h.elementText.trim() === selectedHabbitsAnalytics.trim()) { // Trim spaces to match
                  const elementWithDate = { ...h, date: entryDate }; // Add the date to the element object
                  setAnalyticsArr(prev => [...prev, elementWithDate]);
                }
              });
            }
          });
        }
      });
    }
  };


  const plotingFunction = (arr) => {
    if (Array.isArray(arr)) {
      arr.forEach(el => {
        switch (el.elementType) {
          case "checkList":
            setCurrentPlotData(prev => {
              const dateExists = prev.some(p => p.date === el.date);
              if (!dateExists) {
                return [...prev, { date: el.date, score: el.userInput ? 100 : 0, displayValue: el.userInput ? "100%" : "0%" }];
              } else {
                return prev;
              }
            });
            break;
          case "select":
            setCurrentPlotData(prev => {
              const dateExists = prev.some(p => p.date === el.date);
              if (!dateExists) {
                const completed = el.elementType === "checkList" ? el.userInput : el.target;
                return [...prev, {
                  date: el.date,
                  score: completed ? 100 : 0,
                  displayValue: completed ? "100%" : "0%"
                }];
              } else {
                return prev;
              }
            });
            break;
          case "numberInput":
            const userValue = parseFloat(el.userInput);
            setCurrentPlotData(prev => {
              return [...prev, {
                date: el.date,
                score: isNaN(userValue) ? 0 : userValue,
                displayValue: userValue.toString()
              }];
            });
            break;
        }
      });
    }
  };


  const handleAddingMissingDay = (arr) => {
    if (dailyEntriesFromDb) {
      // Sort the daily entries by date
      const arrangedArray = dailyEntriesFromDb.sort((a, b) => {
        const dateA = new Date(a.date.replace(/(st|nd|rd|th),/, ','));
        const dateB = new Date(b.date.replace(/(st|nd|rd|th),/, ','));
        return dateB - dateA;
      });

      // Create an array of dates from arrangedArray
      let daysArr = [];
      arrangedArray.forEach(d => {
        daysArr.push(d.date);
      });
      // console.log(daysArr)

      // Create a set of dates from arr for quick lookup
      const existingDates = new Set(arr.map(a => a.date));

      // Iterate over daysArr to find and insert missing dates
      daysArr.forEach(d => {
        if (!existingDates.has(d)) {
          setCurrentPlotData(prev => { return [...prev, { date: d, score: 0 }] })
        }
      });

      // Optional: Sort arr if needed
      setCurrentPlotData(prev => {
        return prev.sort((a, b) => {
          const dateA = new Date(a.date.replace(/(st|nd|rd|th),/, ','));
          const dateB = new Date(b.date.replace(/(st|nd|rd|th),/, ','));
          return dateB - dateA;
        });
      })

    }
  };


  useEffect(
    () => {
      if (selectedHabbitsAnalytics !== "" && selectedCategoryAnalytics !== "" && dailyEntriesFromDb) {
        setAnalyticsArr([])
        getAnalyticsArr(dailyEntriesFromDb)
      }

    }, [selectedHabbitsAnalytics, dailyEntriesFromDb]
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
    if (currentPlotData.length > 0) {
      handleAddingMissingDay(currentPlotData)
    }

  }, [currentPlotData])


  function cleanAndFormatDate(value) {
    if (value) {
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

  }



  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isNumberInput = analyticsArr[0]?.elementType === "numberInput";
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



  return (
    <Card className=" lg:w-2/3    self-center rounded-xl bg-neutral-200 border-[1px] shadow-2xl z-10 shadow-neutral-500 hover:shadow-neutral-100 ease-in-out duration-300 border-neutral-800">
      <CardHeader className=" flex flex-row gap-2 justify-between">
        <div className=" flex flex-col gap-2">
          <CardTitle>Single Habbit Analytics</CardTitle>
          <CardDescription>
            the graph will show the last month records of the habbit
          </CardDescription>
        </div>
        <HabbitPicker setSelectedHabbitsAnalytics={setSelectedHabbitsAnalytics} setSelectedCategoryAnalytics={setSelectedCategoryAnalytics} trackedHabbitsFromDb={trackedHabbitsFromDb} />
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[200px] w-full" config={chartConfig}>
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
              tickFormatter={(value) => {
                return isFinite(value) ? value : 0;
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-5 font-medium">
              {analyticsArr.length > 0 ? `displaying ${analyticsArr[0].elementText} , type of it is ${analyticsArr[0].elementType} , 
               ${analyticsArr[0].elementType !== 'checkList' ? `the target is ${analyticsArr[0].target}` : ""} ` : 'select a habbit to see its numbers'}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              seeing last month analytics
            </div>
          </div>
        </div>
        <div className="flex flex-col text-center justify-center gap-1 text-sm">
          Pick An Inteval
          <IntervalPicker currentInterval={currentInterval} setCurrentInterval={setCurrentInterval} />
        </div>
      </CardFooter>
    </Card>
  )
}

export default SelectedHabbitsAnalytics





/*
const SelectedHabbitsAnalytics = ({ dailyEntriesFromDb, trackedHabbitsFromDb }) => {

  const [selectedHabbitsAnalytics, setSelectedHabbitsAnalytics] = useState("")
  const [analyticsArr, setAnalyticsArr] = useState([])
  const [selectedCategoryAnalytics, setSelectedCategoryAnalytics] = useState("")
  const [currentPlotData, setCurrentPlotData] = useState([])
  const[ currentInterval , setCurrentInterval] = useState(3)





  const getAnalyticsArr = (dailyEntries) => {
    if (Array.isArray(dailyEntries)) {
      dailyEntries.forEach(entryObject => {
        const entryDate = entryObject.date; // Get the date from the parent object

        if (Array.isArray(entryObject.entries)) {
          entryObject.entries.forEach(entry => {
            if (entry.categoryName === selectedCategoryAnalytics && Array.isArray(entry.elements)) {
              entry.elements.forEach(h => {
                if (h.elementText.trim() === selectedHabbitsAnalytics.trim()) { // Trim spaces to match
                  const elementWithDate = { ...h, date: entryDate }; // Add the date to the element object
                  setAnalyticsArr(prev => [...prev, elementWithDate]);
                }
              });
            }
          });
        }
      });
    }
  };


  const plotingFunction = (arr) => {
    if (Array.isArray(arr)) {
      arr.forEach(
        el => {
          switch (el.elementType) {
            case "checkList":
              setCurrentPlotData(prev => {
                // Check if the current date already exists in the array
                const dateExists = prev.some(p => p.date === el.date);

                // If the date does not exist, add it with the appropriate score
                if (!dateExists) {
                  return [...prev, { date: el.date, score: el.userInput ? 1 : 0 }];
                } else {
                  return prev; // If the date exists, return the array unchanged
                }
              });
              break;
            case "select":
              el.userInput = el.target ? setCurrentPlotData(prev => {
                return [...prev, { date: el.date, score: 1 }]
              }) :
                setCurrentPlotData(prev => {
                  return [...prev, { date: el.date, score: 0 }]
                })
              break;
            case "numberInput":
              const targetValue = parseFloat(el.target);
              const userValue = parseFloat(el.userInput);
              if (targetValue === userValue) {
                setCurrentPlotData(prev => {
                  return [...prev, { date: el.date, score: 1 }]
                })
              } else {
                const difference = Math.abs(targetValue - userValue);
                const maxDifference = Math.max(targetValue, 1); // Prevent division by zero
                const score = Math.max(0, 1 - (difference / maxDifference));
                setCurrentPlotData(prev => {
                  return [...prev, { date: el.date, score: isNaN(score) ? 0 : score }]
                })

              }
              break;
          }
        }
      )

    }
  }


  const handleAddingMissingDay = (arr) => {
    if (dailyEntriesFromDb) {
      // Sort the daily entries by date
      const arrangedArray = dailyEntriesFromDb.sort((a, b) => {
        const dateA = new Date(a.date.replace(/(st|nd|rd|th),/, ','));
        const dateB = new Date(b.date.replace(/(st|nd|rd|th),/, ','));
        return dateB - dateA;
      });

      // Create an array of dates from arrangedArray
      let daysArr = [];
      arrangedArray.forEach(d => {
        daysArr.push(d.date);
      });
     // console.log(daysArr)

      // Create a set of dates from arr for quick lookup
      const existingDates = new Set(arr.map(a => a.date));

      // Iterate over daysArr to find and insert missing dates
      daysArr.forEach(d => {
        if (!existingDates.has(d)) {
          setCurrentPlotData(prev => { return [...prev, { date: d, score: 0 }] })
        }
      });

      // Optional: Sort arr if needed
      setCurrentPlotData(prev => { return prev.sort((a, b) => {
        const dateA = new Date(a.date.replace(/(st|nd|rd|th),/, ','));
        const dateB = new Date(b.date.replace(/(st|nd|rd|th),/, ','));
        return dateB - dateA;
      }); })

    }
  };


  useEffect(
    () => {
      if (selectedHabbitsAnalytics !== "" && selectedCategoryAnalytics !== "" && dailyEntriesFromDb) {
        setAnalyticsArr([])
        getAnalyticsArr(dailyEntriesFromDb)
      }

    }, [selectedHabbitsAnalytics, dailyEntriesFromDb]
  )

  useEffect(
    () => {
      if (analyticsArr.length > 0) {
        setCurrentPlotData([])
        plotingFunction(analyticsArr)
      }

    }, [analyticsArr, dailyEntriesFromDb]
  )

  useEffect(()=>{
    if(currentPlotData.length>0){
      handleAddingMissingDay(currentPlotData)
    }

  } , [currentPlotData])


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

 // console.log(currentPlotData)

  return (
    <Card className=" lg:w-2/3    self-center rounded-xl bg-neutral-200 border-[1px] shadow-2xl z-10 shadow-neutral-500 hover:shadow-neutral-100 ease-in-out duration-300 border-neutral-800">
      <CardHeader className=" flex flex-row gap-2 justify-between">
        <div className=" flex flex-col gap-2">
          <CardTitle>Single Habbit Analytics</CardTitle>
          <CardDescription>
            the graph will show all time records of the habbit 
          </CardDescription>
        </div>
        <HabbitPicker setSelectedHabbitsAnalytics={setSelectedHabbitsAnalytics} setSelectedCategoryAnalytics={setSelectedCategoryAnalytics} trackedHabbitsFromDb={trackedHabbitsFromDb} />
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[200px] w-full" config={chartConfig}>
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
              content={<ChartTooltipContent payload={currentPlotData.length > 0 ? currentPlotData : chartData} className=" rounded-xl bg-neutral-600 text-white"     />}
            />
            <Area
              dataKey={currentPlotData.length > 0 ? "score" : "desktop"}  //default desktop
              type="step"
              fill="#22c55e"
              fillOpacity={0.1}
              stroke="#15803d"
              tickFormatter={(value) => {
                return isFinite(value) ? value : 0;
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-5 font-medium">
              {analyticsArr.length > 0 ? `displaying ${analyticsArr[0].elementText} , type of it is ${analyticsArr[0].elementType} , 
               ${analyticsArr[0].elementType !== 'checkList' ? `the target is ${analyticsArr[0].target}` : ""} ` : 'select a habbit to see its numbers'}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              seeing all time analytics
            </div>
          </div>
        </div>
        <div className="flex flex-col text-center justify-center gap-1 text-sm">
          Pick An Inteval
        <IntervalPicker currentInterval={currentInterval} setCurrentInterval={setCurrentInterval} />
        </div>
      </CardFooter>
    </Card>
  )
}

export default SelectedHabbitsAnalytics
*/
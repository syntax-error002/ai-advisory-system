"use client"

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown } from "lucide-react"

interface WeatherChartProps {
  data: Array<{
    time: string
    temperature: number
    humidity: number
    precipitation: number
  }>
}

export function WeatherChart({ data }: WeatherChartProps) {
  const avgTemp = data.reduce((sum, item) => sum + item.temperature, 0) / data.length
  const tempTrend = data[data.length - 1]?.temperature > data[0]?.temperature

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Weather Trends</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Temperature and humidity over time</CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            {tempTrend ? (
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            )}
            <span className="text-muted-foreground">{avgTemp.toFixed(1)}°C avg</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer
          config={{
            temperature: {
              label: "Temperature (°C)",
              color: "hsl(var(--chart-1))",
            },
            humidity: {
              label: "Humidity (%)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[200px] sm:h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis dataKey="time" fontSize={10} tickMargin={5} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} tickMargin={5} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="var(--color-humidity)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

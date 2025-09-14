"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Sprout } from "lucide-react"

interface CropYieldChartProps {
  cropType: string
}

export function CropYieldChart({ cropType }: CropYieldChartProps) {
  // Mock data based on crop type
  const getYieldData = (crop: string) => {
    const baseData = [
      { month: "Jan", yield: 0, optimal: 0 },
      { month: "Feb", yield: 0, optimal: 0 },
      { month: "Mar", yield: 0, optimal: 0 },
      { month: "Apr", yield: 0, optimal: 0 },
      { month: "May", yield: 0, optimal: 0 },
      { month: "Jun", yield: 0, optimal: 0 },
      { month: "Jul", yield: 0, optimal: 0 },
      { month: "Aug", yield: 0, optimal: 0 },
      { month: "Sep", yield: 0, optimal: 0 },
      { month: "Oct", yield: 0, optimal: 0 },
      { month: "Nov", yield: 0, optimal: 0 },
      { month: "Dec", yield: 0, optimal: 0 },
    ]

    if (crop === "rice") {
      return baseData.map((item, index) => ({
        ...item,
        yield: index >= 5 && index <= 9 ? Math.random() * 80 + 60 : Math.random() * 30 + 10,
        optimal: index >= 5 && index <= 9 ? 85 : 20,
      }))
    } else if (crop === "wheat") {
      return baseData.map((item, index) => ({
        ...item,
        yield: index >= 10 || index <= 2 ? Math.random() * 70 + 50 : Math.random() * 25 + 15,
        optimal: index >= 10 || index <= 2 ? 75 : 25,
      }))
    } else {
      return baseData.map((item) => ({
        ...item,
        yield: Math.random() * 60 + 30,
        optimal: 65,
      }))
    }
  }

  const data = getYieldData(cropType)
  const currentMonth = new Date().getMonth()
  const currentYield = data[currentMonth]?.yield || 0

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Sprout className="h-4 w-4 text-green-500" />
              {cropType.charAt(0).toUpperCase() + cropType.slice(1)} Yield
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Expected vs optimal yield (kg/hectare)</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg sm:text-xl font-bold text-green-600">{currentYield.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground">kg/ha current</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer
          config={{
            yield: {
              label: "Current Yield",
              color: "hsl(var(--chart-3))",
            },
            optimal: {
              label: "Optimal Yield",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[200px] sm:h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis dataKey="month" fontSize={10} tickMargin={5} axisLine={false} tickLine={false} />
              <YAxis fontSize={10} tickMargin={5} axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="optimal" fill="var(--color-optimal)" radius={[2, 2, 0, 0]} opacity={0.6} />
              <Bar dataKey="yield" fill="var(--color-yield)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

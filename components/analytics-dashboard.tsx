"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Droplets, Thermometer, Wind, Eye, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import type { WeatherData } from "@/lib/weather"

interface AnalyticsDashboardProps {
  weather: WeatherData
  cropType: string
}

export function AnalyticsDashboard({ weather, cropType }: AnalyticsDashboardProps) {
  const getHealthScore = () => {
    const temp = weather.current.temp_c
    const humidity = weather.current.humidity
    const precipitation = weather.current.precip_mm

    let score = 100

    // Temperature scoring (optimal range varies by crop)
    const optimalTemp = cropType === "rice" ? [20, 35] : cropType === "wheat" ? [15, 25] : [18, 30]
    if (temp < optimalTemp[0] || temp > optimalTemp[1]) {
      score -= Math.abs(temp - (optimalTemp[0] + optimalTemp[1]) / 2) * 2
    }

    // Humidity scoring
    if (humidity < 40 || humidity > 80) {
      score -= Math.abs(humidity - 60) * 0.5
    }

    return Math.max(0, Math.min(100, score))
  }

  const healthScore = getHealthScore()
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Poor"
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Health Score */}
      <Card className="col-span-1 sm:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Crop Health Score
          </CardTitle>
          <CardDescription className="text-xs">Based on current weather conditions</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-2xl sm:text-3xl font-bold ${getScoreColor(healthScore)}`}>
                  {healthScore.toFixed(0)}%
                </span>
                <Badge variant={healthScore >= 80 ? "default" : healthScore >= 60 ? "secondary" : "destructive"}>
                  {getScoreStatus(healthScore)}
                </Badge>
              </div>
              <Progress value={healthScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Temperature */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            Temperature
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold">{weather.current.temp_c}°C</div>
            <div className="text-xs text-muted-foreground">Feels like {weather.current.feelslike_c}°C</div>
            <div className="flex items-center gap-1 text-xs">
              {weather.current.temp_c > 30 ? (
                <TrendingUp className="h-3 w-3 text-red-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-blue-500" />
              )}
              <span className="text-muted-foreground">{weather.current.temp_c > 30 ? "High" : "Moderate"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Humidity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            Humidity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold">{weather.current.humidity}%</div>
            <Progress value={weather.current.humidity} className="h-1.5" />
            <div className="flex items-center gap-1 text-xs">
              {weather.current.humidity > 70 ? (
                <AlertTriangle className="h-3 w-3 text-yellow-500" />
              ) : (
                <TrendingUp className="h-3 w-3 text-green-500" />
              )}
              <span className="text-muted-foreground">{weather.current.humidity > 70 ? "High" : "Optimal"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wind Speed */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            Wind Speed
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold">{weather.current.wind_kph} km/h</div>
            <div className="text-xs text-muted-foreground">{weather.current.wind_dir} direction</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">{weather.current.wind_kph > 20 ? "Strong" : "Gentle"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Precipitation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-600" />
            Precipitation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold">{weather.current.precip_mm} mm</div>
            <div className="text-xs text-muted-foreground">Last hour</div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">
                {weather.current.precip_mm > 5 ? "Heavy" : weather.current.precip_mm > 0 ? "Light" : "None"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

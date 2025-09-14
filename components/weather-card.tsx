import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Droplets, Eye, Thermometer, Wind } from "lucide-react"
import type { WeatherData } from "@/lib/weather"

interface WeatherCardProps {
  weather: WeatherData
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const { current, location } = weather

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Current Weather</span>
          <Badge variant="outline">
            {location.name}, {location.region}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-chart-1" />
            <span className="text-2xl font-bold">{current.temp_c}°C</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Feels like</p>
            <p className="font-medium">{current.feelslike_c}°C</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-chart-2" />
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="font-medium">{current.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-chart-3" />
            <div>
              <p className="text-sm text-muted-foreground">Wind</p>
              <p className="font-medium">{current.wind_kph} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-chart-4" />
            <div>
              <p className="text-sm text-muted-foreground">Precipitation</p>
              <p className="font-medium">{current.precip_mm} mm</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-chart-5" />
            <div>
              <p className="text-sm text-muted-foreground">UV Index</p>
              <p className="font-medium">{current.uv}</p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">Condition</p>
          <p className="font-medium">{current.condition.text}</p>
        </div>
      </CardContent>
    </Card>
  )
}

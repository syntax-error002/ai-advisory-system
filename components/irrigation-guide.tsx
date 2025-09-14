import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Droplets, Thermometer, Cloud } from "lucide-react"

interface IrrigationGuideProps {
  cropType: string
  temperature: number
  humidity: number
  precipitation: number
  windSpeed: number
}

const cropWaterNeeds = {
  rice: { daily: 25, critical: "Flooding required", method: "Continuous flooding" },
  wheat: { daily: 15, critical: "Tillering & grain filling", method: "Furrow irrigation" },
  corn: { daily: 20, critical: "Tasseling & grain filling", method: "Drip or sprinkler" },
  brinjal: { daily: 12, critical: "Flowering & fruiting", method: "Drip irrigation" },
  tomato: { daily: 18, critical: "Flowering & fruiting", method: "Drip irrigation" },
  potato: { daily: 10, critical: "Tuber formation", method: "Furrow irrigation" },
  onion: { daily: 8, critical: "Bulb development", method: "Light frequent watering" },
  cotton: { daily: 22, critical: "Flowering & boll formation", method: "Furrow irrigation" },
  sugarcane: { daily: 30, critical: "Throughout growth", method: "Flood irrigation" },
  soybean: { daily: 16, critical: "Pod filling", method: "Sprinkler irrigation" },
}

export function IrrigationGuide({ cropType, temperature, humidity, precipitation, windSpeed }: IrrigationGuideProps) {
  const waterNeeds = cropWaterNeeds[cropType as keyof typeof cropWaterNeeds] || cropWaterNeeds.rice

  // Calculate irrigation need based on weather conditions
  const calculateIrrigationNeed = () => {
    let baseNeed = waterNeeds.daily

    // Adjust for temperature
    if (temperature > 35) baseNeed *= 1.3
    else if (temperature > 30) baseNeed *= 1.1
    else if (temperature < 20) baseNeed *= 0.8

    // Adjust for humidity
    if (humidity < 40) baseNeed *= 1.2
    else if (humidity > 80) baseNeed *= 0.8

    // Adjust for wind
    if (windSpeed > 15) baseNeed *= 1.1

    // Reduce if recent precipitation
    if (precipitation > 5) baseNeed *= 0.3
    else if (precipitation > 1) baseNeed *= 0.7

    return Math.round(baseNeed)
  }

  const recommendedWater = calculateIrrigationNeed()
  const waterStress =
    recommendedWater > waterNeeds.daily * 1.2 ? "high" : recommendedWater < waterNeeds.daily * 0.8 ? "low" : "normal"

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Irrigation Guide
          </div>
          <Badge variant={waterStress === "high" ? "destructive" : waterStress === "low" ? "secondary" : "default"}>
            {waterStress.toUpperCase()} NEED
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Today's Water Requirement</span>
            <span className="font-medium">{recommendedWater}mm</span>
          </div>
          <Progress value={(recommendedWater / 40) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground">Based on current weather conditions for {cropType}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <Thermometer className="h-4 w-4 mx-auto text-chart-1" />
            <p className="text-xs text-muted-foreground">Temperature</p>
            <p className="text-sm font-medium">{temperature}°C</p>
          </div>
          <div className="space-y-1">
            <Droplets className="h-4 w-4 mx-auto text-chart-2" />
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-medium">{humidity}%</p>
          </div>
          <div className="space-y-1">
            <Cloud className="h-4 w-4 mx-auto text-chart-3" />
            <p className="text-xs text-muted-foreground">Rainfall</p>
            <p className="text-sm font-medium">{precipitation}mm</p>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <div>
            <h4 className="font-medium text-sm">Recommended Method</h4>
            <p className="text-sm text-muted-foreground">{waterNeeds.method}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm">Critical Growth Stage</h4>
            <p className="text-sm text-muted-foreground">{waterNeeds.critical}</p>
          </div>
        </div>

        {precipitation > 5 && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm">
              <strong>Rain Alert:</strong> Recent rainfall detected. Reduce irrigation by 70% today to prevent
              waterlogging.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

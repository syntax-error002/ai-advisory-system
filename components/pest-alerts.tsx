import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Bug, Shield, AlertTriangle } from "lucide-react"

interface PestAlertsProps {
  cropType: string
  weatherCondition: string
  humidity: number
  temperature: number
}

const pestRisks = {
  rice: {
    high_humidity: ["Brown planthopper", "Rice blast", "Bacterial leaf blight"],
    high_temp: ["Rice stem borer", "Leaf folder"],
    rainy: ["Sheath blight", "Rice tungro virus"],
  },
  wheat: {
    high_humidity: ["Rust diseases", "Powdery mildew"],
    high_temp: ["Aphids", "Termites"],
    rainy: ["Septoria leaf blotch", "Fusarium head blight"],
  },
  brinjal: {
    high_humidity: ["Fruit and shoot borer", "Little leaf disease"],
    high_temp: ["Whitefly", "Jassids"],
    rainy: ["Damping off", "Bacterial wilt"],
  },
  tomato: {
    high_humidity: ["Late blight", "Early blight"],
    high_temp: ["Whitefly", "Thrips"],
    rainy: ["Septoria leaf spot", "Bacterial canker"],
  },
}

export function PestAlerts({ cropType, weatherCondition, humidity, temperature }: PestAlertsProps) {
  const risks = pestRisks[cropType as keyof typeof pestRisks] || pestRisks.rice

  const getCurrentRisks = () => {
    const currentRisks: string[] = []

    if (humidity > 80) {
      currentRisks.push(...risks.high_humidity)
    }

    if (temperature > 30) {
      currentRisks.push(...risks.high_temp)
    }

    if (weatherCondition.toLowerCase().includes("rain") || weatherCondition.toLowerCase().includes("shower")) {
      currentRisks.push(...risks.rainy)
    }

    return [...new Set(currentRisks)] // Remove duplicates
  }

  const currentRisks = getCurrentRisks()
  const riskLevel = currentRisks.length > 2 ? "high" : currentRisks.length > 0 ? "medium" : "low"

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Pest Risk Assessment
          </div>
          <Badge variant={riskLevel === "high" ? "destructive" : riskLevel === "medium" ? "default" : "secondary"}>
            {riskLevel.toUpperCase()} RISK
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentRisks.length > 0 ? (
          <div className="space-y-3">
            <Alert variant={riskLevel === "high" ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Current weather conditions favor pest activity. Monitor your {cropType} crops closely.
              </AlertDescription>
            </Alert>

            <div>
              <h4 className="font-medium text-sm mb-2">Potential Pests to Watch:</h4>
              <ul className="space-y-1">
                {currentRisks.map((pest, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 bg-destructive rounded-full" />
                    {pest}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Current weather conditions are favorable. Low pest risk for your {cropType} crops.
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium text-sm mb-2">Prevention Tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Regular field inspection (2-3 times per week)</li>
            <li>• Maintain proper plant spacing for air circulation</li>
            <li>• Use organic neem-based pesticides as prevention</li>
            <li>• Remove infected plants immediately</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

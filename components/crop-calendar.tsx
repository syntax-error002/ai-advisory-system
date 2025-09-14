import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Send as Seed, Scissors, Droplets } from "lucide-react"

interface CropCalendarProps {
  cropType: string
}

const cropActivities = {
  rice: {
    planting: "June - July",
    watering: "Regular flooding required",
    harvesting: "October - November",
    fertilizing: "Apply NPK during tillering stage",
  },
  wheat: {
    planting: "November - December",
    watering: "Moderate watering needed",
    harvesting: "March - April",
    fertilizing: "Apply urea at sowing and tillering",
  },
  corn: {
    planting: "March - May",
    watering: "Deep watering twice weekly",
    harvesting: "July - September",
    fertilizing: "Apply compost before planting",
  },
  brinjal: {
    planting: "June - July, October - November",
    watering: "Regular watering, avoid waterlogging",
    harvesting: "90-120 days after transplanting",
    fertilizing: "Apply organic manure regularly",
  },
  tomato: {
    planting: "June - July, October - November",
    watering: "Consistent moisture, drip irrigation preferred",
    harvesting: "75-90 days after transplanting",
    fertilizing: "Balanced NPK with calcium",
  },
  potato: {
    planting: "October - December",
    watering: "Moderate watering, avoid excess",
    harvesting: "February - April",
    fertilizing: "Apply potash-rich fertilizer",
  },
  onion: {
    planting: "November - January",
    watering: "Light frequent watering",
    harvesting: "April - May",
    fertilizing: "Apply nitrogen in early stages",
  },
  cotton: {
    planting: "April - May",
    watering: "Deep watering at intervals",
    harvesting: "October - December",
    fertilizing: "Apply phosphorus at flowering",
  },
  sugarcane: {
    planting: "February - March, October - November",
    watering: "Heavy watering required",
    harvesting: "12-18 months after planting",
    fertilizing: "Apply nitrogen in multiple splits",
  },
  soybean: {
    planting: "June - July",
    watering: "Moderate watering needed",
    harvesting: "September - October",
    fertilizing: "Apply phosphorus and potash",
  },
}

export function CropCalendar({ cropType }: CropCalendarProps) {
  const activities = cropActivities[cropType as keyof typeof cropActivities] || cropActivities.rice

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Crop Calendar - {cropType.charAt(0).toUpperCase() + cropType.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Seed className="h-5 w-5 text-chart-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Planting Season</h4>
              <p className="text-sm text-muted-foreground">{activities.planting}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Droplets className="h-5 w-5 text-chart-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Watering</h4>
              <p className="text-sm text-muted-foreground">{activities.watering}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Scissors className="h-5 w-5 text-chart-4 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Harvesting</h4>
              <p className="text-sm text-muted-foreground">{activities.harvesting}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-5 w-5 bg-chart-5 rounded mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Fertilizing</h4>
              <p className="text-sm text-muted-foreground">{activities.fertilizing}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Seasonal Crop</Badge>
            <Badge variant="outline">Weather Dependent</Badge>
            <Badge variant="outline">Market Ready</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import type { WeatherData } from "./weather"
import type { AlertItem } from "@/components/alert-center"

export function generateWeatherAlerts(weather: WeatherData, cropType: string): AlertItem[] {
  const alerts: AlertItem[] = []
  const { current } = weather
  const now = new Date()

  // High temperature alert
  if (current.temp_c > 35) {
    alerts.push({
      id: `temp-${now.getTime()}`,
      type: "weather",
      priority: "high",
      title: "High Temperature Alert",
      message: `Temperature is ${current.temp_c}°C. Consider providing shade for ${cropType} crops and increase irrigation frequency.`,
      timestamp: now,
    })
  }

  // Heavy rain alert
  if (current.precip_mm > 10) {
    alerts.push({
      id: `rain-${now.getTime()}`,
      type: "weather",
      priority: "medium",
      title: "Heavy Rainfall Detected",
      message: `${current.precip_mm}mm rainfall recorded. Avoid spraying pesticides and check for waterlogging in ${cropType} fields.`,
      timestamp: now,
    })
  }

  // High humidity pest risk
  if (current.humidity > 85) {
    alerts.push({
      id: `humidity-${now.getTime()}`,
      type: "pest",
      priority: "medium",
      title: "High Humidity Pest Risk",
      message: `Humidity at ${current.humidity}%. Monitor ${cropType} crops for fungal diseases and pest activity.`,
      timestamp: now,
    })
  }

  // Strong wind alert
  if (current.wind_kph > 25) {
    alerts.push({
      id: `wind-${now.getTime()}`,
      type: "weather",
      priority: "medium",
      title: "Strong Wind Warning",
      message: `Wind speed is ${current.wind_kph} km/h. Secure young plants and avoid aerial spraying operations.`,
      timestamp: now,
    })
  }

  // Low humidity irrigation alert
  if (current.humidity < 30 && current.temp_c > 30) {
    alerts.push({
      id: `irrigation-${now.getTime()}`,
      type: "irrigation",
      priority: "high",
      title: "Irrigation Required",
      message: `Low humidity (${current.humidity}%) and high temperature. Increase watering frequency for ${cropType} crops.`,
      timestamp: now,
    })
  }

  // UV index alert
  if (current.uv > 8) {
    alerts.push({
      id: `uv-${now.getTime()}`,
      type: "general",
      priority: "low",
      title: "High UV Index",
      message: `UV index is ${current.uv}. Avoid midday field work and ensure worker protection.`,
      timestamp: now,
    })
  }

  return alerts
}

export function generateCropSpecificAlerts(cropType: string, weather: WeatherData): AlertItem[] {
  const alerts: AlertItem[] = []
  const { current } = weather
  const now = new Date()

  // Crop-specific temperature alerts
  const cropTempLimits: Record<string, { min: number; max: number }> = {
    rice: { min: 20, max: 35 },
    wheat: { min: 15, max: 25 },
    tomato: { min: 18, max: 30 },
    brinjal: { min: 20, max: 35 },
    potato: { min: 15, max: 25 },
  }

  const limits = cropTempLimits[cropType]
  if (limits) {
    if (current.temp_c < limits.min) {
      alerts.push({
        id: `crop-temp-low-${now.getTime()}`,
        type: "weather",
        priority: "medium",
        title: `${cropType.charAt(0).toUpperCase() + cropType.slice(1)} Temperature Alert`,
        message: `Temperature (${current.temp_c}°C) is below optimal range for ${cropType}. Growth may be affected.`,
        timestamp: now,
      })
    } else if (current.temp_c > limits.max) {
      alerts.push({
        id: `crop-temp-high-${now.getTime()}`,
        type: "weather",
        priority: "high",
        title: `${cropType.charAt(0).toUpperCase() + cropType.slice(1)} Heat Stress`,
        message: `Temperature (${current.temp_c}°C) is above optimal range for ${cropType}. Implement cooling measures.`,
        timestamp: now,
      })
    }
  }

  return alerts
}

"use client"

import { useState, useEffect } from "react"
import { WeatherCard } from "@/components/weather-card"
import { AdvisoryCard } from "@/components/advisory-card"
import { CropSelector } from "@/components/crop-selector"
import { CropCalendar } from "@/components/crop-calendar"
import { PestAlerts } from "@/components/pest-alerts"
import { IrrigationGuide } from "@/components/irrigation-guide"
import { AlertCenter, type AlertItem } from "@/components/alert-center"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Sprout, Calendar, Bug, Droplets, Bell, MapPin } from "lucide-react"
import { generateWeatherAlerts, generateCropSpecificAlerts } from "@/lib/alert-generator"
import type { WeatherData } from "@/lib/weather"
import type { AdvisoryResponse } from "@/lib/ai-advisor"
import { AISummaryButton } from "@/components/ai-summary-button"

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [advisory, setAdvisory] = useState<AdvisoryResponse | null>(null)
  const [location, setLocation] = useState("Kochi, Kerala")
  const [selectedCrop, setSelectedCrop] = useState("rice")
  const [loading, setLoading] = useState(false)
  const [advisoryLoading, setAdvisoryLoading] = useState(false)
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  const autoDetectLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            // For Kerala, we'll map coordinates to districts
            const detectedLocation = getKeralaDistrict(latitude, longitude)
            setLocation(detectedLocation)
            fetchWeatherAndAdvisory(detectedLocation)
          },
          () => {
            // If geolocation fails, use Kochi as default
            console.log("Geolocation failed, using Kochi as default")
            fetchWeatherAndAdvisory("Kochi, Kerala")
          },
        )
      } else {
        fetchWeatherAndAdvisory("Kochi, Kerala")
      }
    } catch (error) {
      console.log("Location detection failed, using Kochi as default")
      fetchWeatherAndAdvisory("Kochi, Kerala")
    }
  }

  const getKeralaDistrict = (lat: number, lng: number): string => {
    // Simplified mapping for Kerala districts based on coordinates
    if (lat >= 11.5 && lat <= 12.0 && lng >= 75.0 && lng <= 76.0) return "Kozhikode, Kerala"
    if (lat >= 10.0 && lat <= 10.5 && lng >= 76.0 && lng <= 77.0) return "Kochi, Kerala"
    if (lat >= 8.5 && lat <= 9.0 && lng >= 76.5 && lng <= 77.5) return "Thiruvananthapuram, Kerala"
    if (lat >= 9.5 && lat <= 10.0 && lng >= 76.0 && lng <= 77.0) return "Thrissur, Kerala"
    if (lat >= 10.5 && lat <= 11.0 && lng >= 75.5 && lng <= 76.5) return "Malappuram, Kerala"
    // Default to Kochi if coordinates don't match
    return "Kochi, Kerala"
  }

  const fetchWeatherAndAdvisory = async (newLocation?: string) => {
    const targetLocation = newLocation || location
    setLoading(true)
    setAdvisoryLoading(true)

    try {
      // Fetch weather data
      const weatherResponse = await fetch(`/api/weather?location=${encodeURIComponent(targetLocation)}`)
      if (!weatherResponse.ok) throw new Error("Failed to fetch weather")

      const weatherData: WeatherData = await weatherResponse.json()
      setWeather(weatherData)
      setLoading(false)

      // Generate alerts based on weather and crop data
      const weatherAlerts = generateWeatherAlerts(weatherData, selectedCrop)
      const cropAlerts = generateCropSpecificAlerts(selectedCrop, weatherData)
      setAlerts((prev) => {
        const existingIds = new Set(prev.map((alert) => alert.id))
        const newAlerts = [...weatherAlerts, ...cropAlerts].filter((alert) => !existingIds.has(alert.id))
        return [...prev, ...newAlerts]
      })

      // Fetch AI advisory
      const advisoryResponse = await fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weatherData,
          cropType: selectedCrop,
          location: targetLocation,
          season: getCurrentSeason(),
        }),
      })

      if (!advisoryResponse.ok) throw new Error("Failed to fetch advisory")

      const advisoryData: AdvisoryResponse = await advisoryResponse.json()
      setAdvisory(advisoryData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
      setAdvisoryLoading(false)
    }
  }

  const getCurrentSeason = () => {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return "Spring"
    if (month >= 5 && month <= 7) return "Summer"
    if (month >= 8 && month <= 10) return "Autumn"
    return "Winter"
  }

  const handleCropChange = (newCrop: string) => {
    setSelectedCrop(newCrop)
    if (weather) {
      setAdvisoryLoading(true)

      // Generate new crop-specific alerts
      const cropAlerts = generateCropSpecificAlerts(newCrop, weather)
      setAlerts((prev) => {
        const existingIds = new Set(prev.map((alert) => alert.id))
        const newAlerts = cropAlerts.filter((alert) => !existingIds.has(alert.id))
        return [...prev, ...newAlerts]
      })

      fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weatherData: weather,
          cropType: newCrop,
          location,
          season: getCurrentSeason(),
        }),
      })
        .then((res) => res.json())
        .then((data) => setAdvisory(data))
        .catch((error) => console.error("Error updating advisory:", error))
        .finally(() => setAdvisoryLoading(false))
    }
  }

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, dismissed: true } : alert)))
  }

  useEffect(() => {
    autoDetectLocation()
  }, [])

  const activeAlertsCount = alerts.filter((alert) => !alert.dismissed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-green-200 dark:border-gray-700">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <Sprout className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Kerala Krishi</h1>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3 w-3" />
                  <span>{location}</span>
                </div>
              </div>
            </div>
            {activeAlertsCount > 0 && (
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeAlertsCount}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-green-100 dark:border-gray-700">
          <CropSelector selectedCrop={selectedCrop} onCropChange={handleCropChange} />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-sm border border-green-100 dark:border-gray-700">
            <TabsList className="grid w-full grid-cols-5 bg-transparent h-12">
              <TabsTrigger
                value="overview"
                className="flex flex-col items-center gap-1 text-xs data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300"
              >
                <Sprout className="h-4 w-4" />
                <span>Home</span>
              </TabsTrigger>
              <TabsTrigger
                value="alerts"
                className="flex flex-col items-center gap-1 text-xs data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300 relative"
              >
                <Bell className="h-4 w-4" />
                <span>Alerts</span>
                {activeAlertsCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {activeAlertsCount}
                  </div>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="flex flex-col items-center gap-1 text-xs data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300"
              >
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </TabsTrigger>
              <TabsTrigger
                value="pests"
                className="flex flex-col items-center gap-1 text-xs data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300"
              >
                <Bug className="h-4 w-4" />
                <span>Pests</span>
              </TabsTrigger>
              <TabsTrigger
                value="irrigation"
                className="flex flex-col items-center gap-1 text-xs data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300"
              >
                <Droplets className="h-4 w-4" />
                <span>Water</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-4">
              {weather ? (
                <WeatherCard weather={weather} />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-green-100 dark:border-gray-700">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-green-600" />
                    <p className="text-gray-600 dark:text-gray-400">Loading weather data...</p>
                  </div>
                </div>
              )}

              {advisory ? (
                <AdvisoryCard advisory={advisory} loading={advisoryLoading} />
              ) : (
                <AdvisoryCard
                  advisory={{
                    recommendations: [],
                    alerts: [],
                    priority: "medium",
                  }}
                  loading={true}
                />
              )}
            </div>

            <Button
              onClick={() => fetchWeatherAndAdvisory()}
              disabled={loading}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-2xl"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </TabsContent>

          <TabsContent value="alerts">
            <AlertCenter alerts={alerts} onDismissAlert={handleDismissAlert} />
          </TabsContent>

          <TabsContent value="calendar">
            <CropCalendar cropType={selectedCrop} />
          </TabsContent>

          <TabsContent value="pests">
            {weather && (
              <PestAlerts
                cropType={selectedCrop}
                weatherCondition={weather.current.condition.text}
                humidity={weather.current.humidity}
                temperature={weather.current.temp_c}
              />
            )}
          </TabsContent>

          <TabsContent value="irrigation">
            {weather && (
              <IrrigationGuide
                cropType={selectedCrop}
                temperature={weather.current.temp_c}
                humidity={weather.current.humidity}
                precipitation={weather.current.precip_mm}
                windSpeed={weather.current.wind_kph}
              />
            )}
          </TabsContent>
        </Tabs>

        <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-2xl p-4 border border-green-200 dark:border-green-700">
          <h3 className="font-semibold mb-3 text-green-800 dark:text-green-200">Kerala Farming Tips - കൃഷി നുറുങ്ങുകൾ</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
              <h4 className="font-medium mb-1 text-green-700 dark:text-green-300">Monsoon Preparation</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor Southwest & Northeast monsoons for optimal planting
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
              <h4 className="font-medium mb-1 text-green-700 dark:text-green-300">Spice Cultivation</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Kerala's spices need specific humidity and temperature conditions
              </p>
            </div>
          </div>
        </div>

        <div className="h-20"></div>
      </div>

      {weather && <AISummaryButton weather={weather} cropType={selectedCrop} location={location} />}
    </div>
  )
}

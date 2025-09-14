"use client"

import { useState, useEffect } from "react"
import { WeatherCard } from "@/components/weather-card"
import { AdvisoryCard } from "@/components/advisory-card"
import { CropSelector } from "@/components/crop-selector"
import { CropCalendar } from "@/components/crop-calendar"
import { PestAlerts } from "@/components/pest-alerts"
import { IrrigationGuide } from "@/components/irrigation-guide"
import { AlertCenter, type AlertItem } from "@/components/alert-center"
import { RefreshCw, Sprout, Calendar, Bug, Droplets, Bell, MapPin, Bot } from "lucide-react"
import { generateWeatherAlerts, generateCropSpecificAlerts } from "@/lib/alert-generator"
import type { WeatherData } from "@/lib/weather"
import type { AdvisoryResponse } from "@/lib/ai-advisor"
import { AISummaryButton } from "@/components/ai-summary-button"

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [advisory, setAdvisory] = useState<AdvisoryResponse | null>(null)
  const [location, setLocation] = useState("Kochi, Kerala")
  const [selectedCrop, setSelectedCrop] = useState("rice")
  const [loading, setLoading] = useState(true)
  const [advisoryLoading, setAdvisoryLoading] = useState(true)
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  const autoDetectLocation = async () => {
    // Implement geolocation logic or default to a location
    // For this example, we'll stick with the default
    fetchWeatherAndAdvisory("Kochi, Kerala")
  }

  const fetchWeatherAndAdvisory = async (newLocation?: string) => {
    const targetLocation = newLocation || location
    setLoading(true)
    setAdvisoryLoading(true)

    try {
      const [weatherResponse, advisoryResponse] = await Promise.all([
        fetch(`/api/weather?location=${encodeURIComponent(targetLocation)}`),
        fetch("/api/advisory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cropType: selectedCrop,
            location: targetLocation,
            season: getCurrentSeason(),
          }),
        }),
      ])

      if (!weatherResponse.ok) throw new Error("Failed to fetch weather")
      const weatherData: WeatherData = await weatherResponse.json()
      setWeather(weatherData)

      if (!advisoryResponse.ok) throw new Error("Failed to fetch advisory")
      const advisoryData: AdvisoryResponse = await advisoryResponse.json()
      setAdvisory(advisoryData)

      const weatherAlerts = generateWeatherAlerts(weatherData, selectedCrop)
      const cropAlerts = generateCropSpecificAlerts(selectedCrop, weatherData)
      setAlerts([...weatherAlerts, ...cropAlerts])
    } catch (error) {
      console.error("Error fetching data:", error)
      // Optionally, set an error state to display to the user
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
    fetchWeatherAndAdvisory()
  }

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  useEffect(() => {
    autoDetectLocation()
  }, [])

  const activeAlertsCount = alerts.filter((alert) => !alert.dismissed).length

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center p-8 bg-card rounded-2xl">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : weather && (
              <WeatherCard weather={weather} />
            )}
            {advisoryLoading ? (
              <div className="flex items-center justify-center p-8 bg-card rounded-2xl">
                <Bot className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : advisory && (
              <AdvisoryCard advisory={advisory} loading={advisoryLoading} />
            )}
          </div>
        )
      case "calendar":
        return <CropCalendar cropType={selectedCrop} />
      case "pests":
        return weather ? (
          <PestAlerts
            cropType={selectedCrop}
            weatherCondition={weather.current.condition.text}
            humidity={weather.current.humidity}
            temperature={weather.current.temp_c}
          />
        ) : null
      case "irrigation":
        return weather ? (
          <IrrigationGuide
            cropType={selectedCrop}
            temperature={weather.current.temp_c}
            humidity={weather.current.humidity}
            precipitation={weather.current.precip_mm}
            windSpeed={weather.current.wind_kph}
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-lg font-bold">Kerala Krishi</h1>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{location}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setActiveTab("alerts")}>
              <Bell className="h-6 w-6" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <CropSelector selectedCrop={selectedCrop} onCropChange={handleCropChange} />
        {activeTab === "alerts" ? (
          <AlertCenter alerts={alerts} onDismissAlert={handleDismissAlert} />
        ) : (
          renderContent()
        )}
        {/* Spacer for bottom nav */}
        <div className="h-16" />
      </main>

      {/* AI Summary FAB */}
      {weather && (
        <div className="absolute bottom-24 right-4 z-40">
          <AISummaryButton weather={weather} cropType={selectedCrop} location={location} />
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-md max-w-lg mx-auto">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex flex-col items-center justify-center gap-1 text-xs ${activeTab === "overview" ? "text-primary" : "text-muted-foreground"}`}>
            <Sprout className="h-5 w-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex flex-col items-center justify-center gap-1 text-xs ${activeTab === "calendar" ? "text-primary" : "text-muted-foreground"}`}>
            <Calendar className="h-5 w-5" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab("pests")}
            className={`flex flex-col items-center justify-center gap-1 text-xs ${activeTab === "pests" ? "text-primary" : "text-muted-foreground"}`}>
            <Bug className="h-5 w-5" />
            <span>Pests</span>
          </button>
          <button
            onClick={() => setActiveTab("irrigation")}
            className={`flex flex-col items-center justify-center gap-1 text-xs ${activeTab === "irrigation" ? "text-primary" : "text-muted-foreground"}`}>
            <Droplets className="h-5 w-5" />
            <span>Water</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

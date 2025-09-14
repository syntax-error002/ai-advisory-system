import { type NextRequest, NextResponse } from "next/server"
import { getWeatherData } from "@/lib/weather"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location") || "New Delhi"

  try {
    const weatherData = await getWeatherData(location)
    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"

// IMPORTANT: Replace with your actual Gemini API Key
// You should move this to a .env.local file to keep it secure
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { weather, cropType, location } = await request.json()

    if (!weather || !cropType || !location) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const prompt = `You are an expert agricultural AI assistant for farmers in Kerala, India. Your goal is to provide a highly relevant, concise, and actionable summary based on the provided real-time data.

Location: ${location}
Crop: ${cropType}
Current Weather: ${weather.current.temp_c}°C, ${weather.current.condition.text}
Humidity: ${weather.current.humidity}%
Wind: ${weather.current.wind_kph} km/h
Today's Forecast:
  - Max Temp: ${weather.forecast.forecastday[0].day.maxtemp_c}°C
  - Min Temp: ${weather.forecast.forecastday[0].day.mintemp_c}°C
  - Chance of Rain: ${weather.forecast.forecastday[0].day.daily_chance_of_rain}%
  - Total Precipitation: ${weather.forecast.forecastday[0].day.totalprecip_mm} mm

Generate a JSON object with two key fields: "summary" and "tip".

1.  **"summary" (max 30 words):**
    - Briefly describe the current weather's impact on the specified crop.
    - Mention any immediate opportunities or threats.
    - Example: "Warm, humid weather is good for rice growth, but increases fungal risk."

2.  **"tip" (max 20 words):**
    - Provide one highly practical and actionable tip directly related to the summary.
    - Be specific. Instead of "monitor pests", say "Check for leaf folder pests due to high humidity."
    - Example: "Scout for sheath blight and consider a preventive fungicide application."

Output Format (JSON only):
{
  "summary": "...",
  "tip": "..."
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
            responseMimeType: "application/json",
          },
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Gemini API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      throw new Error("No response from Gemini API")
    }
    
    const parsedResponse = JSON.parse(generatedText)
    return NextResponse.json(parsedResponse)

  } catch (error) {
    console.error("Error generating quick summary:", error)
    // Providing a more informative fallback
    return NextResponse.json(
      {
        summary: "Could not generate AI summary. The service may be temporarily unavailable.",
        tip: "Please rely on the standard weather and crop data for now.",
      },
      { status: 500 },
    )
  }
}

export interface AdvisoryRequest {
  weatherData: any
  cropType?: string
  location?: string
  season?: string
}

export interface AdvisoryResponse {
  recommendations: string[]
  alerts: string[]
  priority: "low" | "medium" | "high"
}

export async function getAIAdvisory(request: AdvisoryRequest): Promise<AdvisoryResponse> {
  const GEMINI_API_KEY = "AIzaSyDSIgIkI2Xe3cL_iyiUDttsORjN_1LbLZs"

  const prompt = `You are an agricultural advisor AI. Based on the following weather data and crop information, provide specific, actionable farming advice.

Weather Data:
- Temperature: ${request.weatherData.current?.temp_c}°C
- Humidity: ${request.weatherData.current?.humidity}%
- Wind Speed: ${request.weatherData.current?.wind_kph} km/h
- Precipitation: ${request.weatherData.current?.precip_mm}mm
- UV Index: ${request.weatherData.current?.uv}
- Condition: ${request.weatherData.current?.condition?.text}
- Location: ${request.weatherData.location?.name}, ${request.weatherData.location?.region}

Crop Type: ${request.cropType || "General crops"}
Season: ${request.season || "Current season"}

Please provide:
1. 3-5 specific recommendations for today's farming activities
2. Any weather-related alerts or warnings
3. Priority level (low/medium/high) based on weather conditions

Format your response as JSON with this structure:
{
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "alerts": ["alert 1", "alert 2", ...],
  "priority": "low|medium|high"
}`

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates[0].content.parts[0].text

    // Try to parse JSON response
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.warn("Failed to parse AI response as JSON, using fallback")
    }

    // Fallback if JSON parsing fails
    return {
      recommendations: [aiResponse.substring(0, 200) + "..."],
      alerts: ["Check weather conditions regularly"],
      priority: "medium" as const,
    }
  } catch (error) {
    console.error("Failed to get AI advisory:", error)
    return {
      recommendations: ["Monitor weather conditions closely", "Check crop health regularly"],
      alerts: ["Unable to get current AI recommendations"],
      priority: "medium" as const,
    }
  }
}

import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = "AIzaSyDSIgIkI2Xe3cL_iyiUDttsORjN_1LbLZs"

export async function POST(request: NextRequest) {
  try {
    const { weather, cropType, location } = await request.json()

    if (!weather || !cropType || !location) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const prompt = `Based on the following data, provide a very brief summary (max 25 words) and one practical tip (max 15 words) for a farmer:

Location: ${location}
Crop: ${cropType}
Weather: ${weather.current.temp_c}°C, ${weather.current.condition.text}
Humidity: ${weather.current.humidity}%
Wind: ${weather.current.wind_kph} km/h

Format your response as JSON:
{
  "summary": "Brief weather and crop status summary",
  "tip": "One actionable farming tip"
}`

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
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 150,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!generatedText) {
      throw new Error("No response from Gemini API")
    }

    // Try to parse JSON from the response
    let parsedResponse
    try {
      // Extract JSON from the response (in case it's wrapped in markdown)
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      parsedResponse = {
        summary: "Current conditions are suitable for farming activities.",
        tip: "Monitor weather changes regularly.",
      }
    }

    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error("Error generating quick summary:", error)
    return NextResponse.json(
      {
        summary: "Weather data available for your location.",
        tip: "Check conditions before field work.",
      },
      { status: 200 },
    )
  }
}

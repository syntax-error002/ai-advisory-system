import { type NextRequest, NextResponse } from "next/server"
import { getAIAdvisory } from "@/lib/ai-advisor"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const advisory = await getAIAdvisory(body)
    return NextResponse.json(advisory)
  } catch (error) {
    console.error("Advisory API error:", error)
    return NextResponse.json({ error: "Failed to get AI advisory" }, { status: 500 })
  }
}

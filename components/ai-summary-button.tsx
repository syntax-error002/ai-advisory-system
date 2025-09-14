'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, X, Loader2, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface AISummaryButtonProps {
  weather: any
  cropType: string
  location: string
}

interface QuickSummary {
  summary: string
  tip: string
}

export function AISummaryButton({ weather, cropType, location }: AISummaryButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<QuickSummary | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const getQuickSummary = async () => {
    if (isOpen) {
      setIsOpen(false)
      return
    }

    setIsOpen(true)
    if (summary) return

    setLoading(true)

    try {
      const response = await fetch("/api/quick-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weather, cropType, location }),
      })

      if (!response.ok) throw new Error(`API Error: ${response.status}`)

      const data: QuickSummary = await response.json()
      setSummary(data)
    } catch (error) {
      console.error("Error getting quick summary:", error)
      setSummary({
        summary: "Unable to generate summary at the moment.",
        tip: "Please try again later or check your connection.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        const fabButton = document.getElementById("ai-fab")
        if (fabButton && !fabButton.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [cardRef])

  return (
    <>
      <div className="fixed bottom-24 right-4 z-50" id="ai-fab">
        <Button
          onClick={getQuickSummary}
          size="icon"
          className={cn(
            "rounded-full h-16 w-16 shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-110",
            "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
            isOpen && "scale-110 bg-muted text-muted-foreground",
          )}
          disabled={!weather}
        >
          {isOpen ? <X className="h-7 w-7" /> : <Sparkles className="h-7 w-7" />}
        </Button>
      </div>

      {isOpen && (
        <div
          ref={cardRef}
          className="fixed bottom-44 right-4 z-40 w-[calc(100vw-3rem)] max-w-sm origin-bottom-right transition-all duration-300 ease-in-out transform-gpu animate-in slide-in-from-bottom-5 fade-in"
        >
          <Card className="bg-gradient-to-br from-card to-card/90 backdrop-blur-lg border-2 border-primary/20 shadow-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-primary">AI-Generated Insights</h3>
              </div>

              {loading ? (
                <div className="space-y-3 py-2">
                  <div className="h-4 bg-muted/50 rounded-full animate-pulse w-full" />
                  <div className="h-4 bg-muted/50 rounded-full animate-pulse w-5/6" />
                  <div className="h-8 bg-muted/50 rounded-lg animate-pulse w-full mt-4" />
                </div>
              ) : summary ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide text-muted-foreground">Weather Impact</h4>
                    <p className="text-base font-medium text-pretty leading-snug">{summary.summary}</p>
                  </div>
                  <div className="border-t border-primary/10 pt-3">
                    <h4 className="text-sm font-semibold tracking-wide text-primary/90">Actionable Tip</h4>
                    <p className="text-base font-bold text-primary text-pretty leading-snug">{summary.tip}</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, X, Loader2 } from "lucide-react"
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

  const getQuickSummary = async () => {
    if (summary && !loading) {
      setIsOpen(!isOpen)
      return
    }

    setLoading(true)
    setIsOpen(true)

    try {
      const response = await fetch("/api/quick-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weather,
          cropType,
          location,
        }),
      })

      if (!response.ok) throw new Error("Failed to get summary")

      const data: QuickSummary = await response.json()
      setSummary(data)
    } catch (error) {
      console.error("Error getting quick summary:", error)
      setSummary({
        summary: "Unable to generate summary at the moment.",
        tip: "Try refreshing your data and check your internet connection.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={getQuickSummary}
          size="lg"
          className={cn(
            "rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200",
            "bg-accent hover:bg-accent/90 text-accent-foreground",
            isOpen && "bg-muted hover:bg-muted/90",
          )}
          disabled={!weather}
        >
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
        </Button>
      </div>

      {/* Summary Card */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-3rem)]">
          <Card className="shadow-xl border-2">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold text-sm">AI Quick Summary</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {loading ? (
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ) : summary ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Summary</h4>
                    <p className="text-sm text-pretty">{summary.summary}</p>
                  </div>
                  <div className="border-t pt-3">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Quick Tip
                    </h4>
                    <p className="text-sm font-medium text-accent text-pretty">{summary.tip}</p>
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

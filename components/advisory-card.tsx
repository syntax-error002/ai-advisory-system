import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, AlertCircle } from "lucide-react"
import type { AdvisoryResponse } from "@/lib/ai-advisor"

interface AdvisoryCardProps {
  advisory: AdvisoryResponse
  loading?: boolean
}

export function AdvisoryCard({ advisory, loading }: AdvisoryCardProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4" />
      case "medium":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI Advisory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Advisory</span>
          <Badge variant={getPriorityColor(advisory.priority) as any} className="flex items-center gap-1">
            {getPriorityIcon(advisory.priority)}
            {advisory.priority.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {advisory.alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Alerts</h4>
            {advisory.alerts.map((alert, index) => (
              <Alert key={index} variant={advisory.priority === "high" ? "destructive" : "default"}>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Recommendations</h4>
          <ul className="space-y-2">
            {advisory.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-chart-3 mt-0.5 flex-shrink-0" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

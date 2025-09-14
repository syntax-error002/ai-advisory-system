"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, Info, CheckCircle, X } from "lucide-react"
import { useState } from "react"

export interface AlertItem {
  id: string
  type: "weather" | "pest" | "irrigation" | "general"
  priority: "high" | "medium" | "low"
  title: string
  message: string
  timestamp: Date
  dismissed?: boolean
}

interface AlertCenterProps {
  alerts: AlertItem[]
  onDismissAlert: (alertId: string) => void
}

export function AlertCenter({ alerts, onDismissAlert }: AlertCenterProps) {
  const [showDismissed, setShowDismissed] = useState(false)

  const activeAlerts = alerts.filter((alert) => !alert.dismissed)
  const dismissedAlerts = alerts.filter((alert) => alert.dismissed)

  const getAlertIcon = (type: string, priority: string) => {
    if (priority === "high") return <AlertTriangle className="h-4 w-4" />
    if (type === "weather") return <Info className="h-4 w-4" />
    return <CheckCircle className="h-4 w-4" />
  }

  const getAlertVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alert Center
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {activeAlerts.length}
              </Badge>
            )}
          </div>
          {dismissedAlerts.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setShowDismissed(!showDismissed)}>
              {showDismissed ? "Hide" : "Show"} Dismissed
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeAlerts.length === 0 && !showDismissed && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No active alerts</p>
            <p className="text-sm">Your crops are looking good!</p>
          </div>
        )}

        {/* Active Alerts */}
        {activeAlerts.map((alert) => (
          <Alert key={alert.id} variant={getAlertVariant(alert.priority) as any}>
            <div className="flex items-start justify-between w-full">
              <div className="flex items-start gap-2 flex-1">
                {getAlertIcon(alert.type, alert.priority)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {alert.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</span>
                  </div>
                  <AlertDescription className="text-sm">{alert.message}</AlertDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onDismissAlert(alert.id)} className="ml-2 h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </Alert>
        ))}

        {/* Dismissed Alerts */}
        {showDismissed && dismissedAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground border-t pt-4">Dismissed Alerts</h4>
            {dismissedAlerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-muted rounded-lg opacity-60">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {alert.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

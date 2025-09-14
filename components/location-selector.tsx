"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search } from "lucide-react"

interface LocationSelectorProps {
  currentLocation: string
  onLocationChange: (location: string) => void
  loading?: boolean
}

const keralaLocations = [
  { value: "Thiruvananthapuram", label: "Thiruvananthapuram", district: "Thiruvananthapuram" },
  { value: "Kochi", label: "Kochi", district: "Ernakulam" },
  { value: "Kozhikode", label: "Kozhikode", district: "Kozhikode" },
  { value: "Thrissur", label: "Thrissur", district: "Thrissur" },
  { value: "Kollam", label: "Kollam", district: "Kollam" },
  { value: "Alappuzha", label: "Alappuzha", district: "Alappuzha" },
  { value: "Kottayam", label: "Kottayam", district: "Kottayam" },
  { value: "Palakkad", label: "Palakkad", district: "Palakkad" },
  { value: "Malappuram", label: "Malappuram", district: "Malappuram" },
  { value: "Kannur", label: "Kannur", district: "Kannur" },
  { value: "Kasaragod", label: "Kasaragod", district: "Kasaragod" },
  { value: "Wayanad", label: "Wayanad", district: "Wayanad" },
  { value: "Idukki", label: "Idukki", district: "Idukki" },
  { value: "Pathanamthitta", label: "Pathanamthitta", district: "Pathanamthitta" },
]

export function LocationSelector({ currentLocation, onLocationChange, loading }: LocationSelectorProps) {
  const [inputLocation, setInputLocation] = useState(currentLocation)
  const [useCustomLocation, setUseCustomLocation] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputLocation.trim()) {
      onLocationChange(inputLocation.trim())
    }
  }

  const handleSelectChange = (value: string) => {
    setInputLocation(value)
    onLocationChange(value)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Kerala Location</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div>
          <Select
            value={keralaLocations.find((loc) => loc.value === currentLocation)?.value || ""}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className="h-9 sm:h-10">
              <SelectValue placeholder="Select Kerala district" />
            </SelectTrigger>
            <SelectContent>
              {keralaLocations.map((location) => (
                <SelectItem key={location.value} value={location.value} className="text-sm">
                  <div className="flex flex-col">
                    <span>{location.label}</span>
                    <span className="text-xs text-muted-foreground">{location.district} District</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setUseCustomLocation(!useCustomLocation)}
            className="text-xs"
          >
            {useCustomLocation ? "Use Kerala Districts" : "Custom Location"}
          </Button>
        </div>

        {useCustomLocation && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter any location..."
              value={inputLocation}
              onChange={(e) => setInputLocation(e.target.value)}
              disabled={loading}
              className="h-9 sm:h-10 text-sm"
            />
            <Button type="submit" disabled={loading || !inputLocation.trim()} size="sm" className="px-3">
              <Search className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

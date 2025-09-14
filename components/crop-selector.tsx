"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wheat } from "lucide-react"

interface CropSelectorProps {
  selectedCrop: string
  onCropChange: (crop: string) => void
}

const crops = [
  { value: "rice", label: "Rice (Nellu)", emoji: "🌾" },
  { value: "coconut", label: "Coconut (Thenga)", emoji: "🥥" },
  { value: "pepper", label: "Black Pepper (Kurumulaku)", emoji: "🌶️" },
  { value: "cardamom", label: "Cardamom (Elakka)", emoji: "🌿" },
  { value: "rubber", label: "Rubber (Rappar)", emoji: "🌳" },
  { value: "banana", label: "Banana (Vazha)", emoji: "🍌" },
  { value: "tapioca", label: "Tapioca (Kappa)", emoji: "🥔" },
  { value: "ginger", label: "Ginger (Inji)", emoji: "🫚" },
  { value: "turmeric", label: "Turmeric (Manjal)", emoji: "🟡" },
  { value: "cashew", label: "Cashew (Kashumavu)", emoji: "🥜" },
  { value: "tea", label: "Tea (Chaya)", emoji: "🍃" },
  { value: "coffee", label: "Coffee (Kapi)", emoji: "☕" },
]

export function CropSelector({ selectedCrop, onCropChange }: CropSelectorProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
          <Wheat className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Kerala Crops</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Select value={selectedCrop} onValueChange={onCropChange}>
          <SelectTrigger className="h-9 sm:h-10">
            <SelectValue placeholder="Select your crop" />
          </SelectTrigger>
          <SelectContent>
            {crops.map((crop) => (
              <SelectItem key={crop.value} value={crop.value} className="text-sm">
                <div className="flex items-center gap-2">
                  <span>{crop.emoji}</span>
                  <span>{crop.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}

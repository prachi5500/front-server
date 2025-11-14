import { useState } from "react";
import { FontSelector } from "./FontSelector";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Type, Palette, Minus, Plus } from "lucide-react";

interface CustomizationPanelProps {
  selectedFont: string;
  onFontSelect: (font: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  textColor: string;
  onTextColorChange: (color: string) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

const colorPresets = [
  "#000000", "#ffffff", "#374151", "#6b7280", "#9ca3af",
  "#0ea5e9", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899",
  "#f59e0b", "#ef4444", "#10b981", "#059669", "#84cc16",
  // additional 13 colors
  "#8B4513", // saddle brown
  "#D2691E", // chocolate
  "#FF7F50", // coral
  "#FF6347", // tomato
  "#FFA07A", // light salmon
  "#FFD700", // gold
  "#C0C0C0", // silver
  "#708090", // slate gray
  "#00CED1", // dark turquoise
  "#40E0D0", // turquoise
  "#7B68EE", // medium slate blue
  "#BA55D3", // medium orchid
  "#FF1493"  // deep pink
];

export const CustomizationPanel = ({
  selectedFont,
  onFontSelect,
  fontSize,
  onFontSizeChange,
  textColor,
  onTextColorChange,
  accentColor,
  onAccentColorChange
}: CustomizationPanelProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-6">
      {/* Font Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-5 h-5 text-primary" />
          <Label className="text-lg font-semibold">Font</Label>
        </div>
        <FontSelector
          selectedFont={selectedFont}
          onFontSelect={onFontSelect}
        />
      </div>

      {/* Font Size */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Font Size</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFontSizeChange(Math.max(12, fontSize - 2))}
              disabled={fontSize <= 12}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="text-sm font-mono w-8 text-center">{fontSize}px</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFontSizeChange(Math.min(24, fontSize + 2))}
              disabled={fontSize >= 24}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <Slider
          value={[fontSize]}
          onValueChange={(value) => onFontSizeChange(value[0])}
          min={12}
          max={24}
          step={1}
          className="w-full"
        />
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <Label className="text-lg font-semibold">Colors</Label>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Text Color</Label>
          <div className="flex flex-wrap gap-2">
            {colorPresets.map((color) => (
              <button
                key={color}
                onClick={() => onTextColorChange(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  textColor === color ? "border-primary scale-110" : "border-gray-300 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <span className="text-xs text-muted-foreground font-mono">{textColor}</span>
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Accent Color</Label>
          <div className="flex flex-wrap gap-2">
            {colorPresets.map((color) => (
              <button
                key={color}
                onClick={() => onAccentColorChange(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  accentColor === color ? "border-primary scale-110" : "border-gray-300 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => onAccentColorChange(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <span className="text-xs text-muted-foreground font-mono">{accentColor}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
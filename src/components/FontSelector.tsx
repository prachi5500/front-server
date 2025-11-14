import { Type } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface FontSelectorProps {
  selectedFont: string;
  onFontSelect: (font: string) => void;
}

const fonts = [
  { name: "Arial", family: "Arial, sans-serif" },
  { name: "Helvetica", family: "Helvetica, sans-serif" },
  { name: "Times New Roman", family: "Times New Roman, serif" },
  { name: "Georgia", family: "Georgia, serif" },
  { name: "Verdana", family: "Verdana, sans-serif" },
  { name: "Courier New", family: "Courier New, monospace" },
  { name: "Trebuchet MS", family: "Trebuchet MS, sans-serif" },
  { name: "Garamond", family: "Garamond, serif" },
  // Cursive/script options (system-available on many devices)
  { name: "Brush Script MT", family: "\"Brush Script MT\", cursive" },
  { name: "Lucida Handwriting", family: "\"Lucida Handwriting\", cursive" },
  { name: "Segoe Script", family: "\"Segoe Script\", cursive" },
  { name: "Monotype Corsiva", family: "\"Monotype Corsiva\", cursive" },
];

export const FontSelector = ({ selectedFont, onFontSelect }: FontSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Type className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Choose Font</h3>
      </div>

      <Select value={selectedFont} onValueChange={(v) => onFontSelect(v)}>
        <SelectTrigger className="rounded-lg">
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent>
          {fonts.map((font) => (
            <SelectItem key={font.family} value={font.family}>
              <span style={{ fontFamily: font.family }}>{font.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
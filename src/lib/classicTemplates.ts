export type LayoutKey =
  | "BadgeSplit"
  | "DiagonalSplit"
  | "LeftBar"
  | "CircleSplit"
  | "MinimalCenter"
  | "GeoCorner"
  | "StripeAngled"
  | "MapPanel"
  | "HexBadge"
  | "ModernBlocks";

export type PatternKey = "topo" | "linen" | "dots" | "grid" | "waves" | "none";

export interface ClassicDesignConfig {
  id: string;
  name: string;
  layout: LayoutKey;
  bgStyle: "solid" | "gradient" | "pattern";
  bgColors: string[]; // 1 or 2
  textColor: string;
  accentColor: string;
  pattern?: PatternKey;
  fontFamily?: string;
  fontWeight?: "light" | "normal" | "bold";
  borderStyle?: "rounded" | "sharp" | "dashed";
  // layout-specific tweak
  badgeColor?: string;
  metallic?: boolean;
  description?: string;
}

/**
 * 10 base design groups - mixed elegant & modern.
 * Each group has variations -> totals 100 templates
 */
const baseThemes = [
  // [primary, secondary, accent, text]
  ["#0b1220", "#111827", "#D4AF37", "#ffffff"], // black + gold
  ["#071A52", "#0B3D91", "#60A5FA", "#ffffff"], // corporate blue
  ["#F8FAFD", "#E6EEF8", "#1E3A8A", "#0f172a"], // clean light
  ["#0b1220", "#1f2937", "#7c3aed", "#ffffff"], // dark violet
  ["#06202d", "#083344", "#06b6d4", "#ffffff"], // dark cyan
  ["#FFF7ED", "#FFEDD5", "#92400E", "#0f172a"], // warm gold light
  ["#ECFCCB", "#BBF7D0", "#065F46", "#0f172a"], // mint green
  ["#F3E8FF", "#D8B4FE", "#6D28D9", "#0f172a"], // purple pastel
  ["#FFF1F2", "#FFD6E0", "#9A1750", "#0f172a"], // pink
  ["#0f172a", "#0b1220", "#60a5fa", "#ffffff"], // navy modern
];

const layouts: LayoutKey[] = [
  "BadgeSplit",
  "DiagonalSplit",
  "LeftBar",
  "CircleSplit",
  "MinimalCenter",
  "GeoCorner",
  "StripeAngled",
  "MapPanel",
  "HexBadge",
  "ModernBlocks",
];

const patterns: PatternKey[] = ["topo", "linen", "dots", "grid", "waves", "none"];

function makeId(i: number) {
  return `template-${String(i + 1).padStart(3, "0")}`;
}

// Generate one template per layout type
export const classicTemplates: ClassicDesignConfig[] = (() => {
  const out: ClassicDesignConfig[] = [];
  
  // Create one template for each layout type
  layouts.forEach((layout, index) => {
    const theme = baseThemes[index % baseThemes.length];
    const pattern = patterns[index % patterns.length];
    
    out.push({
      id: `classic-${String(index + 1).padStart(3, '0')}`,
      name: `${layout} Classic`,
      layout,
      bgStyle: "solid",
      bgColors: [theme[0]],
      textColor: theme[3],
      accentColor: theme[2],
      pattern,
      fontFamily: "Inter, sans-serif",
      fontWeight: "normal",
      borderStyle: "rounded",
      badgeColor: theme[2],
      description: `Classic ${layout} layout`
    });
  });

  return out;
})();

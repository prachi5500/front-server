// export interface ClassicDesignConfig {
//   id: string;
//   name: string;
//   bgStyle: "solid" | "gradient";
//   bgColors: string[];
//   textColor: string;
//   accentColor: string;
//   layout: "center" | "left" | "split";
//   decoration: "none" | "circles" | "lines" | "shapes" | "waves" | "grid";
//   fontWeight: "light" | "normal" | "bold";
//   borderStyle: "rounded" | "square" | "dashed" | "double" | "shadow";
// }
 
// const layouts: ClassicDesignConfig["layout"][] = ["center", "left", "split"];
// const decorations: ClassicDesignConfig["decoration"][] = ["none", "circles", "lines", "shapes"];
// const weights: ClassicDesignConfig["fontWeight"][] = ["light", "normal", "bold"];
// const borders: ClassicDesignConfig["borderStyle"][] = ["rounded", "square", "dashed"];




// // 🎨 10 color theme groups
// const colorThemes = [
//     ["#ffffff", "#f3f4f6", "#0f172a"], // classic
//     ["#e0f7fa", "#80deea", "#006064"], // teal
//     ["#fef3c7", "#fcd34d", "#92400e"], // yellow-orange
//     ["#f3e8ff", "#c084fc", "#581c87"], // purple
//     ["#fee2e2", "#f87171", "#7f1d1d"], // red
//     ["#dcfce7", "#4ade80", "#166534"], // green
//     ["#e0f2fe", "#60a5fa", "#1e3a8a"], // blue
//     ["#f5f3ff", "#a78bfa", "#312e81"], // violet
//     ["#fdf2f8", "#f9a8d4", "#831843"], // pink
//     ["#fef9c3", "#facc15", "#713f12"], // gold
//   ];
  
//   function randomItem<T>(arr: T[]): T {
//     return arr[Math.floor(Math.random() * arr.length)];
//   }
  
//   export const classicTemplates: ClassicDesignConfig[] = (() => {
//     const result: ClassicDesignConfig[] = [];
//     for (let i = 0; i < 100; i++) {
//       const theme = colorThemes[i % colorThemes.length];
//       const [light, mid, dark] = theme;
  
//       const bgStyle = i % 3 === 0 ? "gradient" : i % 3 === 1 ? "solid" : "pattern";
//       const bgColors =
//         bgStyle === "gradient"
//           ? [mid, dark]
//           : bgStyle === "solid"
//           ? [light]
//           : [light, mid, dark];
  
//       result.push({
//         id: `classic-${(i + 1).toString().padStart(3, "0")}`,
//         name: `Classic ${(i + 1).toString().padStart(2, "0")}`,
//         bgStyle,
//         bgColors,
//         textColor: dark,
//         accentColor: mid,
//         layout: randomItem(layouts),
//         decoration: randomItem(decorations),
//         fontWeight: randomItem(weights),
//         borderStyle: randomItem(borders),
//       });
//     }
//     return result;
//   })();


// src/lib/classicTemplates.ts
// export type BgStyle = "solid" | "gradient" | "pattern";
// export type Layout = "center" | "left" | "split";
// export type Decoration = "none" | "circles" | "lines" | "shapes" | "ornament";
// export type Pattern =
//   | "dots"
//   | "grid"
//   | "waves"
//   | "zigzag"
//   | "mesh"
//   | "stripes"
//   | "radial"
//   | "diagonal"
//   | "none";
// export type FontWeight = "light" | "normal" | "bold";
// export type BorderStyle = "rounded" | "square" | "dashed" | "double" | "shadow";

// export interface ClassicDesignConfig {
//   id: string;
//   name: string;
//   bgStyle: BgStyle;
//   bgColors: string[]; // 1 or 2 colors for solid/gradient or palette for pattern
//   textColor: string;
//   accentColor: string;
//   layout: Layout;
//   decoration: Decoration;
//   pattern?: Pattern;
//   fontWeight: FontWeight;
//   borderStyle: BorderStyle;
//   // optional more cosmetic tweaks
//   gradientAngle?: number;
//   patternScale?: number; // used by components to set background-size
//   description?: string;
// }

// /**
//  * Utility helpers to create palettes and patterns.
//  * We'll generate 100 unique templates by mixing theme groups, pattern families,
//  * decorations and layout variations.
//  */

// const layouts: Layout[] = ["center", "left", "split"];
// const decorations: Decoration[] = ["none", "circles", "lines", "shapes", "ornament"];
// const patterns: Pattern[] = [
//   "dots",
//   "grid",
//   "waves",
//   "zigzag",
//   "mesh",
//   "stripes",
//   "radial",
//   "diagonal",
//   "none",
// ];
// const weights: FontWeight[] = ["light", "normal", "bold"];
// const borders: BorderStyle[] = ["rounded", "square", "dashed", "double", "shadow"];

// /**
//  * 12 theme palettes combining modern & elegant vibes; each theme yields 8-9 variants
//  * Each entry: [light, mid, dark, accentCandidate]
//  */
// const themeGroups: string[][] = [
//   ["#0f172a", "#111827", "#0b1220", "#D4AF37"], // Black + Gold (luxury)
//   ["#071A52", "#0B3D91", "#2563EB", "#60A5FA"], // Corporate Blue
//   ["#F8FAFD", "#E6EEF8", "#C0D7F6", "#1E3A8A"], // Clean blue (minimal)
//   ["#0F172A", "#1F2937", "#374151", "#A78BFA"], // Dark + violet accent
//   ["#0f172a", "#06202d", "#083344", "#06B6D4"], // Dark cyan tech
//   ["#FEF3C7", "#FDE68A", "#F59E0B", "#B45309"], // Warm golden
//   ["#FFF7ED", "#FFEDD5", "#FDBA74", "#92400E"], // Soft orange elegant
//   ["#ECFCCB", "#BBF7D0", "#34D399", "#065F46"], // Mint/Green
//   ["#FFF1F2", "#FFD6E0", "#FB7185", "#9A1750"], // Pink feminine
//   ["#F3E8FF", "#D8B4FE", "#A78BFA", "#6D28D9"], // Purple gradients
//   ["#F0F9FF", "#BAE6FD", "#60A5FA", "#1E40AF"], // Sky/modern
//   ["#F8FAF0", "#E6F4EC", "#C7E9D4", "#2F855A"], // Soft green luxury
// ];

// /** Some gradient angle options for variety */
// const gradientAngles = [90, 120, 135, 160, 45];

// /** small helper */
// function pick<T>(arr: T[], idx: number, offset = 0): T {
//   return arr[(idx + offset) % arr.length];
// }

// /** Build 100 templates */
// export const classicTemplates: ClassicDesignConfig[] = (() => {
//   const out: ClassicDesignConfig[] = [];

//   for (let i = 0; i < 100; i++) {
//     const themeIdx = i % themeGroups.length;
//     const theme = themeGroups[themeIdx];

//     // pick variant offsets to produce differences inside same theme
//     const variant = Math.floor(i / themeGroups.length); // 0..8 roughly
//     const isGradient = (i % 3) !== 0; // 2/3 will be gradient-ish to look modern
//     const patternPick = patterns[(i * 7) % patterns.length];
//     const decorationPick = decorations[(i * 5) % decorations.length];
//     const layout = layouts[i % layouts.length];
//     const weight = weights[i % weights.length];
//     const border = borders[i % borders.length];
//     const accent = theme[3];

//     // derive bg colors based on variant:
//     // primary = theme[0] or theme[1], secondary = theme[2] rotated by variant
//     const primary = theme[(variant + 0) % 3];
//     const secondary = theme[(variant + 1) % 3];
//     const mid = theme[(variant + 2) % 3];

//     const bgStyle: BgStyle = patternPick === "none" ? (isGradient ? "gradient" : "solid") : "pattern";
//     const bgColors = bgStyle === "gradient" ? [primary, mid] : bgStyle === "solid" ? [primary] : [primary, mid];

//     // text color: ensure contrast: for dark primary use white, else dark slate
//     const textColor = primary.startsWith("#f") || primary.startsWith("#F") || primary === "#FFF7ED" ? "#0f172a" : "#ffffff";

//     // patternScale variety
//     const patternScale = 18 + (variant * 3) % 32;

//     out.push({
//       id: `classic-${(i + 1).toString().padStart(3, "0")}`,
//       name: `${i < 9 ? "00" : i < 99 ? "0" : ""}${i + 1} ${themeIdx % 2 === 0 ? "Elegance" : "Modern"}`,
//       bgStyle,
//       bgColors,
//       textColor,
//       accentColor: accent,
//       layout,
//       decoration: decorationPick,
//       pattern: patternPick,
//       fontWeight: weight,
//       borderStyle: border,
//       gradientAngle: pick(gradientAngles, i),
//       patternScale,
//       description: `Theme ${themeIdx + 1} variant ${variant + 1}`,
//     });
//   }

//   return out;
// })();



// src/lib/classicTemplates.ts
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

// generate 100 templates programmatically
export const classicTemplates: ClassicDesignConfig[] = (() => {
  const out: ClassicDesignConfig[] = [];
  for (let i = 0; i < 100; i++) {
    const themeIdx = i % baseThemes.length;
    const theme = baseThemes[themeIdx];
    const variant = Math.floor(i / baseThemes.length); // 0..9 roughly
    const layout = layouts[i % layouts.length];
    const pattern = patterns[(i * 3 + variant) % patterns.length];

    // small variations
    const metallic = (i % 11) === 0 || (themeIdx % 3 === 0 && variant % 2 === 0); // occasional metallics
    const borderStyle = ["rounded", "sharp", "dashed"][i % 3] as ClassicDesignConfig["borderStyle"];
    const fontWeight = ["light", "normal", "bold"][i % 3] as ClassicDesignConfig["fontWeight"];

    // choose colors rotated by variant for variety
    const primary = theme[(variant + 0) % 3];
    const secondary = theme[(variant + 1) % 3];
    const accent = theme[2];
    const textColor = theme[3];

    // alternate bgStyle for variety
    const bgStyle = i % 4 === 0 ? "solid" : i % 4 === 1 ? "gradient" : "pattern";

    out.push({
      id: makeId(i),
      name: `${layout} ${themeIdx + 1}-${variant + 1}`,
      layout,
      bgStyle,
      bgColors: bgStyle === "gradient" ? [primary, secondary] : [primary],
      textColor,
      accentColor: accent,
      pattern,
      fontFamily: variant % 2 === 0 ? "Inter, sans-serif" : "Playfair Display, serif",
      fontWeight,
      borderStyle,
      badgeColor: metallic ? "#D4AF37" : accent,
      metallic,
      description: `Layout ${layout} • Theme ${themeIdx + 1} • variant ${variant + 1}`,
    });
  }
  return out;
})();

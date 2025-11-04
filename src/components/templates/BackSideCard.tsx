// import { BusinessCardData } from "../BusinessCardForm";
// import { QRCodeSVG } from "qrcode.react";

// interface BackSideCardProps {
//   data: BusinessCardData;
//   background: { style: "solid" | "gradient"; colors: string[] };
//   textColor: string;
//   accentColor: string;
//   fontFamily?: string;
//   fontSize?: number;
// }

// export const BackSideCard = ({
//   data,
//   background,
//   textColor,
//   accentColor,
//   fontFamily = "Arial, sans-serif",
//   fontSize,
// }: BackSideCardProps) => {
//   const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTITLE:${data.title}\nORG:${data.company}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;
//   const getBgStyle = () => {
//     if (background.style === "gradient" && background.colors.length >= 2) {
//       return { background: `linear-gradient(135deg, ${background.colors[0]}, ${background.colors[1]})` };
//     }
//     return { backgroundColor: background.colors[0] };
//   };

//   return (
//     <div
//       className="w-full aspect-[1.75/1] p-8 flex flex-col justify-center items-center relative overflow-hidden shadow-lg rounded-xl"
//       style={{
//         ...getBgStyle(),
//         color: textColor,
//         fontFamily,
//         fontSize: fontSize ? `${fontSize}px` : "16px",
//       }}
//     >
//       <div className="w-full max-w-sm text-center space-y-3">
//         {data.email && (
//           <div className="text-sm">
//             <span className="font-semibold" style={{ color: accentColor }}>✉ </span>
//             <span>{data.email}</span>
//           </div>
//         )}
//         {data.phone && (
//           <div className="text-sm">
//             <span className="font-semibold" style={{ color: accentColor }}>✆ </span>
//             <span>{data.phone}</span>
//           </div>
//         )}
//         {data.website  && (
//           <div className="text-sm">
//             <span className="font-semibold" style={{ color: accentColor }}>⌂ </span>
//             <span>{data.website}</span>
//           </div>
//         )}
//         {data.address && (
//           <div className="text-sm">
//             <span className="font-semibold" style={{ color: accentColor }}>Address: </span>
//             <span>{data.address}</span>
//           </div>
//         )}
//       </div>
//       {/* {data.name && (data.email || data.phone) && (
//         <div className="mt-6 bg-white p-2 rounded-lg shadow-md">
//           <QRCodeSVG value={vCardData} size={64} />
//         </div>
//       )} */}
//     </div>
//   );
// };

// src/components/BackSideCard.tsx
// import React from "react";
// import { QRCodeSVG } from "qrcode.react";
// import type { ClassicDesignConfig } from "@/lib/classicTemplates";
// import { BusinessCardData } from "../BusinessCardForm";

// interface BackSideCardProps {
//   data: BusinessCardData;
//   config?: ClassicDesignConfig; // optional: if provided, back will match front
//   background?: { style: "solid" | "gradient"; colors: string[] };
//   textColor?: string;
//   accentColor?: string;
//   fontFamily?: string;
//   fontSize?: number;
//   patternOpacity?: number;
//   showQRCode?: boolean;
// }

// export const BackSideCard: React.FC<BackSideCardProps> = ({
//   data,
//   config,
//   background,
//   textColor,
//   accentColor,
//   fontFamily = "Inter, Arial, sans-serif",
//   fontSize,
//   patternOpacity = 0.08,
//   showQRCode = true,
// }) => {
//   // Choose values: prefer config (matching front) else background props
//   const bgStyle = config?.bgStyle ?? (background ? background.style : "solid");
//   const bgColors = config?.bgColors ?? (background ? background.colors : ["#ffffff"]);
//   const appliedText = textColor ?? config?.textColor ?? "#0f172a";
//   const appliedAccent = accentColor ?? config?.accentColor ?? "#1f2937";
//   const pattern = config?.pattern ?? "none";

//   const getBgStyle = (): React.CSSProperties => {
//     if (bgStyle === "gradient" && bgColors.length >= 2) {
//       const angle = config?.gradientAngle ?? 135;
//       return { background: `linear-gradient(${angle}deg, ${bgColors[0]}, ${bgColors[1]})` };
//     }
//     // pattern or solid base color
//     return { backgroundColor: bgColors[0] };
//   };

//   const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTITLE:${data.title}\nORG:${data.company}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;

//   const patternMap: Record<string, (accent: string, scale?: number) => React.CSSProperties> = {
//     dots: (accent, scale = 22) => ({
//       backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     grid: (accent, scale = 26) => ({
//       backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     waves: (accent, scale = 180) => ({
//       backgroundImage: `radial-gradient(circle at 20% 30%, ${accent} 0%, transparent 35%), radial-gradient(circle at 80% 70%, ${accent} 0%, transparent 35%)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     zigzag: (accent, scale = 18) => ({
//       backgroundImage: `repeating-linear-gradient(45deg, ${accent}, ${accent} 2px, transparent 2px, transparent ${scale}px)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     mesh: (accent, scale = 220) => ({
//       backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02))`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     stripes: (accent, scale = 36) => ({
//       backgroundImage: `repeating-linear-gradient(135deg, ${accent}, ${accent} 10px, transparent 10px, transparent ${scale}px)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     radial: (accent, scale = 300) => ({
//       backgroundImage: `radial-gradient(circle at 30% 30%, ${accent} 0%, transparent 45%)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     diagonal: (accent, scale = 60) => ({
//       backgroundImage: `repeating-linear-gradient(135deg, ${accent}, ${accent} 2px, transparent 2px, transparent ${scale}px)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     none: () => ({}),
//   };

//   const borderClass = config?.borderStyle === "rounded" ? "rounded-xl" : config?.borderStyle === "dashed" ? "border-2 border-dashed" : "";

//   return (
//     <div
//       className={`w-full aspect-[1.75/1] p-8 flex flex-col justify-center items-center relative overflow-hidden shadow-lg ${borderClass}`}
//       style={{
//         ...getBgStyle(),
//         color: appliedText,
//         fontFamily,
//         fontSize: fontSize ? `${fontSize}px` : "15px",
//       }}
//     >
//       {/* pattern overlay */}
//       {pattern && pattern !== "none" && (
//         <div
//           className="absolute inset-0 pointer-events-none"
//           style={{
//             ...(patternMap[pattern] ? patternMap[pattern](appliedAccent, config?.patternScale) : {}),
//             opacity: patternOpacity,
//             mixBlendMode: bgStyle === "gradient" ? "overlay" : "soft-light",
//           }}
//         />
//       )}

//       <div className="w-full max-w-sm text-center z-10 space-y-3">
//         {data.email && (
//           <div className="text-sm">
//             <span className="font-semibold" style={{ color: appliedAccent }}>
//               ✉
//             </span>{" "}
//             <span>{data.email}</span>
//           </div>
//         )}
//         {data.phone && (
//           <div className="text-sm">
//             <span className="font-semibold" style={{ color: appliedAccent }}>
//               ✆
//             </span>{" "}
//             <span>{data.phone}</span>
//           </div>
//         )}
//         {data.website && (
//           <div className="text-sm">
//             <span className="font-semibold" style={{ color: appliedAccent }}>
//               ⌂
//             </span>{" "}
//             <span>{data.website}</span>
//           </div>
//         )}
//         {data.address && (
//           <div className="text-sm">
//             <span className="font-semibold" style={{ color: appliedAccent }}>
//               📍
//             </span>{" "}
//             <span>{data.address}</span>
//           </div>
//         )}
//       </div>

//       {showQRCode && data.name && (data.email || data.phone) && (
//         <div className="mt-6 bg-white/80 p-2 rounded-lg shadow-md z-10">
//           <QRCodeSVG value={vCardData} size={64} />
//         </div>
//       )}
//     </div>
//   );
// };
// export default BackSideCard;

// src/components/BackSideCard.tsx
import React from "react";
import type { ClassicDesignConfig } from "@/lib/classicTemplates";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  data: {
    name?: string;
    title?: string;
    company?: string;
    logo?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
  };
  config?: ClassicDesignConfig;
  background?: { style: "solid" | "gradient"; colors: string[] };
  textColor?: string;
  accentColor?: string;
  fontFamily?: string;
  fontSize?: number;
  showLargeQR?: boolean;
}

export const BackSideCard: React.FC<Props> = ({ data, config, background, textColor, accentColor, fontFamily, fontSize = 15, showLargeQR = true }) => {
  const appliedAccent = accentColor ?? config?.accentColor ?? "#1f2937";
  const appliedText = textColor ?? config?.textColor ?? "#0f172a";

  const bgStyle: React.CSSProperties = (() => {
    const style = config?.bgStyle ?? background?.style ?? "solid";
    const colors = config?.bgColors ?? background?.colors ?? ["#ffffff"];
    if (style === "gradient" && colors.length >= 2) {
      return { background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` };
    }
    return { backgroundColor: colors[0] };
  })();

  const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTITLE:${data.title}\nORG:${data.company}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;

  return (
    <div
      className="w-full aspect-[1.75/1] p-6 relative overflow-hidden shadow-lg rounded-lg"
      style={{
        ...bgStyle,
        color: appliedText,
        fontFamily: fontFamily ?? config?.fontFamily ?? "Inter, Arial, sans-serif",
        fontSize,
      }}
    >
      {/* Subtle topo lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="topo" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M0,50 C25,0 75,0 100,50 C75,100 25,100 0,50Z"
                fill="none"
                stroke={appliedAccent}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div style={{ textAlign: "center" }}>
          {data.email && (
            <div><strong style={{ color: appliedAccent }}>✉</strong> {data.email}</div>
          )}
          {data.phone && (
            <div><strong style={{ color: appliedAccent }}>✆</strong> {data.phone}</div>
          )}
          {data.website && (
            <div><strong style={{ color: appliedAccent }}>⌂</strong> {data.website}</div>
          )}
          {data.address && (
            <div><strong style={{ color: appliedAccent }}>📍</strong> {data.address}</div>
          )}
        </div>

        {showLargeQR && (data.email || data.phone) && (
          <div style={{ marginTop: 14, background: "rgba(255,255,255,0.9)", padding: 8, borderRadius: 8 }}>
            <QRCodeSVG value={vCardData} size={96} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BackSideCard;

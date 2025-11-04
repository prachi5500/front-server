// // import { QRCodeSVG } from "qrcode.react";
// // import { BusinessCardData } from "../BusinessCardForm";
// // import type { ClassicDesignConfig } from "@/lib/classicTemplates";

// // interface ClassicCardProps {
// //   data: BusinessCardData;
// //   config: ClassicDesignConfig;
// //   fontFamily?: string;
// //   fontSize?: number;
// //   textColor?: string; // override
// //   accentColor?: string; // override
// // }

// // export const ClassicCard = ({
// //   data,
// //   config,
// //   fontFamily = "Arial, sans-serif",
// //   fontSize,
// //   textColor,
// //   accentColor,
// // }: ClassicCardProps) => {
// //   const appliedText = textColor ?? config.textColor;
// //   const appliedAccent = accentColor ?? config.accentColor;

// //   const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTITLE:${data.title}\nORG:${data.company}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;

// //   const getBgStyle = () => {
// //     const [c1, c2] = config.bgColors;
// //     if (config.bgStyle === "gradient" && c2) {
// //       return { background: `linear-gradient(135deg, ${c1}, ${c2})` };
// //     }
// //     return { backgroundColor: c1 };
// //   };

// //   const getDecoration = () => {
// //     switch (config.decoration) {
// //       case "circles":
// //         return (
// //           <>
// //             <div className="absolute top-4 right-4 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: appliedAccent }} />
// //             <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: appliedAccent }} />
// //           </>
// //         );
// //       case "lines":
// //         return (
// //           <>
// //             <div className="absolute top-0 right-0 w-px h-full opacity-20" style={{ backgroundColor: appliedAccent }} />
// //             <div className="absolute left-0 bottom-0 w-full h-px opacity-20" style={{ backgroundColor: appliedAccent }} />
// //           </>
// //         );
// //       case "shapes":
// //         return (
// //           <>
// //             <div className="absolute top-0 right-0 w-16 h-16 rotate-45 opacity-10" style={{ backgroundColor: appliedAccent }} />
// //             <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: appliedAccent }} />
// //           </>
// //         );
// //       default:
// //         return null;
// //     }
// //   };

// //   const layoutClass =
// //     config.layout === "split"
// //       ? "grid grid-cols-2 gap-4"
// //       : config.layout === "left"
// //       ? "flex flex-col items-start"
// //       : "flex flex-col items-center text-center";

// //   const fontWeightClass =
// //     config.fontWeight === "bold" ? "font-bold" : config.fontWeight === "light" ? "font-light" : "font-normal";

// //   const borderClass =
// //     config.borderStyle === "rounded" ? "rounded-xl" : config.borderStyle === "dashed" ? "border-2 border-dashed" : "";

// //   return (
// //     <div
// //       className={`w-full aspect-[1.75/1] p-8 flex flex-col justify-between relative overflow-hidden shadow-lg ${borderClass}`}
// //       style={{
// //         ...getBgStyle(),
// //         color: appliedText,
// //         fontFamily,
// //         fontSize: fontSize ? `${fontSize}px` : "16px",
// //       }}
// //     >
// //       {data.logo && (
// //         <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm rounded-md p-2 shadow">
// //           <img src={data.logo} alt="Company logo" className="h-10 w-10 object-contain" crossOrigin="anonymous" />
// //         </div>
// //       )}
// //       {getDecoration()}

// //       <div className={`relative z-10 ${layoutClass}`}>
// //         <div>
// //           <h3 className={`text-2xl mb-1 ${fontWeightClass}`} style={{ color: appliedText }}>
// //             {data.name || "Your Name"}
// //           </h3>
// //           <p className="text-sm mb-1" style={{ color: appliedAccent }}>
// //             {data.title || "Job Title"}
// //           </p>
// //           <p className="text-xs opacity-80">{data.company || "Company Name"}</p>
// //         </div>
// //       </div>

// //       <div className="flex justify-between items-end relative z-10">
// //         {/* <div className="space-y-1 text-xs">
// //           {data.email && <div className="flex items-center gap-2"><span style={{ color: appliedAccent }}>✉</span><span>{data.email}</span></div>}
// //           {data.phone && <div className="flex items-center gap-2"><span style={{ color: appliedAccent }}>✆</span><span>{data.phone}</span></div>}
// //           {data.website && <div className="flex items-center gap-2"><span style={{ color: appliedAccent }}>⌂</span><span>{data.website}</span></div>}
// //         </div>  */}
// //         {data.name && data.email && (
// //           <div className="bg-white p-2 rounded-lg shadow-md">
// //             <QRCodeSVG value={vCardData} size={60} />
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };


// // src/components/ClassicCard.tsx
// import React from "react";
// import { QRCodeSVG } from "qrcode.react";
// import type { ClassicDesignConfig } from "@/lib/classicTemplates";
// import { BusinessCardData } from "../BusinessCardForm";

// interface ClassicCardProps {
//   data: BusinessCardData;
//   config: ClassicDesignConfig;
//   fontFamily?: string;
//   fontSize?: number;
//   textColor?: string; // override
//   accentColor?: string; // override
// }

// export const ClassicCard: React.FC<ClassicCardProps> = ({
//   data,
//   config,
//   fontFamily = "Inter, Arial, sans-serif",
//   fontSize,
//   textColor,
//   accentColor,
// }) => {
//   const appliedText = textColor ?? config.textColor;
//   const appliedAccent = accentColor ?? config.accentColor;

//   const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTITLE:${data.title}\nORG:${data.company}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;

//   const getBg = (): React.CSSProperties => {
//     const angle = config.gradientAngle ?? 135;
//     if (config.bgStyle === "gradient" && config.bgColors.length >= 2) {
//       return { background: `linear-gradient(${angle}deg, ${config.bgColors[0]}, ${config.bgColors[1]})` };
//     }
//     if (config.bgStyle === "pattern") {
//       // base color plus subtle overlay will be added later
//       return { backgroundColor: config.bgColors[0] };
//     }
//     return { backgroundColor: config.bgColors[0] };
//   };

//   // decorations (circles, lines, shapes, ornament)
//   const getDecoration = () => {
//     const accent = appliedAccent;
//     switch (config.decoration) {
//       case "circles":
//         return (
//           <>
//             <div style={{ backgroundColor: accent }} className="absolute -right-6 -top-6 w-36 h-36 rounded-full opacity-12" />
//             <div style={{ backgroundColor: accent }} className="absolute left-4 bottom-4 w-24 h-24 rounded-full opacity-12" />
//           </>
//         );
//       case "lines":
//         return (
//           <>
//             <div style={{ backgroundColor: accent }} className="absolute right-0 top-0 w-0.5 h-full opacity-18" />
//             <div style={{ backgroundColor: accent }} className="absolute left-0 bottom-0 w-full h-0.5 opacity-12" />
//           </>
//         );
//       case "shapes":
//         return (
//           <>
//             <div style={{ backgroundColor: accent }} className="absolute -right-4 top-8 w-20 h-20 rotate-45 opacity-12" />
//             <div style={{ backgroundColor: accent }} className="absolute -left-10 bottom-6 w-28 h-28 rounded-full opacity-10" />
//           </>
//         );
//       case "ornament":
//         return (
//           <>
//             <svg className="absolute right-2 top-2 opacity-10" width="120" height="120" viewBox="0 0 120 120" fill="none">
//               <circle cx="60" cy="60" r="60" fill={appliedAccent} />
//             </svg>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   // pattern overlay CSS map
//   const patternMap: Record<string, (accent: string, scale?: number) => React.CSSProperties> = {
//     dots: (accent, scale = 24) => ({
//       backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     grid: (accent, scale = 28) => ({
//       backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     waves: (accent, scale = 200) => ({
//       backgroundImage: `radial-gradient(circle at 30% 20%, ${accent} 0%, transparent 30%), radial-gradient(circle at 70% 80%, ${accent} 0%, transparent 30%)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     zigzag: (accent, scale = 20) => ({
//       backgroundImage: `repeating-linear-gradient(45deg, ${accent}, ${accent} 2px, transparent 2px, transparent ${scale}px)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     mesh: (accent, scale = 200) => ({
//       backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02)), linear-gradient(60deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02))`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     stripes: (accent, scale = 40) => ({
//       backgroundImage: `repeating-linear-gradient(135deg, ${accent}, ${accent} 8px, transparent 8px, transparent ${scale}px)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     radial: (accent, scale = 300) => ({
//       backgroundImage: `radial-gradient(circle at 20% 20%, ${accent} 0%, transparent 40%)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     diagonal: (accent, scale = 60) => ({
//       backgroundImage: `repeating-linear-gradient(135deg, ${accent}, ${accent} 2px, transparent 2px, transparent ${scale}px)`,
//       backgroundSize: `${scale}px ${scale}px`,
//     }),
//     none: () => ({}),
//   };

//   const layoutClass =
//     config.layout === "split"
//       ? "grid grid-cols-2 gap-4 items-center"
//       : config.layout === "left"
//       ? "flex flex-col items-start"
//       : "flex flex-col items-center text-center";

//   const fontWeightClass = config.fontWeight === "bold" ? "font-bold" : config.fontWeight === "light" ? "font-light" : "font-normal";

//   const borderClass =
//     config.borderStyle === "rounded"
//       ? "rounded-xl"
//       : config.borderStyle === "dashed"
//       ? "border-2 border-dashed"
//       : config.borderStyle === "double"
//       ? "border-4"
//       : config.borderStyle === "shadow"
//       ? "shadow-2xl"
//       : "";

//   return (
//     <div
//       className={`w-full aspect-[1.75/1] p-6 relative overflow-hidden ${borderClass} shadow-lg`}
//       style={{
//         ...getBg(),
//         color: appliedText,
//         fontFamily,
//         fontSize: fontSize ? `${fontSize}px` : "15px",
//       }}
//     >
//       {/* pattern overlay */}
//       {config.pattern && config.pattern !== "none" && (
//         <div
//           className="absolute inset-0 pointer-events-none"
//           style={{
//             ...(patternMap[config.pattern] ? patternMap[config.pattern](appliedAccent, config.patternScale) : {}),
//             opacity: config.pattern === "mesh" ? 0.06 : 0.08,
//             mixBlendMode: config.bgStyle === "gradient" ? "overlay" : "soft-light",
//           }}
//         />
//       )}

//       {/* decorative shapes */}
//       {getDecoration()}

//       {/* logo badge */}
//       {data.logo && (
//         <div className="absolute top-3 right-3 z-20 bg-white/70 backdrop-blur-sm rounded-md p-2 shadow">
//           <img src={data.logo} alt="logo" className="h-10 w-10 object-contain" crossOrigin="anonymous" />
//         </div>
//       )}

//       {/* main content */}
//       <div className={`relative z-10 h-full ${layoutClass} p-2`}>
//         <div className="flex flex-col justify-center">
//           <h3 className={`text-2xl ${fontWeightClass}`} style={{ color: appliedText }}>
//             {data.name || "Your Name"}
//           </h3>
//           <p className="text-sm mt-1" style={{ color: appliedAccent }}>
//             {data.title || "Job Title"}
//           </p>
//           <p className="text-xs opacity-80 mt-1">{data.company || "Company Name"}</p>
//         </div>

//         {/* QR / small info block at bottom-right for split or standard layouts */}
//         <div className="flex items-end justify-end">
//           {data.name && data.email && (
//             <div className="bg-white p-2 rounded-lg shadow-md">
//               <QRCodeSVG value={vCardData} size={60} />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ClassicCard;


// src/components/ClassicCard.tsx
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import type { ClassicDesignConfig } from "@/lib/classicTemplates";
import { BusinessCardData } from "../BusinessCardForm";

interface ClassicCardProps {
  data: BusinessCardData;
  config: ClassicDesignConfig;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  accentColor?: string;
}

export const ClassicCard: React.FC<ClassicCardProps> = ({
  data,
  config,
  fontFamily = "Inter, Arial, sans-serif",
  fontSize,
  textColor,
  accentColor,
}) => {
  const appliedText = textColor ?? config.textColor;
  const appliedAccent = accentColor ?? config.accentColor;

  const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTITLE:${data.title}\nORG:${data.company}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;

  // 🌟 Special Gold Badge Layout
  if (config.layout === "GoldBadgeLayout") {
    return (
      <div
        className="w-full aspect-[1.75/1] p-6 relative overflow-hidden shadow-xl rounded-xl"
        style={{
          backgroundColor: config.bgColors[0] || "#0b1220",
          color: appliedText,
          fontFamily,
          fontSize: `${fontSize || 15}px`,
        }}
      >
        {/* Topographic pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="goldTopo" width="100" height="100" patternUnits="userSpaceOnUse">
                <path
                  d="M0,50 C25,0 75,0 100,50 C75,100 25,100 0,50Z"
                  fill="none"
                  stroke={appliedAccent}
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#goldTopo)" />
          </svg>
        </div>

        {/* Golden glow on left */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/3"
          style={{
            background: `radial-gradient(circle at right center, rgba(212,175,55,0.25), transparent 80%)`,
          }}
        />

        {/* Hexagonal gold badge */}
        <div className="flex items-center justify-center absolute left-10 top-1/2 -translate-y-1/2 z-20">
          <div
            className="relative flex items-center justify-center shadow-lg"
            style={{
              width: 120,
              height: 120,
              background: config.metallic
                ? `linear-gradient(145deg, #d4af37, #b8860b)`
                : config.badgeColor,
              clipPath:
                "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              boxShadow:
                "inset 0 2px 6px rgba(255,255,255,0.25), 0 8px 18px rgba(0,0,0,0.5)",
            }}
          >
            {data.logo ? (
              <img
                src={data.logo}
                alt="Logo"
                className="absolute w-14 h-14 object-contain"
              />
            ) : (
              <div className="text-black font-bold text-sm">LOGO</div>
            )}
          </div>
        </div>

        {/* Text on right side */}
        <div className="flex flex-col justify-center absolute right-10 top-1/2 -translate-y-1/2 z-20 text-right">
          <h3 className="text-2xl font-semibold" style={{ color: appliedText }}>
            {data.name || "Your Name"}
          </h3>
          <p className="text-sm mt-1" style={{ color: appliedAccent }}>
            {data.title || "General Manager"}
          </p>
          <p
            className="text-xs mt-2 opacity-80"
            style={{ color: appliedText }}
          >
            {data.company || "Company Name"}
          </p>
        </div>

        {/* QR bottom-right */}
        {data.name && data.email && (
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md z-30">
            <QRCodeSVG value={vCardData} size={60} />
          </div>
        )}
      </div>
    );
  }

  // 🧱 Default (your existing)
  const getBg = (): React.CSSProperties => {
    const angle = config.gradientAngle ?? 135;
    if (config.bgStyle === "gradient" && config.bgColors.length >= 2) {
      return { background: `linear-gradient(${angle}deg, ${config.bgColors[0]}, ${config.bgColors[1]})` };
    }
    return { backgroundColor: config.bgColors[0] };
  };

  const borderClass =
    config.borderStyle === "rounded"
      ? "rounded-xl"
      : config.borderStyle === "dashed"
      ? "border-2 border-dashed"
      : "";

  return (
    <div
      className={`w-full aspect-[1.75/1] p-6 relative overflow-hidden ${borderClass} shadow-lg`}
      style={{
        ...getBg(),
        color: appliedText,
        fontFamily,
        fontSize: `${fontSize || 15}px`,
      }}
    >
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-2xl font-semibold">{data.name || "Your Name"}</h3>
          <p className="text-sm mt-1" style={{ color: appliedAccent }}>
            {data.title || "Job Title"}
          </p>
          <p className="text-xs mt-1 opacity-80">{data.company || "Company Name"}</p>
        </div>
        {data.name && data.email && (
          <div className="bg-white p-2 rounded-lg shadow-md self-end">
            <QRCodeSVG value={vCardData} size={60} />
          </div>
        )}
      </div>
    </div>
  );
};
export default ClassicCard;

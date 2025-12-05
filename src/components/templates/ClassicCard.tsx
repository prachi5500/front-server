// import React from "react";
// import { QRCodeSVG } from "qrcode.react";
// import type { ClassicDesignConfig } from "@/lib/classicTemplates";
// import { BusinessCardData } from "../BusinessCardForm";

// interface ClassicCardProps {
//   data: BusinessCardData;
//   config: ClassicDesignConfig;
//   fontFamily?: string;
//   fontSize?: number;
//   textColor?: string;
//   accentColor?: string;
  
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
//   const hasUserCoreInfo = !!(data.name && data.email && data.phone);
//   const hasUserName = !!data.name?.trim();

//   // Calculate responsive font sizes
//   const baseFontSize = fontSize || 15;
//   const titleSize = baseFontSize + 6; // Larger for name
//   const subtitleSize = baseFontSize + 2; // Slightly larger for title
//   const bodySize = Math.max(12, baseFontSize); // Minimum 12px for body text

//   const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTITLE:${data.title}\nORG:${data.company}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;
//   // Background helper
//   const getBg = (): React.CSSProperties => {
//     if (config.bgStyle === "gradient" && config.bgColors.length >= 2) {
//       return { background: `linear-gradient(135deg, ${config.bgColors[0]}, ${config.bgColors[1]})` };
//     }
//     return { backgroundColor: config.bgColors[0] };
//   };

//   const borderClass =
//     config.borderStyle === "rounded"
//       ? "rounded-xl"
//       : config.borderStyle === "dashed"
//         ? "border-2 border-dashed"
//         : "";

//   return (
//     <div
//       className={`w-full h-full p-4 relative overflow-hidden ${borderClass} shadow-lg`}
//       style={{
//         ...getBg(),
//         color: appliedText,
//         fontFamily,
//       }}
//     >
//       {data.logo && (
//         <div className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow">
//           <div className="rounded-full overflow-hidden border border-white/70" style={{ width: 48, height: 48 }}>
//             <img src={data.logo} alt="logo" className="w-full h-full object-cover rounded-full" crossOrigin="anonymous" />
//           </div>
//         </div>
//       )}
//       <div className="relative z-10 flex flex-col justify-between h-full">
//         <div>
//           <h3
//             className="font-semibold md:text-lg lg:text-xl"
//             style={{
//               fontSize: `${titleSize}px`,
//               lineHeight: 1.2,
//             }}
//           >
//             {hasUserName ? (data.name || "") : (data.name || "Your Name")}
//           </h3>
//           {data.title?.trim() && (
//             <p
//               className="mt-1 md:text-base lg:text-lg"
//               style={{
//                 color: appliedAccent,
//                 fontSize: `${subtitleSize}px`,
//                 lineHeight: 1.3,
//               }}
//             >
//               {data.title}
//             </p>
//           )}
//           {data.company?.trim() && (
//             <p
//               className="mt-1 opacity-80 md:text-sm lg:text-base"
//               style={{
//                 fontSize: `${bodySize}px`,
//                 lineHeight: 1.4,
//               }}
//             >
//               {data.company}
//             </p>
//           )}
//         </div>
//         {data.name && data.email && (
//           <div className="bg-white p-2 rounded-lg shadow-md self-end">
//             <QRCodeSVG value={vCardData} size={60} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default ClassicCard;



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
  // NEW PROPS ADDED:
  isResponsive?: boolean;
  containerWidth?: number;
}

export const ClassicCard: React.FC<ClassicCardProps> = ({
  data,
  config,
  fontFamily = "Inter, Arial, sans-serif",
  fontSize,
  textColor,
  accentColor,
  // NEW PROPS WITH DEFAULTS:
  isResponsive = false,
  containerWidth = 560,
}) => {
  const appliedText = textColor ?? config.textColor;
  const appliedAccent = accentColor ?? config.accentColor;
  const hasUserCoreInfo = !!(data.name && data.email && data.phone);
  const hasUserName = !!data.name?.trim();

  // RESPONSIVE FONT SIZE FUNCTION
  const getResponsiveSize = (baseSize: number): string => {
    if (!isResponsive) {
      return `${baseSize}px`;
    }
    
    // Calculate scale based on container width
    const scaleFactor = containerWidth / 560; // 560px is standard business card width
    
    // Apply scaling
    const scaledSize = baseSize * scaleFactor;
    
    // Set min and max bounds
    const minSize = Math.max(8, baseSize * 0.4); // Minimum 40% of base size
    const maxSize = baseSize * 1.5; // Maximum 150% of base size
    
    // Use CSS clamp for responsive sizing
    return `clamp(${minSize}px, ${scaledSize}px, ${maxSize}px)`;
  };

  // RESPONSIVE SPACING FUNCTION
  const getResponsiveSpacing = (baseSpacing: number): string => {
    if (!isResponsive) {
      return `${baseSpacing}px`;
    }
    
    const scaleFactor = containerWidth / 560;
    const scaledSpacing = baseSpacing * scaleFactor;
    
    const minSpacing = Math.max(2, baseSpacing * 0.3);
    const maxSpacing = baseSpacing * 2;
    
    return `clamp(${minSpacing}px, ${scaledSpacing}px, ${maxSpacing}px)`;
  };

  // Base sizes (unscaled)
  const baseFontSize = fontSize || 16;
  const nameSize = baseFontSize + 8;    // e.g., 24px at base 16
  const titleSize = baseFontSize + 4;   // e.g., 20px at base 16
  const companySize = baseFontSize;     // e.g., 16px at base 16
  const logoSize = 48;
  const qrSize = 60;

  const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTITLE:${data.title}\nORG:${data.company}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;
  
  // Background helper
  const getBg = (): React.CSSProperties => {
    if (config.bgStyle === "gradient" && config.bgColors.length >= 2) {
      return { background: `linear-gradient(135deg, ${config.bgColors[0]}, ${config.bgColors[1]})` };
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
      className={`w-full h-full relative overflow-hidden ${borderClass} shadow-lg`}
      style={{
        ...getBg(),
        color: appliedText,
        fontFamily,
        // Responsive padding
        padding: isResponsive ? getResponsiveSpacing(16) : '16px',
      }}
    >
      {data.logo && (
        <div 
          className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm rounded-full shadow"
          style={{
            // Responsive logo container padding
            padding: isResponsive ? getResponsiveSpacing(4) : '4px',
          }}
        >
          <div 
            className="rounded-full overflow-hidden border border-white/70"
            style={{ 
              // Responsive logo size
              width: isResponsive ? getResponsiveSize(logoSize) : '48px',
              height: isResponsive ? getResponsiveSize(logoSize) : '48px',
            }}
          >
            <img src={data.logo} alt="logo" className="w-full h-full object-cover rounded-full" crossOrigin="anonymous" />
          </div>
        </div>
      )}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <h3
            className="font-semibold"
            style={{
              fontSize: getResponsiveSize(nameSize),
              lineHeight: 1.2,
            }}
          >
            {hasUserName ? (data.name || "") : (data.name || "Your Name")}
          </h3>
          {data.title?.trim() && (
            <p
              className="mt-1"
              style={{
                color: appliedAccent,
                fontSize: getResponsiveSize(titleSize),
                lineHeight: 1.3,
                // Responsive margin
                marginTop: isResponsive ? getResponsiveSpacing(4) : '4px',
              }}
            >
              {data.title}
            </p>
          )}
          {data.company?.trim() && (
            <p
              className="mt-1 opacity-80"
              style={{
                fontSize: getResponsiveSize(companySize),
                lineHeight: 1.4,
                // Responsive margin
                marginTop: isResponsive ? getResponsiveSpacing(4) : '4px',
              }}
            >
              {data.company}
            </p>
          )}
        </div>
        {data.name && data.email && (
          <div 
            className="bg-white rounded-lg shadow-md self-end"
            style={{
              // Responsive QR container
              padding: isResponsive ? getResponsiveSpacing(8) : '8px',
            }}
          >
            <QRCodeSVG 
              value={vCardData} 
              size={isResponsive ? parseInt(getResponsiveSize(qrSize).replace('px', '')) : 60}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default ClassicCard;




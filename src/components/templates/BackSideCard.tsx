// import React, { useMemo } from "react";
// import type { ClassicDesignConfig } from "@/lib/classicTemplates";
// import { QRCodeSVG } from "qrcode.react";

// interface Props {
//   data: {
//     name?: string;
//     title?: string;
//     company?: string;
//     logo?: string;
//     email?: string;
//     phone?: string;
//     website?: string;
//     address?: string;
//   };
//   config?: ClassicDesignConfig;
//   background?: { style: "solid" | "gradient"; colors: string[] };
//   textColor?: string;
//   accentColor?: string;
//   fontFamily?: string;
//   fontSize?: number;
//   showLargeQR?: boolean;
//   transparentBg?: boolean;
//   compact?: boolean;
//   qrSize?: number;
//   // New Props
//   qrColor?: string;
//   qrLogoUrl?: string;
  
// }

// // Helper: Move outside component
// const getContrast = (hex: string) => {
//   try {
//     const v = hex.replace("#", "");
//     const fullHex = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
//     const r = parseInt(fullHex.substring(0, 2), 16);
//     const g = parseInt(fullHex.substring(2, 4), 16);
//     const b = parseInt(fullHex.substring(4, 6), 16);
//     const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
//     return luminance > 0.6 ? "#0f172a" : "#ffffff";
//   } catch {
//     return "#0f172a";
//   }
// };

// export const BackSideCard: React.FC<Props> = ({
//   data,
//   config,
//   background,
//   textColor,
//   accentColor,
//   fontFamily,
//   fontSize = 15,
//   showLargeQR = true,
//   transparentBg = false,
//   compact = false,
//   qrSize,
//   qrColor = "#000000",
//   qrLogoUrl,
// }) => {
//   // Detect mobile viewport for responsive sizing
//   const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

//   // Calculate responsive font sizes
//   const baseSize = fontSize || 12;
//   const textSize = isMobile ? baseSize * 0.8 : baseSize; // smaller text on mobile
//   const iconSize = baseSize * 1.2; // Icons slightly larger than text

//   // QR size:
//   // - On mobile: keep QR smaller so it fits comfortably in the card
//   // - On desktop: allow a larger size (or any passed qrSize) so it matches the earlier design
//   let baseQr: number;
//   if (isMobile) {
//     // Mobile defaults (smaller)
//     const mobileLarge = 40; // base ~40px at fontSize 12
//     const mobileSmall = 28; // base ~28px
//     const requested = qrSize ?? (showLargeQR ? mobileLarge : mobileSmall);
//     // Clamp to avoid oversized QR on very small screens
//     baseQr = Math.min(requested, mobileLarge);
//   } else {
//     // Desktop / tablet defaults (larger, closer to original behavior)
//     const desktopLarge = 68; // approx original large QR
//     const desktopSmall = 48;
//     baseQr = qrSize ?? (showLargeQR ? desktopLarge : desktopSmall);
//   }

//   const qrSizeValue = baseQr * (baseSize / 12);

//   const appliedAccent = accentColor ?? config?.accentColor ?? "#1f2937";
//   const hasUserCoreInfo = !!(data.name && data.email && data.phone);

//   const bgStyle: React.CSSProperties = useMemo(() => {
//     if (transparentBg) return {};
//     const style = config?.bgStyle ?? background?.style ?? "solid";
//     const colors = config?.bgColors ?? background?.colors ?? ["#ffffff"];

//     if (style === "gradient" && colors.length >= 2) {
//       return { background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` };
//     }
//     return { backgroundColor: colors[0] };
//   }, [transparentBg, config, background]);

//   const baseBgColor = (config?.bgColors ?? background?.colors ?? ["#ffffff"])[0];
//   const appliedText = textColor ?? config?.textColor ?? getContrast(baseBgColor);

//   const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTITLE:${data.title}\nORG:${data.company}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;

//   // Dynamic Image Settings for QR
//   const qrImageSettings = useMemo(() => {
//     if (!qrLogoUrl) return undefined;
//     return {
//       src: qrLogoUrl,
//       x: undefined,
//       y: undefined,
//       height: 24,
//       width: 24,
//       excavate: true, // Cuts a hole in the QR code for the logo
//     };
//   }, [qrLogoUrl]);

//   const renderContent = () => (
//     <div className="relative z-10 flex items-center justify-between h-full w-full px-0.5 md:px-4 gap-3 md:gap-5">

//       {/* Left Side - Text Content (smaller) */}
//       <div className="flex-1 flex items-center justify-start w-full min-w-0 max-w-[70%] md:max-w-none">

//         <div className="space-y-1 md:space-y-2 w-full" style={{ lineHeight: 1.3 }}>
//           {hasUserCoreInfo ? (
//             <>
//               {data.email && (
//                 <div className="flex items-center gap-2 md:gap-3">
//                   <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
//                   <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
//                     {data.email}
//                   </span>
//                 </div>
//               )}
//               <div className="flex items-center gap-2 md:gap-3">
//                 <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
//                 <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
//                   {data.phone}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 md:gap-3">
//                 <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
//                 <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
//                   {data.website}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 md:gap-3">
//                 <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
//                 <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
//                   {data.address}
//                 </span>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="flex items-center gap-2 md:gap-3">
//                 <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
//                 <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
//                   {data.phone || "+91 00000 00000"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 md:gap-3">
//                 <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
//                 <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
//                   {data.website || "your-website.com"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 md:gap-3">
//                 <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
//                 <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
//                   {data.address || "Your Address, City"}
//                 </span>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Right Side - QR Code */}
//       {(data.name || data.email) && (
//         <div className="flex-shrink-0 bg-white/90 p-2 md:p-3 rounded-lg shadow-sm backdrop-blur-sm">
//           <QRCodeSVG
//             value={vCardData}
//             size={window.innerWidth < 640 ? 60 : 90}  // 60px on mobile, 90px on desktop 
//             // size={qrSizeValue } 
//             fgColor={qrColor}
//             imageSettings={qrImageSettings}
//           />
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div
//       className="w-full aspect-[1.75/1] py-2 px-0.5 md:p-4 lg:p-6 relative overflow-hidden rounded-xl transition-all duration-300"

//       style={{
//         ...bgStyle,
//         color: appliedText,
//         fontFamily: fontFamily ?? config?.fontFamily ?? "Inter, Arial, sans-serif",
//         fontSize,
//       }}
//     >
//       {!transparentBg && (
//         <div className="absolute inset-0 opacity-10 pointer-events-none">
//           <svg width="100%" height="100%">
//             <defs>
//               <pattern id="topo" width="100" height="100" patternUnits="userSpaceOnUse">
//                 <path d="M0,50 C25,0 75,0 100,50 C75,100 25,100 0,50Z" fill="none" stroke={appliedAccent} strokeWidth="1" />
//               </pattern>
//             </defs>
//             <rect width="100%" height="100%" fill="url(#topo)" />
//           </svg>
//         </div>
//       )}
//       {renderContent()}
//     </div>
//   );
// };

// export default BackSideCard;



import React, { useMemo } from "react";
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
  transparentBg?: boolean;
  compact?: boolean;
  qrSize?: number;
  qrColor?: string;
  qrLogoUrl?: string;
  // NEW PROPS ADDED:
  isResponsive?: boolean;
  containerWidth?: number;
}

// Helper: Move outside component
const getContrast = (hex: string) => {
  try {
    const v = hex.replace("#", "");
    const fullHex = v.length === 3 ? v.split("").map((c) => c + c).join("") : v;
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#0f172a" : "#ffffff";
  } catch {
    return "#0f172a";
  }
};

export const BackSideCard: React.FC<Props> = ({
  data,
  config,
  background,
  textColor,
  accentColor,
  fontFamily,
  fontSize = 15,
  showLargeQR = true,
  transparentBg = false,
  compact = false,
  qrSize,
  qrColor = "#000000",
  qrLogoUrl,
  // NEW PROPS WITH DEFAULTS:
  isResponsive = false,
  containerWidth = 560,
}) => {
  // RESPONSIVE SIZE FUNCTION
  const getResponsiveSize = (baseSize: number, type: 'font' | 'spacing' | 'element' = 'font'): string => {
    if (!isResponsive) {
      return `${baseSize}px`;
    }
    
    // Calculate scale based on container width
    const scaleFactor = containerWidth / 560; // 560px is standard business card width
    
    // Apply scaling
    const scaledSize = baseSize * scaleFactor;
    
    // Set different min/max bounds for different types
    let minSize, maxSize;
    
    switch (type) {
      case 'font':
        minSize = Math.max(8, baseSize * 0.4); // Minimum 40% of base size
        maxSize = baseSize * 1.5; // Maximum 150% of base size
        break;
      case 'spacing':
        minSize = Math.max(2, baseSize * 0.3); // Minimum 30% of base size
        maxSize = baseSize * 2; // Maximum 200% of base size
        break;
      case 'element': // For QR, icons, etc.
        minSize = Math.max(16, baseSize * 0.5); // Minimum 50% of base size
        maxSize = baseSize * 1.5; // Maximum 150% of base size
        break;
      default:
        minSize = baseSize * 0.5;
        maxSize = baseSize * 1.5;
    }
    
    // Use CSS clamp for responsive sizing
    return `clamp(${minSize}px, ${scaledSize}px, ${maxSize}px)`;
  };

  // Base sizes (unscaled)
  const baseFontSize = fontSize || 16;
  const textSize = baseFontSize; // Base text size
  const iconSize = baseFontSize * 1.2; // Icons slightly larger than text
  
  // QR size calculation
  const getQrSize = (): number => {
    if (!isResponsive) {
      // Use original logic for non-responsive
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      let baseQr;
      
      if (isMobile) {
        const mobileLarge = 40;
        const mobileSmall = 28;
        const requested = qrSize ?? (showLargeQR ? mobileLarge : mobileSmall);
        baseQr = Math.min(requested, mobileLarge);
      } else {
        const desktopLarge = 68;
        const desktopSmall = 48;
        baseQr = qrSize ?? (showLargeQR ? desktopLarge : desktopSmall);
      }
      
      return baseQr * (baseFontSize / 12);
    }
    
    // Responsive mode: scale QR based on container width
    const baseQrSize = qrSize ?? (showLargeQR ? 68 : 48);
    const scaleFactor = containerWidth / 560;
    const scaledQr = baseQrSize * scaleFactor;
    
    // Clamp values
    const minQr = showLargeQR ? 40 : 28;
    const maxQr = showLargeQR ? 100 : 68;
    
    return Math.max(minQr, Math.min(maxQr, scaledQr));
  };

  const qrSizeValue = getQrSize();
  
  const appliedAccent = accentColor ?? config?.accentColor ?? "#1f2937";
  const hasUserCoreInfo = !!(data.name && data.email && data.phone);

  const bgStyle: React.CSSProperties = useMemo(() => {
    if (transparentBg) return {};
    const style = config?.bgStyle ?? background?.style ?? "solid";
    const colors = config?.bgColors ?? background?.colors ?? ["#ffffff"];

    if (style === "gradient" && colors.length >= 2) {
      return { background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` };
    }
    return { backgroundColor: colors[0] };
  }, [transparentBg, config, background]);

  const baseBgColor = (config?.bgColors ?? background?.colors ?? ["#ffffff"])[0];
  const appliedText = textColor ?? config?.textColor ?? getContrast(baseBgColor);

  const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data.name}\nTITLE:${data.title}\nORG:${data.company}\nEMAIL:${data.email}\nTEL:${data.phone}\nURL:${data.website}\nADR:${data.address}\nEND:VCARD`;

  // Dynamic Image Settings for QR
  const qrImageSettings = useMemo(() => {
    if (!qrLogoUrl) return undefined;
    
    // Responsive logo size in QR
    let logoSize = 24;
    if (isResponsive) {
      const scaleFactor = containerWidth / 560;
      logoSize = Math.max(16, Math.min(32, 24 * scaleFactor));
    }
    
    return {
      src: qrLogoUrl,
      x: undefined,
      y: undefined,
      height: logoSize,
      width: logoSize,
      excavate: true,
    };
  }, [qrLogoUrl, isResponsive, containerWidth]);

  const renderContent = () => (
    <div 
      className="relative z-10 flex items-center justify-between h-full w-full"
      style={{
        // Responsive horizontal padding
        paddingLeft: isResponsive ? getResponsiveSize(compact ? 4 : 8, 'spacing') : (compact ? '4px' : '8px'),
        paddingRight: isResponsive ? getResponsiveSize(compact ? 4 : 8, 'spacing') : (compact ? '4px' : '8px'),
        // Responsive gap between text and QR
        gap: isResponsive ? getResponsiveSize(compact ? 12 : 20, 'spacing') : (compact ? '12px' : '20px'),
      }}
    >
      {/* Left Side - Text Content */}
      <div 
        className="flex-1 flex items-center justify-start w-full min-w-0"
        style={{
          // Responsive max width
          maxWidth: isResponsive 
            ? `calc(70% - ${getResponsiveSize(compact ? 6 : 10, 'spacing')})`
            : '70%',
        }}
      >
        <div 
          className="w-full"
          style={{
            lineHeight: 1.3,
            // Responsive vertical gap between items
            rowGap: isResponsive ? getResponsiveSize(compact ? 2 : 4, 'spacing') : (compact ? '2px' : '4px'),
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {hasUserCoreInfo ? (
            <>
              {data.email && (
                <div 
                  className="flex items-center"
                  style={{
                    // Responsive gap between icon and text
                    gap: isResponsive ? getResponsiveSize(compact ? 2 : 3, 'spacing') : (compact ? '2px' : '3px'),
                  }}
                >
                  <span 
                    style={{ 
                      color: appliedAccent, 
                      fontSize: getResponsiveSize(iconSize, 'font'),
                      flexShrink: 0,
                    }}
                  >
                    ✉
                  </span>
                  <span 
                    className="break-words"
                    style={{ 
                      fontSize: getResponsiveSize(textSize, 'font'),
                      wordBreak: 'break-word',
                    }}
                  >
                    {data.email}
                  </span>
                </div>
              )}
              {data.phone && (
                <div 
                  className="flex items-center"
                  style={{
                    gap: isResponsive ? getResponsiveSize(compact ? 2 : 3, 'spacing') : (compact ? '2px' : '3px'),
                  }}
                >
                  <span 
                    style={{ 
                      color: appliedAccent, 
                      fontSize: getResponsiveSize(iconSize, 'font'),
                      flexShrink: 0,
                    }}
                  >
                    ✆
                  </span>
                  <span 
                    className="break-words"
                    style={{ 
                      fontSize: getResponsiveSize(textSize, 'font'),
                    }}
                  >
                    {data.phone}
                  </span>
                </div>
              )}
              {data.website && (
                <div 
                  className="flex items-center"
                  style={{
                    gap: isResponsive ? getResponsiveSize(compact ? 2 : 3, 'spacing') : (compact ? '2px' : '3px'),
                  }}
                >
                  <span 
                    style={{ 
                      color: appliedAccent, 
                      fontSize: getResponsiveSize(iconSize, 'font'),
                      flexShrink: 0,
                    }}
                  >
                    ⌂
                  </span>
                  <span 
                    className="break-words"
                    style={{ 
                      fontSize: getResponsiveSize(textSize, 'font'),
                    }}
                  >
                    {data.website}
                  </span>
                </div>
              )}
              {data.address && (
                <div 
                  className="flex items-center"
                  style={{
                    gap: isResponsive ? getResponsiveSize(compact ? 2 : 3, 'spacing') : (compact ? '2px' : '3px'),
                  }}
                >
                  <span 
                    style={{ 
                      color: appliedAccent, 
                      fontSize: getResponsiveSize(iconSize, 'font'),
                      flexShrink: 0,
                    }}
                  >
                    📍
                  </span>
                  <span 
                    className="break-words"
                    style={{ 
                      fontSize: getResponsiveSize(textSize, 'font'),
                    }}
                  >
                    {data.address}
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <div 
                className="flex items-center"
                style={{
                  gap: isResponsive ? getResponsiveSize(compact ? 2 : 3, 'spacing') : (compact ? '2px' : '3px'),
                }}
              >
                <span 
                  style={{ 
                    color: appliedAccent, 
                    fontSize: getResponsiveSize(iconSize, 'font'),
                    flexShrink: 0,
                  }}
                >
                  ✆
                </span>
                <span 
                  className="break-words"
                  style={{ 
                    fontSize: getResponsiveSize(textSize, 'font'),
                  }}
                >
                  {data.phone || "+91 00000 00000"}
                </span>
              </div>
              <div 
                className="flex items-center"
                style={{
                  gap: isResponsive ? getResponsiveSize(compact ? 2 : 3, 'spacing') : (compact ? '2px' : '3px'),
                }}
              >
                <span 
                  style={{ 
                    color: appliedAccent, 
                    fontSize: getResponsiveSize(iconSize, 'font'),
                    flexShrink: 0,
                  }}
                >
                  ⌂
                </span>
                <span 
                  className="break-words"
                  style={{ 
                    fontSize: getResponsiveSize(textSize, 'font'),
                  }}
                >
                  {data.website || "your-website.com"}
                </span>
              </div>
              <div 
                className="flex items-center"
                style={{
                  gap: isResponsive ? getResponsiveSize(compact ? 2 : 3, 'spacing') : (compact ? '2px' : '3px'),
                }}
              >
                <span 
                  style={{ 
                    color: appliedAccent, 
                    fontSize: getResponsiveSize(iconSize, 'font'),
                    flexShrink: 0,
                  }}
                >
                  📍
                </span>
                <span 
                  className="break-words"
                  style={{ 
                    fontSize: getResponsiveSize(textSize, 'font'),
                  }}
                >
                  {data.address || "Your Address, City"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - QR Code */}
      {(data.name || data.email) && (
        <div 
          className="flex-shrink-0 bg-white/90 backdrop-blur-sm"
          style={{
            // Responsive padding and styling
            padding: isResponsive 
              ? getResponsiveSize(compact ? 4 : 8, 'spacing')
              : (compact ? '4px' : '8px'),
            borderRadius: isResponsive 
              ? getResponsiveSize(6, 'spacing')
              : '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <QRCodeSVG
            value={vCardData}
            size={qrSizeValue}
            fgColor={qrColor}
            imageSettings={qrImageSettings}
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      className="w-full aspect-[1.75/1] relative overflow-hidden transition-all duration-300"
      style={{
        ...bgStyle,
        color: appliedText,
        fontFamily: fontFamily ?? config?.fontFamily ?? "Inter, Arial, sans-serif",
        // Responsive border radius
        borderRadius: isResponsive 
          ? getResponsiveSize(8, 'spacing')
          : '8px',
        // Responsive vertical padding
        paddingTop: isResponsive ? getResponsiveSize(8, 'spacing') : '8px',
        paddingBottom: isResponsive ? getResponsiveSize(8, 'spacing') : '8px',
      }}
    >
      {!transparentBg && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern 
                id="topo" 
                width={isResponsive ? getResponsiveSize(100, 'element') : "100"} 
                height={isResponsive ? getResponsiveSize(100, 'element') : "100"} 
                patternUnits="userSpaceOnUse"
              >
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
      )}
      {renderContent()}
    </div>
  );
};

export default BackSideCard;

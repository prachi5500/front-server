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
  // New Props
  qrColor?: string;
  qrLogoUrl?: string;
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
}) => {
  // Detect mobile viewport for responsive sizing
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  // Calculate responsive font sizes
  const baseSize = fontSize || 12;
  const textSize = isMobile ? baseSize * 0.8 : baseSize; // smaller text on mobile
  const iconSize = baseSize * 1.2; // Icons slightly larger than text

  // QR size:
  // - On mobile: keep QR smaller so it fits comfortably in the card
  // - On desktop: allow a larger size (or any passed qrSize) so it matches the earlier design
  let baseQr: number;
  if (isMobile) {
    // Mobile defaults (smaller)
    const mobileLarge = 40; // base ~40px at fontSize 12
    const mobileSmall = 28; // base ~28px
    const requested = qrSize ?? (showLargeQR ? mobileLarge : mobileSmall);
    // Clamp to avoid oversized QR on very small screens
    baseQr = Math.min(requested, mobileLarge);
  } else {
    // Desktop / tablet defaults (larger, closer to original behavior)
    const desktopLarge = 68; // approx original large QR
    const desktopSmall = 48;
    baseQr = qrSize ?? (showLargeQR ? desktopLarge : desktopSmall);
  }

  const qrSizeValue = baseQr * (baseSize / 12);

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
    return {
      src: qrLogoUrl,
      x: undefined,
      y: undefined,
      height: 24,
      width: 24,
      excavate: true, // Cuts a hole in the QR code for the logo
    };
  }, [qrLogoUrl]);

  const renderContent = () => (
    <div className="relative z-10 flex items-center justify-between h-full w-full px-0.5 md:px-4 gap-3 md:gap-5">

      {/* Left Side - Text Content (smaller) */}
      <div className="flex-1 flex items-center justify-start w-full min-w-0 max-w-[70%] md:max-w-none">

        <div className="space-y-1 md:space-y-2 w-full" style={{ lineHeight: 1.3 }}>
          {hasUserCoreInfo ? (
            <>
              {data.email && (
                <div className="flex items-center gap-2 md:gap-3">
                  <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
                  <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
                    {data.email}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 md:gap-3">
                <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
                <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
                  {data.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
                <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
                  {data.website}
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
                <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
                  {data.address}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 md:gap-3">
                <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
                <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
                  {data.phone || "+91 00000 00000"}
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
                <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
                  {data.website || "your-website.com"}
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span style={{ color: appliedAccent, fontSize: `${iconSize}px` }}></span>
                <span className="md:text-base lg:text-lg break-words" style={{ fontSize: `${textSize}px` }}>
                  {data.address || "Your Address, City"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - QR Code */}
      {(data.name || data.email) && (
        <div className="flex-shrink-0 bg-white/90 p-2 md:p-3 rounded-lg shadow-sm backdrop-blur-sm">
          <QRCodeSVG
            value={vCardData}
            size={window.innerWidth < 640 ? 60 : 90}  // 60px on mobile, 90px on desktop 
            // size={qrSizeValue } 
            fgColor={qrColor}
            imageSettings={qrImageSettings}
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      className="w-full aspect-[1.75/1] py-2 px-0.5 md:p-4 lg:p-6 relative overflow-hidden rounded-xl transition-all duration-300"

      style={{
        ...bgStyle,
        color: appliedText,
        fontFamily: fontFamily ?? config?.fontFamily ?? "Inter, Arial, sans-serif",
        fontSize,
      }}
    >
      {!transparentBg && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="topo" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0,50 C25,0 75,0 100,50 C75,100 25,100 0,50Z" fill="none" stroke={appliedAccent} strokeWidth="1" />
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
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
    // ---- FONT SCALE BASED ON fontSize ----
  const scale = fontSize / 16;

  const sizeEmail = 12 * scale;
  const sizePhone = 12 * scale;
  const sizeWebsite = 12 * scale;
  const sizeAddress = 12 * scale;
  const sizeQR = (qrSize ?? (showLargeQR ? 60 : 40)) * scale;

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
    <div className="relative z-10 flex items-center justify-between h-full w-full px-2 md:px-4 gap-3 md:gap-4">
      {/* Left Side - Text Content (smaller) */}
      <div className="flex-1 flex items-center justify-start">
        <div className="space-y-1 md:space-y-2" style={{ lineHeight: 1.3 }}>
          {hasUserCoreInfo ? (
            <>
              {data.email && (
                <div style={{ fontSize: sizeEmail }}>
  <strong style={{ color: appliedAccent }}>✉</strong> {data.email}
</div>
              )}
              <div style={{ fontSize: sizePhone }}>
  <strong style={{ color: appliedAccent }}>✆</strong> {data.phone}
</div>

              <div style={{ fontSize: sizeWebsite }}>
  <strong style={{ color: appliedAccent }}>⌂</strong> {data.website}
</div>

             <div style={{ fontSize: sizeAddress }}>
  <strong style={{ color: appliedAccent }}>📍</strong> {data.address}
</div>

            </>
          ) : (
            <>
                <div style={{ fontSize: sizeAddress }}><strong style={{ color: appliedAccent }}>✆</strong> {data.phone || "+91 00000 00000"}</div>
                <div style={{ fontSize: sizeAddress }}><strong style={{ color: appliedAccent }}>⌂</strong> {data.website || "your-website.com"}</div>
                <div style={{ fontSize: sizeAddress }}><strong style={{ color: appliedAccent }}>📍</strong> {data.address || "Your Address, City"}</div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - QR Code */}
      {(data.name || data.email) && (
        <div className="flex-shrink-0 bg-white/90 p-2 md:p-3 rounded-lg shadow-sm backdrop-blur-sm">
          <QRCodeSVG 
            value={vCardData} 
            size={sizeQR } 
            fgColor={qrColor}
            imageSettings={qrImageSettings}
          />
        </div>
      )}
    </div>
  );

  return (
    <div
      className="w-full aspect-[1.75/1] p-4 md:p-6 relative overflow-hidden shadow-lg rounded-xl transition-all duration-300"
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
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
      className={`w-full aspect-[1.75/1] p-6 relative overflow-hidden ${borderClass} shadow-lg`}
      style={{
        ...getBg(),
        color: appliedText,
        fontFamily,
        fontSize: `${fontSize || 15}px`,
      }}
    >
      <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-1 rounded-md text-xs font-semibold shadow">
        Premium
      </div>
      {data.logo && (
        <div className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow">
          <div className="rounded-full overflow-hidden border border-white/70" style={{ width: 48, height: 48 }}>
            <img src={data.logo} alt="logo" className="w-full h-full object-cover rounded-full" crossOrigin="anonymous" />
          </div>
        </div>
      )}
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

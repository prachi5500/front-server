import { QRCodeSVG } from "qrcode.react";
import { BusinessCardData } from "../BusinessCardForm";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

interface DynamicCardProps {
  data: BusinessCardData;
  designConfig: {
    id: string;
    name: string;
    bgStyle: string;
    bgColors: string[];
    textColor: string;
    accentColor: string;
    layout: string;
    decoration: string;
    fontWeight: string;
    fontFamily: string;
    fontSize?: number;
    borderStyle: string;
  };
}

export const DynamicCard = ({ data, designConfig }: DynamicCardProps) => {
  const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
TITLE:${data.title}
ORG:${data.company}
EMAIL:${data.email}
TEL:${data.phone}
URL:${data.website}
ADR:${data.address}
END:VCARD`;

  const getBgStyle = () => {
    const [color1, color2] = designConfig.bgColors;
    if (designConfig.bgStyle.includes("gradient")) {
      return {
        background: `linear-gradient(135deg, ${color1}, ${color2})`,
      };
    }
    return { backgroundColor: color1 };
  };

  const getDecoration = () => {
    switch (designConfig.decoration) {
      case "circles":
        return (
          <>
            <div className="absolute top-4 right-4 w-24 h-24 rounded-full opacity-10" style={{ backgroundColor: designConfig.accentColor }} />
            <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: designConfig.accentColor }} />
          </>
        );
      case "lines":
        return (
          <>
            <div className="absolute top-0 right-0 w-px h-full opacity-20" style={{ backgroundColor: designConfig.accentColor }} />
            <div className="absolute left-0 bottom-0 w-full h-px opacity-20" style={{ backgroundColor: designConfig.accentColor }} />
          </>
        );
      case "shapes":
        return (
          <>
            <div className="absolute top-0 right-0 w-16 h-16 rotate-45 opacity-10" style={{ backgroundColor: designConfig.accentColor }} />
            <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: designConfig.accentColor }} />
          </>
        );
      default:
        return null;
    }
  };

  const getLayoutStyle = () => {
    if (designConfig.layout === "split") {
      return "grid grid-cols-2 gap-4";
    } else if (designConfig.layout === "left-aligned") {
      return "flex flex-col items-start";
    }
    return "flex flex-col items-center text-center";
  };

  const fontWeightClass = designConfig.fontWeight === "bold" ? "font-bold" : designConfig.fontWeight === "light" ? "font-light" : "font-normal";
  const borderClass = designConfig.borderStyle.includes("rounded") ? "rounded-xl" : designConfig.borderStyle.includes("dashed") ? "border-2 border-dashed" : "";

  return (
    <div
      className={`w-full aspect-[1.75/1] p-8 flex flex-col justify-between relative overflow-hidden shadow-lg ${borderClass}`}
      style={{
        ...getBgStyle(),
        color: designConfig.textColor,
        fontFamily: designConfig.fontFamily,
        fontSize: designConfig.fontSize ? `${designConfig.fontSize}px` : '16px',
      }}
    >
      {data.logo && (
        <div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm rounded-md p-2 shadow">
          <img src={data.logo} alt="Company logo" className="h-10 w-10 object-contain" crossOrigin="anonymous" />
        </div>
      )}
      {getDecoration()}
      
      <div className={`relative z-10 ${getLayoutStyle()}`}>
        <div>
          <h3 className={`text-2xl mb-1 ${fontWeightClass}`} style={{ color: designConfig.textColor }}>
            {data.name || "Your Name"}
          </h3>
          <p className="text-sm mb-1" style={{ color: designConfig.accentColor }}>
            {data.title || "Job Title"}
          </p>
          <p className="text-xs opacity-80">{data.company || "Company Name"}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-end relative z-10">
        <div className="space-y-1 text-xs">
          {data.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3" style={{ color: designConfig.accentColor }} />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3" style={{ color: designConfig.accentColor }} />
              <span>{data.phone}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3" style={{ color: designConfig.accentColor }} />
              <span>{data.website}</span>
            </div>
          )}
        </div>
        
        {data.name && data.email && (
          <div className="bg-white p-2 rounded-lg shadow-md">
            <QRCodeSVG value={vCardData} size={60} />
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { BusinessCardData } from "./BusinessCardForm";
import { QRCodeSVG } from "qrcode.react";

// ✅ Default values define karein
const defaultPositions = {
  name: { x: 10, y: 30 },
  title: { x: 10, y: 45 },
  company: { x: 10, y: 55 },
  logo: { x: 10, y: 10 }
};

const defaultSizes = {
  name: 28,
  title: 20,
  company: 18,
  logo: 80
};

const defaultPositionsBack = {
  email: { x: 10, y: 20 },
  phone: { x: 10, y: 35 },
  website: { x: 10, y: 50 },
  address: { x: 10, y: 65 },
  qr: { x: 65, y: 30 }
};

const defaultBackSizes = {
  email: 16,
  phone: 16,
  website: 16,
  address: 16,
  qr: 120
};

interface CardPreviewWithDesignProps {
  item: any;
  type: 'front' | 'back';
  size?: 'small' | 'medium' | 'large';
}

export const CardPreviewWithDesign: React.FC<CardPreviewWithDesignProps> = ({ 
  item, 
  type,
  size = 'medium' 
}) => {
  const design = item.design;
  const data = item.data;
  const serverMeta = item.serverMeta;
  
  const isServer = item.kind === "server";
  
  // Get design values or use defaults
  const positions = design?.positions || defaultPositions;
  const sizes = design?.sizes || defaultSizes;
  const positionsBack = design?.positionsBack || defaultPositionsBack;
  const backSizes = design?.backSizes || defaultBackSizes;
  
  const font = design?.font || item.selectedFont || "Arial, sans-serif";
  const fontSize = design?.fontSize || item.fontSize || 16;
  const textColor = design?.textColor || item.textColor || "#000000";
  const accentColor = design?.accentColor || item.accentColor || "#0ea5e9";
  
  // QR code settings
  const qrColor = design?.qrColor || serverMeta?.qrColor || "#000000";
  const qrLogoUrl = design?.qrLogoUrl || serverMeta?.qrLogoUrl;
  
  // Size scaling
  const scaleFactor = {
    small: 0.5,
    medium: 0.8,
    large: 1
  }[size];

  // Generate vCard for QR code
  const generateVCard = () => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${data?.name || 'Your Name'}
TITLE:${data?.title || 'Job Title'}
ORG:${data?.company || 'Company'}
EMAIL:${data?.email || 'email@example.com'}
TEL:${data?.phone || '+91 00000 00000'}
URL:${data?.website || 'your-website.com'}
ADR:${data?.address || 'Your Address, City'}
END:VCARD`;
  };

  const qrData = design?.qrData || generateVCard();
  
  // Handle QR code error
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    setQrError(false);
  }, [item]);

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget as HTMLImageElement;
    target.style.display = 'none';
  };

  if (type === 'front') {
    // Front side preview
    if (item.frontImageUrl) {
      return (
        <img
          src={item.frontImageUrl}
          alt="Front of Business Card"
          className="w-full h-full object-contain"
          onError={handleImageError}
        />
      );
    }

    // Dynamic preview based on saved design
    const bg = isServer ? serverMeta?.background_url : undefined;
    
    return (
      <div 
        className="w-full h-full relative"
        style={{
          backgroundImage: bg ? `url(${bg})` : undefined,
          backgroundColor: bg ? undefined : '#f3f4f6',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          fontFamily: font,
          color: textColor,
        }}
      >
        {/* Logo */}
        {data?.logo && (
          <div
            style={{
              position: 'absolute',
              left: `${positions.logo.x}%`,
              top: `${positions.logo.y}%`,
              width: `${sizes.logo * scaleFactor}px`,
              height: `${sizes.logo * scaleFactor}px`,
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: 'white',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 10,
            }}
          >
            <img
              src={data.logo}
              alt="Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = 
                    '<div class="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">LOGO</div>';
                }
              }}
            />
          </div>
        )}
        
        {/* Name */}
        <div
          style={{
            position: 'absolute',
            left: `${positions.name.x}%`,
            top: `${positions.name.y}%`,
            fontSize: `${sizes.name * scaleFactor}px`,
            fontFamily: font,
            fontWeight: 'bold',
            color: textColor,
          }}
        >
          {data?.name || "Your Name"}
        </div>
        
        {/* Title */}
        <div
          style={{
            position: 'absolute',
            left: `${positions.title.x}%`,
            top: `${positions.title.y}%`,
            fontSize: `${sizes.title * scaleFactor}px`,
            fontFamily: font,
            color: accentColor,
          }}
        >
          {data?.title || "Job Title"}
        </div>
        
        {/* Company */}
        <div
          style={{
            position: 'absolute',
            left: `${positions.company.x}%`,
            top: `${positions.company.y}%`,
            fontSize: `${sizes.company * scaleFactor}px`,
            fontFamily: font,
            color: textColor,
            opacity: 0.8,
          }}
        >
          {data?.company || "Company"}
        </div>
      </div>
    );
  } else {
    // Back side preview
    if (item.backImageUrl) {
      return (
        <img
          src={item.backImageUrl}
          alt="Back of Business Card"
          className="w-full h-full object-contain"
          onError={handleImageError}
        />
      );
    }

    // Dynamic back side preview
    const backBg = isServer ? (serverMeta?.back_background_url || serverMeta?.background_url) : undefined;

    return (
      <div 
        className="w-full h-full relative"
        style={{
          backgroundImage: backBg ? `url(${backBg})` : undefined,
          backgroundColor: backBg ? undefined : '#f3f4f6',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          fontFamily: font,
          color: textColor,
        }}
      >
        {/* Email */}
        <div
          style={{
            position: 'absolute',
            left: `${positionsBack.email.x}%`,
            top: `${positionsBack.email.y}%`,
            fontSize: `${backSizes.email * scaleFactor}px`,
          }}
        >
          <span style={{ color: accentColor, marginRight: '8px' }}>✉</span>
          {data?.email || "email@example.com"}
        </div>
        
        {/* Phone */}
        <div
          style={{
            position: 'absolute',
            left: `${positionsBack.phone.x}%`,
            top: `${positionsBack.phone.y}%`,
            fontSize: `${backSizes.phone * scaleFactor}px`,
          }}
        >
          <span style={{ color: accentColor, marginRight: '8px' }}>✆</span>
          {data?.phone || "+91 00000 00000"}
        </div>
        
        {/* Website */}
        {data?.website && (
          <div
            style={{
              position: 'absolute',
              left: `${positionsBack.website.x}%`,
              top: `${positionsBack.website.y}%`,
              fontSize: `${backSizes.website * scaleFactor}px`,
            }}
          >
            <span style={{ color: accentColor, marginRight: '8px' }}>⌂</span>
            {data.website}
          </div>
        )}
        
        {/* Address */}
        {data?.address && (
          <div
            style={{
              position: 'absolute',
              left: `${positionsBack.address.x}%`,
              top: `${positionsBack.address.y}%`,
              fontSize: `${backSizes.address * scaleFactor}px`,
            }}
          >
            <span style={{ color: accentColor, marginRight: '8px' }}>📍</span>
            {data.address}
          </div>
        )}
        
        {/* QR Code */}
        <div
          style={{
            position: 'absolute',
            left: `${positionsBack.qr.x}%`,
            top: `${positionsBack.qr.y}%`,
          }}
        >
          <div style={{ 
            background: 'white', 
            padding: '8px', 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {qrError ? (
              <div style={{ 
                width: `${backSizes.qr * scaleFactor}px`, 
                height: `${backSizes.qr * scaleFactor}px`,
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
              }}>
                <span style={{ 
                  color: qrColor, 
                  fontSize: '10px', 
                  fontWeight: 'bold',
                }}>
                  QR CODE
                </span>
              </div>
            ) : (
              <QRCodeSVG 
                value={qrData}
                size={backSizes.qr * scaleFactor}
                fgColor={qrColor}
                bgColor="#FFFFFF"
                level="H"
                includeMargin={false}
                onError={() => setQrError(true)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
};

export { defaultPositions, defaultSizes, defaultPositionsBack, defaultBackSizes };
export default CardPreviewWithDesign;
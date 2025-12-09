// import React, { useState, useEffect } from 'react';
// import { BusinessCardData } from "./BusinessCardForm";
// import { QRCodeSVG } from "qrcode.react";

// interface CardPreviewWithDesignProps {
//   item: any;
//   type: 'front' | 'back';
//   size?: 'small' | 'medium' | 'large';
// }

// export const CardPreviewWithDesign: React.FC<CardPreviewWithDesignProps> = ({ 
//   item, 
//   type,
//   size = 'medium' 
// }) => {
//   const design = item.design;
//   const data = item.data;
//   const serverMeta = item.serverMeta;
  
//   const isServer = item.kind === "server";
  
//   // Get design values or use defaults
//   const positions = design?.positions || defaultPositions;
//   const sizes = design?.sizes || defaultSizes;
//   const positionsBack = design?.positionsBack || defaultPositionsBack;
//   const backSizes = design?.backSizes || defaultBackSizes;
  
//   const font = design?.font || item.selectedFont || "Arial, sans-serif";
//   const fontSize = design?.fontSize || item.fontSize || 16;
//   const textColor = design?.textColor || item.textColor || "#000000";
//   const accentColor = design?.accentColor || item.accentColor || "#0ea5e9";
  
//   // QR code settings
//   const qrColor = design?.qrColor || serverMeta?.qrColor || "#000000";
//   const qrLogoUrl = design?.qrLogoUrl || serverMeta?.qrLogoUrl;
//   const qrData = design?.qrData || generateVCard();
  
//   // Size scaling
//   const scaleFactor = {
//     small: 0.5,
//     medium: 0.8,
//     large: 1
//   }[size];

//   // Generate vCard for QR code
//   function generateVCard() {
//     return `BEGIN:VCARD
// VERSION:3.0
// FN:${data?.name || 'Your Name'}
// TITLE:${data?.title || 'Job Title'}
// ORG:${data?.company || 'Company'}
// EMAIL:${data?.email || 'email@example.com'}
// TEL:${data?.phone || '+91 00000 00000'}
// URL:${data?.website || 'your-website.com'}
// ADR:${data?.address || 'Your Address, City'}
// END:VCARD`;
//   }

//   // Handle QR code error
//   const [qrError, setQrError] = useState(false);

//   useEffect(() => {
//     setQrError(false);
//   }, [item]);

//   if (type === 'front') {
//     // Front side preview
//     if (item.frontImageUrl) {
//       return (
//         <img
//           src={item.frontImageUrl}
//           alt="Front of Business Card"
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             // Fallback if image fails to load
//             (e.target as HTMLImageElement).src = `https://via.placeholder.com/560x320/f3f4f6/000000?text=${encodeURIComponent(data?.name || 'Card Front')}`;
//           }}
//         />
//       );
//     }

//     // Dynamic preview based on saved design
//     const bg = isServer ? serverMeta?.background_url : undefined;
//     const cfg = isServer ? serverMeta?.config : {};
    
//     return (
//       <div 
//         className="w-full h-full relative"
//         style={{
//           backgroundImage: bg ? `url(${bg})` : undefined,
//           backgroundColor: bg ? undefined : '#f3f4f6',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           fontFamily: font,
//           color: textColor,
//           fontSize: `${fontSize * scaleFactor}px`,
//         }}
//       >
//         {/* Logo */}
//         {data?.logo && (
//           <div
//             style={{
//               position: 'absolute',
//               left: `${positions.logo.x}%`,
//               top: `${positions.logo.y}%`,
//               width: sizes.logo * scaleFactor,
//               height: sizes.logo * scaleFactor,
//               borderRadius: '50%',
//               overflow: 'hidden',
//               backgroundColor: 'white',
//               border: '2px solid white',
//               boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//               zIndex: 10,
//             }}
//           >
//             <img
//               src={data.logo}
//               alt="Logo"
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 (e.target as HTMLImageElement).style.display = 'none';
//                 (e.target as HTMLImageElement).parentElement!.innerHTML = 
//                   '<div class="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">LOGO</div>';
//               }}
//             />
//           </div>
//         )}
        
//         {/* Name */}
//         <div
//           style={{
//             position: 'absolute',
//             left: `${positions.name.x}%`,
//             top: `${positions.name.y}%`,
//             fontSize: `${sizes.name * scaleFactor}px`,
//             fontFamily: font,
//             fontWeight: 'bold',
//             color: textColor,
//           }}
//         >
//           {data?.name || "Your Name"}
//         </div>
        
//         {/* Title */}
//         <div
//           style={{
//             position: 'absolute',
//             left: `${positions.title.x}%`,
//             top: `${positions.title.y}%`,
//             fontSize: `${sizes.title * scaleFactor}px`,
//             fontFamily: font,
//             color: accentColor,
//           }}
//         >
//           {data?.title || "Job Title"}
//         </div>
        
//         {/* Company */}
//         <div
//           style={{
//             position: 'absolute',
//             left: `${positions.company.x}%`,
//             top: `${positions.company.y}%`,
//             fontSize: `${sizes.company * scaleFactor}px`,
//             fontFamily: font,
//             color: textColor,
//             opacity: 0.8,
//           }}
//         >
//           {data?.company || "Company"}
//         </div>
//       </div>
//     );
//   } else {
//     // Back side preview
//     if (item.backImageUrl) {
//       return (
//         <img
//           src={item.backImageUrl}
//           alt="Back of Business Card"
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             // Fallback if image fails to load
//             (e.target as HTMLImageElement).style.display = 'none';
//             const fallback = document.createElement('div');
//             fallback.className = 'w-full h-full';
//             fallback.innerHTML = renderDynamicBack();
//             e.target.parentElement?.appendChild(fallback);
//           }}
//         />
//       );
//     }

//     // Dynamic back side preview
//     const backBg = isServer ? (serverMeta?.back_background_url || serverMeta?.background_url) : undefined;
//     const cfg = isServer ? serverMeta?.config : {};

//     const renderDynamicBack = () => {
//       return (
//         <div 
//           className="w-full h-full relative"
//           style={{
//             backgroundImage: backBg ? `url(${backBg})` : undefined,
//             backgroundColor: backBg ? undefined : '#f3f4f6',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             fontFamily: font,
//             color: textColor,
//             fontSize: `${fontSize * scaleFactor}px`,
//           }}
//         >
//           {/* Email */}
//           {data?.email && (
//             <div
//               style={{
//                 position: 'absolute',
//                 left: `${positionsBack.email.x}%`,
//                 top: `${positionsBack.email.y}%`,
//                 fontSize: `${backSizes.email * scaleFactor}px`,
//               }}
//             >
//               <span style={{ color: accentColor, marginRight: '8px' }}>✉</span>
//               {data.email}
//             </div>
//           )}
          
//           {/* Phone */}
//           {data?.phone && (
//             <div
//               style={{
//                 position: 'absolute',
//                 left: `${positionsBack.phone.x}%`,
//                 top: `${positionsBack.phone.y}%`,
//                 fontSize: `${backSizes.phone * scaleFactor}px`,
//               }}
//             >
//               <span style={{ color: accentColor, marginRight: '8px' }}>✆</span>
//               {data.phone}
//             </div>
//           )}
          
//           {/* Website */}
//           {data?.website && (
//             <div
//               style={{
//                 position: 'absolute',
//                 left: `${positionsBack.website.x}%`,
//                 top: `${positionsBack.website.y}%`,
//                 fontSize: `${backSizes.website * scaleFactor}px`,
//               }}
//             >
//               <span style={{ color: accentColor, marginRight: '8px' }}>⌂</span>
//               {data.website}
//             </div>
//           )}
          
//           {/* Address */}
//           {data?.address && (
//             <div
//               style={{
//                 position: 'absolute',
//                 left: `${positionsBack.address.x}%`,
//                 top: `${positionsBack.address.y}%`,
//                 fontSize: `${backSizes.address * scaleFactor}px`,
//               }}
//             >
//               <span style={{ color: accentColor, marginRight: '8px' }}>📍</span>
//               {data.address}
//             </div>
//           )}
          
//           {/* QR Code */}
//           <div
//             style={{
//               position: 'absolute',
//               left: `${positionsBack.qr.x}%`,
//               top: `${positionsBack.qr.y}%`,
//             }}
//           >
//             {qrError ? (
//               // QR code error fallback
//               <div style={{ 
//                 background: 'white', 
//                 padding: 8, 
//                 borderRadius: 8,
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}>
//                 <div style={{ 
//                   width: backSizes.qr * scaleFactor, 
//                   height: backSizes.qr * scaleFactor,
//                   backgroundColor: '#f3f4f6',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   borderRadius: 4
//                 }}>
//                   <span style={{ 
//                     color: qrColor, 
//                     fontSize: 10, 
//                     fontWeight: 'bold',
//                     textAlign: 'center'
//                   }}>
//                     QR<br/>CODE
//                   </span>
//                 </div>
//                 {qrLogoUrl && (
//                   <div style={{
//                     position: 'absolute',
//                     width: 20,
//                     height: 20,
//                     borderRadius: 4,
//                     overflow: 'hidden',
//                     backgroundColor: 'white',
//                     padding: 2
//                   }}>
//                     <img 
//                       src={qrLogoUrl} 
//                       alt="Logo" 
//                       style={{ width: '100%', height: '100%', objectFit: 'contain' }}
//                       onError={(e) => e.currentTarget.style.display = 'none'}
//                     />
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // QR Code with proper settings
//               <div style={{ 
//                 background: 'white', 
//                 padding: 8, 
//                 borderRadius: 8,
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
//               }}>
//                 <QRCodeSVG 
//                   value={qrData}
//                   size={backSizes.qr * scaleFactor}
//                   fgColor={qrColor}
//                   bgColor="#FFFFFF"
//                   level="H" // High error correction
//                   includeMargin={false}
//                   imageSettings={qrLogoUrl ? {
//                     src: qrLogoUrl,
//                     height: 24,
//                     width: 24,
//                     excavate: true,
//                   } : undefined}
//                   onError={() => setQrError(true)}
//                 />
//                 {qrLogoUrl && !qrError && (
//                   <div style={{
//                     position: 'absolute',
//                     top: '50%',
//                     left: '50%',
//                     transform: 'translate(-50%, -50%)',
//                     width: 20,
//                     height: 20,
//                     borderRadius: 4,
//                     overflow: 'hidden',
//                     backgroundColor: 'white',
//                     padding: 2,
//                     pointerEvents: 'none'
//                   }}>
//                     <img 
//                       src={qrLogoUrl} 
//                       alt="Logo" 
//                       style={{ width: '100%', height: '100%', objectFit: 'contain' }}
//                       onError={(e) => e.currentTarget.style.display = 'none'}
//                     />
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     };

//     return renderDynamicBack();
//   }
// };

// // Add default export
// export default CardPreviewWithDesign;




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
  email: { x: 10, y: 15 },
  phone: { x: 10, y: 30 },
  website: { x: 10, y: 45 },
  address: { x: 10, y: 60 },
  qr: { x: 60, y: 20 }
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
          className="w-full h-full object-cover"
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
          fontSize: `${fontSize * scaleFactor}px`,
        }}
      >
        {/* Logo */}
        {data?.logo && (
          <div
            style={{
              position: 'absolute',
              left: `${positions.logo.x}%`,
              top: `${positions.logo.y}%`,
              width: sizes.logo * scaleFactor,
              height: sizes.logo * scaleFactor,
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
          className="w-full h-full object-cover"
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
          fontSize: `${fontSize * scaleFactor}px`,
        }}
      >
        {/* Email */}
        {data?.email && (
          <div
            style={{
              position: 'absolute',
              left: `${positionsBack.email.x}%`,
              top: `${positionsBack.email.y}%`,
              fontSize: `${backSizes.email * scaleFactor}px`,
            }}
          >
            <span style={{ color: accentColor, marginRight: '8px' }}>✉</span>
            {data.email}
          </div>
        )}
        
        {/* Phone */}
        {data?.phone && (
          <div
            style={{
              position: 'absolute',
              left: `${positionsBack.phone.x}%`,
              top: `${positionsBack.phone.y}%`,
              fontSize: `${backSizes.phone * scaleFactor}px`,
            }}
          >
            <span style={{ color: accentColor, marginRight: '8px' }}>✆</span>
            {data.phone}
          </div>
        )}
        
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
          {qrError ? (
            // QR code error fallback
            <div style={{ 
              background: 'white', 
              padding: 8, 
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                width: backSizes.qr * scaleFactor, 
                height: backSizes.qr * scaleFactor,
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4
              }}>
                <span style={{ 
                  color: qrColor, 
                  fontSize: 10, 
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  QR<br/>CODE
                </span>
              </div>
              {qrLogoUrl && (
                <div style={{
                  position: 'absolute',
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  padding: 2
                }}>
                  <img 
                    src={qrLogoUrl} 
                    alt="Logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => (e.currentTarget as HTMLImageElement).style.display = 'none'}
                  />
                </div>
              )}
            </div>
          ) : (
            // QR Code with proper settings
            <div style={{ 
              background: 'white', 
              padding: 8, 
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <QRCodeSVG 
                value={qrData}
                size={backSizes.qr * scaleFactor}
                fgColor={qrColor}
                bgColor="#FFFFFF"
                level="H" // High error correction
                includeMargin={false}
                imageSettings={qrLogoUrl ? {
                  src: qrLogoUrl,
                  height: 24,
                  width: 24,
                  excavate: true,
                } : undefined}
                onError={() => setQrError(true)}
              />
              {qrLogoUrl && !qrError && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  padding: 2,
                  pointerEvents: 'none'
                }}>
                  <img 
                    src={qrLogoUrl} 
                    alt="Logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => (e.currentTarget as HTMLImageElement).style.display = 'none'}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
};

// ✅ Export default values bhi
export { defaultPositions, defaultSizes, defaultPositionsBack, defaultBackSizes };
export default CardPreviewWithDesign;
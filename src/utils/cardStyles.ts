import { CartItem } from "@/contexts/CartContext";

export const CARD_DIMENSIONS = {
  width: 560,  // Standard business card width in pixels
  height: 320, // Standard business card height in pixels
  qrSize: 100, // QR code size in pixels
  padding: 24,  // Padding around the card content
  borderRadius: 12, // Rounded corners
  shadow: '0 4px 12px rgba(0, 0, 0, 0.15)' // Subtle shadow
};

export const getCardStyles = (item: CartItem) => {
  return {
    container: {
      width: `${CARD_DIMENSIONS.width}px`,
      height: `${CARD_DIMENSIONS.height}px`,
      borderRadius: `${CARD_DIMENSIONS.borderRadius}px`,
      overflow: 'hidden',
      boxShadow: CARD_DIMENSIONS.shadow,
      position: 'relative' as const,
      backgroundColor: '#ffffff',
      fontFamily: item.selectedFont || 'sans-serif',
      color: item.textColor || '#000000',
      fontSize: `${item.fontSize || 16}px`,
      display: 'flex',
      flexDirection: 'column' as const,
      padding: `${CARD_DIMENSIONS.padding}px`
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px'
    },
    qrCode: {
      position: 'absolute' as const,
      bottom: `${CARD_DIMENSIONS.padding}px`,
      right: `${CARD_DIMENSIONS.padding}px`,
      width: `${CARD_DIMENSIONS.qrSize}px`,
      height: `${CARD_DIMENSIONS.qrSize}px`,
      backgroundColor: '#ffffff',
      padding: '8px',
      borderRadius: '8px'
    },
  };
};
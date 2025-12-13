import { useEffect, useState, useRef } from "react";
import { BusinessCardData } from "./BusinessCardForm";
import { ClassicCard } from "./templates/ClassicCard";
import { Check, Download } from "lucide-react";
import { downloadAsImage } from "@/lib/utils";
import { Button } from "./ui/button";
import { classicTemplates } from "@/lib/classicTemplates";
import { BackSideCard } from "./templates/BackSideCard";
import { QRCodeSVG } from "qrcode.react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { listPublishedTemplates, Template } from "@/services/templates";
import { apiFetch } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { CustomizationPanel } from "./CustomizationPanel";
import { generateCardImage } from "@/services/imageGenerator";
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface TemplateSelectorProps {
  data: BusinessCardData;
  selectedFont?: string;
  fontSize?: number;
  textColor?: string;
  accentColor?: string;
  onFontSelect?: (font: string) => void;
  onFontSizeChange?: (size: number) => void;
  onTextColorChange?: (color: string) => void;
  onAccentColorChange?: (color: string) => void;
  showCustomizationPanel?: boolean;
}

const templates = classicTemplates;
const DEFAULT_PRICE = 2.99;

export const TemplateSelector = ({
  data,
  selectedFont = "Arial, sans-serif",
  fontSize = 16,
  textColor = "#000000",
  accentColor = "#0ea5e9",
  onFontSelect,
  onFontSizeChange,
  onTextColorChange,
  onAccentColorChange,
  showCustomizationPanel = false,
}: TemplateSelectorProps) => {
  const [scale, setScale] = useState(1);
  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);

  const [showCartSuccess, setShowCartSuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id ?? "classic-001");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previewRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const selectedConfig = templates.find((t) => t.id === selectedTemplate) || templates[0];
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [sbTemplates, setSbTemplates] = useState<Template[]>([]);
  const combined = [
    ...sbTemplates.map((t) => ({ kind: "server" as const, id: `sb:${t.id}`, server: t }))
  ];
  const totalPages = Math.max(1, Math.ceil(combined.length / pageSize));
  const pagedTemplates = combined.slice(page * pageSize, page * pageSize + pageSize);
  const cartCtx = useCart();
  const navigate = useNavigate();
  const pricePerItem = 2.99;
  const { user } = useAuth();
  const [isEditLayout, setIsEditLayout] = useState(false);
  const [isLayoutDialogOpen, setIsLayoutDialogOpen] = useState(false);
  const [isStyleDialogOpen, setIsStyleDialogOpen] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);


  const isCustomerDetailsValid = () => {
    const effectiveName = (customerName || data.name || "").trim();
    const effectivePhone = (customerPhone || data.phone || "").trim();
    return (
      !!effectiveName &&
      !!effectivePhone &&
      !!addressLine1.trim() &&
      !!city.trim() &&
      !!state.trim() &&
      !!pincode.trim()
    );
  };

  type FrontKey = 'name' | 'title' | 'company' | 'logo';

  // Default positions and sizes
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

  // Use saved positions from config or defaults
  const [positions, setPositions] = useState<{
    name: { x: number; y: number };
    title: { x: number; y: number };
    company: { x: number; y: number };
    logo: { x: number; y: number };
  }>(defaultPositions);

  const [sizes, setSizes] = useState<{
    name: number;
    title: number;
    company: number;
    logo: number;
  }>(defaultSizes);

  const [positionsBack, setPositionsBack] = useState<{ email: { x: number; y: number }; phone: { x: number; y: number }; website: { x: number; y: number }; address: { x: number; y: number }; qr: { x: number; y: number } }>(defaultPositionsBack);

  const [backSizes, setBackSizes] = useState<{ email: number; phone: number; website: number; address: number; qr: number }>(defaultBackSizes);

  const dragState = useRef<{ key: FrontKey | null; offsetX: number; offsetY: number }>({ key: null, offsetX: 0, offsetY: 0 });
  const resizeState = useRef<{ key: FrontKey | null; baseSize: number; startY: number }>({ key: null, baseSize: 0, startY: 0 });

  const backDragState = useRef<{ key: 'email' | 'phone' | 'website' | 'address' | 'qr' | null; offsetX: number; offsetY: number }>({ key: null, offsetX: 0, offsetY: 0 });
  const backResizeState = useRef<{ key: 'email' | 'phone' | 'website' | 'address' | 'qr' | null; baseSize: number; startY: number }>({ key: null, baseSize: 0, startY: 0 });

  const onDragStart = (key: FrontKey, e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditLayout || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const pointX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pointY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragState.current = { key, offsetX: pointX - rect.left, offsetY: pointY - rect.top };
    window.addEventListener('mousemove', onDragMove as any);
    window.addEventListener('touchmove', onDragMove as any, { passive: false });
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchend', onDragEnd);
  };

  const onDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isEditLayout || !previewRef.current || !dragState.current.key) return;
    const rect = previewRef.current.getBoundingClientRect();
    const pointX = e instanceof TouchEvent ? e.touches[0]?.clientX ?? dragState.current.offsetX : (e as MouseEvent).clientX;
    const pointY = e instanceof TouchEvent ? e.touches[0]?.clientY ?? dragState.current.offsetY : (e as MouseEvent).clientY;
    const xPx = Math.min(Math.max(pointX - rect.left, 0), rect.width);
    const yPx = Math.min(Math.max(pointY - rect.top, 0), rect.height);
    const x = (xPx / rect.width) * 100;
    const y = (yPx / rect.height) * 100;
    const k = dragState.current.key;
    setPositions((p) => ({ ...p, [k]: { x, y } }));
    if (e instanceof TouchEvent) e.preventDefault();
  };

  const onDragEnd = () => {
    dragState.current = { key: null, offsetX: 0, offsetY: 0 };
    window.removeEventListener('mousemove', onDragMove as any);
    window.removeEventListener('touchmove', onDragMove as any);
    window.removeEventListener('mouseup', onDragEnd);
    window.removeEventListener('touchend', onDragEnd);
  };

  const onResizeStart = (key: FrontKey, e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditLayout) return;
    const startY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const baseSize = sizes[key];
    resizeState.current = { key, baseSize, startY };
    window.addEventListener('mousemove', onResizeMove as any);
    window.addEventListener('touchmove', onResizeMove as any, { passive: false });
    window.addEventListener('mouseup', onResizeEnd);
    window.addEventListener('touchend', onResizeEnd);
  };

  const onResizeMove = (e: MouseEvent | TouchEvent) => {
    if (!isEditLayout || !resizeState.current.key) return;
    const curY = e instanceof TouchEvent ? e.touches[0]?.clientY ?? resizeState.current.startY : (e as MouseEvent).clientY;
    const delta = curY - resizeState.current.startY;
    const k = resizeState.current.key;
    const newSize = Math.max(8, Math.min(64, Math.round(resizeState.current.baseSize + delta * 0.2)));
    setSizes((s) => ({ ...s, [k]: newSize }));
    if (e instanceof TouchEvent) e.preventDefault();
  };

  const onResizeEnd = () => {
    resizeState.current = { key: null, baseSize: 0, startY: 0 };
    window.removeEventListener('mousemove', onResizeMove as any);
    window.removeEventListener('touchmove', onResizeMove as any);
    window.removeEventListener('mouseup', onResizeEnd);
    window.removeEventListener('touchend', onResizeEnd);
  };

  const onBackDragStart = (key: 'email' | 'phone' | 'website' | 'address' | 'qr', e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditLayout || !backRef.current) return;
    const rect = backRef.current.getBoundingClientRect();
    const pointX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pointY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    backDragState.current = { key, offsetX: pointX - rect.left, offsetY: pointY - rect.top };
    window.addEventListener('mousemove', onBackDragMove as any);
    window.addEventListener('touchmove', onBackDragMove as any, { passive: false });
    window.addEventListener('mouseup', onBackDragEnd);
    window.addEventListener('touchend', onBackDragEnd);
  };

  const onBackDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isEditLayout || !backRef.current || !backDragState.current.key) return;
    const rect = backRef.current.getBoundingClientRect();
    const pointX = e instanceof TouchEvent ? e.touches[0]?.clientX ?? backDragState.current.offsetX : (e as MouseEvent).clientX;
    const pointY = e instanceof TouchEvent ? e.touches[0]?.clientY ?? backDragState.current.offsetY : (e as MouseEvent).clientY;
    const xPx = Math.min(Math.max(pointX - rect.left, 0), rect.width);
    const yPx = Math.min(Math.max(pointY - rect.top, 0), rect.height);
    const x = (xPx / rect.width) * 100;
    const y = (yPx / rect.height) * 100;
    const k = backDragState.current.key;
    setPositionsBack((p) => ({ ...p, [k!]: { x, y } }));
    if (e instanceof TouchEvent) e.preventDefault();
  };

  const onBackDragEnd = () => {
    backDragState.current = { key: null, offsetX: 0, offsetY: 0 };
    window.removeEventListener('mousemove', onBackDragMove as any);
    window.removeEventListener('touchmove', onBackDragMove as any);
    window.removeEventListener('mouseup', onBackDragEnd);
    window.removeEventListener('touchend', onBackDragEnd);
  };

  const onBackResizeStart = (key: 'email' | 'phone' | 'website' | 'address' | 'qr', e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditLayout) return;
    const startY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const baseSize = backSizes[key];
    backResizeState.current = { key, baseSize, startY };
    window.addEventListener('mousemove', onBackResizeMove as any);
    window.addEventListener('touchmove', onBackResizeMove as any, { passive: false });
    window.addEventListener('mouseup', onBackResizeEnd);
    window.addEventListener('touchend', onBackResizeEnd);
  };

  const onBackResizeMove = (e: MouseEvent | TouchEvent) => {
    if (!isEditLayout || !backResizeState.current.key) return;
    const curY = e instanceof TouchEvent ? e.touches[0]?.clientY ?? backResizeState.current.startY : (e as MouseEvent).clientY;
    const delta = curY - backResizeState.current.startY;
    const k = backResizeState.current.key;
    const clampMax = k === 'qr' ? 140 : 64;
    const clampMin = k === 'qr' ? 40 : 8;
    const newSize = Math.max(clampMin, Math.min(clampMax, Math.round(backResizeState.current.baseSize + delta * 0.2)));
    setBackSizes((s) => ({ ...s, [k]: newSize }));
    if (e instanceof TouchEvent) e.preventDefault();
  };

  const onBackResizeEnd = () => {
    backResizeState.current = { key: null, baseSize: 0, startY: 0 };
    window.removeEventListener('mousemove', onBackResizeMove as any);
    window.removeEventListener('touchmove', onBackResizeMove as any);
    window.removeEventListener('mouseup', onBackResizeEnd);
    window.removeEventListener('touchend', onBackResizeEnd);
  };

  const defaultFont = "Arial, sans-serif";
  const defaultFontSize = 16;
  const defaultText = "#000000";
  const defaultAccent = "#0ea5e9";
  const hasOverrides =
    selectedFont !== defaultFont ||
    fontSize !== defaultFontSize ||
    textColor !== defaultText ||
    accentColor !== defaultAccent;

  useEffect(() => {
    const updateScaleAll = () => {
      Object.entries(containerRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const w = el.getBoundingClientRect().width;
        const cardWidth = 280;
        const scaleValue = w / cardWidth;
        el.style.setProperty("--cardScale", String(scaleValue));
      });
    };
  }, []);

  // for font scalling
  useEffect(() => {
    const updateScaleAll = () => {
      Object.entries(containerRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const w = el.getBoundingClientRect().width;
        const cardWidth = 280; // FULL size card width
        const scaleValue = w / cardWidth;
        el.style.setProperty("--cardScale", String(scaleValue));
      });
    };

    updateScaleAll();
    window.addEventListener("resize", updateScaleAll);
    return () => window.removeEventListener("resize", updateScaleAll);
  }, []);

  useEffect(() => {
    const updatePreviewScale = () => {
      if (!previewContainerRef.current) return;

      const parentWidth = previewContainerRef.current.offsetWidth;
      const scale = Math.min(parentWidth / 560, 1);
      setPreviewScale(scale);
    };

    updatePreviewScale();
    window.addEventListener("resize", updatePreviewScale);

    return () => window.removeEventListener("resize", updatePreviewScale);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await listPublishedTemplates();
        if (alive) setSbTemplates(Array.isArray(data) ? data : []);
      } catch { }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    setPage(0);
  }, [Array.isArray(sbTemplates) ? sbTemplates.length : 0]);

  useEffect(() => {
    const list = Array.isArray(sbTemplates) ? sbTemplates : [];
    if (list.length > 0 && !String(selectedTemplate).startsWith("sb:")) {
      setSelectedTemplate(`sb:${list[0].id}`);
    }
  }, [Array.isArray(sbTemplates) ? sbTemplates.length : 0]);

  // Load saved positions when template changes
  useEffect(() => {
    const isServer = selectedTemplate.startsWith("sb:");
    if (!isServer) return;

    const serverId = selectedTemplate.slice(3);
    const t = sbTemplates.find(x => x.id === serverId);
    if (!t?.config) return;

    const cfg = t.config;

    // Load front side positions
    if (cfg.positions) {
      setPositions({
        name: cfg.positions.name || defaultPositions.name,
        title: cfg.positions.title || defaultPositions.title,
        company: cfg.positions.company || defaultPositions.company,
        logo: cfg.positions.logo || defaultPositions.logo,
      });
    }

    // Load front side sizes
    if (cfg.sizes) {
      setSizes({
        name: cfg.sizes.name || defaultSizes.name,
        title: cfg.sizes.title || defaultSizes.title,
        company: cfg.sizes.company || defaultSizes.company,
        logo: cfg.sizes.logo || defaultSizes.logo,
      });
    }

    // Load back side positions
    if (cfg.positionsBack) {
      setPositionsBack({
        email: cfg.positionsBack.email || defaultPositionsBack.email,
        phone: cfg.positionsBack.phone || defaultPositionsBack.phone,
        website: cfg.positionsBack.website || defaultPositionsBack.website,
        address: cfg.positionsBack.address || defaultPositionsBack.address,
        qr: cfg.positionsBack.qr || defaultPositionsBack.qr,
      });
    }

    // Load back side sizes
    if (cfg.backSizes) {
      setBackSizes({
        email: cfg.backSizes.email || defaultBackSizes.email,
        phone: cfg.backSizes.phone || defaultBackSizes.phone,
        website: cfg.backSizes.website || defaultBackSizes.website,
        address: cfg.backSizes.address || defaultBackSizes.address,
        qr: cfg.backSizes.qr || defaultBackSizes.qr,
      });
    }
    setIsEditLayout(false);
  }, [selectedTemplate, sbTemplates]);

  const [isUploading, setIsUploading] = useState(false);

  const generateVCard1 = () => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${data.name || 'Your Name'}
TITLE:${data.title || 'Job Title'}
ORG:${data.company || 'Company'}
EMAIL:${data.email || 'email@example.com'}
TEL:${data.phone || '+91 00000 00000'}
URL:${data.website || 'your-website.com'}
ADR:${data.address || 'Your Address, City'}
END:VCARD`;
  };


  //  Optimized function to generate card images
  const generateCardImages = async (): Promise<{ front: string, back: string, thumbnail: string }> => {
    const isServer = selectedTemplate.startsWith("sb:");
    const serverId = isServer ? selectedTemplate.slice(3) : "";
    const st = isServer ? sbTemplates.find(x => x.id === serverId) : undefined;

    // Generate vCard for QR code
    const generateVCard = (): string => {
      return `BEGIN:VCARD
VERSION:3.0
FN:${data.name || 'Your Name'}
TITLE:${data.title || 'Job Title'}
ORG:${data.company || 'Company'}
EMAIL:${data.email || 'email@example.com'}
TEL:${data.phone || '+91 00000 00000'}
URL:${data.website || 'your-website.com'}
ADR:${data.address || 'Your Address, City'}
END:VCARD`;
    };

    const vCard = generateVCard();
    const qrColor = isServer ? (st?.config?.qrColor || "#000000") : "#000000";

    // Generate QR code
    const QRCodeLib = (await import('qrcode')).default;
    const qrDataUrl = await QRCodeLib.toDataURL(vCard, {
      width: 200,
      margin: 1,
      color: {
        dark: qrColor,
        light: "#FFFFFF"
      }
    });

    // Function to create HTML element for a card side
    const createCardSideHTML = async (side: 'front' | 'back'): Promise<string> => {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '560px';
      tempDiv.style.height = '320px';
      tempDiv.style.zIndex = '-1000';
      tempDiv.style.overflow = 'hidden';

      if (side === 'front') {
        // Front side with current positions
        const bg = isServer ? (st?.background_url) : undefined;
        const cfg: any = st?.config || {};
        const fc = hasOverrides ? textColor : (cfg.fontColor || "#000000");
        const accent = hasOverrides ? accentColor : (cfg.accentColor || "#0ea5e9");
        const ff = hasOverrides ? selectedFont : (cfg.fontFamily || "Inter, Arial, sans-serif");

        tempDiv.innerHTML = `
          <div style="width: 560px; height: 320px; position: relative;
                      background: ${bg ? `url('${bg}')` : '#f3f4f6'};
                      background-size: cover; background-position: center;">
            ${data.logo ? `
            <div style="position: absolute; 
                        left: ${positions.logo.x}%; top: ${positions.logo.y}%;
                        width: ${sizes.logo}px; height: ${sizes.logo}px;
                        border-radius: 50%; overflow: hidden;
                        border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
              <img src="${data.logo}" alt="Logo" 
                   style="width: 100%; height: 100%; object-fit: cover;" 
                   crossorigin="anonymous" />
            </div>
            ` : ''}
            
            <div style="position: absolute; 
                        left: ${positions.name.x}%; top: ${positions.name.y}%;
                        font-family: ${ff}; font-size: ${sizes.name}px; 
                        color: ${fc}; font-weight: bold;">
              ${data.name || 'Your Name'}
            </div>
            
            <div style="position: absolute; 
                        left: ${positions.title.x}%; top: ${positions.title.y}%;
                        font-family: ${ff}; font-size: ${sizes.title}px; 
                        color: ${accent};">
              ${data.title || 'Job Title'}
            </div>
            
            <div style="position: absolute; 
                        left: ${positions.company.x}%; top: ${positions.company.y}%;
                        font-family: ${ff}; font-size: ${sizes.company}px; 
                        color: ${fc}; opacity: 0.8;">
              ${data.company || 'Company'}
            </div>
          </div>
        `;
      } else {
        // Back side with current positions
        const bg = isServer ? (st?.back_background_url || st?.background_url) : undefined;
        const cfg: any = st?.config || {};
        const fc = hasOverrides ? textColor : (cfg.fontColor || "#000000");
        const accent = hasOverrides ? accentColor : (cfg.accentColor || "#0ea5e9");
        const ff = hasOverrides ? selectedFont : (cfg.fontFamily || "Inter, Arial, sans-serif");

        tempDiv.innerHTML = `
          <div style="width: 560px; height: 320px; position: relative;
                      background: ${bg ? `url('${bg}')` : '#f3f4f6'};
                      background-size: cover; background-position: center;
                      font-family: ${ff}; color: ${fc};">
            
            <!-- Email with position -->
            <div style="position: absolute; 
                        left: ${positionsBack.email.x}%; top: ${positionsBack.email.y}%;
                        font-size: ${backSizes.email}px;">
              <span style="color: ${accent}; margin-right: 10px;">✉</span>
              ${data.email || 'email@example.com'}
            </div>
            
            <!-- Phone with position -->
            <div style="position: absolute; 
                        left: ${positionsBack.phone.x}%; top: ${positionsBack.phone.y}%;
                        font-size: ${backSizes.phone}px;">
              <span style="color: ${accent}; margin-right: 10px;">✆</span>
              ${data.phone || '+91 00000 00000'}
            </div>
            
            ${data.website ? `
            <!-- Website with position -->
            <div style="position: absolute; 
                        left: ${positionsBack.website.x}%; top: ${positionsBack.website.y}%;
                        font-size: ${backSizes.website}px;">
              <span style="color: ${accent}; margin-right: 10px;">⌂</span>
              ${data.website}
            </div>
            ` : ''}
            
            ${data.address ? `
            <!-- Address with position -->
            <div style="position: absolute; 
                        left: ${positionsBack.address.x}%; top: ${positionsBack.address.y}%;
                        font-size: ${backSizes.address}px;">
              <span style="color: ${accent}; margin-right: 10px;">📍</span>
              ${data.address}
            </div>
            ` : ''}
            
            <!-- QR Code with position -->
            <div style="position: absolute; 
                        left: ${positionsBack.qr.x}%; top: ${positionsBack.qr.y}%;
                        background: white; padding: 10px; border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <img src="${qrDataUrl}" alt="QR Code" 
                   style="width: ${backSizes.qr}px; height: ${backSizes.qr}px;"
                   crossorigin="anonymous" />
            </div>
          </div>
        `;
      }

      document.body.appendChild(tempDiv);

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        allowTaint: true
      } as any);

      document.body.removeChild(tempDiv);
      return canvas.toDataURL('image/png', 1.0);
    };

    try {
      const frontImage = await createCardSideHTML('front');
      const backImage = await createCardSideHTML('back');

      return {
        front: frontImage,
        back: backImage,
        thumbnail: frontImage
      };
    } catch (error) {
      console.error('Error generating card images:', error);
      const fallback = createFallbackImage(data.name || 'Business Card');
      return {
        front: fallback,
        back: fallback,
        thumbnail: fallback
      };
    }
  };

  const addToCart = async () => {
    setIsUploading(true);

    try {
      const isServer = selectedTemplate.startsWith("sb:");
      const serverId = isServer ? selectedTemplate.slice(3) : "";
      const st = isServer ? sbTemplates.find(x => x.id === serverId) : undefined;
      const classicConfig = !isServer ? classicTemplates.find(t => t.id === selectedTemplate) : undefined;

      const price = (isServer && st?.price) ? st.price : (pricePerItem || DEFAULT_PRICE);

      // Step 1: Generate card images (Base64)
      const { front: frontBase64, back: backBase64, thumbnail: thumbnailBase64 } = await generateCardImages();

      // Step 2: Upload images to Cloudinary
      let frontImageUrl = '';
      let backImageUrl = '';
      let thumbnailUrl = '';

      try {
        frontImageUrl = await uploadImageToCloudinary(frontBase64);
        backImageUrl = await uploadImageToCloudinary(backBase64);
        thumbnailUrl = await uploadImageToCloudinary(thumbnailBase64);

        if (!frontImageUrl || !backImageUrl) {
          throw new Error("Failed to upload images to Cloudinary");
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Fallback to Base64 if upload fails
        frontImageUrl = frontBase64;
        backImageUrl = backBase64;
        thumbnailUrl = thumbnailBase64;
      }

      // Structure for frontData (Positions & Sizes)
      const frontDataPayload = {
        positions: positions,
        sizes: sizes,
        font: selectedFont,
        fontSize: fontSize,
        textColor: textColor,
        accentColor: accentColor,
        isEditLayout: isEditLayout
      };

      // Structure for backData
      const backDataPayload = {
        positionsBack: positionsBack,
        backSizes: backSizes,
        font: selectedFont,
        fontSize: fontSize,
        textColor: textColor,
        accentColor: accentColor,
        isEditLayout: isEditLayout
      };

      // Generate vCard for QR code data
      const generateVCard = () => {
        return `BEGIN:VCARD
VERSION:3.0
FN:${data.name || 'Your Name'}
TITLE:${data.title || 'Job Title'}
ORG:${data.company || 'Company'}
EMAIL:${data.email || 'email@example.com'}
TEL:${data.phone || '+91 00000 00000'}
URL:${data.website || 'your-website.com'}
ADR:${data.address || 'Your Address, City'}
END:VCARD`;
      };

      const vCard = generateVCard();
      const qrColor = isServer ? (st?.config?.qrColor || "#000000") : "#000000";

      const designData = {
        positions,
        sizes,
        positionsBack,
        backSizes,
        font: selectedFont,
        fontSize,
        textColor,
        accentColor,
        isEditLayout: isEditLayout,
        qrColor: qrColor,
        qrLogoUrl: isServer ? st?.config?.qrLogoUrl : undefined,
        qrData: vCard,
      };

      // Step 3: Add to cart with Cloudinary URLs
      cartCtx.add({
        id: selectedTemplate,
        productId: selectedTemplate,
        kind: isServer ? "server" : "classic",
        data: data,
        selectedFont,
        fontSize,
        textColor,
        accentColor,
        price: price,
        frontImageUrl: frontImageUrl, // Cloudinary URL
        backImageUrl: backImageUrl,   // Cloudinary URL
        thumbnailUrl: thumbnailUrl,   // Cloudinary URL
        frontData: frontDataPayload,
        backData: backDataPayload,
        serverMeta: isServer ? {
          name: st?.name,
          background_url: st?.background_url,
          back_background_url: st?.back_background_url,
          config: st?.config,
          qrColor: qrColor,
          qrLogoUrl: isServer ? st?.config?.qrLogoUrl : undefined,
        } : undefined,
        design: designData,
        quantity: 1,
      });

      // Step 4: Navigate to cart
      setShowCartSuccess(true);
      setTimeout(() => {
        setShowCartSuccess(false);
        navigate("/cart");
      }, 2000); // Auto-close after 2 seconds and navigate
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const buyCurrent = async () => {
    setIsUploading(true);

    try {
      if (!selectedTemplate) return;

      const isServer = selectedTemplate.startsWith("sb:");
      const serverId = isServer ? selectedTemplate.slice(3) : "";
      const st = isServer ? sbTemplates.find((x) => x.id === serverId) : undefined;

      const price = (isServer ? st?.price : undefined) ?? DEFAULT_PRICE;

      // Step 1: Generate card images
      const { front: frontBase64, back: backBase64 } = await generateCardImages();

      // Step 2: Upload to Cloudinary
      let frontImageUrl = '';
      let backImageUrl = '';

      try {
        frontImageUrl = await uploadImageToCloudinary(frontBase64);
        backImageUrl = await uploadImageToCloudinary(backBase64);

        if (!frontImageUrl || !backImageUrl) {
          throw new Error("Failed to upload images to Cloudinary");
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        frontImageUrl = frontBase64;
        backImageUrl = backBase64;
      }

      const designFront = {
        positions,
        sizes,
        font: selectedFont,
        fontSize,
        textColor,
        accentColor,
        isEditLayout,
      };

      const designBack = {
        positionsBack,
        backSizes,
        font: selectedFont,
        fontSize,
        textColor,
        accentColor,
        isEditLayout,
      };

      // Step 3: Add to cart with Cloudinary URLs
      cartCtx.add({
        id: selectedTemplate,
        kind: isServer ? "server" : "classic",
        data,
        selectedFont,
        fontSize,
        textColor,
        accentColor,
        price,
        frontImageUrl: frontImageUrl, // Cloudinary URL
        backImageUrl: backImageUrl,   // Cloudinary URL
        thumbnailUrl: frontImageUrl,  // Use front as thumbnail
        serverMeta: isServer ? {
          name: st?.name,
          background_url: st?.background_url,
          back_background_url: st?.back_background_url,
          config: st?.config,
        } : undefined,
        frontData: designFront,
        backData: designBack,
        quantity: 1,
        productId: selectedTemplate
      });

      // Step 4: Navigate to checkout
      navigate("/checkout");
    } catch (e: any) {
      console.error('Checkout error:', e);
      alert(e.message || "Unable to start checkout");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)] border border-border animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-0">
            <h2 className="text-xl font-bold text-foreground">Preview</h2>
            <div className="flex flex-nowrap items-center justify-end gap-2 w-full overflow-x-auto scrollbar-hide py-1">
              <Button
                onClick={buyCurrent}
                size="sm"
                variant="default"
                disabled={isUploading}
                className="gap-1.5 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
              >
                {isUploading ? 'Processing...' : 'Buy'}
              </Button>

              <Button
                onClick={addToCart}
                variant="outline"
                size="sm"
                disabled={isUploading}
                className="gap-1.5 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
              >
                {isUploading ? 'Adding...' : 'Add to Cart'}
              </Button>
            </div>
          </div>

          {false && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 border rounded-lg p-3 bg-background/40">
                <h3 className="text-sm font-semibold">Customer Details</h3>
                <div className="grid gap-2 text-xs">
                  <div className="grid gap-1">
                    <label className="font-medium">Full Name *</label>
                    <input
                      className="border rounded px-2 py-1"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={data.name || "Your Name"}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="font-medium">Phone *</label>
                    <input
                      className="border rounded px-2 py-1"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={data.phone || "Phone number"}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="font-medium">Address Line 1 *</label>
                    <input
                      className="border rounded px-2 py-1"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="House / Flat, Street"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="font-medium">Address Line 2</label>
                    <input
                      className="border rounded px-2 py-1"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Area, Landmark (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="grid gap-1">
                      <label className="font-medium">City *</label>
                      <input
                        className="border rounded px-2 py-1"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className="font-medium">State *</label>
                      <input
                        className="border rounded px-2 py-1"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1">
                      <label className="font-medium">Pincode *</label>
                      <input
                        className="border rounded px-2 py-1"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-muted to-background p-0 rounded-lg overflow-x-hidden">
          <div className="bg-gradient-to-br from-muted to-background rounded-lg overflow-hidden p-0 ">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">

              {(() => {
                const isServer = selectedTemplate.startsWith("sb:");
                if (!isServer) {
                  function generateVCard(): string | string[] {
                    throw new Error("Function not implemented.");
                  }

                  return (
                    <>
                      {/* <div
                        ref={previewContainerRef}
                        className="relative overflow-hidden mx-auto"
                        style={{ maxWidth: "450px" }}
                      > */}
                      <div
                        ref={previewContainerRef}
                        className="relative overflow-hidden mx-auto"
                        style={{
                          maxWidth: "560px",
                          width: "100%",
                          height: `${320 * previewScale}px`
                        }}
                      >
                        <div
                          className="origin-top-left"
                          style={{
                            width: "560px",
                            transform: `scale(${previewScale})`,
                            transformOrigin: "top left",
                          }}
                        >
                          <div
                            ref={previewRef}
                            style={{
                              width: "100%",
                              aspectRatio: "1.75 / 1",
                            }}
                            className="relative"
                          >
                            <div className="wm-screen-only" data-watermark="screen-only" />
                            {!isEditLayout && selectedConfig && (
                              <ClassicCard
                                data={data}
                                config={selectedConfig}
                                fontFamily={hasOverrides ? selectedFont : undefined}
                                fontSize={hasOverrides ? fontSize : undefined}

                                textColor={hasOverrides ? textColor : undefined}
                                accentColor={hasOverrides ? accentColor : undefined}
                              />
                            )}
                            {isEditLayout && selectedConfig && (
                              <div
                                className="w-full aspect-[1.75/1] rounded-lg border overflow-hidden p-4 relative"
                                style={{
                                  background: selectedConfig.bgStyle === 'gradient' ? `linear-gradient(135deg, ${selectedConfig.bgColors[0]}, ${selectedConfig.bgColors[1]})` : undefined,
                                  backgroundColor: selectedConfig.bgStyle === 'solid' ? selectedConfig.bgColors[0] : undefined,
                                  color: hasOverrides ? (textColor ?? selectedConfig.textColor) : selectedConfig.textColor,
                                  fontFamily: hasOverrides ? selectedFont : undefined,
                                  fontSize: `${hasOverrides ? fontSize : 16}px`,
                                }}
                              >
                                <div className="absolute inset-0">
                                  {/* Name */}
                                  <div
                                    className="cursor-move select-none font-bold"
                                    style={{ position: 'absolute', left: `${positions.name.x}%`, top: `${positions.name.y}%`, fontSize: sizes.name }}
                                    onMouseDown={(e) => onDragStart('name', e)}
                                    onTouchStart={(e) => onDragStart('name', e)}
                                  >
                                    {data.name || 'Your Name'}
                                    <span
                                      className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                                      style={{ right: -6, bottom: -6 }}
                                      onMouseDown={(e) => { e.stopPropagation(); onResizeStart('name', e); }}
                                      onTouchStart={(e) => { e.stopPropagation(); onResizeStart('name', e); }}
                                    />
                                  </div>

                                  {/* Title */}
                                  <div
                                    className="cursor-move select-none"
                                    style={{ position: 'absolute', left: `${positions.title.x}%`, top: `${positions.title.y}%`, color: hasOverrides ? (accentColor ?? selectedConfig.accentColor) : selectedConfig.accentColor, fontSize: sizes.title }}
                                    onMouseDown={(e) => onDragStart('title', e)}
                                    onTouchStart={(e) => onDragStart('title', e)}
                                  >
                                    {data.title || 'Job Title'}
                                    <span
                                      className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                                      style={{ right: -6, bottom: -6 }}
                                      onMouseDown={(e) => { e.stopPropagation(); onResizeStart('title', e); }}
                                      onTouchStart={(e) => { e.stopPropagation(); onResizeStart('title', e); }}
                                    />
                                  </div>

                                  {/* Company */}
                                  <div
                                    className="cursor-move select-none opacity-80"
                                    style={{ position: 'absolute', left: `${positions.company.x}%`, top: `${positions.company.y}%`, fontSize: sizes.company }}
                                    onMouseDown={(e) => onDragStart('company', e)}
                                    onTouchStart={(e) => onDragStart('company', e)}
                                  >
                                    {data.company || 'Company'}
                                    <span
                                      className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                                      style={{ right: -6, bottom: -6 }}
                                      onMouseDown={(e) => { e.stopPropagation(); onResizeStart('company', e); }}
                                      onTouchStart={(e) => { e.stopPropagation(); onResizeStart('company', e); }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* <div
                        ref={previewContainerRef}
                        className="relative overflow-hidden mx-auto"
                        style={{ maxWidth: "450px" }}
                      > */}
                      <div
                        ref={previewContainerRef}
                        className="relative overflow-hidden mx-auto"
                        style={{
                          maxWidth: "560px",
                          width: "100%",
                          height: `${320 * previewScale}px`
                        }}
                      >
                        <div
                          className="origin-top-left"
                          style={{
                            width: "560px",
                            transform: `scale(${previewScale})`,
                            transformOrigin: "top left",
                          }}
                        >
                          <div
                            ref={backRef}
                            style={{
                              width: "100%",
                              aspectRatio: "1.75 / 1",
                            }}
                            className="relative"
                          >
                            <div className="wm-screen-only" data-watermark="screen-only" />
                            {!isEditLayout && selectedConfig && (
                              <BackSideCard
                                data={data}
                                background={{
                                  style: selectedConfig.bgStyle === "solid" ? "solid" : "gradient",
                                  colors: selectedConfig.bgColors,
                                }}
                                textColor={hasOverrides ? (textColor ?? selectedConfig.textColor) : selectedConfig.textColor}
                                accentColor={hasOverrides ? (accentColor ?? selectedConfig.accentColor) : selectedConfig.accentColor}
                                fontFamily={hasOverrides ? selectedFont : undefined}
                                fontSize={hasOverrides ? fontSize : undefined}
                              />
                            )}
                            {isEditLayout && selectedConfig && (
                              <div
                                className="w-full aspect-[1.75/1] rounded-lg border overflow-hidden relative"
                                style={{
                                  background: selectedConfig.bgStyle === 'gradient' ? `linear-gradient(135deg, ${selectedConfig.bgColors[0]}, ${selectedConfig.bgColors[1]})` : undefined,
                                  backgroundColor: selectedConfig.bgStyle === 'solid' ? selectedConfig.bgColors[0] : undefined,
                                  color: hasOverrides ? (textColor ?? selectedConfig.textColor) : selectedConfig.textColor,
                                  fontFamily: hasOverrides ? selectedFont : undefined,
                                  fontSize: `${hasOverrides ? fontSize : 16}px`,
                                }}
                              >
                                <div className="absolute inset-0">
                                  <div
                                    className="cursor-move select-none"
                                    style={{ position: 'absolute', left: `${positionsBack.email.x}%`, top: `${positionsBack.email.y}%`, fontSize: backSizes.email }}
                                    onMouseDown={(e) => onBackDragStart('email', e)}
                                    onTouchStart={(e) => onBackDragStart('email', e)}
                                  >
                                    <strong style={{ color: hasOverrides ? (accentColor ?? selectedConfig.accentColor) : selectedConfig.accentColor }}>✉</strong> {data.email || 'email@example.com'}
                                    <span
                                      className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                                      style={{ right: -6, bottom: -6 }}
                                      onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('email', e); }}
                                      onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('email', e); }}
                                    />
                                  </div>
                                  <div
                                    className="cursor-move select-none"
                                    style={{ position: 'absolute', left: `${positionsBack.phone.x}%`, top: `${positionsBack.phone.y}%`, fontSize: backSizes.phone }}
                                    onMouseDown={(e) => onBackDragStart('phone', e)}
                                    onTouchStart={(e) => onBackDragStart('phone', e)}
                                  >
                                    <strong style={{ color: hasOverrides ? (accentColor ?? selectedConfig.accentColor) : selectedConfig.accentColor }}>✆</strong> {data.phone || '+91 00000 00000'}
                                    <span
                                      className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                                      style={{ right: -6, bottom: -6 }}
                                      onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('phone', e); }}
                                      onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('phone', e); }}
                                    />
                                  </div>
                                  <div
                                    className="cursor-move select-none"
                                    style={{ position: 'absolute', left: `${positionsBack.website.x}%`, top: `${positionsBack.website.y}%`, fontSize: backSizes.website }}
                                    onMouseDown={(e) => onBackDragStart('website', e)}
                                    onTouchStart={(e) => onBackDragStart('website', e)}
                                  >
                                    <strong style={{ color: hasOverrides ? (accentColor ?? selectedConfig.accentColor) : selectedConfig.accentColor }}>⌂</strong> {data.website || 'your-website.com'}
                                    <span
                                      className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                                      style={{ right: -6, bottom: -6 }}
                                      onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('website', e); }}
                                      onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('website', e); }}
                                    />
                                  </div>
                                  <div
                                    className="cursor-move select-none"
                                    style={{ position: 'absolute', left: `${positionsBack.address.x}%`, top: `${positionsBack.address.y}%`, fontSize: backSizes.address }}
                                    onMouseDown={(e) => onBackDragStart('address', e)}
                                    onTouchStart={(e) => onBackDragStart('address', e)}
                                  >
                                    <strong style={{ color: hasOverrides ? (accentColor ?? selectedConfig.accentColor) : selectedConfig.accentColor }}>📍</strong> {data.address || 'Your Address, City'}
                                    <span
                                      className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                                      style={{ right: -6, bottom: -6 }}
                                      onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('address', e); }}
                                      onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('address', e); }}
                                    />
                                  </div>
                                  <div
                                    className="cursor-move select-none"
                                    style={{ position: 'absolute', left: `${positionsBack.qr.x}%`, top: `${positionsBack.qr.y}%` }}
                                    onMouseDown={(e) => onBackDragStart('qr', e)}
                                    onTouchStart={(e) => onBackDragStart('qr', e)}
                                  >
                                    <div style={{ background: 'rgba(255,255,255,0.9)', padding: 6, borderRadius: 8 }}>
                                      <QRCodeSVG value={generateVCard()} size={backSizes.qr} />
                                    </div>
                                    <span
                                      className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                                      style={{ right: -6, bottom: -6 }}
                                      onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('qr', e); }}
                                      onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('qr', e); }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }

                // Server-side template rendering
                const sid = selectedTemplate.slice(3);
                const t = sbTemplates.find(x => x.id === sid);
                const bg = t?.background_url || undefined;
                const backBg = t?.back_background_url || t?.background_url || undefined;
                const cfg: any = t?.config || {};

                // Get saved positions and sizes from config
                const savedPositions = cfg.positions || {};
                const savedSizes = cfg.sizes || {};
                const savedPositionsBack = cfg.positionsBack || {};
                const savedBackSizes = cfg.backSizes || {};

                // Use saved values or defaults
                const effectivePositions = {
                  name: savedPositions.name || defaultPositions.name,
                  title: savedPositions.title || defaultPositions.title,
                  company: savedPositions.company || defaultPositions.company,
                  logo: savedPositions.logo || defaultPositions.logo,
                };

                const effectiveSizes = {
                  name: savedSizes.name || defaultSizes.name,
                  title: savedSizes.title || defaultSizes.title,
                  company: savedSizes.company || defaultSizes.company,
                  logo: savedSizes.logo || defaultSizes.logo,
                };

                const effectivePositionsBack = {
                  email: savedPositionsBack.email || defaultPositionsBack.email,
                  phone: savedPositionsBack.phone || defaultPositionsBack.phone,
                  website: savedPositionsBack.website || defaultPositionsBack.website,
                  address: savedPositionsBack.address || defaultPositionsBack.address,
                  qr: savedPositionsBack.qr || defaultPositionsBack.qr,
                };

                const effectiveBackSizes = {
                  email: savedBackSizes.email || defaultBackSizes.email,
                  phone: savedBackSizes.phone || defaultBackSizes.phone,
                  website: savedBackSizes.website || defaultBackSizes.website,
                  address: savedBackSizes.address || defaultBackSizes.address,
                  qr: savedBackSizes.qr || defaultBackSizes.qr,
                };

                const fc = hasOverrides ? textColor : (cfg.fontColor || "#000000");
                const fs = hasOverrides ? fontSize : (cfg.fontSize || 16);
                const accent = hasOverrides ? accentColor : (cfg.accentColor || "#0ea5e9");
                const ff = hasOverrides ? selectedFont : (cfg.fontFamily || "Inter, Arial, sans-serif");
                const qrLogoUrl = cfg.qrLogoUrl;
                const qrColor = cfg.qrColor || "#000000";

                const generateVCard = (): string => generateVCard1();


                // return (
                //   <>
                //     {/* Front Side */}
                //     <div ref={previewRef} className="w-full max-w-full relative overflow-hidden">
                //       <div className="wm-screen-only" data-watermark="screen-only" />
                //       {!isEditLayout && (
                //         <div
                //           className="w-full aspect-[1.75/1] rounded-lg border overflow-hidden p-4 relative"
                //           style={{
                //             backgroundColor: bg ? undefined : "#f3f4f6",
                //             backgroundImage: bg ? `url(${bg})` : undefined,
                //             backgroundSize: "cover",
                //             backgroundPosition: "center",
                //             color: fc,
                //             fontFamily: ff,
                //             fontSize: `${fs}px`,
                //           }}
                //         >
                //           {/* Logo - if exists and has saved position */}
                //           {data.logo && effectivePositions.logo && (
                //             <div
                //               style={{
                //                 position: 'absolute',
                //                 left: `${effectivePositions.logo.x}%`,
                //                 top: `${effectivePositions.logo.y}%`,
                //                 width: effectiveSizes.logo,
                //                 height: effectiveSizes.logo,
                //                 borderRadius: "50%",
                //                 overflow: "hidden",
                //                 backgroundColor: "white",
                //                 border: "2px solid white",
                //                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                //                 zIndex: 10,
                //               }}
                //             >
                //               <img
                //                 src={data.logo}
                //                 alt="Logo"
                //                 className="w-full h-full object-cover"
                //               />
                //             </div>
                //           )}

                //           {/* Name with saved position */}
                //           <div
                //             style={{
                //               position: 'absolute',
                //               left: `${effectivePositions.name.x}%`,
                //               top: `${effectivePositions.name.y}%`,
                //               fontSize: `${effectiveSizes.name}px`,
                //               fontFamily: ff,
                //               fontWeight: 'bold',
                //               color: fc,
                //               zIndex: 5,
                //             }}
                //           >
                //             {data.name || "Your Name"}
                //           </div>

                //           {/* Title with saved position */}
                //           <div
                //             style={{
                //               position: 'absolute',
                //               left: `${effectivePositions.title.x}%`,
                //               top: `${effectivePositions.title.y}%`,
                //               fontSize: `${effectiveSizes.title}px`,
                //               fontFamily: ff,
                //               color: accent,
                //               zIndex: 5,
                //             }}
                //           >
                //             {data.title || "Job Title"}
                //           </div>

                //           {/* Company with saved position */}
                //           <div
                //             style={{
                //               position: 'absolute',
                //               left: `${effectivePositions.company.x}%`,
                //               top: `${effectivePositions.company.y}%`,
                //               fontSize: `${effectiveSizes.company}px`,
                //               fontFamily: ff,
                //               color: fc,
                //               opacity: 0.8,
                //               zIndex: 5,
                //             }}
                //           >
                //             {data.company || "Company"}
                //           </div>
                //         </div>
                //       )}

                //       {/* Edit Mode - Load saved positions for editing */}
                //       {isEditLayout && (
                //         <div
                //           className="w-full aspect-[1.75/1] rounded-lg border overflow-hidden p-4 relative"
                //           style={{
                //             backgroundColor: bg ? undefined : "#f3f4f6",
                //             backgroundImage: bg ? `url(${bg})` : undefined,
                //             backgroundSize: "cover",
                //             backgroundPosition: "center",
                //             color: fc,
                //             fontFamily: ff,
                //             fontSize: `${fs}px`,
                //           }}
                //         >
                //           <div className="absolute inset-0">
                //             {/* Name - Use saved positions from config or current positions */}
                //             <div
                //               className="cursor-move select-none font-bold"
                //               style={{
                //                 position: 'absolute',
                //                 left: `${positions.name.x}%`,
                //                 top: `${positions.name.y}%`,
                //                 fontFamily: ff,
                //                 fontSize: sizes.name * previewScale,
                //                 color: fc,
                //               }}
                //               onMouseDown={(e) => onDragStart('name', e)}
                //               onTouchStart={(e) => onDragStart('name', e)}
                //             >
                //               {data.name || 'Your Name'}
                //               <span
                //                 className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                //                 style={{ right: -6, bottom: -6 }}
                //                 onMouseDown={(e) => { e.stopPropagation(); onResizeStart('name', e); }}
                //                 onTouchStart={(e) => { e.stopPropagation(); onResizeStart('name', e); }}
                //               />
                //             </div>

                //             {/* Title */}
                //             <div
                //               className="cursor-move select-none"
                //               style={{
                //                 position: 'absolute',
                //                 left: `${positions.title.x}%`,
                //                 top: `${positions.title.y}%`,
                //                 color: accent,
                //                 fontFamily: ff,
                //                 fontSize: sizes.title * previewScale
                //               }}
                //               onMouseDown={(e) => onDragStart('title', e)}
                //               onTouchStart={(e) => onDragStart('title', e)}
                //             >
                //               {data.title || 'Job Title'}
                //               <span
                //                 className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                //                 style={{ right: -6, bottom: -6 }}
                //                 onMouseDown={(e) => { e.stopPropagation(); onResizeStart('title', e); }}
                //                 onTouchStart={(e) => { e.stopPropagation(); onResizeStart('title', e); }}
                //               />
                //             </div>

                //             {/* Company */}
                //             <div
                //               className="cursor-move select-none opacity-80"
                //               style={{
                //                 position: 'absolute',
                //                 left: `${positions.company.x}%`,
                //                 top: `${positions.company.y}%`,
                //                 fontFamily: ff,
                //                 fontSize: sizes.company * previewScale
                //               }}
                //               onMouseDown={(e) => onDragStart('company', e)}
                //               onTouchStart={(e) => onDragStart('company', e)}
                //             >
                //               {data.company || 'Company'}
                //               <span
                //                 className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                //                 style={{ right: -6, bottom: -6 }}
                //                 onMouseDown={(e) => { e.stopPropagation(); onResizeStart('company', e); }}
                //                 onTouchStart={(e) => { e.stopPropagation(); onResizeStart('company', e); }}
                //               />
                //             </div>

                //             {/* Logo with saved position */}
                //             {data.logo && (
                //               <div
                //                 className="cursor-move select-none"
                //                 style={{
                //                   position: "absolute",
                //                   left: `${positions.logo.x}%`,
                //                   top: `${positions.logo.y}%`,
                //                   width: sizes.logo,
                //                   height: sizes.logo,
                //                   borderRadius: "9999px",
                //                   overflow: "hidden",
                //                   backgroundColor: "rgba(255,255,255,0.9)",
                //                 }}
                //                 onMouseDown={(e) => onDragStart("logo", e)}
                //                 onTouchStart={(e) => onDragStart("logo", e)}
                //               >
                //                 <img
                //                   src={data.logo}
                //                   alt="logo"
                //                   className="w-full h-full object-cover"
                //                   crossOrigin="anonymous"
                //                 />
                //                 <span
                //                   className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                //                   style={{ right: -6, bottom: -6 }}
                //                   onMouseDown={(e) => {
                //                     e.stopPropagation();
                //                     onResizeStart("logo", e);
                //                   }}
                //                   onTouchStart={(e) => {
                //                     e.stopPropagation();
                //                     onResizeStart("logo", e);
                //                   }}
                //                 />
                //               </div>
                //             )}
                //           </div>
                //         </div>
                //       )}
                //     </div>

                //     {/* Back Side */}
                //     <div ref={backRef} className="w-full max-w-full relative overflow-hidden">
                //       <div className="wm-screen-only" data-watermark="screen-only" />
                //       {!isEditLayout && (
                //         <div
                //           className="w-full aspect-[1.75/1] rounded-lg border overflow-hidden"
                //           style={{
                //             backgroundColor: backBg ? undefined : "#f3f4f6",
                //             backgroundImage: backBg ? `url(${backBg})` : undefined,
                //             backgroundSize: "cover",
                //             backgroundPosition: "center",
                //           }}
                //         >
                //           <div className="w-full h-full p-4 relative">
                //             {/* Back side elements with saved positions */}
                //             <div
                //               style={{
                //                 position: 'absolute',
                //                 left: `${effectivePositionsBack.email.x}%`,
                //                 top: `${effectivePositionsBack.email.y}%`,
                //                 fontSize: `${effectiveBackSizes.email}px`,
                //                 fontFamily: ff,
                //                 color: fc,
                //               }}
                //             >
                //               <strong style={{ color: accent }}>✉</strong> {data.email || 'email@example.com'}
                //             </div>

                //             <div
                //               style={{
                //                 position: 'absolute',
                //                 left: `${effectivePositionsBack.phone.x}%`,
                //                 top: `${effectivePositionsBack.phone.y}%`,
                //                 fontSize: `${effectiveBackSizes.phone}px`,
                //                 fontFamily: ff,
                //                 color: fc,
                //               }}
                //             >
                //               <strong style={{ color: accent }}>✆</strong> {data.phone || '+91 00000 00000'}
                //             </div>

                //             <div
                //               style={{
                //                 position: 'absolute',
                //                 left: `${effectivePositionsBack.website.x}%`,
                //                 top: `${effectivePositionsBack.website.y}%`,
                //                 fontSize: `${effectiveBackSizes.website}px`,
                //                 fontFamily: ff,
                //                 color: fc,
                //               }}
                //             >
                //               <strong style={{ color: accent }}>⌂</strong> {data.website || 'your-website.com'}
                //             </div>

                //             <div
                //               style={{
                //                 position: 'absolute',
                //                 left: `${effectivePositionsBack.address.x}%`,
                //                 top: `${effectivePositionsBack.address.y}%`,
                //                 fontSize: `${effectiveBackSizes.address}px`,
                //                 fontFamily: ff,
                //                 color: fc,
                //               }}
                //             >
                //               <strong style={{ color: accent }}>📍</strong> {data.address || 'Your Address, City'}
                //             </div>

                //             <div
                //               style={{
                //                 position: 'absolute',
                //                 left: `${effectivePositionsBack.qr.x}%`,
                //                 top: `${effectivePositionsBack.qr.y}%`,
                //               }}
                //             >
                //               <div style={{ background: 'rgba(255,255,255,0.9)', padding: 6, borderRadius: 8 }}>
                //                 <QRCodeSVG
                //                   value={generateVCard()}
                //                   size={effectiveBackSizes.qr}
                //                   fgColor={qrColor}
                //                   imageSettings={qrLogoUrl ? {
                //                     src: qrLogoUrl,
                //                     height: 24,
                //                     width: 24,
                //                     excavate: true,
                //                   } : undefined}
                //                 />
                //               </div>
                //             </div>
                //           </div>
                //         </div>
                //       )}

                //       {isEditLayout && (
                //         <div
                //           className="w-full aspect-[1.75/1] rounded-lg border overflow-hidden relative"
                //           style={{
                //             backgroundColor: backBg ? undefined : "#f3f4f6",
                //             backgroundImage: backBg ? `url(${backBg})` : undefined,
                //             backgroundSize: "cover",
                //             backgroundPosition: "center",
                //             color: fc,
                //             fontFamily: ff,
                //             fontSize: `${fs}px`,
                //           }}
                //         >
                //           <div className="absolute inset-0">
                //             <div
                //               className="cursor-move select-none"
                //               style={{
                //                 position: 'absolute',
                //                 left: `${positionsBack.email.x}%`,
                //                 top: `${positionsBack.email.y}%`,
                //                 fontSize: backSizes.email * previewScale
                //               }}
                //               onMouseDown={(e) => onBackDragStart('email', e)}
                //               onTouchStart={(e) => onBackDragStart('email', e)}
                //             >
                //               <strong style={{ color: accent }}>✉</strong> {data.email || 'email@example.com'}
                //               <span
                //                 className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                //                 style={{ right: -6, bottom: -6 }}
                //                 onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('email', e); }}
                //                 onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('email', e); }}
                //               />
                //             </div>

                //             <div
                //               className="cursor-move select-none"
                //               style={{
                //                 position: 'absolute',
                //                 left: `${positionsBack.phone.x}%`,
                //                 top: `${positionsBack.phone.y}%`,
                //                 fontSize: backSizes.phone * previewScale
                //               }}
                //               onMouseDown={(e) => onBackDragStart('phone', e)}
                //               onTouchStart={(e) => onBackDragStart('phone', e)}
                //             >
                //               <strong style={{ color: accent }}>✆</strong> {data.phone || '+91 00000 00000'}
                //               <span
                //                 className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                //                 style={{ right: -6, bottom: -6 }}
                //                 onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('phone', e); }}
                //                 onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('phone', e); }}
                //               />
                //             </div>

                //             <div
                //               className="cursor-move select-none"
                //               style={{
                //                 position: 'absolute',
                //                 left: `${positionsBack.website.x}%`,
                //                 top: `${positionsBack.website.y}%`,
                //                 fontSize: backSizes.website * previewScale
                //               }}
                //               onMouseDown={(e) => onBackDragStart('website', e)}
                //               onTouchStart={(e) => onBackDragStart('website', e)}
                //             >
                //               <strong style={{ color: accent }}>⌂</strong> {data.website || 'your-website.com'}
                //               <span
                //                 className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                //                 style={{ right: -6, bottom: -6 }}
                //                 onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('website', e); }}
                //                 onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('website', e); }}
                //               />
                //             </div>

                //             <div
                //               className="cursor-move select-none"
                //               style={{
                //                 position: 'absolute',
                //                 left: `${positionsBack.address.x}%`,
                //                 top: `${positionsBack.address.y}%`,
                //                 fontSize: backSizes.address * previewScale
                //               }}
                //               onMouseDown={(e) => onBackDragStart('address', e)}
                //               onTouchStart={(e) => onBackDragStart('address', e)}
                //             >
                //               <strong style={{ color: accent }}>📍</strong> {data.address || 'Your Address, City'}
                //               <span
                //                 className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                //                 style={{ right: -6, bottom: -6 }}
                //                 onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('address', e); }}
                //                 onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('address', e); }}
                //               />
                //             </div>

                //             <div
                //               className="cursor-move select-none"
                //               style={{
                //                 position: 'absolute',
                //                 left: `${positionsBack.qr.x}%`,
                //                 top: `${positionsBack.qr.y}%`
                //               }}
                //               onMouseDown={(e) => onBackDragStart('qr', e)}
                //               onTouchStart={(e) => onBackDragStart('qr', e)}
                //             >
                //               <div style={{ background: 'rgba(255,255,255,0.9)', padding: 6, borderRadius: 8 }}>
                //                 <QRCodeSVG
                //                   value={generateVCard()}
                //                   size={backSizes.qr * previewScale}
                //                   fgColor={qrColor}
                //                   imageSettings={qrLogoUrl ? {
                //                     src: qrLogoUrl,
                //                     height: 24,
                //                     width: 24,
                //                     excavate: true,
                //                   } : undefined}
                //                 />
                //               </div>
                //               <span
                //                 className="absolute w-3 h-3 bg-primary rounded-sm cursor-nwse-resize"
                //                 style={{ right: -6, bottom: -6 }}
                //                 onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('qr', e); }}
                //                 onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('qr', e); }}
                //               />
                //             </div>
                //           </div>
                //         </div>
                //       )}
                //     </div>
                //   </>
                // );
                return (
                  <>
                    {/* --- FRONT SIDE (Fixed with Scale) --- */}
                    <div
                      ref={previewContainerRef}
                      className="relative overflow-hidden mx-auto"
                      style={{
                        width: "100%",
                        height: `${320 * previewScale}px` // Dynamic Height
                      }}
                    >
                      <div
                        className="origin-top-left"
                        style={{
                          width: "560px", // Fixed logical width
                          height: "320px",
                          transform: `scale(${previewScale})`, // Scale down based on screen width
                          transformOrigin: "top left",
                        }}
                      >
                        <div ref={previewRef} className="w-full h-full relative overflow-hidden">
                          <div className="wm-screen-only" data-watermark="screen-only" />

                          {/* Card Background & Content */}
                          <div
                            className="w-full h-full rounded-lg border overflow-hidden p-4 relative"
                            style={{
                              backgroundColor: bg ? undefined : "#f3f4f6",
                              backgroundImage: bg ? `url(${bg})` : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              color: fc,
                              fontFamily: ff,
                              fontSize: `${fs}px`,
                            }}
                          >
                            {/* Logo */}
                            {data.logo && effectivePositions.logo && (
                              <div
                                style={{
                                  position: 'absolute',
                                  left: `${effectivePositions.logo.x}%`,
                                  top: `${effectivePositions.logo.y}%`,
                                  width: effectiveSizes.logo,
                                  height: effectiveSizes.logo,
                                  borderRadius: "50%",
                                  overflow: "hidden",
                                  backgroundColor: "white",
                                  border: "2px solid white",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                  zIndex: 10,
                                }}
                              >
                                <img src={data.logo} alt="Logo" className="w-full h-full object-cover" />
                              </div>
                            )}

                            {/* Name */}
                            <div
                              style={{
                                position: 'absolute',
                                left: `${effectivePositions.name.x}%`,
                                top: `${effectivePositions.name.y}%`,
                                fontSize: `${effectiveSizes.name}px`,
                                fontFamily: ff,
                                fontWeight: 'bold',
                                color: fc,
                                zIndex: 5,
                                whiteSpace: "nowrap"
                              }}
                            >
                              {data.name || "Your Name"}
                            </div>

                            {/* Title */}
                            <div
                              style={{
                                position: 'absolute',
                                left: `${effectivePositions.title.x}%`,
                                top: `${effectivePositions.title.y}%`,
                                fontSize: `${effectiveSizes.title}px`,
                                fontFamily: ff,
                                color: accent,
                                zIndex: 5,
                                whiteSpace: "nowrap"
                              }}
                            >
                              {data.title || "Job Title"}
                            </div>

                            {/* Company */}
                            <div
                              style={{
                                position: 'absolute',
                                left: `${effectivePositions.company.x}%`,
                                top: `${effectivePositions.company.y}%`,
                                fontSize: `${effectiveSizes.company}px`,
                                fontFamily: ff,
                                color: fc,
                                opacity: 0.8,
                                zIndex: 5,
                                whiteSpace: "nowrap"
                              }}
                            >
                              {data.company || "Company"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* --- BACK SIDE (Fixed with Scale) --- */}
                    <div
                      className="relative overflow-hidden mx-auto mt-4" // mt-4 for gap between cards
                      style={{
                        width: "100%",
                        height: `${320 * previewScale}px`
                      }}
                    >
                      <div
                        className="origin-top-left"
                        style={{
                          width: "560px",
                          height: "320px",
                          transform: `scale(${previewScale})`,
                          transformOrigin: "top left",
                        }}
                      >
                        <div ref={backRef} className="w-full h-full relative overflow-hidden">
                          <div className="wm-screen-only" data-watermark="screen-only" />

                          <div
                            className="w-full h-full rounded-lg border overflow-hidden relative"
                            style={{
                              backgroundColor: backBg ? undefined : "#f3f4f6",
                              backgroundImage: backBg ? `url(${backBg})` : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <div className="w-full h-full p-4 relative">
                              {/* Email */}
                              <div
                                style={{
                                  position: 'absolute',
                                  left: `${effectivePositionsBack.email.x}%`,
                                  top: `${effectivePositionsBack.email.y}%`,
                                  fontSize: `${effectiveBackSizes.email}px`,
                                  fontFamily: ff,
                                  color: fc,
                                  whiteSpace: "nowrap"
                                }}
                              >
                                <strong style={{ color: accent }}>✉</strong> {data.email || 'email@example.com'}
                              </div>

                              {/* Phone */}
                              <div
                                style={{
                                  position: 'absolute',
                                  left: `${effectivePositionsBack.phone.x}%`,
                                  top: `${effectivePositionsBack.phone.y}%`,
                                  fontSize: `${effectiveBackSizes.phone}px`,
                                  fontFamily: ff,
                                  color: fc,
                                  whiteSpace: "nowrap"
                                }}
                              >
                                <strong style={{ color: accent }}>✆</strong> {data.phone || '+91 00000 00000'}
                              </div>

                              {/* Website */}
                              <div
                                style={{
                                  position: 'absolute',
                                  left: `${effectivePositionsBack.website.x}%`,
                                  top: `${effectivePositionsBack.website.y}%`,
                                  fontSize: `${effectiveBackSizes.website}px`,
                                  fontFamily: ff,
                                  color: fc,
                                  whiteSpace: "nowrap"
                                }}
                              >
                                <strong style={{ color: accent }}>⌂</strong> {data.website || 'your-website.com'}
                              </div>

                              {/* Address */}
                              <div
                                style={{
                                  position: 'absolute',
                                  left: `${effectivePositionsBack.address.x}%`,
                                  top: `${effectivePositionsBack.address.y}%`,
                                  fontSize: `${effectiveBackSizes.address}px`,
                                  fontFamily: ff,
                                  color: fc,
                                  whiteSpace: "nowrap"
                                }}
                              >
                                <strong style={{ color: accent }}>📍</strong> {data.address || 'Your Address, City'}
                              </div>

                              {/* QR Code */}
                              <div
                                style={{
                                  position: 'absolute',
                                  left: `${effectivePositionsBack.qr.x}%`,
                                  top: `${effectivePositionsBack.qr.y}%`,
                                }}
                              >
                                <div style={{ background: 'rgba(255,255,255,0.9)', padding: 6, borderRadius: 8 }}>
                                  <QRCodeSVG
                                    value={generateVCard()}
                                    size={effectiveBackSizes.qr}
                                    fgColor={qrColor}
                                    imageSettings={qrLogoUrl ? {
                                      src: qrLogoUrl,
                                      height: 24,
                                      width: 24,
                                      excavate: true,
                                    } : undefined}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {showCustomizationPanel && (
          <div className="mt-4">
            <CustomizationPanel
              selectedFont={selectedFont}
              onFontSelect={onFontSelect ?? (() => { })}
              fontSize={fontSize}
              onFontSizeChange={onFontSizeChange ?? (() => { })}
              textColor={textColor}
              onTextColorChange={onTextColorChange ?? (() => { })}
              accentColor={accentColor}
              onAccentColorChange={onAccentColorChange ?? (() => { })}
            />
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl p-4 shadow-[var(--shadow-card)] border border-border animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          Available Templates
        </h2>
        {sbTemplates.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No templates available.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
              {pagedTemplates.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => (containerRefs.current[item.id] = el)}
                  className="relative w-full max-w-[280px] aspect-[1.75/1] mx-auto"
                  style={{ ["--cardScale" as any]: 1 }}
                >
                  <button
                    onClick={() => setSelectedTemplate(item.id)}
                    className={`group relative rounded-lg overflow-hidden transition-all duration-300 border-2 w-full h-full ${selectedTemplate === item.id
                      ? "border-primary shadow-[var(--shadow-hover)]"
                      : "border-border hover:border-primary/50 hover:shadow-[var(--shadow-card)]"
                      }`}
                  >
                    {selectedTemplate === item.id && (
                      <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className="absolute inset-0 origin-top-left pointer-events-none"
                      style={{ transform: `scale(var(--cardScale))` }}
                    >
                      <div style={{ width: 280, height: 160 }}>
                        {(() => {
                          const t = item.server;
                          const bg = t?.thumbnail_url || t?.background_url || undefined;
                          const cfg = t?.config || {};
                          const fc = cfg.fontColor || "#000";
                          const fs = cfg.fontSize || 16;
                          const accent = cfg.accentColor || "#0ea5e9";
                          const ff = cfg.fontFamily || "Inter, Arial";

                          // Get saved positions from config
                          const savedPositions = cfg.positions || {};
                          const savedSizes = cfg.sizes || {};

                          // Use saved values or defaults for thumbnail preview
                          const thumbPositions = {
                            name: savedPositions.name || defaultPositions.name,
                            title: savedPositions.title || defaultPositions.title,
                            company: savedPositions.company || defaultPositions.company,
                            logo: savedPositions.logo || defaultPositions.logo,
                          };

                          const thumbSizes = {
                            name: savedSizes.name || defaultSizes.name,
                            title: savedSizes.title || defaultSizes.title,
                            company: savedSizes.company || defaultSizes.company,
                            logo: savedSizes.logo || defaultSizes.logo,
                          };

                          // Calculate thumbnail scale factor (for smaller preview)
                          const thumbScale = 0.6; // Scale down for thumbnail

                          return (
                            <>
                              <div
                                className="w-full h-full relative pointer-events-none"
                                style={{
                                  backgroundColor: bg ? undefined : "#f3f4f6",
                                  backgroundImage: bg ? `url(${bg})` : undefined,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  color: fc,
                                  fontFamily: ff,
                                  fontSize: `${fs}px`,
                                }}
                              >
                                {/* Logo in thumbnail with saved position */}
                                {data.logo && thumbPositions.logo && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      left: `${thumbPositions.logo.x}%`,
                                      top: `${thumbPositions.logo.y}%`,
                                      width: thumbSizes.logo * thumbScale,
                                      height: thumbSizes.logo * thumbScale,
                                      borderRadius: "50%",
                                      overflow: "hidden",
                                      backgroundColor: "white",
                                      border: "2px solid white",
                                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                      zIndex: 10,
                                    }}
                                  >
                                    <img
                                      src={data.logo}
                                      alt="Logo"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}

                                {/* Name in thumbnail with saved position */}
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: `${thumbPositions.name.x}%`,
                                    top: `${thumbPositions.name.y}%`,
                                    fontSize: `${thumbSizes.name * thumbScale}px`,
                                    fontFamily: ff,
                                    fontWeight: 'bold',
                                    color: fc,
                                    zIndex: 5,
                                  }}
                                >
                                  {data.name || "Your Name"}
                                </div>

                                {/* Title in thumbnail with saved position */}
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: `${thumbPositions.title.x}%`,
                                    top: `${thumbPositions.title.y}%`,
                                    fontSize: `${thumbSizes.title * thumbScale}px`,
                                    fontFamily: ff,
                                    color: accent,
                                    zIndex: 5,
                                  }}
                                >
                                  {data.title || "Job Title"}
                                </div>

                                {/* Company in thumbnail with saved position */}
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: `${thumbPositions.company.x}%`,
                                    top: `${thumbPositions.company.y}%`,
                                    fontSize: `${thumbSizes.company * thumbScale}px`,
                                    fontFamily: ff,
                                    color: fc,
                                    opacity: 0.8,
                                    zIndex: 5,
                                  }}
                                >
                                  {data.company || "Company"}
                                </div>
                              </div>

                              {/* Template name overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                <p className="text-white font-medium text-sm truncate">
                                  {item.server?.name || "Template"}
                                </p>
                                {item.server?.price && (
                                  <p className="text-white/90 text-xs">
                                    ₹{item.server.price.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {sbTemplates.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Prev
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {page + 1} of {Math.ceil(sbTemplates.length / pageSize)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((p) => Math.min(Math.ceil(sbTemplates.length / pageSize) - 1, p + 1))
                  }
                  disabled={page >= Math.ceil(sbTemplates.length / pageSize) - 1}
                >
                  Next
                </Button>
              </div>
            )}
            {/* Success Modal */}
            <Dialog open={showCartSuccess} onOpenChange={setShowCartSuccess}>
              <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Success!</h3>
                  <p className="text-gray-600">Item added to cart successfully!</p>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};


const createFallbackImage = (text: string, width = 560, height = 320): string => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add border
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // Add text
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, width / 2, height / 2 - 20);

    ctx.font = '14px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Image Preview', width / 2, height / 2 + 10);

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Error creating fallback image:', error);
    return '';
  }
};



function uploadImageToCloudinary(frontBase64: string): string | PromiseLike<string> {
  throw new Error("Function not implemented.");
}
import { FormEvent, useState, useRef, useEffect } from "react";
import { createTemplate, uploadTemplateAsset } from "@/services/templates";
import { useNavigate } from "react-router-dom";
import { BusinessCardForm, type BusinessCardData } from "@/components/BusinessCardForm";
import { BackSideCard } from "@/components/templates/BackSideCard";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Move, Expand } from "lucide-react";

type FrontKey = 'name' | 'title' | 'company' | 'logo';
type BackKey = 'email' | 'phone' | 'website' | 'address' | 'qr';

const NewTemplate = () => {
  const navigate = useNavigate();

  // UI State
  const [activeTab, setActiveTab] = useState("general");
  const [showBack, setShowBack] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditLayout, setIsEditLayout] = useState(false);

  // Template Config State
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState<string>("2.99");

  // Design State
  const [fontColor, setFontColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);
  const [accentColor, setAccentColor] = useState("#0ea5e9");
  const [fontFamily, setFontFamily] = useState<string>("Inter, Arial, sans-serif");

  // QR Code State
  const [qrColor, setQrColor] = useState("#000000");
  const [qrLogoUrl, setQrLogoUrl] = useState("");

  // Assets State (Dual: File OR URL)
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgUrlInput, setBgUrlInput] = useState("");

  const [backBgFile, setBackBgFile] = useState<File | null>(null);
  const [backBgUrlInput, setBackBgUrlInput] = useState("");

  const [thumbFile, setThumbFile] = useState<File | null>(null);

  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");

  // Preview Data
  const [previewData, setPreviewData] = useState<BusinessCardData>({
    name: "Alex Morgan",
    title: "Product Designer",
    company: "Creative Studio",
    email: "alex@studio.com",
    phone: "+1 555 000 1234",
    website: "www.alex.design",
    address: "123 Design Ave, NY",
    logo: "",
  });

  // DRAG & DROP STATE FOR FRONT
  const [positions, setPositions] = useState<{
    name: { x: number; y: number };
    title: { x: number; y: number };
    company: { x: number; y: number };
    logo: { x: number; y: number };
  }>({
    name: { x: 70, y: 30 },
    title: { x: 70, y: 42 },
    company: { x: 70, y: 52 },
    logo: { x: 18, y: 50 },
  });

  const [sizes, setSizes] = useState<{
    name: number;
    title: number;
    company: number;
    logo: number;
  }>({ name: 22, title: 18, company: 14, logo: 64 });

  // DRAG & DROP STATE FOR BACK
  const [positionsBack, setPositionsBack] = useState<{
    email: { x: number; y: number };
    phone: { x: number; y: number };
    website: { x: number; y: number };
    address: { x: number; y: number };
    qr: { x: number; y: number };
  }>({
    email: { x: 15, y: 20 },
    phone: { x: 15, y: 32 },
    website: { x: 15, y: 44 },
    address: { x: 15, y: 56 },
    qr: { x: 75, y: 35 }
  });

  const [backSizes, setBackSizes] = useState<{
    email: number;
    phone: number;
    website: number;
    address: number;
    qr: number;
  }>({ email: 15, phone: 15, website: 15, address: 15, qr: 72 });

  // Refs for drag & drop
  const previewRef = useRef<HTMLDivElement>(null);
  const backPreviewRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ key: FrontKey | BackKey | null; offsetX: number; offsetY: number }>({ key: null, offsetX: 0, offsetY: 0 });
  const resizeState = useRef<{ key: FrontKey | BackKey | null; baseSize: number; startY: number }>({ key: null, baseSize: 0, startY: 0 });

  // Handle logo upload
  useEffect(() => {
    if (logoFile) {
      const url = URL.createObjectURL(logoFile);
      setLogoUrl(url);
      setPreviewData(prev => ({ ...prev, logo: url }));
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [logoFile]);

  // DRAG & DROP FUNCTIONS FOR FRONT
  const onDragStart = (key: FrontKey, e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditLayout || !previewRef.current) return;
    e.preventDefault();
    const rect = previewRef.current.getBoundingClientRect();
    const pointX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pointY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragState.current = { 
      key, 
      offsetX: pointX - rect.left - (rect.width * positions[key].x / 100), 
      offsetY: pointY - rect.top - (rect.height * positions[key].y / 100) 
    };
    
    document.addEventListener('mousemove', onDragMove as any);
    document.addEventListener('touchmove', onDragMove as any, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);
  };

  const onDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isEditLayout || !previewRef.current || !dragState.current.key) return;
    e.preventDefault();
    const rect = previewRef.current.getBoundingClientRect();
    const pointX = e instanceof TouchEvent ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
    const pointY = e instanceof TouchEvent ? e.touches[0]?.clientY : (e as MouseEvent).clientY;
    
    if (!pointX || !pointY) return;
    
    const xPx = Math.min(Math.max(pointX - rect.left - dragState.current.offsetX, 0), rect.width);
    const yPx = Math.min(Math.max(pointY - rect.top - dragState.current.offsetY, 0), rect.height);
    const x = (xPx / rect.width) * 100;
    const y = (yPx / rect.height) * 100;
    
    const k = dragState.current.key as FrontKey;
    setPositions((p) => ({ ...p, [k]: { x, y } }));
  };

  const onDragEnd = () => {
    dragState.current = { key: null, offsetX: 0, offsetY: 0 };
    document.removeEventListener('mousemove', onDragMove as any);
    document.removeEventListener('touchmove', onDragMove as any);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchend', onDragEnd);
  };

  // RESIZE FUNCTIONS FOR FRONT
  const onResizeStart = (key: FrontKey, e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditLayout) return;
    e.preventDefault();
    e.stopPropagation();
    const startY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const baseSize = sizes[key];
    resizeState.current = { key, baseSize, startY };
    
    document.addEventListener('mousemove', onResizeMove as any);
    document.addEventListener('touchmove', onResizeMove as any, { passive: false });
    document.addEventListener('mouseup', onResizeEnd);
    document.addEventListener('touchend', onResizeEnd);
  };

  const onResizeMove = (e: MouseEvent | TouchEvent) => {
    if (!isEditLayout || !resizeState.current.key) return;
    e.preventDefault();
    const curY = e instanceof TouchEvent ? e.touches[0]?.clientY : (e as MouseEvent).clientY;
    if (!curY) return;
    
    const delta = curY - resizeState.current.startY;
    const k = resizeState.current.key as FrontKey;
    const newSize = Math.max(24, Math.min(200, Math.round(resizeState.current.baseSize + delta * 0.5)));
    setSizes((s) => ({ ...s, [k]: newSize }));
  };

  const onResizeEnd = () => {
    resizeState.current = { key: null, baseSize: 0, startY: 0 };
    document.removeEventListener('mousemove', onResizeMove as any);
    document.removeEventListener('touchmove', onResizeMove as any);
    document.removeEventListener('mouseup', onResizeEnd);
    document.removeEventListener('touchend', onResizeEnd);
  };

  // BACK SIDE DRAG & DROP FUNCTIONS
  const onBackDragStart = (key: BackKey, e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditLayout || !backPreviewRef.current) return;
    e.preventDefault();
    const rect = backPreviewRef.current.getBoundingClientRect();
    const pointX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pointY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragState.current = { 
      key, 
      offsetX: pointX - rect.left - (rect.width * positionsBack[key].x / 100), 
      offsetY: pointY - rect.top - (rect.height * positionsBack[key].y / 100) 
    };
    
    document.addEventListener('mousemove', onBackDragMove as any);
    document.addEventListener('touchmove', onBackDragMove as any, { passive: false });
    document.addEventListener('mouseup', onBackDragEnd);
    document.addEventListener('touchend', onBackDragEnd);
  };

  const onBackDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isEditLayout || !backPreviewRef.current || !dragState.current.key) return;
    e.preventDefault();
    const rect = backPreviewRef.current.getBoundingClientRect();
    const pointX = e instanceof TouchEvent ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
    const pointY = e instanceof TouchEvent ? e.touches[0]?.clientY : (e as MouseEvent).clientY;
    
    if (!pointX || !pointY) return;
    
    const xPx = Math.min(Math.max(pointX - rect.left - dragState.current.offsetX, 0), rect.width);
    const yPx = Math.min(Math.max(pointY - rect.top - dragState.current.offsetY, 0), rect.height);
    const x = (xPx / rect.width) * 100;
    const y = (yPx / rect.height) * 100;
    
    const k = dragState.current.key as BackKey;
    setPositionsBack((p) => ({ ...p, [k]: { x, y } }));
  };

  const onBackDragEnd = () => {
    dragState.current = { key: null, offsetX: 0, offsetY: 0 };
    document.removeEventListener('mousemove', onBackDragMove as any);
    document.removeEventListener('touchmove', onBackDragMove as any);
    document.removeEventListener('mouseup', onBackDragEnd);
    document.removeEventListener('touchend', onBackDragEnd);
  };

  // BACK SIDE RESIZE FUNCTIONS
  const onBackResizeStart = (key: BackKey, e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditLayout) return;
    e.preventDefault();
    e.stopPropagation();
    const startY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const baseSize = backSizes[key];
    resizeState.current = { key, baseSize, startY };
    
    document.addEventListener('mousemove', onBackResizeMove as any);
    document.addEventListener('touchmove', onBackResizeMove as any, { passive: false });
    document.addEventListener('mouseup', onBackResizeEnd);
    document.addEventListener('touchend', onBackResizeEnd);
  };

  const onBackResizeMove = (e: MouseEvent | TouchEvent) => {
    if (!isEditLayout || !resizeState.current.key) return;
    e.preventDefault();
    const curY = e instanceof TouchEvent ? e.touches[0]?.clientY : (e as MouseEvent).clientY;
    if (!curY) return;
    
    const delta = curY - resizeState.current.startY;
    const k = resizeState.current.key as BackKey;
    const clampMax = k === 'qr' ? 140 : 64;
    const clampMin = k === 'qr' ? 40 : 8;
    const newSize = Math.max(clampMin, Math.min(clampMax, Math.round(resizeState.current.baseSize + delta * 0.2)));
    setBackSizes((s) => ({ ...s, [k]: newSize }));
  };

  const onBackResizeEnd = () => {
    resizeState.current = { key: null, baseSize: 0, startY: 0 };
    document.removeEventListener('mousemove', onBackResizeMove as any);
    document.removeEventListener('touchmove', onBackResizeMove as any);
    document.removeEventListener('mouseup', onBackResizeEnd);
    document.removeEventListener('touchend', onBackResizeEnd);
  };

  // Reset positions to default
  const resetPositions = () => {
    setPositions({
      name: { x: 70, y: 30 },
      title: { x: 70, y: 42 },
      company: { x: 70, y: 52 },
      logo: { x: 18, y: 50 },
    });
    setSizes({ name: 22, title: 18, company: 14, logo: 64 });
    setPositionsBack({
      email: { x: 15, y: 20 },
      phone: { x: 15, y: 32 },
      website: { x: 15, y: 44 },
      address: { x: 15, y: 56 },
      qr: { x: 75, y: 35 }
    });
    setBackSizes({ email: 15, phone: 15, website: 15, address: 15, qr: 72 });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let background_url: string | null = bgUrlInput || null;
      let back_background_url: string | null = backBgUrlInput || null;
      let thumbnail_url: string | null = null;
      let template_logo_url: string | null = logoUrl || null;

      const ts = Date.now();

      if (bgFile) {
        background_url = await uploadTemplateAsset(
          bgFile,
          `backgrounds/${ts}-${bgFile.name}`,
        );
      }
      if (backBgFile) {
        back_background_url = await uploadTemplateAsset(
          backBgFile,
          `backgrounds/${ts}-back-${backBgFile.name}`,
        );
      }
      if (thumbFile) {
        thumbnail_url = await uploadTemplateAsset(
          thumbFile,
          `thumbnails/${ts}-${thumbFile.name}`,
        );
      }

      // IMPORTANT: Save positions and sizes in config
      const config = {
        fontColor,
        fontSize,
        accentColor,
        fontFamily,
        premium: isPremium,
        price,
        qrColor,
        qrLogoUrl,
        // Save layout positions and sizes
        positions,
        sizes,
        positionsBack,
        backSizes
      };

      const numericPrice =
        parseFloat(price.replace(/[^0-9.]/g, "")) || 2.99;

      const created = await createTemplate({
        name,
        status,
        config,
        background_url,
        back_background_url,
        thumbnail_url,
        price: numericPrice,
      });

      // Naya template banne ke baad uske edit page pe bhejo
      navigate(`/admin/templates/${created.id}/edit`, { replace: true });
    } catch (e: any) {
      setError(e.message ?? "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const getPreviewBg = () => {
    if (showBack) {
      return backBgFile
        ? URL.createObjectURL(backBgFile)
        : backBgUrlInput || null;
    }
    return bgFile ? URL.createObjectURL(bgFile) : bgUrlInput || null;
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (bgFile) {
        URL.revokeObjectURL(URL.createObjectURL(bgFile));
      }
      if (backBgFile) {
        URL.revokeObjectURL(URL.createObjectURL(backBgFile));
      }
      if (logoFile) {
        URL.revokeObjectURL(URL.createObjectURL(logoFile));
      }
    };
  }, [bgFile, backBgFile, logoFile]);

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            New Template
          </h1>
          <p className="text-sm text-gray-500">
            Create a new business card template.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="hidden sm:inline-flex"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="min-w-[100px]"
          >
            {saving ? "Creating..." : "Create Template"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: Sticky Preview Area (Span 5) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between bg-white p-2 rounded-lg border shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-2">Live Preview</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBack((v) => !v)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Switch to {showBack ? "Front" : "Back"} View
                </Button>
                <Button
                  type="button"
                  variant={isEditLayout ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditLayout(!isEditLayout)}
                  className="flex items-center gap-1"
                >
                  <Move className="w-3 h-3" />
                  {isEditLayout ? "Exit Edit Mode" : "Edit Layout"}
                </Button>
                {isEditLayout && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetPositions}
                    className="text-xs"
                  >
                    Reset 
                  </Button>
                )}
              </div>
            </div>

            {/* The Card Render */}
            <div
              ref={showBack ? backPreviewRef : previewRef}
              className="w-full aspect-[1.75/1] rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-500 relative"
              style={{
                backgroundColor: getPreviewBg() ? undefined : "#ffffff",
                backgroundImage: getPreviewBg() ? `url(${getPreviewBg()})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: isEditLayout ? 'default' : 'pointer'
              }}
            >
              <div className="w-full h-full">
                {showBack ? (
                  // BACK SIDE RENDER
                  !isEditLayout ? (
                    <BackSideCard
                      data={previewData}
                      textColor={fontColor}
                      accentColor={accentColor}
                      fontFamily={fontFamily}
                      fontSize={fontSize}
                      showLargeQR={true}
                      transparentBg={true}
                      qrColor={qrColor}
                      qrLogoUrl={qrLogoUrl}
                    />
                  ) : (
                    <div className="w-full h-full relative">
                      {/* Edit Mode Back Side */}
                      <div
                        className="cursor-move select-none absolute"
                        style={{ 
                          left: `${positionsBack.email.x}%`, 
                          top: `${positionsBack.email.y}%`,
                          fontSize: backSizes.email,
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onBackDragStart('email', e)}
                        onTouchStart={(e) => onBackDragStart('email', e)}
                      >
                        <strong style={{ color: accentColor }}>✉</strong> {previewData.email}
                        {isEditLayout && (
                          <span
                            className="absolute w-3 h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -6, bottom: -6 }}
                            onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('email', e); }}
                            onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('email', e); }}
                          />
                        )}
                      </div>

                      <div
                        className="cursor-move select-none absolute"
                        style={{ 
                          left: `${positionsBack.phone.x}%`, 
                          top: `${positionsBack.phone.y}%`,
                          fontSize: backSizes.phone,
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onBackDragStart('phone', e)}
                        onTouchStart={(e) => onBackDragStart('phone', e)}
                      >
                        <strong style={{ color: accentColor }}>✆</strong> {previewData.phone}
                        {isEditLayout && (
                          <span
                            className="absolute w-3 h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -6, bottom: -6 }}
                            onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('phone', e); }}
                            onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('phone', e); }}
                          />
                        )}
                      </div>

                      <div
                        className="cursor-move select-none absolute"
                        style={{ 
                          left: `${positionsBack.website.x}%`, 
                          top: `${positionsBack.website.y}%`,
                          fontSize: backSizes.website,
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onBackDragStart('website', e)}
                        onTouchStart={(e) => onBackDragStart('website', e)}
                      >
                        <strong style={{ color: accentColor }}>⌂</strong> {previewData.website}
                        {isEditLayout && (
                          <span
                            className="absolute w-3 h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -6, bottom: -6 }}
                            onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('website', e); }}
                            onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('website', e); }}
                          />
                        )}
                      </div>

                      <div
                        className="cursor-move select-none absolute"
                        style={{ 
                          left: `${positionsBack.address.x}%`, 
                          top: `${positionsBack.address.y}%`,
                          fontSize: backSizes.address,
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onBackDragStart('address', e)}
                        onTouchStart={(e) => onBackDragStart('address', e)}
                      >
                        <strong style={{ color: accentColor }}>📍</strong> {previewData.address}
                        {isEditLayout && (
                          <span
                            className="absolute w-3 h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -6, bottom: -6 }}
                            onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('address', e); }}
                            onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('address', e); }}
                          />
                        )}
                      </div>

                      <div
                        className="cursor-move select-none absolute"
                        style={{ 
                          left: `${positionsBack.qr.x}%`, 
                          top: `${positionsBack.qr.y}%` 
                        }}
                        onMouseDown={(e) => onBackDragStart('qr', e)}
                        onTouchStart={(e) => onBackDragStart('qr', e)}
                      >
                        <div style={{ background: 'rgba(255,255,255,0.9)', padding: 6, borderRadius: 8 }}>
                          <QRCodeSVG 
                            value={`BEGIN:VCARD\nFN:${previewData.name}\nTITLE:${previewData.title}\nORG:${previewData.company}\nEMAIL:${previewData.email}\nTEL:${previewData.phone}\nURL:${previewData.website}\nADR:${previewData.address}\nEND:VCARD`} 
                            size={backSizes.qr} 
                            fgColor={qrColor}
                            imageSettings={qrLogoUrl ? {
                              src: qrLogoUrl,
                              height: 24,
                              width: 24,
                              excavate: true,
                            } : undefined}
                          />
                        </div>
                        {isEditLayout && (
                          <span
                            className="absolute w-3 h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -6, bottom: -6 }}
                            onMouseDown={(e) => { e.stopPropagation(); onBackResizeStart('qr', e); }}
                            onTouchStart={(e) => { e.stopPropagation(); onBackResizeStart('qr', e); }}
                          />
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  // FRONT SIDE RENDER
                  !isEditLayout ? (
                    <div className="w-full h-full flex items-center justify-end p-8">
                      <div className="flex flex-col text-right z-10">
                        <h3
                          className="font-bold leading-tight mb-1"
                          style={{
                            color: fontColor,
                            fontFamily,
                            fontSize: fontSize + 8,
                          }}
                        >
                          {previewData.name}
                        </h3>

                        <p
                          className="font-medium mb-2"
                          style={{
                            color: accentColor,
                            fontFamily,
                            fontSize: fontSize + 4,
                          }}
                        >
                          {previewData.title}
                        </p>

                        <p
                          className="opacity-75"
                          style={{
                            color: fontColor,
                            fontFamily,
                            fontSize: fontSize,
                          }}
                        >
                          {previewData.company}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      {/* Edit Mode Front Side */}
                      <div
                        className="cursor-move select-none font-bold absolute"
                        style={{ 
                          left: `${positions.name.x}%`, 
                          top: `${positions.name.y}%`,
                          fontSize: sizes.name,
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onDragStart('name', e)}
                        onTouchStart={(e) => onDragStart('name', e)}
                      >
                        {previewData.name}
                        {isEditLayout && (
                          <span
                            className="absolute w-3 h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -6, bottom: -6 }}
                            onMouseDown={(e) => { e.stopPropagation(); onResizeStart('name', e); }}
                            onTouchStart={(e) => { e.stopPropagation(); onResizeStart('name', e); }}
                          />
                        )}
                      </div>

                      <div
                        className="cursor-move select-none absolute"
                        style={{ 
                          left: `${positions.title.x}%`, 
                          top: `${positions.title.y}%`,
                          fontSize: sizes.title,
                          color: accentColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onDragStart('title', e)}
                        onTouchStart={(e) => onDragStart('title', e)}
                      >
                        {previewData.title}
                        {isEditLayout && (
                          <span
                            className="absolute w-3 h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -6, bottom: -6 }}
                            onMouseDown={(e) => { e.stopPropagation(); onResizeStart('title', e); }}
                            onTouchStart={(e) => { e.stopPropagation(); onResizeStart('title', e); }}
                          />
                        )}
                      </div>

                      <div
                        className="cursor-move select-none opacity-80 absolute"
                        style={{ 
                          left: `${positions.company.x}%`, 
                          top: `${positions.company.y}%`,
                          fontSize: sizes.company,
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onDragStart('company', e)}
                        onTouchStart={(e) => onDragStart('company', e)}
                      >
                        {previewData.company}
                        {isEditLayout && (
                          <span
                            className="absolute w-3 h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -6, bottom: -6 }}
                            onMouseDown={(e) => { e.stopPropagation(); onResizeStart('company', e); }}
                            onTouchStart={(e) => { e.stopPropagation(); onResizeStart('company', e); }}
                          />
                        )}
                      </div>

                      {/* Logo (if exists) */}
                      {previewData.logo && (
                        <div
                          className="cursor-move select-none absolute bg-white rounded-full overflow-hidden shadow-lg border-2 border-white"
                          style={{
                            left: `${positions.logo.x}%`,
                            top: `${positions.logo.y}%`,
                            width: sizes.logo,
                            height: sizes.logo,
                            transform: 'translate(-50%, -50%)', // Center the logo on its position
                          }}
                          onMouseDown={(e) => onDragStart("logo", e)}
                          onTouchStart={(e) => onDragStart("logo", e)}
                        >
                          <img
                            src={previewData.logo}
                            alt="logo"
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                          
                          {/* Resize Handle - Now positioned correctly */}
                          {isEditLayout && (
                            <div className="absolute -bottom-2 -right-2">
                              <div
                                className="w-5 h-5 bg-blue-500 rounded-full cursor-nwse-resize flex items-center justify-center border-2 border-white shadow-md"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onResizeStart("logo", e);
                                }}
                                onTouchStart={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onResizeStart("logo", e);
                                }}
                              >
                                <Expand className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}
                          
                          {/* Drag Indicator */}
                          {isEditLayout && (
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Edit Mode Indicator */}
              {isEditLayout && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Edit Mode - Drag to move, resize handles at bottom-right
                </div>
              )}
            </div>

            {/* Layout Info Panel */}
            {isEditLayout && (
              <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800 border border-yellow-100">
                <p><strong>Layout Editing Active:</strong></p>
                <ul className="mt-1 list-disc pl-5 space-y-1">
                  <li>Drag any element to reposition</li>
                  <li>Use the blue handles at bottom-right to resize</li>
                  <li>Switch between Front/Back views</li>
                  <li>Click "Reset Positions" to restore defaults</li>
                  <li>Positions will be saved when you create template</li>
                </ul>
              </div>
            )}

            {/* Logo Upload Section */}
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <label className="text-sm font-medium block mb-2">Preview Logo</label>
              <p className="text-xs text-gray-500 mb-3">Upload a logo for preview (not saved to template)</p>
              <div className="flex gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  className="flex-1 text-sm"
                />
                {previewData.logo && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoUrl("");
                      setPreviewData(prev => ({ ...prev, logo: "" }));
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {/* Helper Tip */}
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
              <p><strong>Tip:</strong> Fill in the details on the right. Your preview will update live!</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Form Controls (Span 7) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Custom Tab Navigation */}
            <div className="flex border-b bg-gray-50/50">
              {['general', 'design', 'qr', 'content', 'layout'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab
                    ? "border-b-2 border-black text-black bg-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {tab === 'qr' ? 'QR Code' : tab}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-6">
              {/* GENERAL TAB */}
              {activeTab === 'general' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Template Name</label>
                      <input className="w-full border rounded-md px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select className="w-full border rounded-md px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="prem"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={isPremium}
                        onChange={(e) => setIsPremium(e.target.checked)}
                      />
                      <label
                        htmlFor="prem"
                        className="text-sm font-medium"
                      >
                        Premium Template
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Price String
                      </label>
                      <input
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="2.99"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t">
                    <label className="text-sm font-medium">
                      Thumbnail Image (Required)
                    </label>
                    <input
                      type="file"
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      accept="image/*"
                      onChange={(e) =>
                        setThumbFile(e.target.files?.[0] ?? null)
                      }
                    />
                  </div>
                </div>
              )}

              {/* DESIGN TAB */}
              {activeTab === 'design' && (
                <div className="space-y-6">
                  {/* Backgrounds Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900">Backgrounds</h3>

                    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <label className="text-sm font-medium block">Front Background</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Paste Image URL (e.g., https://...)"
                          className="flex-1 border rounded-md px-3 py-2 text-sm"
                          value={bgUrlInput}
                          onChange={(e) => setBgUrlInput(e.target.value)}
                        />
                        <span className="text-xs self-center text-gray-400">OR</span>
                        <input type="file" className="w-1/3 text-xs" accept="image/*" onChange={(e) => setBgFile(e.target.files?.[0] ?? null)} />
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <label className="text-sm font-medium block">Back Background</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Paste Image URL (e.g., https://...)"
                          className="flex-1 border rounded-md px-3 py-2 text-sm"
                          value={backBgUrlInput}
                          onChange={(e) => setBackBgUrlInput(e.target.value)}
                        />
                        <span className="text-xs self-center text-gray-400">OR</span>
                        <input type="file" className="w-1/3 text-xs" accept="image/*" onChange={(e) => setBackBgFile(e.target.files?.[0] ?? null)} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t my-4"></div>

                  {/* Typography Section */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Primary Text Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" className="h-9 w-9 rounded cursor-pointer border-none" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
                        <span className="text-xs font-mono text-gray-500">{fontColor}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" className="h-9 w-9 rounded cursor-pointer border-none" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
                        <span className="text-xs font-mono text-gray-500">{accentColor}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Base Font Size (px)</label>
                      <input type="number" className="w-full border rounded-md px-3 py-2 text-sm" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Font Family</label>
                      <select className="w-full border rounded-md px-3 py-2 text-sm" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                        <option value="Inter, Arial, sans-serif">Inter (Clean)</option>
                        <option value="Playfair Display, serif">Playfair (Elegant)</option>
                        <option value="Georgia, serif">Georgia (Classic)</option>
                        <option value="Courier New, monospace">Courier (Retro)</option>
                        <option value="Roboto, sans-serif">Roboto (Modern)</option>
                        <option value="Poppins, sans-serif">Poppins (Rounded Modern)</option>
                        <option value="Montserrat, sans-serif">Montserrat (Professional)</option>
                        <option value="Lato, sans-serif">Lato (Smooth)</option>
                        <option value="Nunito, sans-serif">Nunito (Soft Rounded)</option>
                        <option value="Open Sans, sans-serif">Open Sans (Clean)</option>
                        <option value="Source Sans Pro, sans-serif">Source Sans (Neutral)</option>
                        <option value="Ubuntu, sans-serif">Ubuntu (Tech Style)</option>
                        <option value="Pacifico, cursive">Pacifico (Handwritten)</option>
                        <option value="Dancing Script, cursive">Dancing Script (Signature)</option>
                        <option value="Great Vibes, cursive">Great Vibes (Elegant Script)</option>
                        <option value="Rubik, sans-serif">Rubik (Rounded Stylish)</option>
                        <option value="Josefin Sans, sans-serif">Josefin Sans (Minimal Stylish)</option>
                        <option value="Raleway, sans-serif">Raleway (Thin Modern)</option>
                        <option value="Merriweather, serif">Merriweather (Elegant Serif)</option>
                        <option value="Times New Roman, serif">Times New Roman (Formal Classic)</option>
                        <option value="Garamond, serif">Garamond (Premium Traditional)</option>
                        <option value="Cormorant Garamond, serif">Cormorant Garamond (Luxury Serif)</option>
                        <option value="Bodoni Moda, serif">Bodoni Moda (High Fashion)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* QR CODE TAB */}
              {activeTab === 'qr' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 mb-4">
                    Customize how the VCard QR looks on the back of the card.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">QR Foreground Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" className="h-10 w-14 p-1 bg-white border rounded" value={qrColor} onChange={(e) => setQrColor(e.target.value)} />
                        <div className="text-xs text-gray-500">Usually Black or Dark Blue</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Center Logo URL</label>
                      <input
                        type="text"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        placeholder="https://... (Logo Icon)"
                        value={qrLogoUrl}
                        onChange={(e) => setQrLogoUrl(e.target.value)}
                      />
                      <p className="text-xs text-gray-400">Paste a URL to a small, square logo (PNG/SVG) to appear in the center.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENT TAB */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-2">This data is only for previewing the design.</p>
                  <BusinessCardForm data={previewData} onChange={setPreviewData} />
                </div>
              )}

              {/* LAYOUT TAB - New Tab for Layout Settings */}
              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-lg text-sm text-green-700 mb-4">
                    <strong>Layout Settings:</strong> These positions will be saved with your template and used when customers select this template.
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Front Side Layout Controls */}
                    <div className="space-y-4 border p-4 rounded-lg">
                      <h4 className="font-medium text-sm">Front Side Layout</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Name Position</span>
                          <div className="text-xs text-gray-500">
                            X: {positions.name.x.toFixed(1)}% Y: {positions.name.y.toFixed(1)}%
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={positions.name.x}
                            onChange={(e) => setPositions(p => ({...p, name: {...p.name, x: parseFloat(e.target.value)}}))}
                            className="w-full"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={positions.name.y}
                            onChange={(e) => setPositions(p => ({...p, name: {...p.name, y: parseFloat(e.target.value)}}))}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Name Size</span>
                          <span className="text-xs text-gray-500">{sizes.name}px</span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="64"
                          value={sizes.name}
                          onChange={(e) => setSizes(s => ({...s, name: parseInt(e.target.value)}))}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Logo Size</span>
                          <span className="text-xs text-gray-500">{sizes.logo}px</span>
                        </div>
                        <input
                          type="range"
                          min="24"
                          max="200"
                          value={sizes.logo}
                          onChange={(e) => setSizes(s => ({...s, logo: parseInt(e.target.value)}))}
                          className="w-full"
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPositions({
                              name: { x: 70, y: 30 },
                              title: { x: 70, y: 42 },
                              company: { x: 70, y: 52 },
                              logo: { x: 18, y: 50 },
                            });
                            setSizes({ name: 22, title: 18, company: 14, logo: 64 });
                          }}
                          className="w-full"
                        >
                          Reset 
                        </Button>
                      </div>
                    </div>

                    {/* Back Side Layout Controls */}
                    <div className="space-y-4 border p-4 rounded-lg">
                      <h4 className="font-medium text-sm">Back Side Layout</h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">QR Position</span>
                          <div className="text-xs text-gray-500">
                            X: {positionsBack.qr.x.toFixed(1)}% Y: {positionsBack.qr.y.toFixed(1)}%
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={positionsBack.qr.x}
                            onChange={(e) => setPositionsBack(p => ({...p, qr: {...p.qr, x: parseFloat(e.target.value)}}))}
                            className="w-full"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={positionsBack.qr.y}
                            onChange={(e) => setPositionsBack(p => ({...p, qr: {...p.qr, y: parseFloat(e.target.value)}}))}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">QR Size</span>
                          <span className="text-xs text-gray-500">{backSizes.qr}px</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="140"
                          value={backSizes.qr}
                          onChange={(e) => setBackSizes(s => ({...s, qr: parseInt(e.target.value)}))}
                          className="w-full"
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPositionsBack({
                              email: { x: 15, y: 20 },
                              phone: { x: 15, y: 32 },
                              website: { x: 15, y: 44 },
                              address: { x: 15, y: 56 },
                              qr: { x: 75, y: 35 }
                            });
                            setBackSizes({ email: 15, phone: 15, website: 15, address: 15, qr: 72 });
                          }}
                          className="w-full"
                        >
                          Reset 
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          <strong>Pro Tip:</strong> Use "Edit Layout" button on preview to drag & drop elements visually.
                          Or use the sliders above for precise control.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditLayout(!isEditLayout)}
                        className="flex items-center gap-2"
                      >
                        <Move className="w-4 h-4" />
                        {isEditLayout ? "Exit Visual Edit" : "Enter Visual Edit Mode"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NewTemplate;
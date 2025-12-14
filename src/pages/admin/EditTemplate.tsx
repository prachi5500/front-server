import { FormEvent, useEffect, useRef, useState } from "react";
import {
  getTemplate,
  updateTemplate,
  uploadTemplateAsset,
  Template,
} from "@/services/templates";
import { useNavigate, useParams } from "react-router-dom";
import {
  BusinessCardForm,
  type BusinessCardData,
} from "@/components/BusinessCardForm";
import { BackSideCard } from "@/components/templates/BackSideCard";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Move } from "lucide-react";

type FrontKey = 'name' | 'title' | 'company' | 'logo';
type BackKey = 'email' | 'phone' | 'website' | 'address' | 'qr';

const EditTemplate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Core Data
  const [item, setItem] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [activeTab, setActiveTab] = useState("general");
  const [showBack, setShowBack] = useState(false);
  const [isEditLayout, setIsEditLayout] = useState(false);

  // Template Config State
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
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

  // DRAG & DROP STATE FOR FRONT (Load from config or use defaults)
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

  // DRAG & DROP STATE FOR BACK (Load from config or use defaults)
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

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const t = await getTemplate(id);
        if (!t) throw new Error("Not found");
        setItem(t);
        setName(t.name);
        setStatus(t.status);

        // Load Config
        const cfg = (t.config || {}) as any;
        setFontColor(cfg.fontColor ?? "#000000");
        setFontSize(cfg.fontSize ?? 16);
        setAccentColor(cfg.accentColor ?? "#0ea5e9");
        setFontFamily(cfg.fontFamily ?? "Inter, Arial, sans-serif");
        setIsPremium(!!cfg.premium);
        setPrice(cfg.price ?? "2.99");

        // Load QR Config
        setQrColor(cfg.qrColor ?? "#000000");
        setQrLogoUrl(cfg.qrLogoUrl ?? "");

        // Load positions from config if they exist
        if (cfg.positions) {
          setPositions({
            name: cfg.positions.name || { x: 70, y: 30 },
            title: cfg.positions.title || { x: 70, y: 42 },
            company: cfg.positions.company || { x: 70, y: 52 },
            logo: cfg.positions.logo || { x: 18, y: 50 },
          });
        }

        if (cfg.sizes) {
          setSizes({
            name: cfg.sizes.name || 22,
            title: cfg.sizes.title || 18,
            company: cfg.sizes.company || 14,
            logo: cfg.sizes.logo || 64,
          });
        }

        if (cfg.positionsBack) {
          setPositionsBack({
            email: cfg.positionsBack.email || { x: 15, y: 20 },
            phone: cfg.positionsBack.phone || { x: 15, y: 32 },
            website: cfg.positionsBack.website || { x: 15, y: 44 },
            address: cfg.positionsBack.address || { x: 15, y: 56 },
            qr: cfg.positionsBack.qr || { x: 75, y: 35 }
          });
        }

        if (cfg.backSizes) {
          setBackSizes({
            email: cfg.backSizes.email || 15,
            phone: cfg.backSizes.phone || 15,
            website: cfg.backSizes.website || 15,
            address: cfg.backSizes.address || 15,
            qr: cfg.backSizes.qr || 72,
          });
        }

        // Load URLs into inputs
        setBgUrlInput(t.background_url || "");
        setBackBgUrlInput(t.back_background_url || "");
      } catch (e: any) {
        setError(e.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // DRAG & DROP FUNCTIONS FOR FRONT
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
    const k = dragState.current.key as FrontKey;
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

  // RESIZE FUNCTIONS FOR FRONT
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
    const k = resizeState.current.key as FrontKey;
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

  // BACK SIDE DRAG & DROP FUNCTIONS
  const onBackDragStart = (key: BackKey, e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditLayout || !backPreviewRef.current) return;
    const rect = backPreviewRef.current.getBoundingClientRect();
    const pointX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pointY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragState.current = { key, offsetX: pointX - rect.left, offsetY: pointY - rect.top };
    window.addEventListener('mousemove', onBackDragMove as any);
    window.addEventListener('touchmove', onBackDragMove as any, { passive: false });
    window.addEventListener('mouseup', onBackDragEnd);
    window.addEventListener('touchend', onBackDragEnd);
  };

  const onBackDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isEditLayout || !backPreviewRef.current || !dragState.current.key) return;
    const rect = backPreviewRef.current.getBoundingClientRect();
    const pointX = e instanceof TouchEvent ? e.touches[0]?.clientX ?? dragState.current.offsetX : (e as MouseEvent).clientX;
    const pointY = e instanceof TouchEvent ? e.touches[0]?.clientY ?? dragState.current.offsetY : (e as MouseEvent).clientY;
    const xPx = Math.min(Math.max(pointX - rect.left, 0), rect.width);
    const yPx = Math.min(Math.max(pointY - rect.top, 0), rect.height);
    const x = (xPx / rect.width) * 100;
    const y = (yPx / rect.height) * 100;
    const k = dragState.current.key as BackKey;
    setPositionsBack((p) => ({ ...p, [k]: { x, y } }));
    if (e instanceof TouchEvent) e.preventDefault();
  };

  const onBackDragEnd = () => {
    dragState.current = { key: null, offsetX: 0, offsetY: 0 };
    window.removeEventListener('mousemove', onBackDragMove as any);
    window.removeEventListener('touchmove', onBackDragMove as any);
    window.removeEventListener('mouseup', onBackDragEnd);
    window.removeEventListener('touchend', onBackDragEnd);
  };

  // BACK SIDE RESIZE FUNCTIONS
  const onBackResizeStart = (key: BackKey, e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditLayout) return;
    const startY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const baseSize = backSizes[key];
    resizeState.current = { key, baseSize, startY };
    window.addEventListener('mousemove', onBackResizeMove as any);
    window.addEventListener('touchmove', onBackResizeMove as any, { passive: false });
    window.addEventListener('mouseup', onBackResizeEnd);
    window.addEventListener('touchend', onBackResizeEnd);
  };

  const onBackResizeMove = (e: MouseEvent | TouchEvent) => {
    if (!isEditLayout || !resizeState.current.key) return;
    const curY = e instanceof TouchEvent ? e.touches[0]?.clientY ?? resizeState.current.startY : (e as MouseEvent).clientY;
    const delta = curY - resizeState.current.startY;
    const k = resizeState.current.key as BackKey;
    const clampMax = k === 'qr' ? 140 : 64;
    const clampMin = k === 'qr' ? 40 : 8;
    const newSize = Math.max(clampMin, Math.min(clampMax, Math.round(resizeState.current.baseSize + delta * 0.2)));
    setBackSizes((s) => ({ ...s, [k]: newSize }));
    if (e instanceof TouchEvent) e.preventDefault();
  };

  const onBackResizeEnd = () => {
    resizeState.current = { key: null, baseSize: 0, startY: 0 };
    window.removeEventListener('mousemove', onBackResizeMove as any);
    window.removeEventListener('touchmove', onBackResizeMove as any);
    window.removeEventListener('mouseup', onBackResizeEnd);
    window.removeEventListener('touchend', onBackResizeEnd);
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
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      let background_url = bgUrlInput || item?.background_url || null;
      let back_background_url = backBgUrlInput || item?.back_background_url || null;
      let thumbnail_url = item?.thumbnail_url || null;

      const ts = Date.now();

      if (bgFile) {
        background_url = await uploadTemplateAsset(
          bgFile,
          `backgrounds/${ts}-${bgFile.name}`
        );
      }
      if (backBgFile) {
        back_background_url = await uploadTemplateAsset(
          backBgFile,
          `backgrounds/${ts}-back-${backBgFile.name}`
        );
      }
      if (thumbFile) {
        thumbnail_url = await uploadTemplateAsset(
          thumbFile,
          `thumbnails/${ts}-${thumbFile.name}`
        );
      }

      // IMPORTANT: Save updated positions and sizes in config
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

      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 2.99;

      await updateTemplate(id, {
        name,
        status,
        config,
        background_url,
        back_background_url,
        thumbnail_url,
        price: numericPrice,
      });

      navigate("/admin/templates", { replace: true });
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Helpers for Preview Logic
  const getPreviewBg = () => {
    if (showBack) {
      return backBgFile ? URL.createObjectURL(backBgFile) : backBgUrlInput;
    }
    return bgFile ? URL.createObjectURL(bgFile) : bgUrlInput;
  };

  // Generate vCard string for QR code
  const generateVCard = () => {
    return `BEGIN:VCARD
VERSION:3.0
FN:${previewData.name}
TITLE:${previewData.title}
ORG:${previewData.company}
EMAIL:${previewData.email}
TEL:${previewData.phone}
URL:${previewData.website}
ADR:${previewData.address}
END:VCARD`;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading template...
      </div>
    );
  if (error)
    return <div className="p-8 text-red-500 bg-red-50 rounded-lg">{error}</div>;
  if (!item) return <div className="p-8">Template not found</div>;

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gray-50/50"
    >
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Edit Template
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Customize design, default content, and settings.
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            size="sm"
            className="text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            size="sm"
            className="min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-lg mb-6 text-xs sm:text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* LEFT: Sticky Preview Area (Span 5) */}
        <div className="lg:col-span-5">
          <div className="sticky top-4 sm:top-6 space-y-3 sm:space-y-4">
            {/* Live Preview Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-2 sm:p-3 rounded-lg border shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-2">
                Live Preview
              </span>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBack((v) => !v)}
                  className="text-xs px-2 py-1 h-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {showBack ? "Front" : "Back"}
                </Button>
                <Button
                  type="button"
                  variant={isEditLayout ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsEditLayout(!isEditLayout)}
                  className="flex items-center gap-1 text-xs px-2 py-1 h-7"
                >
                  <Move className="w-3 h-3" />
                  {isEditLayout ? "Exit" : "Layout"}
                </Button>
                {isEditLayout && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetPositions}
                    className="text-xs px-2 py-1 h-7"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* The Card Render - Responsive */}
            <div
              ref={showBack ? backPreviewRef : previewRef}
              className="w-full aspect-[1.75/1] rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl border border-gray-200 overflow-hidden transition-all duration-500 relative"
              style={{
                backgroundColor: getPreviewBg() ? undefined : "#ffffff",
                backgroundImage: getPreviewBg()
                  ? `url(${getPreviewBg()})`
                  : undefined,
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
                      {/* Edit Mode Back Side - Responsive font sizes */}
                      <div
                        className="cursor-move select-none absolute"
                        style={{ 
                          left: `${positionsBack.email.x}%`, 
                          top: `${positionsBack.email.y}%`,
                          fontSize: Math.max(10, backSizes.email * 0.8),
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onBackDragStart('email', e)}
                        onTouchStart={(e) => onBackDragStart('email', e)}
                      >
                        <strong style={{ color: accentColor }}>✉</strong> {previewData.email}
                        {isEditLayout && (
                          <span
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -4, bottom: -4 }}
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
                          fontSize: Math.max(10, backSizes.phone * 0.8),
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onBackDragStart('phone', e)}
                        onTouchStart={(e) => onBackDragStart('phone', e)}
                      >
                        <strong style={{ color: accentColor }}>✆</strong> {previewData.phone}
                        {isEditLayout && (
                          <span
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -4, bottom: -4 }}
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
                          fontSize: Math.max(10, backSizes.website * 0.8),
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onBackDragStart('website', e)}
                        onTouchStart={(e) => onBackDragStart('website', e)}
                      >
                        <strong style={{ color: accentColor }}>⌂</strong> {previewData.website}
                        {isEditLayout && (
                          <span
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -4, bottom: -4 }}
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
                          fontSize: Math.max(10, backSizes.address * 0.8),
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onBackDragStart('address', e)}
                        onTouchStart={(e) => onBackDragStart('address', e)}
                      >
                        <strong style={{ color: accentColor }}>📍</strong> {previewData.address}
                        {isEditLayout && (
                          <span
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -4, bottom: -4 }}
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
                        <div style={{ background: 'rgba(255,255,255,0.9)', padding: 4, borderRadius: 6 }}>
                          <QRCodeSVG 
                            value={generateVCard()} 
                            size={Math.max(60, backSizes.qr * 0.7)} 
                            fgColor={qrColor}
                            imageSettings={qrLogoUrl ? {
                              src: qrLogoUrl,
                              height: 20,
                              width: 20,
                              excavate: true,
                            } : undefined}
                          />
                        </div>
                        {isEditLayout && (
                          <span
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -4, bottom: -4 }}
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
                    <div className="w-full h-full flex items-center justify-end p-4 sm:p-6 md:p-8">
                      <div className="flex flex-col text-right z-10">
                        <h3
                          className="font-bold leading-tight mb-1"
                          style={{
                            color: fontColor,
                            fontFamily,
                            fontSize: Math.max(16, fontSize + 4),
                          }}
                        >
                          {previewData.name}
                        </h3>

                        <p
                          className="font-medium mb-1 sm:mb-2"
                          style={{
                            color: accentColor,
                            fontFamily,
                            fontSize: Math.max(14, fontSize + 2),
                          }}
                        >
                          {previewData.title}
                        </p>

                        <p
                          className="opacity-75"
                          style={{
                            color: fontColor,
                            fontFamily,
                            fontSize: Math.max(12, fontSize),
                          }}
                        >
                          {previewData.company}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      {/* Edit Mode Front Side - Responsive */}
                      <div
                        className="cursor-move select-none font-bold absolute"
                        style={{ 
                          position: 'absolute',
                          left: `${positions.name.x}%`, 
                          top: `${positions.name.y}%`,
                          fontSize: Math.max(14, sizes.name * 0.7),
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onDragStart('name', e)}
                        onTouchStart={(e) => onDragStart('name', e)}
                      >
                        {previewData.name}
                        {isEditLayout && (
                          <span
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -4, bottom: -4 }}
                            onMouseDown={(e) => { e.stopPropagation(); onResizeStart('name', e); }}
                            onTouchStart={(e) => { e.stopPropagation(); onResizeStart('name', e); }}
                          />
                        )}
                      </div>

                      <div
                        className="cursor-move select-none absolute"
                        style={{ 
                          position: 'absolute',
                          left: `${positions.title.x}%`, 
                          top: `${positions.title.y}%`,
                          fontSize: Math.max(12, sizes.title * 0.7),
                          color: accentColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onDragStart('title', e)}
                        onTouchStart={(e) => onDragStart('title', e)}
                      >
                        {previewData.title}
                        {isEditLayout && (
                          <span
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -4, bottom: -4 }}
                            onMouseDown={(e) => { e.stopPropagation(); onResizeStart('title', e); }}
                            onTouchStart={(e) => { e.stopPropagation(); onResizeStart('title', e); }}
                          />
                        )}
                      </div>

                      <div
                        className="cursor-move select-none opacity-80 absolute"
                        style={{ 
                          position: 'absolute',
                          left: `${positions.company.x}%`, 
                          top: `${positions.company.y}%`,
                          fontSize: Math.max(10, sizes.company * 0.7),
                          color: fontColor,
                          fontFamily
                        }}
                        onMouseDown={(e) => onDragStart('company', e)}
                        onTouchStart={(e) => onDragStart('company', e)}
                      >
                        {previewData.company}
                        {isEditLayout && (
                          <span
                            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                            style={{ right: -4, bottom: -4 }}
                            onMouseDown={(e) => { e.stopPropagation(); onResizeStart('company', e); }}
                            onTouchStart={(e) => { e.stopPropagation(); onResizeStart('company', e); }}
                          />
                        )}
                      </div>

                      {/* Logo (if exists) */}
                      {previewData.logo && (
                        <div
                          className="cursor-move select-none absolute"
                          style={{
                            position: "absolute",
                            left: `${positions.logo.x}%`,
                            top: `${positions.logo.y}%`,
                            width: Math.max(40, sizes.logo * 0.7),
                            height: Math.max(40, sizes.logo * 0.7),
                            borderRadius: "9999px",
                            overflow: "hidden",
                            backgroundColor: "rgba(255,255,255,0.9)",
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
                          {isEditLayout && (
                            <span
                              className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-sm cursor-nwse-resize border border-white"
                              style={{ right: -4, bottom: -4 }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                onResizeStart("logo", e);
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation();
                                onResizeStart("logo", e);
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Edit Mode Indicator */}
              {isEditLayout && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded truncate max-w-[80%]">
                  Edit Mode
                </div>
              )}
            </div>

            {/* Layout Info Panel */}
            {isEditLayout && (
              <div className="bg-yellow-50 p-3 rounded-lg text-xs text-yellow-800 border border-yellow-100">
                <p className="font-semibold">Layout Editing Active:</p>
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  <li>Drag elements to reposition</li>
                  <li>Use blue handles to resize</li>
                  <li>Switch between Front/Back views</li>
                </ul>
              </div>
            )}

            {/* Helper Tip */}
            <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800 border border-blue-100">
              <p><strong>Tip:</strong> Changes reflect instantly. Use tabs to customize.</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Form Controls (Span 7) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border overflow-hidden">
            {/* Custom Tab Navigation - Responsive */}
            <div className="flex overflow-x-auto border-b bg-gray-50/50 scrollbar-hide">
              {['general', 'design', 'qr', 'content', 'layout'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium capitalize transition-colors whitespace-nowrap ${activeTab === tab
                      ? "border-b-2 border-black text-black bg-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {tab === 'qr' ? 'QR Code' : tab}
                </button>
              ))}
            </div>

            <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
              {/* GENERAL TAB */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Template Name</label>
                      <input 
                        className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Status</label>
                      <select 
                        className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm" 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value as any)}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="prem"
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded border-gray-300"
                        checked={isPremium}
                        onChange={(e) => setIsPremium(e.target.checked)}
                      />
                      <label htmlFor="prem" className="text-xs sm:text-sm font-medium">
                        Premium Template
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Price</label>
                      <input
                        className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="2.99"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 pt-3 sm:pt-4 border-t">
                    <label className="text-xs sm:text-sm font-medium">Thumbnail Image</label>
                    <input
                      type="file"
                      className="block w-full text-xs sm:text-sm text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      accept="image/*"
                      onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)}
                    />
                    {item.thumbnail_url && !thumbFile && (
                      <p className="text-xs text-gray-400 truncate">
                        Current: {item.thumbnail_url.split("/").pop()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* DESIGN TAB */}
              {activeTab === 'design' && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Backgrounds Section */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-sm font-bold text-gray-900">Backgrounds</h3>

                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-medium block">Front Background</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="https://..."
                          className="flex-1 border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
                          value={bgUrlInput}
                          onChange={(e) => setBgUrlInput(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">OR</span>
                          <input 
                            type="file" 
                            className="w-full sm:w-auto text-xs" 
                            accept="image/*" 
                            onChange={(e) => setBgFile(e.target.files?.[0] ?? null)} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-3">
                      <label className="text-xs sm:text-sm font-medium block">Back Background</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="https://..."
                          className="flex-1 border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
                          value={backBgUrlInput}
                          onChange={(e) => setBackBgUrlInput(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">OR</span>
                          <input 
                            type="file" 
                            className="w-full sm:w-auto text-xs" 
                            accept="image/*" 
                            onChange={(e) => setBackBgFile(e.target.files?.[0] ?? null)} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t my-3 sm:my-4"></div>

                  {/* Typography Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Primary Text Color</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          className="h-7 w-7 sm:h-9 sm:w-9 rounded cursor-pointer border-none" 
                          value={fontColor} 
                          onChange={(e) => setFontColor(e.target.value)} 
                        />
                        <span className="text-xs font-mono text-gray-500 truncate">{fontColor}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          className="h-7 w-7 sm:h-9 sm:w-9 rounded cursor-pointer border-none" 
                          value={accentColor} 
                          onChange={(e) => setAccentColor(e.target.value)} 
                        />
                        <span className="text-xs font-mono text-gray-500 truncate">{accentColor}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Base Font Size (px)</label>
                      <input 
                        type="number" 
                        className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm" 
                        value={fontSize} 
                        onChange={(e) => setFontSize(Number(e.target.value))} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Font Family</label>
                      <select 
                        className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm" 
                        value={fontFamily} 
                        onChange={(e) => setFontFamily(e.target.value)}
                      >
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
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* QR CODE TAB */}
              {activeTab === 'qr' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-blue-50 p-3 rounded-lg text-xs sm:text-sm text-blue-700 mb-3 sm:mb-4">
                    Customize how the VCard QR looks on the back of the card.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">QR Foreground Color</label>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <input 
                          type="color" 
                          className="h-8 w-10 sm:h-10 sm:w-14 p-1 bg-white border rounded" 
                          value={qrColor} 
                          onChange={(e) => setQrColor(e.target.value)} 
                        />
                        <div className="text-xs text-gray-500">Black or Dark Blue</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Center Logo URL</label>
                      <input
                        type="text"
                        className="w-full border rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm"
                        placeholder="https://... (Logo Icon)"
                        value={qrLogoUrl}
                        onChange={(e) => setQrLogoUrl(e.target.value)}
                      />
                      <p className="text-xs text-gray-400">Paste URL to a small logo (PNG/SVG).</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENT TAB */}
              {activeTab === 'content' && (
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">This data is only for previewing the design.</p>
                  <BusinessCardForm data={previewData} onChange={setPreviewData} />
                </div>
              )}

              {/* LAYOUT TAB - Responsive */}
              {activeTab === 'layout' && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-green-50 p-3 rounded-lg text-xs sm:text-sm text-green-700 mb-3 sm:mb-4">
                    <strong>Layout Settings:</strong> Positions will be saved with your template.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Front Side Layout Controls */}
                    <div className="space-y-3 sm:space-y-4 border p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-xs sm:text-sm">Front Side Layout</h4>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm">Name Position</span>
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
                            className="w-full h-2"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={positions.name.y}
                            onChange={(e) => setPositions(p => ({...p, name: {...p.name, y: parseFloat(e.target.value)}}))}
                            className="w-full h-2"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm">Name Size</span>
                          <span className="text-xs text-gray-500">{sizes.name}px</span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="64"
                          value={sizes.name}
                          onChange={(e) => setSizes(s => ({...s, name: parseInt(e.target.value)}))}
                          className="w-full h-2"
                        />
                      </div>

                      <div className="pt-3 sm:pt-4 border-t">
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
                          className="w-full text-xs"
                        >
                          Reset Front Layout
                        </Button>
                      </div>
                    </div>

                    {/* Back Side Layout Controls */}
                    <div className="space-y-3 sm:space-y-4 border p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-xs sm:text-sm">Back Side Layout</h4>
                      
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm">QR Position</span>
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
                            className="w-full h-2"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={positionsBack.qr.y}
                            onChange={(e) => setPositionsBack(p => ({...p, qr: {...p.qr, y: parseFloat(e.target.value)}}))}
                            className="w-full h-2"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm">QR Size</span>
                          <span className="text-xs text-gray-500">{backSizes.qr}px</span>
                        </div>
                        <input
                          type="range"
                          min="40"
                          max="140"
                          value={backSizes.qr}
                          onChange={(e) => setBackSizes(s => ({...s, qr: parseInt(e.target.value)}))}
                          className="w-full h-2"
                        />
                      </div>

                      <div className="pt-3 sm:pt-4 border-t">
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
                          className="w-full text-xs"
                        >
                          Reset Back Layout
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-600">
                          <strong>Tip:</strong> Use "Layout" button on preview to drag & drop elements visually.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditLayout(!isEditLayout)}
                        className="flex items-center gap-1 text-xs sm:text-sm"
                        size="sm"
                      >
                        <Move className="w-3 h-3 sm:w-4 sm:h-4" />
                        {isEditLayout ? "Exit Visual Edit" : "Enter Visual Edit"}
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

export default EditTemplate;
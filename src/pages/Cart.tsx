// src/pages/Cart.tsx
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, X, Menu } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";
import { ClassicCard } from "@/components/templates/ClassicCard";
import { BackSideCard } from "@/components/templates/BackSideCard";
import { classicTemplates } from "@/lib/classicTemplates";
import { listPublishedTemplates, Template } from "@/services/templates";
import { QRCodeSVG } from "qrcode.react";

export default function CartPage() {
  const { items, remove, total, update } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [sbTemplates, setSbTemplates] = useState<Template[]>([]);
  const CARD_WIDTH = 560;
  const CARD_HEIGHT = 320;
  const PREVIEW_SCALE = 0.32;

  const scaledFrame = (content: ReactNode) => (
    <div className="relative w-full aspect-[1.75/1] rounded-lg overflow-hidden shadow-md bg-white">
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          transform: `scale(${PREVIEW_SCALE})`,
          transformOrigin: "top left",
        }}
      >
        {content}
      </div>
    </div>
  );

  const renderServerFront = (item: any, template: Template | undefined) => {
    const cfg: any = template?.config || {};
    const fc = item.textColor || cfg.fontColor || "#000000";
    const fs = item.fontSize || cfg.fontSize || 16;
    const accent = item.accentColor || cfg.accentColor || "#0ea5e9";
    const ff = item.selectedFont || cfg.fontFamily || "Inter, Arial, sans-serif";
    const bg = template?.background_url;
    const frontData = item.frontData;
    const positions =
      frontData?.positions || {
        name: { x: 70, y: 30 },
        title: { x: 70, y: 42 },
        company: { x: 70, y: 52 },
        logo: { x: 18, y: 50 },
      };
    const sizes =
      frontData?.sizes || { name: 22, title: 18, company: 14, logo: 64 };
    const scaled = (value: number) => Math.max(6, value * PREVIEW_SCALE);

    if (frontData?.isEditLayout) {
      return (
        <div
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            backgroundColor: bg ? undefined : "#f3f4f6",
            backgroundImage: bg ? `url(${bg})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: fc,
            fontFamily: ff,
          }}
        >
          <div className="absolute inset-0" style={{ position: "relative" }}>
            <div
              className="font-bold whitespace-nowrap"
              style={{
                position: "absolute",
                left: `${positions.name.x}%`,
                top: `${positions.name.y}%`,
                fontSize: scaled(sizes.name),
              }}
            >
              {item.data.name || "Your Name"}
            </div>
            <div
              className="whitespace-nowrap"
              style={{
                position: "absolute",
                left: `${positions.title.x}%`,
                top: `${positions.title.y}%`,
                color: accent,
                fontSize: scaled(sizes.title),
              }}
            >
              {item.data.title || "Job Title"}
            </div>
            <div
              className="opacity-80 whitespace-nowrap"
              style={{
                position: "absolute",
                left: `${positions.company.x}%`,
                top: `${positions.company.y}%`,
                fontSize: scaled(sizes.company),
              }}
            >
              {item.data.company || "Company"}
            </div>
            {item.data.logo && positions.logo && (
              <img
                src={item.data.logo}
                alt="logo"
                style={{
                  position: "absolute",
                  left: `${positions.logo.x}%`,
                  top: `${positions.logo.y}%`,
                  width: scaled(sizes.logo),
                  height: scaled(sizes.logo),
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          padding: 24,
          backgroundColor: bg ? undefined : "#f3f4f6",
          backgroundImage: bg ? `url(${bg})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: fc,
          fontFamily: ff,
        }}
      >
        <div className="w-full h-full flex items-center justify-between gap-4">
          {item.data.logo ? (
            <img
              src={item.data.logo}
              alt="Logo"
              className="w-20 h-20 object-cover rounded-full border border-white/50 shadow"
            />
          ) : (
            <div />
          )}
          <div className="flex flex-col text-right leading-snug">
            <h3 className="font-bold text-2xl">{item.data.name || "Your Name"}</h3>
            {item.data.title?.trim() && (
              <p style={{ color: accent, fontSize: fs + 4 }}>{item.data.title}</p>
            )}
            {item.data.company?.trim() && (
              <p className="opacity-80" style={{ fontSize: fs }}>
                {item.data.company}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderServerBack = (item: any, template: Template | undefined) => {
    const cfg: any = template?.config || {};
    const fc = item.textColor || cfg.fontColor || "#000000";
    const fs = item.fontSize || cfg.fontSize || 16;
    const accent = item.accentColor || cfg.accentColor || "#0ea5e9";
    const ff = item.selectedFont || cfg.fontFamily || "Inter, Arial, sans-serif";
    const backBg = template?.back_background_url || template?.background_url;
    const backData = item.backData;
    const positionsBack =
      backData?.positionsBack || {
        email: { x: 15, y: 20 },
        phone: { x: 15, y: 32 },
        website: { x: 15, y: 44 },
        address: { x: 15, y: 56 },
        qr: { x: 75, y: 35 },
      };
    const backSizes =
      backData?.backSizes || {
        email: 15,
        phone: 15,
        website: 15,
        address: 15,
        qr: 72,
      };
    const scaled = (value: number) => Math.max(6, value * PREVIEW_SCALE);
    const qrValue = `BEGIN:VCARD
FN:${item.data.name}
TITLE:${item.data.title}
ORG:${item.data.company}
EMAIL:${item.data.email}
TEL:${item.data.phone}
URL:${item.data.website}
ADR:${item.data.address}
END:VCARD`;

    if (backData?.isEditLayout) {
      return (
        <div
          style={{
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            backgroundColor: backBg ? undefined : "#f3f4f6",
            backgroundImage: backBg ? `url(${backBg})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: fc,
            fontFamily: ff,
          }}
        >
          <div className="absolute inset-0" style={{ position: "relative" }}>
            <div
              className="whitespace-nowrap"
              style={{
                position: "absolute",
                left: `${positionsBack.email.x}%`,
                top: `${positionsBack.email.y}%`,
                fontSize: scaled(backSizes.email),
              }}
            >
              <strong style={{ color: accent }}>✉</strong>{" "}
              {item.data.email || "email@example.com"}
            </div>
            <div
              className="whitespace-nowrap"
              style={{
                position: "absolute",
                left: `${positionsBack.phone.x}%`,
                top: `${positionsBack.phone.y}%`,
                fontSize: scaled(backSizes.phone),
              }}
            >
              <strong style={{ color: accent }}>✆</strong>{" "}
              {item.data.phone || "+91 00000 00000"}
            </div>
            <div
              className="whitespace-nowrap"
              style={{
                position: "absolute",
                left: `${positionsBack.website.x}%`,
                top: `${positionsBack.website.y}%`,
                fontSize: scaled(backSizes.website),
              }}
            >
              <strong style={{ color: accent }}>⌂</strong>{" "}
              {item.data.website || "your-website.com"}
            </div>
            <div
              className="whitespace-nowrap"
              style={{
                position: "absolute",
                left: `${positionsBack.address.x}%`,
                top: `${positionsBack.address.y}%`,
                fontSize: scaled(backSizes.address),
              }}
            >
              <strong style={{ color: accent }}>📍</strong>{" "}
              {item.data.address || "Your Address"}
            </div>
            <div
              style={{
                position: "absolute",
                left: `${positionsBack.qr.x}%`,
                top: `${positionsBack.qr.y}%`,
                transform: "translate(-50%, -50%)",
                background: "rgba(255,255,255,0.9)",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <QRCodeSVG value={qrValue} size={scaled(backSizes.qr)} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          padding: 24,
          backgroundColor: backBg ? undefined : "#f3f4f6",
          backgroundImage: backBg ? `url(${backBg})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: fc,
          fontFamily: ff,
        }}
      >
        <BackSideCard
          data={item.data}
          textColor={fc}
          accentColor={accent}
          fontFamily={ff}
          fontSize={fs}
          showLargeQR={false}
          qrSize={72}
          compact
          transparentBg
        />
      </div>
    );
  };

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

  return (
    <>
      {/* Header - Fully Responsive */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <h1
              className="text-2xl lg:text-4xl font-bold text-blue-700 cursor-pointer select-none"
              onClick={() => navigate("/")}
            >
              Businesscard
            </h1>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-10">
              <div className="flex items-center bg-gray-100 rounded-lg px-5 py-3 w-full">
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500 w-full"
                />
              </div>
            </div>

            {/* Desktop Progress Bar - Tumhare original jaisa, bas compact */}
            <div className="hidden lg:flex items-center gap-8 text-xs font-medium">
              {["Cart", "Address", "Payment", "Summary"].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {i + 1}
                  </div>
                  <span className={i === 0 ? "text-blue-600 font-semibold" : "text-gray-600"}>
                    {step}
                  </span>
                  {i < 3 && <div className="w-12 h-px bg-gray-300" />}
                </div>
              ))}
            </div>

            {/* Mobile Search + Cart */}
            <div className="flex items-center gap-4">
              <button onClick={() => setSearchOpen(!searchOpen)} className="lg:hidden">
                <Search className="w-6 h-6 text-gray-700" />
              </button>
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-gray-700" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {items.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Dropdown */}
          {searchOpen && (
            <div className="lg:hidden border-t bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 outline-none"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          )}

          {/* MOBILE PROGRESS BAR – Ek Line Mein, Super Chhota, Perfect Center */}
          <div className="lg:hidden border-t bg-gray-50">
            <div className="px-4 py-4">
              <div className="flex items-center justify-center gap-3 text-xs font-medium">

                {/* Step 1 - Cart (Active) */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-blue-600 font-semibold">Cart</span>
                </div>

                <div className="w-10 h-px bg-gray-300"></div>

                {/* Step 2 */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <span className="text-gray-500">Address</span>
                </div>

                <div className="w-10 h-px bg-gray-300"></div>

                {/* Step 3 */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <span className="text-gray-500">Payment</span>
                </div>

                <div className="w-10 h-px bg-gray-300"></div>

                {/* Step 4 */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <span className="text-gray-500">Summary</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

          {/* Empty Cart */}
          {items.length === 0 ? (
            <div className="text-center py-20 lg:py-32">
              <div className="mb-10">
                <div className="inline-block p-12 bg-white rounded-3xl shadow-lg">
                  <ShoppingBag className="w-24 h-24 lg:w-32 lg:h-32 text-gray-300" />
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                Your cart is empty!
              </h2>
              <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added anything yet.</p>
              <Button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
                    My Cart ({items.length} {items.length > 1 ? "Items" : "Item"})
                  </h2>

                  <div className="space-y-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-5 lg:p-6">
                          <div className="space-y-4">
                            {/* Card Preview - Front and Back Side by Side */}
                            <div className="flex flex-col gap-2 w-full lg:w-auto">
                              <div className="flex gap-3">
                                {/* Front Side Preview */}
                                <div className="flex-1 lg:w-64 bg-white rounded-lg overflow-hidden shadow-md relative aspect-[1.75/1]">
                                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded z-10">Front</div>
                                {(() => {
                                  const isServer = item.id.startsWith("sb:");
                                  const serverId = isServer ? item.id.slice(3) : "";
                                  const serverTemplate = isServer ? sbTemplates.find(t => t.id === serverId) : null;
                                  const classicConfig = !isServer ? classicTemplates.find(t => t.id === item.id) : null;
                                  
                                  if (isServer && serverTemplate) {
                                    const bg = serverTemplate.background_url;
                                    const cfg: any = serverTemplate.config || {};
                                    const fc = item.textColor || cfg.fontColor || "#000000";
                                    const fs = item.fontSize || cfg.fontSize || 16;
                                    const accent = item.accentColor || cfg.accentColor || "#0ea5e9";
                                    const ff = item.selectedFont || cfg.fontFamily || "Inter, Arial, sans-serif";
                                    
                                    // Use edited positions if available
                                    const positions = item.frontData?.positions || {
                                      name: { x: 70, y: 30 },
                                      title: { x: 70, y: 42 },
                                      company: { x: 70, y: 52 },
                                    };
                                    const sizes = item.frontData?.sizes || { name: 22, title: 18, company: 14 };
                                    const isEditLayout = item.frontData?.isEditLayout || false;
                                    
                                    if (isEditLayout && item.frontData) {
                                      return (
                                        <div
                                          className="w-full h-full relative"
                                          style={{
                                            backgroundColor: bg ? undefined : "#f3f4f6",
                                            backgroundImage: bg ? `url(${bg})` : undefined,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            color: fc,
                                            fontFamily: ff,
                                            fontSize: `${fs * 0.25}px`,
                                          }}
                                        >
                                          <div className="absolute inset-0 p-2">
                                            <div
                                              className="font-bold whitespace-nowrap"
                                              style={{ position: 'absolute', left: `${positions.name.x}%`, top: `${positions.name.y}%`, fontSize: `${sizes.name * 0.25}px` }}
                                            >
                                              {item.data.name || 'Your Name'}
                                            </div>
                                            <div
                                              className="whitespace-nowrap"
                                              style={{ position: 'absolute', left: `${positions.title.x}%`, top: `${positions.title.y}%`, color: accent, fontSize: `${sizes.title * 0.25}px` }}
                                            >
                                              {item.data.title || 'Job Title'}
                                            </div>
                                            <div
                                              className="opacity-80 whitespace-nowrap"
                                              style={{ position: 'absolute', left: `${positions.company.x}%`, top: `${positions.company.y}%`, fontSize: `${sizes.company * 0.25}px` }}
                                            >
                                              {item.data.company || 'Company'}
                                            </div>
                                            {item.data.logo && positions.logo && (
                                              <img
                                                src={item.data.logo}
                                                alt="logo"
                                                style={{
                                                  position: "absolute",
                                                  left: `${positions.logo.x}%`,
                                                  top: `${positions.logo.y}%`,
                                                  width: `${sizes.logo * 0.25}px`,
                                                  height: `${sizes.logo * 0.25}px`,
                                                  borderRadius: "50%",
                                                  objectFit: "cover",
                                                }}
                                              />
                                            )}
                                          </div>
                                        </div>
                                      );
                                    }
                                    
                                    return (
                                      <div
                                        className="w-full h-full p-2 flex items-center justify-between gap-2"
                                        style={{
                                          backgroundColor: bg ? undefined : "#f3f4f6",
                                          backgroundImage: bg ? `url(${bg})` : undefined,
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                          color: fc,
                                          fontFamily: ff,
                                          fontSize: `${fs * 0.3}px`,
                                        }}
                                      >
                                        {item.data.logo ? (
                                          <img src={item.data.logo} alt="Logo" className="w-10 h-10 object-cover rounded-full border border-white/50 shadow" />
                                        ) : <div />}
                                        <div className="flex flex-col text-right leading-tight">
                                          <h3 className="font-bold text-xs">
                                            {item.data.name || "Your Name"}
                                          </h3>
                                          {item.data.title?.trim() && (
                                            <p style={{ color: accent, fontSize: `${(fs + 2) * 0.3}px` }}>{item.data.title}</p>
                                          )}
                                          {item.data.company?.trim() && (
                                            <p className="opacity-80 text-[10px]">{item.data.company}</p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }
                                  
                                  if (!isServer && classicConfig) {
                                    return (
                                      <div className="w-full h-full" style={{ transform: "scale(0.35)", transformOrigin: "top left", width: "285.7%", height: "285.7%" }}>
                                        <ClassicCard
                                          data={item.data}
                                          config={classicConfig}
                                          fontFamily={item.selectedFont}
                                          fontSize={item.fontSize}
                                          textColor={item.textColor}
                                          accentColor={item.accentColor}
                                        />
                                      </div>
                                    );
                                  }
                                  
                                  return (
                                    <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-blue-50 to-gray-50">
                                      <div>
                                        <h3 className="font-bold text-sm text-gray-900">
                                          {item.data?.name || "John Doe"}
                                        </h3>
                                        <p className="text-blue-600 font-medium text-xs">
                                          {item.data?.title || "Software Engineer"}
                                        </p>
                                      </div>
                                      <div className="text-xs">
                                        <p className="font-medium text-gray-800">
                                          {item.data?.company || "Tech Corp"}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })()}
                                </div>
                                
                                {/* Back Side Preview */}
                                <div className="flex-1 lg:w-64 bg-white rounded-lg overflow-hidden shadow-md relative aspect-[1.75/1]">
                                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded z-10">Back</div>
                                {(() => {
                                  const isServer = item.id.startsWith("sb:");
                                  const serverId = isServer ? item.id.slice(3) : "";
                                  const serverTemplate = isServer ? sbTemplates.find(t => t.id === serverId) : null;
                                  const classicConfig = !isServer ? classicTemplates.find(t => t.id === item.id) : null;
                                  
                                  if (isServer && serverTemplate) {
                                    const backBg = serverTemplate.back_background_url || serverTemplate.background_url;
                                    const cfg: any = serverTemplate.config || {};
                                    const fc = item.textColor || cfg.fontColor || "#000000";
                                    const fs = item.fontSize || cfg.fontSize || 16;
                                    const accent = item.accentColor || cfg.accentColor || "#0ea5e9";
                                    const ff = item.selectedFont || cfg.fontFamily || "Inter, Arial, sans-serif";
                                    
                                    // Use edited positions if available
                                    const positionsBack = item.backData?.positionsBack || {
                                      email: { x: 15, y: 20 },
                                      phone: { x: 15, y: 32 },
                                      website: { x: 15, y: 44 },
                                      address: { x: 15, y: 56 },
                                      qr: { x: 75, y: 35 },
                                    };
                                    const backSizes = item.backData?.backSizes || { email: 15, phone: 15, website: 15, address: 15, qr: 72 };
                                    const isEditLayout = item.backData?.isEditLayout || false;
                                    
                                    if (isEditLayout && item.backData) {
                                      return (
                                        <div
                                          className="w-full h-full relative"
                                          style={{
                                            backgroundColor: backBg ? undefined : "#f3f4f6",
                                            backgroundImage: backBg ? `url(${backBg})` : undefined,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            color: fc,
                                            fontFamily: ff,
                                            fontSize: `${fs * 0.25}px`,
                                          }}
                                        >
                                          <div className="absolute inset-0 p-2">
                                            <div
                                              className="whitespace-nowrap"
                                              style={{ position: 'absolute', left: `${positionsBack.email.x}%`, top: `${positionsBack.email.y}%`, fontSize: `${backSizes.email * 0.3}px` }}
                                            >
                                              <strong style={{ color: accent }}>✉</strong> {item.data.email || 'email@example.com'}
                                            </div>
                                            <div
                                              className="whitespace-nowrap"
                                              style={{ position: 'absolute', left: `${positionsBack.phone.x}%`, top: `${positionsBack.phone.y}%`, fontSize: `${backSizes.phone * 0.3}px` }}
                                            >
                                              <strong style={{ color: accent }}>✆</strong> {item.data.phone || '+91 00000 00000'}
                                            </div>
                                            <div
                                              className="whitespace-nowrap"
                                              style={{ position: 'absolute', left: `${positionsBack.website.x}%`, top: `${positionsBack.website.y}%`, fontSize: `${backSizes.website * 0.3}px` }}
                                            >
                                              <strong style={{ color: accent }}>⌂</strong> {item.data.website || 'your-website.com'}
                                            </div>
                                            <div
                                              className="whitespace-nowrap"
                                              style={{ position: 'absolute', left: `${positionsBack.address.x}%`, top: `${positionsBack.address.y}%`, fontSize: `${backSizes.address * 0.3}px` }}
                                            >
                                              <strong style={{ color: accent }}>📍</strong> {item.data.address || 'Your Address'}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                    
                                    return (
                                      <div
                                        className="w-full h-full p-2"
                                        style={{
                                          backgroundColor: backBg ? undefined : "#f3f4f6",
                                          backgroundImage: backBg ? `url(${backBg})` : undefined,
                                          backgroundSize: "cover",
                                          backgroundPosition: "center",
                                        }}
                                      >
                                        <BackSideCard
                                          data={item.data}
                                          textColor={fc}
                                          accentColor={accent}
                                          fontFamily={ff}
                                          fontSize={fs * 0.35}
                                          showLargeQR={false}
                                          qrSize={32}
                                          compact={true}
                                          transparentBg={true}
                                        />
                                      </div>
                                    );
                                  }
                                  
                                  if (!isServer && classicConfig) {
                                    return (
                                      <div className="w-full h-full" style={{ transform: "scale(0.35)", transformOrigin: "top left", width: "285.7%", height: "285.7%" }}>
                                        <BackSideCard
                                          data={item.data}
                                          background={{
                                            style: classicConfig.bgStyle === "solid" ? "solid" : "gradient",
                                            colors: classicConfig.bgColors,
                                          }}
                                          textColor={item.textColor}
                                          accentColor={item.accentColor}
                                          fontFamily={item.selectedFont}
                                          fontSize={item.fontSize}
                                        />
                                      </div>
                                    );
                                  }
                                  
                                  return (
                                    <div className="w-full h-full p-4 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                                      <div className="text-xs space-y-1">
                                        <p className="text-gray-600">✉ {item.data?.email || "email@example.com"}</p>
                                        <p className="text-gray-600">✆ {item.data?.phone || "+91 00000 00000"}</p>
                                        {item.data?.website && (
                                          <p className="text-gray-600">⌂ {item.data.website}</p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })()}
                                </div>
                              </div>
                            </div>
                            {/* Item Details */}
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2 border-t border-dashed border-gray-200">
                              <div className="space-y-2 text-sm text-gray-600">
                                <span className="text-xs uppercase tracking-wide text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                                  {item.frontData?.isEditLayout || item.backData?.isEditLayout ? "Edited Design" : "Standard Design"}
                                </span>
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {(() => {
                                    const isServer = item.id.startsWith("sb:");
                                    const serverId = isServer ? item.id.slice(3) : "";
                                    const serverTemplate = isServer ? sbTemplates.find(t => t.id === serverId) : null;
                                    const classicConfig = !isServer ? classicTemplates.find(t => t.id === item.id) : null;
                                    
                                    if (isServer && serverTemplate) {
                                      return serverTemplate.name || "Business Card";
                                    }
                                    if (!isServer && classicConfig) {
                                      return classicConfig.name || "Business Card";
                                    }
                                    return "Business Card";
                                  })()}
                                </h3>
                                <div className="space-y-1">
                                  <p>Card Type: <span className="font-medium">{item.data?.cardType || "Standard"}</span></p>
                                  <p>Paper: <span className="font-medium">{item.data?.paperType || "300 GSM Matte"}</span></p>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-4 w-full lg:w-auto">
                                <div className="text-3xl font-bold text-gray-900">
                                  ₹{item.price.toFixed(0)}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(item.id)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full h-12 w-12"
                                >
                                  <X className="w-6 h-6" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Summary - Right Side (Sticky on Desktop) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-800 mb-5">Order Summary</h2>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total MRP</span>
                      <span className="font-medium">₹{(total * 2).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount (20%)</span>
                      <span className="text-green-600 font-medium">-₹{(total * 0.2).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charges</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>

                    <div className="border-t-2 border-dashed pt-4 mt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-2xl text-blue-600">₹{total.toFixed(0)}</span>
                      </div>
                    </div>

                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium text-center">
                      You saved ₹{(total * 0.2).toFixed(0)} on this order!
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/checkout")}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-7 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Secure checkout • No payment charged yet
                  </p>

                  <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-sm font-medium text-gray-700 flex items-center justify-center gap-2">
                      <span className="text-green-600">Lock Icon</span>
                      100% Safe & Secure Payments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
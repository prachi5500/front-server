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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDragResize } from "@/hooks/useDragResize";

const EditTemplate = () => {
  // useDragResize.ts
  const { positions, setPositions, onDragStart, onResizeStart } = useDragResize(
    {
      name: { x: 200, y: 50, w: 150, h: 40 },
      title: { x: 200, y: 100, w: 150, h: 30 },
      company: { x: 200, y: 150, w: 150, h: 25 },

      email: { x: 50, y: 200, w: 150, h: 20 },
      phone: { x: 50, y: 230, w: 150, h: 20 },
      website: { x: 50, y: 260, w: 150, h: 20 },
    }
  );

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

  // Template Config State
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState<string>("$2.99");

  // Design State
  const [fontColor, setFontColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);
  const [accentColor, setAccentColor] = useState("#0ea5e9");
  const [fontFamily, setFontFamily] = useState<string>(
    "Inter, Arial, sans-serif"
  );

  // QR Code State
  const [qrColor, setQrColor] = useState("#000000");
  const [qrLogoUrl, setQrLogoUrl] = useState(""); // URL for logo inside QR

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
        setPrice(cfg.price ?? "$2.99");

        // Load QR Config
        setQrColor(cfg.qrColor ?? "#000000");
        setQrLogoUrl(cfg.qrLogoUrl ?? "");

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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      let background_url = bgUrlInput;
      let back_background_url = backBgUrlInput;
      let thumbnail_url = item?.thumbnail_url ?? null;

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

      const config = {
        fontColor,
        fontSize,
        accentColor,
        fontFamily,
        premium: isPremium,
        price,
        qrColor,
        qrLogoUrl,
      };

      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, "")) || 2.99;

      await updateTemplate(id, {
        name,
        status,
        config,
        background_url: background_url || null,
        back_background_url: back_background_url || null,
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
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Edit Template
          </h1>
          <p className="text-sm text-gray-500">
            Customize design, default content, and settings.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={saving}
            className="min-w-[100px]"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Sticky Preview Area (Span 5) */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center justify-between bg-white p-2 rounded-lg border shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 px-2">
                Live Preview
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowBack((v) => !v)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Switch to {showBack ? "Front" : "Back"} View
              </Button>
            </div>

            {/* The Card Render */}
            <div
              className="w-full aspect-[1.75/1] rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-500"
              style={{
                backgroundColor: getPreviewBg() ? undefined : "#ffffff",
                backgroundImage: getPreviewBg()
                  ? `url(${getPreviewBg()})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="w-full h-full">
                {showBack ? (
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
                                    <div className="w-full h-full flex items-center justify-end p-8">
                                      <div className="flex flex-col text-right z-10">
                                        <h3
                    className="font-bold leading-tight mb-1"
                    style={{
                      color: fontColor,
                      fontFamily,
                      fontSize: fontSize + 8,  // Name bigger
                    }}
                  >
                    {previewData.name}
                  </h3>

                  <p
                    className="font-medium mb-2"
                    style={{
                      color: accentColor,
                      fontFamily,
                      fontSize: fontSize + 4, // Title medium
                    }}
                  >
                    {previewData.title}
                  </p>

                  <p
                    className="opacity-75"
                    style={{
                      color: fontColor,
                      fontFamily,
                      fontSize: fontSize, // Company normal
                    }}
                  >
                    {previewData.company}
                  </p>

                                      </div>
                                    </div>
                  // <div id="front-card" className="w-full h-full relative">
                  //   {/* NAME */}
                  //   <div
                  //     className="absolute cursor-move"
                  //     style={{
                  //       left: positions.name.x,
                  //       top: positions.name.y,
                  //       width: positions.name.w,
                  //       height: positions.name.h,
                  //       color: fontColor,
                  //       fontFamily,
                  //       fontSize: fontSize + 8,
                  //     }}
                  //     onMouseDown={(e) => onDragStart("name", e)}
                  //   >
                  //     {previewData.name}

                  //     {/* Resize handle */}
                  //     <span
                  //       className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded cursor-se-resize"
                  //       onMouseDown={(e) => onResizeStart("name", e)}
                  //     />
                  //   </div>

                  //   {/* TITLE */}
                  //   <div
                  //     className="absolute cursor-move"
                  //     style={{
                  //       left: positions.title.x,
                  //       top: positions.title.y,
                  //       width: positions.title.w,
                  //       height: positions.title.h,
                  //       color: accentColor,
                  //       fontFamily,
                  //       fontSize: fontSize + 4,
                  //     }}
                  //     onMouseDown={(e) => onDragStart("title", e)}
                  //   >
                  //     {previewData.title}

                  //     <span
                  //       className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded cursor-se-resize"
                  //       onMouseDown={(e) => onResizeStart("title", e)}
                  //     />
                  //   </div>

                  //   {/* COMPANY */}
                  //   <div
                  //     className="absolute cursor-move opacity-75"
                  //     style={{
                  //       left: positions.company.x,
                  //       top: positions.company.y,
                  //       width: positions.company.w,
                  //       height: positions.company.h,
                  //       color: fontColor,
                  //       fontFamily,
                  //       fontSize,
                  //     }}
                  //     onMouseDown={(e) => onDragStart("company", e)}
                  //   >
                  //     {previewData.company}

                  //     <span
                  //       className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded cursor-se-resize"
                  //       onMouseDown={(e) => onResizeStart("company", e)}
                  //     />
                  //   </div>
                  // </div>
                )}
              </div>
            </div>

            {/* Helper Tip */}
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
              <p>
                <strong>Tip:</strong> Changes to colors and fonts are reflected
                instantly. Use the tabs on the right to customize.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Form Controls (Span 7) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Custom Tab Navigation */}
            <div className="flex border-b bg-gray-50/50">
              {["general", "design", "qr", "content"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-black text-black bg-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab === "qr" ? "QR Code" : tab}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-6">
              {/* GENERAL TAB */}
              {activeTab === "general" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Template Name
                      </label>
                      <input
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                      >
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
                      <label htmlFor="prem" className="text-sm font-medium">
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
                      Thumbnail Image
                    </label>
                    <input
                      type="file"
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                      accept="image/*"
                      onChange={(e) =>
                        setThumbFile(e.target.files?.[0] ?? null)
                      }
                    />
                    {item.thumbnail_url && !thumbFile && (
                      <p className="text-xs text-gray-400">
                        Current: {item.thumbnail_url.split("/").pop()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* DESIGN TAB */}
              {activeTab === "design" && (
                <div className="space-y-6">
                  {/* Backgrounds Section */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900">
                      Backgrounds
                    </h3>

                    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <label className="text-sm font-medium block">
                        Front Background
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://..."
                          className="flex-1 border rounded-md px-3 py-2 text-sm"
                          value={bgUrlInput}
                          onChange={(e) => setBgUrlInput(e.target.value)}
                        />
                        <span className="text-xs self-center text-gray-400">
                          OR
                        </span>
                        <input
                          type="file"
                          className="w-1/3 text-xs"
                          accept="image/*"
                          onChange={(e) =>
                            setBgFile(e.target.files?.[0] ?? null)
                          }
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <label className="text-sm font-medium block">
                        Back Background
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://..."
                          className="flex-1 border rounded-md px-3 py-2 text-sm"
                          value={backBgUrlInput}
                          onChange={(e) => setBackBgUrlInput(e.target.value)}
                        />
                        <span className="text-xs self-center text-gray-400">
                          OR
                        </span>
                        <input
                          type="file"
                          className="w-1/3 text-xs"
                          accept="image/*"
                          onChange={(e) =>
                            setBackBgFile(e.target.files?.[0] ?? null)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t my-4"></div>

                  {/* Typography Section */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Primary Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          className="h-9 w-9 rounded cursor-pointer border-none"
                          value={fontColor}
                          onChange={(e) => setFontColor(e.target.value)}
                        />
                        <span className="text-xs font-mono text-gray-500">
                          {fontColor}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Accent Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          className="h-9 w-9 rounded cursor-pointer border-none"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                        />
                        <span className="text-xs font-mono text-gray-500">
                          {accentColor}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Base Font Size (px)
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Font Family</label>
                      <select
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                      >
                        <option value="Inter, Arial, sans-serif">
                          Inter (Clean)
                        </option>
                        <option value="Playfair Display, serif">
                          Playfair (Elegant)
                        </option>
                        <option value="Georgia, serif">
                          Georgia (Classic)
                        </option>
                        <option value="Courier New, monospace">
                          Courier (Retro)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* QR CODE TAB */}
              {activeTab === "qr" && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 mb-4">
                    Customize how the VCard QR looks on the back of the card.
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        QR Foreground Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          className="h-10 w-14 p-1 bg-white border rounded"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                        />
                        <div className="text-xs text-gray-500">
                          Usually Black or Dark Blue
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Center Logo URL
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        placeholder="https://... (Logo Icon)"
                        value={qrLogoUrl}
                        onChange={(e) => setQrLogoUrl(e.target.value)}
                      />
                      <p className="text-xs text-gray-400">
                        Paste a URL to a small, square logo (PNG/SVG) to appear
                        in the center.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENT TAB */}
              {activeTab === "content" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-2">
                    This data is only for previewing the design.
                  </p>
                  <BusinessCardForm
                    data={previewData}
                    onChange={setPreviewData}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTemplate;

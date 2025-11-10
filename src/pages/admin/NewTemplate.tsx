import { FormEvent, useState, useRef } from "react";
import { createTemplate, uploadTemplateAsset } from "@/services/templates";
import { useNavigate } from "react-router-dom";
import { BusinessCardForm, type BusinessCardData } from "@/components/BusinessCardForm";
import { BackSideCard } from "@/components/templates/BackSideCard";
import { Button } from "@/components/ui/button";

const NewTemplate = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [fontColor, setFontColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);
  const [accentColor, setAccentColor] = useState("#0ea5e9");
  const [fontFamily, setFontFamily] = useState<string>("Inter, Arial, sans-serif");
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [backBgFile, setBackBgFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showBack, setShowBack] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isPremium, setIsPremium] = useState(false);

  const [previewData, setPreviewData] = useState<BusinessCardData>({
    name: "Your Name",
    title: "Job Title",
    company: "Company Name",
    email: "email@example.com",
    phone: "+91 00000 00000",
    website: "your-website.com",
    address: "Your Address, City",
    logo: "",
  });

  const bgPreviewUrl = bgFile ? URL.createObjectURL(bgFile) : null;
  const backBgPreviewUrl = backBgFile ? URL.createObjectURL(backBgFile) : null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let background_url: string | null = null;
      let thumbnail_url: string | null = null;
      let back_background_url: string | null = null;
      const ts = Date.now();
      if (bgFile) {
        background_url = await uploadTemplateAsset(bgFile, `backgrounds/${ts}-${bgFile.name}`);
      }
      if (backBgFile) {
        back_background_url = await uploadTemplateAsset(backBgFile, `backgrounds/${ts}-back-${backBgFile.name}`);
      }
      if (thumbFile) {
        thumbnail_url = await uploadTemplateAsset(thumbFile, `thumbnails/${ts}-${thumbFile.name}`);
      }
      const config = { fontColor, fontSize, accentColor, fontFamily, premium: isPremium };
      const created = await createTemplate({ name, status, config, background_url, back_background_url, thumbnail_url });
      navigate(`/admin/templates/${created.id}/edit`, { replace: true });
    } catch (e: any) {
      setError(e.message ?? "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-4">New Template</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="border rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Live Preview</div>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowBack((v) => !v)}>
              {showBack ? "Show Front" : "Show Back"}
            </Button>
          </div>
          <div
            className="w-full aspect-[1.75/1] rounded-lg border overflow-hidden"
            style={{
              backgroundColor: !showBack ? (!bgPreviewUrl ? "#f3f4f6" : undefined) : (!backBgPreviewUrl ? "#f3f4f6" : undefined),
              backgroundImage: !showBack
                ? (bgPreviewUrl ? `url(${bgPreviewUrl})` : undefined)
                : (backBgPreviewUrl ? `url(${backBgPreviewUrl})` : undefined),
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div ref={cardRef} className="w-full h-full p-4">
              {showBack ? (
                <BackSideCard
                  data={previewData}
                  textColor={fontColor}
                  accentColor={accentColor}
                  fontFamily={fontFamily}
                  fontSize={fontSize}
                  showLargeQR={true}
                  transparentBg={true}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-end p-2" style={{ color: fontColor, fontFamily, fontSize }}>
                  <div className="flex flex-col text-right">
                    <h3 className="text-xl font-bold" style={{ color: fontColor }}>{previewData.name || "Your Name"}</h3>
                    <p style={{ color: accentColor }}>{previewData.title || "Job Title"}</p>
                    <p className="text-sm opacity-80">{previewData.company || "Company"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3">
            <BusinessCardForm data={previewData} onChange={setPreviewData} />
          </div>
        </div>
        <div>
          <label className="text-sm">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Status</label>
          <select className="w-full border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm block">Font Color</label>
            <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
          </div>
          <div>
            <label className="text-sm block">Font Size</label>
            <input type="number" className="border rounded px-2 py-1 w-24" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value || "0", 10))} />
          </div>
          <div>
            <label className="text-sm block">Accent Color</label>
            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} />
          </div>
          <div className="flex-1">
            <label className="text-sm block">Font Family</label>
            <select className="w-full border rounded px-3 py-2" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
              <option>Inter, Arial, sans-serif</option>
              <option>Arial, sans-serif</option>
              <option>Playfair Display, serif</option>
              <option>Georgia, serif</option>
              <option>Roboto, Arial, sans-serif</option>
            </select>
          </div>
          <div>
            <label className="text-sm block">Premium</label>
            <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
          </div>
        </div>
        <div>
          <label className="text-sm block">Background Image</label>
          <input type="file" accept="image/*" onChange={(e) => setBgFile(e.target.files?.[0] ?? null)} />
        </div>
        <div>
          <label className="text-sm block">Back Background Image</label>
          <input type="file" accept="image/*" onChange={(e) => setBackBgFile(e.target.files?.[0] ?? null)} />
        </div>
        <div>
          <label className="text-sm block">Thumbnail Image</label>
          <input type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files?.[0] ?? null)} />
        </div>
        <button type="submit" className="bg-black text-white rounded px-4 py-2 disabled:opacity-50" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default NewTemplate;

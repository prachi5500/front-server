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
import { PaymentModal } from "@/components/PaymentModal";

interface TemplateSelectorProps {
  data: BusinessCardData;
  selectedFont?: string;
  fontSize?: number;
  textColor?: string;
  accentColor?: string;
}

const templates = classicTemplates;

export const TemplateSelector = ({
  data,
  selectedFont = "Arial, sans-serif",
  fontSize = 16,
  textColor = "#000000",
  accentColor = "#0ea5e9"
}: TemplateSelectorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id ?? "classic-001");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previewRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const selectedConfig = templates.find((t) => t.id === selectedTemplate) || templates[0];
  const [page, setPage] = useState(0);
  const pageSize = 80;
  const [sbTemplates, setSbTemplates] = useState<Template[]>([]);
  const combined = [
    // Show admin/server templates first like before
    ...sbTemplates.map((t) => ({ kind: "server" as const, id: `sb:${t.id}`, server: t })),
    ...templates.map((t) => ({ kind: "classic" as const, id: t.id, classic: t })),
  ];
  const totalPages = Math.max(1, Math.ceil(combined.length / pageSize));
  const pagedTemplates = combined.slice(page * pageSize, page * pageSize + pageSize);
  const cartCtx = useCart();
  const navigate = useNavigate();
  const pricePerItem = 2.99;
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const defaultFont = "Arial, sans-serif";
  const defaultFontSize = 16;
  const defaultText = "#000000";
  const defaultAccent = "#0ea5e9";
  const hasOverrides =
    selectedFont !== defaultFont ||
    fontSize !== defaultFontSize ||
    textColor !== defaultText ||
    accentColor !== defaultAccent;

  // fetch admin/server templates
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await listPublishedTemplates();
        if (alive) setSbTemplates(Array.isArray(data) ? data : []);
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  // When server templates load, make sure we show page 1 where they appear first
  useEffect(() => {
    setPage(0);
  }, [Array.isArray(sbTemplates) ? sbTemplates.length : 0]);

  // Default select the first server template when available (previous behavior)
  useEffect(() => {
    const list = Array.isArray(sbTemplates) ? sbTemplates : [];
    if (list.length > 0 && !String(selectedTemplate).startsWith("sb:")) {
      setSelectedTemplate(`sb:${list[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Array.isArray(sbTemplates) ? sbTemplates.length : 0]);

  const addToCart = () => {
    const isServer = selectedTemplate.startsWith("sb:");
    const serverId = isServer ? selectedTemplate.slice(3) : "";
    const st = isServer ? sbTemplates.find(x => x.id === serverId) : undefined;
    cartCtx.add({
      id: selectedTemplate,
      kind: isServer ? "server" : "classic",
      data,
      selectedFont,
      fontSize,
      textColor,
      accentColor,
      price: pricePerItem,
      serverMeta: isServer ? { name: st?.name, background_url: st?.background_url, back_background_url: st?.back_background_url, config: st?.config } : undefined,
    });
    navigate("/cart");
  };

  const buyCurrent = () => {
    setIsPaymentOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Selected Design Preview</h2>
          <div className="flex items-center gap-2">
            <Button onClick={buyCurrent} size="sm" className="gap-2">Buy</Button>
            <Button onClick={addToCart} variant="outline" size="sm" className="gap-2">Add to Cart</Button>
          </div>
        </div>
        <div className="bg-gradient-to-br from-muted to-background p-8 rounded-lg">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {(() => {
              const isServer = selectedTemplate.startsWith("sb:");
              if (!isServer) {
                return (
                  <>
                    <div ref={previewRef} className="relative">
                      <div className="wm-screen-only" data-watermark="screen-only" />
                      {selectedConfig && (
                        <ClassicCard
                          data={data}
                          config={selectedConfig}
                          fontFamily={hasOverrides ? selectedFont : undefined}
                          fontSize={hasOverrides ? fontSize : undefined}
                          textColor={hasOverrides ? textColor : undefined}
                          accentColor={hasOverrides ? accentColor : undefined}
                        />
                      )}
                    </div>
                    <div ref={backRef} className="relative">
                      <div className="wm-screen-only" data-watermark="screen-only" />
                      {selectedConfig && (
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
                    </div>
                  </>
                );
              }
              const sid = selectedTemplate.slice(3);
              const t = sbTemplates.find(x => x.id === sid);
              const bg = t?.background_url || undefined;
              const backBg = t?.back_background_url || t?.background_url || undefined;
              const cfg: any = t?.config || {};
              const fc = hasOverrides ? textColor : (cfg.fontColor || "#000000");
              const fs = hasOverrides ? fontSize : (cfg.fontSize || 16);
              const accent = hasOverrides ? accentColor : (cfg.accentColor || "#0ea5e9");
              const ff = hasOverrides ? selectedFont : (cfg.fontFamily || "Inter, Arial, sans-serif");
              return (
                <>
                  <div ref={previewRef} className="w-full relative">
                    <div className="wm-screen-only" data-watermark="screen-only" />
                    <div
                      className="w-full aspect-[1.75/1] rounded-lg border overflow-hidden p-4 relative"
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
                      <div className="w-full h-full flex items-center justify-between gap-4">
                        {data.logo ? (
                          <div className="flex-shrink-0">
                            <img src={data.logo} alt="Logo" className="w-16 h-16 object-cover rounded-full border border-white/50 shadow" />
                          </div>
                        ) : <div />}
                        <div className="flex flex-col text-right leading-snug">
                          <h3 className="text-xl font-bold" style={{ fontFamily: ff }}>{data.name || "Your Name"}</h3>
                          <p style={{ color: accent }}>{data.title || "Job Title"}</p>
                          <p className="text-sm opacity-80">{data.company || "Company"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div ref={backRef} className="w-full relative">
                    <div className="wm-screen-only" data-watermark="screen-only" />
                    <div
                      className="w-full aspect-[1.75/1] rounded-lg border overflow-hidden"
                      style={{
                        backgroundColor: backBg ? undefined : "#f3f4f6",
                        backgroundImage: backBg ? `url(${backBg})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="w-full h-full p-4">
                        <BackSideCard
                          data={data}
                          textColor={fc}
                          accentColor={accent}
                          fontFamily={ff}
                          fontSize={fs}
                          showLargeQR={false}
                          qrSize={68}
                          compact={true}
                          transparentBg={true}
                        />
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Classic Templates</h2>
        {combined.length === 0 ? (
          <div className="text-sm text-muted-foreground">No classic templates available.</div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {pagedTemplates.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => setSelectedTemplate(item.id)}
                className={`group relative rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                  selectedTemplate === item.id
                    ? "border-primary shadow-[var(--shadow-hover)]"
                    : "border-border hover:border-primary/50 hover:shadow-[var(--shadow-card)]"
                }`}
              >
                {selectedTemplate === item.id && (
                  <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                {item.kind === "classic" ? (
                  <>
                    <div
                      ref={(el) => { cardRefs.current[item.id] = el; }}
                      className="pointer-events-none aspect-[1.75/1] w-full relative"
                    >
                      <ClassicCard
                        data={data}
                        config={item.classic}
                        fontFamily={hasOverrides ? selectedFont : undefined}
                        fontSize={hasOverrides ? fontSize : undefined}
                        textColor={hasOverrides ? textColor : undefined}
                        accentColor={hasOverrides ? accentColor : undefined}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white font-medium text-sm">{item.classic.name}</p>
                    </div>
                  </>
                ) : (
                  <>
                    {(() => {
                      const t = item.server;
                      const bg = t?.thumbnail_url || t?.background_url || undefined;
                      const cfg: any = t?.config || {};
                      const fc = cfg.fontColor || "#000000";
                      const fs = cfg.fontSize || 16;
                      const accent = cfg.accentColor || "#0ea5e9";
                      const ff = cfg.fontFamily || "Inter, Arial, sans-serif";
                      const nameSize = Math.max(18, fs + 4);
                      const titleSize = Math.max(16, fs + 2);
                      return (
                        <div
                          className="pointer-events-none aspect-[1.75/1] w-full relative"
                          style={{
                            backgroundColor: bg ? undefined : "#f3f4f6",
                            backgroundImage: bg ? `url(${bg})` : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            color: fc,
                            fontFamily: ff,
                          }}
                        >
                          <div className="w-full h-full px-5 py-4 flex items-center justify-between gap-4">
                            {data.logo ? (
                              <div className="flex-shrink-0">
                                <img src={data.logo} alt="Logo" className="w-16 h-16 object-cover rounded-full border border-white/50 shadow" />
                              </div>
                            ) : <div />}
                            <div className="flex flex-col text-right leading-snug">
                              <div className="font-semibold" style={{ fontFamily: ff, fontSize: nameSize }}>
                                {data.name || "Your Name"}
                              </div>
                              <div style={{ color: accent, fontSize: titleSize }}>{data.title || "Job Title"}</div>
                              <div className="opacity-80" style={{ fontSize: Math.max(14, fs) }}>{data.company || "Company"}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white font-medium text-sm">{item.server?.name || "Template"}</p>
                    </div>
                  </>
                )}
              </button>
              {/* tile quick download removed in commerce flow */}
            </div>
          ))}
        </div>
        )}
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
              Prev
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </div>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
              Next
            </Button>
          </div>
        )}
      </div>
      {/* Cart summary moved to dedicated Cart page */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        itemName={(selectedTemplate.startsWith("sb:") ? (sbTemplates.find(x => x.id === selectedTemplate.slice(3))?.name) : (selectedConfig?.name)) || "Business Card"}
        price={`$${pricePerItem.toFixed(2)}`}
        onPaymentComplete={() => {
          // Download both front and back for current selection
          if (previewRef.current) downloadAsImage(previewRef.current, `${selectedTemplate}-front`);
          if (backRef.current) downloadAsImage(backRef.current, `${selectedTemplate}-back`);
          setIsPaymentOpen(false);
        }}
      />
    </div>
  );
};

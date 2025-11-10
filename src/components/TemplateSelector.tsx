import { useEffect, useState, useRef } from "react";
import { BusinessCardData } from "./BusinessCardForm";
import { ClassicCard } from "./templates/ClassicCard";
import { Check, Download } from "lucide-react";
import { downloadAsImage } from "@/lib/utils";
import { Button } from "./ui/button";
import { classicTemplates } from "@/lib/classicTemplates";
import { BackSideCard } from "./templates/BackSideCard";
import { QRCodeSVG } from "qrcode.react";
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
  const [sbTemplates, setSbTemplates] = useState<Template[]>([]);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const previewRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const selectedConfig = templates.find((t) => t.id === selectedTemplate) || templates[0];
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<"front" | "back" | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listPublishedTemplates();
        if (mounted) setSbTemplates(Array.isArray(data) ? data : []);
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  // If admin-created templates exist, default select the first one
  useEffect(() => {
    const list = Array.isArray(sbTemplates) ? sbTemplates : [];
    if (list.length > 0 && !selectedTemplate.startsWith("sb:")) {
      setSelectedTemplate(`sb:${list[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Array.isArray(sbTemplates) ? sbTemplates.length : 0]);

  const defaultFont = "Arial, sans-serif";
  const defaultFontSize = 16;
  const defaultText = "#000000";
  const defaultAccent = "#0ea5e9";
  const hasOverrides =
    selectedFont !== defaultFont ||
    fontSize !== defaultFontSize ||
    textColor !== defaultText ||
    accentColor !== defaultAccent;

  const selectedIsSb = selectedTemplate.startsWith("sb:");
  const selectedSbId = selectedIsSb ? selectedTemplate.slice(3) : "";
  const selectedSb = (Array.isArray(sbTemplates) ? sbTemplates : []).find(x => x.id === selectedSbId);
  const isSelectedPremium = !!selectedSb?.config?.premium;
  const selectedPrice = (selectedSb as any)?.config?.price || "$2.99";

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Selected Design Preview</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                if (selectedIsSb && isSelectedPremium) {
                  setPendingDownload("front");
                  setIsPaymentOpen(true);
                  return;
                }
                previewRef.current && downloadAsImage(previewRef.current, `${selectedTemplate}-front`);
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download Front
            </Button>
            <Button
              onClick={() => {
                if (selectedIsSb && isSelectedPremium) {
                  setPendingDownload("back");
                  setIsPaymentOpen(true);
                  return;
                }
                backRef.current && downloadAsImage(backRef.current, `${selectedTemplate}-back`);
              }}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download Back
            </Button>
          </div>
        </div>
        <div className="bg-gradient-to-br from-muted to-background p-8 rounded-lg">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {selectedTemplate.startsWith("sb:") ? (
              <>
                <div ref={previewRef} className="w-full">
                  {(() => {
                    const id = selectedTemplate.slice(3);
                    const t = (Array.isArray(sbTemplates) ? sbTemplates : []).find(x => x.id === id);
                    const bg = t?.background_url || undefined;
                    const cfg: any = t?.config || {};
                    const fc = hasOverrides ? textColor : (cfg.fontColor || "#000000");
                    const fs = hasOverrides ? fontSize : (cfg.fontSize || 16);
                    const accent = hasOverrides ? accentColor : (cfg.accentColor || "#0ea5e9");
                    const ff = hasOverrides ? selectedFont : (cfg.fontFamily || "Inter, Arial, sans-serif");
                    return (
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
                        {t?.config?.premium ? (
                          <div className="absolute top-2 left-2 z-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-1 rounded-md text-xs font-semibold shadow">
                            Premium
                          </div>
                        ) : (
                          <div className="absolute top-2 left-2 z-20 bg-black/60 text-white px-2 py-1 rounded-md text-xs font-semibold shadow">
                            Free
                          </div>
                        )}
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
                    );
                  })()}
                </div>
                <div ref={backRef} className="w-full">
                  {(() => {
                    const id = selectedTemplate.slice(3);
                    const t = (Array.isArray(sbTemplates) ? sbTemplates : []).find(x => x.id === id);
                    const backBg = t?.back_background_url || t?.background_url || undefined;
                    const cfg: any = t?.config || {};
                    const fc = hasOverrides ? textColor : (cfg.fontColor || "#000000");
                    const accent = hasOverrides ? accentColor : (cfg.accentColor || "#0ea5e9");
                    const ff = hasOverrides ? selectedFont : (cfg.fontFamily || "Inter, Arial, sans-serif");
                    const fs = hasOverrides ? fontSize : (cfg.fontSize || 16);
                    const containerStyle = {
                      backgroundColor: backBg ? undefined : "#f3f4f6",
                      backgroundImage: backBg ? `url(${backBg})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    } as React.CSSProperties;
                    return (
                      <div className="w-full aspect-[1.75/1] rounded-lg border overflow-hidden" style={containerStyle}>
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
                    );
                  })()}
                </div>
              </>
            ) : (
              <>
                <div ref={previewRef}>
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
                <div ref={backRef}>
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
            )}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Classic Templates</h2>
        {templates.length === 0 && (Array.isArray(sbTemplates) ? sbTemplates.length : 0) === 0 ? (
          <div className="text-sm text-muted-foreground">No classic templates available.</div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            ...(Array.isArray(sbTemplates) ? sbTemplates.map((t) => ({ kind: "sb" as const, t })) : []),
            ...templates.map((template) => ({ kind: "classic" as const, template })),
          ].map((item) => {
            if (item.kind === "classic") {
              const template = item.template;
              return (
                <div key={template.id} className="relative">
                  <button
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`group relative rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                      selectedTemplate === template.id
                        ? "border-primary shadow-[var(--shadow-hover)]"
                        : "border-border hover:border-primary/50 hover:shadow-[var(--shadow-card)]"
                    }`}
                  >
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      ref={(el) => {
                        cardRefs.current[template.id] = el;
                      }}
                      className="pointer-events-none aspect-[1.75/1] w-full"
                    >
                      <ClassicCard
                        data={data}
                        config={template}
                        fontFamily={hasOverrides ? selectedFont : undefined}
                        fontSize={hasOverrides ? fontSize : undefined}
                        textColor={hasOverrides ? textColor : undefined}
                        accentColor={hasOverrides ? accentColor : undefined}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white font-medium text-sm">{template.name}</p>
                    </div>
                  </button>
                  <button
                    onClick={() => cardRefs.current[template.id] && downloadAsImage(cardRefs.current[template.id] as HTMLElement, template.name)}
                    className="absolute top-2 left-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Download template"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              );
            } else {
              const t = item.t;
              const isSelected = selectedTemplate === `sb:${t.id}`;
              const bg = t.thumbnail_url || t.background_url || undefined;
              const cfg: any = t.config || {};
              const fc = cfg.fontColor || "#000000";
              const fs = cfg.fontSize || 16;
              return (
                <div key={`sb-${t.id}`} className="relative">
                  <button
                    onClick={() => setSelectedTemplate(`sb:${t.id}`)}
                    className={`group relative rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                      isSelected ? "border-primary shadow-[var(--shadow-hover)]" : "border-border hover:border-primary/50 hover:shadow-[var(--shadow-card)]"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 z-10">
                      {t?.config?.premium ? (
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-1 rounded-md text-xs font-semibold shadow">
                          Premium
                        </div>
                      ) : (
                        <div className="bg-black/60 text-white px-2 py-1 rounded-md text-xs font-semibold shadow">
                          Free
                        </div>
                      )}
                    </div>
                    <div
                      className="pointer-events-none aspect-[1.75/1] w-full flex items-center justify-center"
                      style={{
                        backgroundColor: bg ? undefined : "#f3f4f6",
                        backgroundImage: bg ? `url(${bg})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Simple text preview using config */}
                      <div className="text-center px-3" style={{ color: fc }}>
                        <div className="font-semibold" style={{ fontSize: Math.max(12, fs) }}>
                          {t.name || "Template"}
                        </div>
                        <div className="opacity-80" style={{ fontSize: Math.max(10, fs - 2) }}>
                          Sample • Phone • Email
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white font-medium text-sm">{t.name}</p>
                    </div>
                  </button>
                </div>
              );
            }
          })}
        </div>
        )}
      </div>
      {selectedIsSb && isSelectedPremium && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          itemName={selectedSb?.name || "Premium Template"}
          price={selectedPrice}
          onPaymentComplete={() => {
            if (pendingDownload === "front") {
              previewRef.current && downloadAsImage(previewRef.current, `${selectedTemplate}-front`);
            } else if (pendingDownload === "back") {
              backRef.current && downloadAsImage(backRef.current, `${selectedTemplate}-back`);
            }
            setPendingDownload(null);
          }}
        />
      )}
    </div>
  );
};

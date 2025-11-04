import { useState, useRef } from "react";
import { BusinessCardData } from "./BusinessCardForm";
import { ClassicCard } from "./templates/ClassicCard";
import { Check, Download } from "lucide-react";
import { downloadAsImage } from "@/lib/utils";
import { Button } from "./ui/button";
import { classicTemplates } from "@/lib/classicTemplates";
import { BackSideCard } from "./templates/BackSideCard";

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

  const defaultFont = "Arial, sans-serif";
  const defaultFontSize = 16;
  const defaultText = "#000000";
  const defaultAccent = "#0ea5e9";
  const hasOverrides =
    selectedFont !== defaultFont ||
    fontSize !== defaultFontSize ||
    textColor !== defaultText ||
    accentColor !== defaultAccent;

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Selected Design Preview</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => previewRef.current && downloadAsImage(previewRef.current, `${selectedTemplate}-front`)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Download Front
            </Button>
            <Button
              onClick={() => backRef.current && downloadAsImage(backRef.current, `${selectedTemplate}-back`)}
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
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Choose Template</h2>
        {templates.length === 0 ? (
          <div className="text-sm text-muted-foreground">No classic templates available.</div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {templates.map((template) => {
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
          })}
        </div>
        )}
      </div>
    </div>
  );
};

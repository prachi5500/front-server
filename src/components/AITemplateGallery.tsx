import { useState, useEffect, useRef } from "react";
import { BusinessCardData } from "./BusinessCardForm";
import { DynamicCard } from "./templates/DynamicCard";
import { Button } from "./ui/button";
import { Loader2, Sparkles, Check, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateDesigns } from "@/services/designService";
import { downloadAsImage } from "@/lib/utils";

interface TemplateCardProps {
  design: any;
  index: number;
  selectedDesignId?: string;
  onSelectTemplate: (designConfig: any) => void;
  data: BusinessCardData;
}

const TemplateCard = ({ design, index, selectedDesignId, onSelectTemplate, data }: TemplateCardProps): JSX.Element => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cardRef.current) {
      downloadAsImage(cardRef.current, `business-card-${design.id}.png`);
    }
  };

  return (
    <div className="relative group cursor-pointer" onClick={() => onSelectTemplate(design)}>
      <div ref={cardRef} className="aspect-[1.75/1]">
        <DynamicCard data={data} designConfig={design} />
      </div>
      {selectedDesignId === design.id && (
        <>
          <div className="absolute top-2 left-2">
            <Check className="w-4 h-4 text-green-500 bg-white rounded-full p-1" />
          </div>
          <div className="absolute top-2 right-2">
            <Button size="sm" onClick={handleDownload} variant="secondary">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

interface AITemplateGalleryProps {
  data: BusinessCardData;
  onSelectTemplate: (designConfig: any) => void;
  selectedDesignId?: string;
}

export const AITemplateGallery = ({ data, onSelectTemplate, selectedDesignId }: AITemplateGalleryProps) => {
  const [designs, setDesigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

    const requestDesigns = async (count: number = 100) => {
    setIsLoading(true);
    try {
      const designs = await generateDesigns(count, data);
      
      // Process and validate the designs
      if (!Array.isArray(designs)) {
        throw new Error('Invalid response format from AI service');
      }

      const processedDesigns = designs.map((design: any, index: number) => ({
        id: design.id || `design-${index}`,
        name: design.name || `Design ${index + 1}`,
        bgStyle: design.bgStyle || 'gradient',
        bgColors: Array.isArray(design.bgColors) ? design.bgColors : ['#ffffff', '#f0f0f0'],
        textColor: design.textColor || '#000000',
        accentColor: design.accentColor || '#0ea5e9',
        layout: design.layout || 'centered',
        decoration: design.decoration || 'none',
        fontWeight: design.fontWeight || 'normal',
        fontFamily: design.fontFamily || 'Arial',
        borderStyle: design.borderStyle || 'none'
      }));

      setDesigns(processedDesigns);

      toast({
        title: "Success!",
        description: `Generated ${processedDesigns.length} unique business card designs`,
      });
    } catch (error: any) {
      console.error('Error generating designs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate designs",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestDesigns(100);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI-Generated Templates
        </h2>
        <Button
          onClick={() => requestDesigns(100)}
          disabled={isLoading}
          variant="outline"
          className="gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Regenerate
            </>
          )}
        </Button>
      </div>

      {isLoading && designs.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="aspect-[1.75/1] bg-muted rounded-lg animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {designs.map((design, index) => (
            <TemplateCard
              key={design.id}
              design={design}
              index={index}
              selectedDesignId={selectedDesignId}
              onSelectTemplate={onSelectTemplate}
              data={data}
            />
          ))}
        </div>
      )}
    </div>
  );
};

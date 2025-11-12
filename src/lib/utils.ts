import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import html2canvas from "html2canvas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const downloadAsImage = async (element: HTMLElement, filename: string) => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // Higher resolution
      useCORS: true,
      ignoreElements: (el: Element) => {
        if (!(el instanceof HTMLElement)) return false;
        // Skip screen-only watermarks/overlays from the exported image
        return (
          el.dataset.watermark === "screen-only" ||
          el.classList.contains("wm-screen-only") ||
          el.id === "anti-capture-overlay"
        );
      },
    });
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error downloading image:', error);
  }
};

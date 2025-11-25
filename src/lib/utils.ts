import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import html2canvas from "html2canvas";
import { apiUpload } from "@/services/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sirf local download ke liye (agar kahin use ho raha ho)
export const downloadAsImage = async (
  element: HTMLElement,
  filename: string
) => {
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
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

// 👉 Naya helper: element ko capture karke server par upload karo, URL return karega
export const captureElementAndUpload = async (
  element: HTMLElement,
  filenamePrefix: string
): Promise<string | null> => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      ignoreElements: (el: Element) => {
        if (!(el instanceof HTMLElement)) return false;
        return (
          el.dataset.watermark === "screen-only" ||
          el.classList.contains("wm-screen-only") ||
          el.id === "anti-capture-overlay"
        );
      },
    });

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png", 1)
    );
    if (!blob) return null;

    const file = new File([blob], `${filenamePrefix}.png`, {
      type: "image/png",
    });

    const res = await apiUpload("/upload", file);
    return (res as any).url || null;
  } catch (err) {
    console.error("captureElementAndUpload error", err);
    return null;
  }
};

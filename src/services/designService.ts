import { BusinessCardData } from "@/components/BusinessCardForm";
import { generateDesignsWithGemini } from "@/lib/gemini-designs";

const HUGGING_FACE_TOKEN = import.meta.env.VITE_HUGGING_FACE_API_KEY;

// 🔹 NEW: Added optional OpenAI fallback support
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function toHex(n: number) {
  const h = Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return h;
}

function parseHex(hex: string) {
  const v = hex.replace("#", "");
  const r = parseInt(v.substring(0, 2), 16);
  const g = parseInt(v.substring(2, 4), 16);
  const b = parseInt(v.substring(4, 6), 16);
  return { r, g, b };
}

function shiftColor(hex: string, shift: number) {
  try {
    const { r, g, b } = parseHex(hex.length >= 7 ? hex : "#000000");
    const rr = toHex(r + shift);
    const gg = toHex(g + shift * 0.6);
    const bb = toHex(b + shift * 0.3);
    return `#${rr}${gg}${bb}`;
  } catch {
    return hex;
  }
}

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

function normFront(d: any) {
  const front = d?.front || d || {};
  return {
    bgStyle: front.bgStyle || "gradient",
    bgColors: Array.isArray(front.bgColors) && front.bgColors.length > 0 ? front.bgColors : ["#ffffff", "#f0f0f0"],
    textColor: front.textColor || "#0f172a",
    accentColor: front.accentColor || "#0ea5e9",
    layout: front.layout || "centered",
    decoration: front.decoration || "none",
    fontWeight: front.fontWeight || "normal",
    fontFamily: front.fontFamily || "Inter, Arial, sans-serif",
    borderStyle: front.borderStyle || "rounded",
    logoShape: front.logoShape || "circle",
  };
}

function signature(front: any) {
  const colors = (front.bgColors || []).join("-");
  return [front.bgStyle, colors, front.layout, front.decoration, front.fontFamily, front.accentColor, front.borderStyle].join("|");
}

function makeVariant(front: any, i: number) {
  const layouts = ["centered", "split", "left-align", "minimal", "diagonal"];
  const decos = ["lines", "dots", "shapes", "waves", "none"];
  const fonts = [
    "Inter, Arial, sans-serif",
    "Poppins, Arial, sans-serif",
    "Roboto, Arial, sans-serif",
    "Playfair Display, serif",
    "Lato, Arial, sans-serif",
  ];
  const s = (i + 1) * 6;
  const c0 = front.bgColors[0];
  const c1 = front.bgColors[1] ?? shiftColor(front.bgColors[0], 12);
  const accent = shiftColor(front.accentColor, s);
  return {
    ...front,
    bgStyle: i % 3 === 0 ? "gradient" : front.bgStyle,
    bgColors: [shiftColor(c0, s), shiftColor(c1, -s / 2)],
    layout: pick(layouts, i),
    decoration: pick(decos, i + 1),
    fontFamily: pick(fonts, i + 2),
    accentColor: accent,
  };
}

function ensureUniqueStylish(input: any[], count: number) {
  const uniq = new Map<string, any>();
  for (const d of input) {
    const f = normFront(d);
    const sig = signature(f);
    if (!uniq.has(sig)) uniq.set(sig, { id: d.id, name: d.name, front: f, back: d.back });
  }
  let arr = Array.from(uniq.values());
  let i = 0;
  while (arr.length < count && arr.length > 0 && i < count * 3) {
    const base = arr[i % arr.length].front;
    const v = makeVariant(base, i + 1);
    const sig = signature(v);
    if (!uniq.has(sig)) {
      const idx = arr.length + 1;
      arr.push({ id: `v-${idx}`, name: `Design ${idx}`, front: v, back: { includeQRCode: true, showEmail: true, showPhone: true, showWebsite: true, showAddress: true } });
      uniq.set(sig, true);
    }
    i++;
  }
  if (arr.length > count) arr = arr.slice(0, count);
  arr = arr.map((d, idx) => ({
    id: d.id || `design-${idx}`,
    name: d.name || `Design ${idx + 1}`,
    front: d.front || normFront(d),
    back:
      d.back || {
        showEmail: true,
        showPhone: true,
        showWebsite: true,
        showAddress: true,
        includeQRCode: true,
      },
  }));
  return arr;
}

export const generateDesigns = async (count: number, businessData: BusinessCardData) => {
  // ✅ Step 1: Try Gemini (for JSON-structured output)
  try {
    console.log("Attempting to generate designs with Gemini...");
    const designs = await generateDesignsWithGemini(count, businessData);
    if (designs && designs.length > 0) {
      console.log(`Successfully generated ${designs.length} designs with Gemini`);
      return ensureUniqueStylish(designs, count);
    }
  } catch (error) {
    console.warn("Gemini generation failed, falling back to next AI:", error);
  }

  // ✅ Step 2: Try Hugging Face (improved prompt for both front & back designs)
  if (HUGGING_FACE_TOKEN) {
    try {
      console.log("Attempting to generate designs with Hugging Face...");
      const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

      // 🔹 Improved prompt: added back-side elements, circular logo, more style diversity
    // 🆕 Richer design diversity prompt
const prompt = `Generate ${count} diverse, visually striking business card design objects as JSON.
Each object must have:
{
 "id": "unique-id",
 "name": "Creative name",
 "front": {
   "bgStyle": "gradient | mesh | pattern | glass",
   "bgColors": ["#hex1", "#hex2"],
   "textColor": "#hex",
   "accentColor": "#hex",
   "layout": "centered | split | diagonal | elegant | minimal",
   "decoration": "lines | dots | waves | shapes | mesh | none",
   "fontWeight": "normal | bold | semibold",
   "fontFamily": "Poppins | Inter | Roboto | Playfair Display | Lato",
   "borderStyle": "rounded | dashed | thin | none",
   "logoShape": "circle"
 },
 "back": {
   "inheritFrontTheme": true,
   "showEmail": true,
   "showPhone": true,
   "showWebsite": true,
   "showAddress": true,
   "includeQRCode": true
 }
}
Use premium color palettes (metallic, gradient, glass, pastel). 
Make every design unique, stylish, and professional.`;

      const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 4096,
            temperature: 0.9,
            top_p: 0.95,
          },
        }),
      });

      if (!response.ok) throw new Error(`Hugging Face API failed: ${response.statusText}`);
      const data = await response.json();

      let designs = [];
      if (Array.isArray(data) && data[0]?.generated_text) {
        const jsonMatch = data[0].generated_text.match(/\[([\s\S]*)\]/);
        designs = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      }

      if (designs.length > 0) {
        console.log("✅ Hugging Face generated designs successfully");
        return ensureUniqueStylish(designs, count);
      }
    } catch (error) {
      console.error("❌ Error generating with Hugging Face:", error);
    }
  }

  // ✅ Step 3: Try OpenAI fallback if available (optional)
  if (OPENAI_API_KEY) {
    try {
      console.log("Attempting to generate designs with OpenAI...");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `Generate ${count} unique and beautiful business card designs as a JSON array. 
Each design should include "front" and "back" as described in previous Hugging Face prompt.`,
            },
          ],
        }),
      });

      const json = await response.json();
      const text = json?.choices?.[0]?.message?.content || "";
      const match = text.match(/\[([\s\S]*)\]/);
      const designs = match ? JSON.parse(match[0]) : [];
      if (designs.length > 0) return ensureUniqueStylish(designs, count);
    } catch (err) {
      console.error("OpenAI fallback failed:", err);
    }
  }

  // ✅ Step 4: Final Fallback — Mock Data (improved designs)
  console.warn("⚠️ All AI services failed, using enhanced mock designs for preview.");
  const safeCount = Math.max(1, Math.min(count, 100));
  const palette = [
    ["#0ea5e9", "#0369a1"],
    ["#fbbf24", "#b45309"],
    ["#a855f7", "#6b21a8"],
    ["#22c55e", "#15803d"],
    ["#f43f5e", "#be123c"],
    ["#14b8a6", "#0f766e"],
    ["#3b82f6", "#1e3a8a"],
    ["#f59e0b", "#b45309"],
  ];

  const mock = Array.from({ length: safeCount }).map((_, i) => {
    const p = palette[i % palette.length];
    return {
      id: `mock-${i}`,
      name: `Design ${i + 1}`,
      front: {
        bgStyle: i % 2 === 0 ? "gradient" : "solid",
        bgColors: p,
        textColor: "#0f172a",
        accentColor: p[0],
        layout: ["centered", "split", "left-align", "minimal"][i % 4],
        decoration: ["dots", "lines", "shapes", "none"][i % 4],
        fontWeight: ["bold", "normal", "semibold"][i % 3],
        fontFamily: ["Arial", "Georgia", "Helvetica", "Verdana"][i % 4],
        borderStyle: ["rounded", "thin", "none"][i % 3],
        logoShape: "circle", // 🔹 Added
      },
      back: {
        showEmail: true,
        showPhone: true,
        showWebsite: true,
        showAddress: true,
        includeQRCode: true,
      },
    };
  });

  return ensureUniqueStylish(mock, count);
};

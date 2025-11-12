import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { classicTemplates } from "@/lib/classicTemplates";
import { ClassicCard } from "@/components/templates/ClassicCard";
import { BackSideCard } from "@/components/templates/BackSideCard";
import { downloadAsImage } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const frontRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const backRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const byId = useMemo(() => {
    const map: Record<string, any> = {};
    for (const t of classicTemplates) map[t.id] = t;
    return map;
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
  }, [items.length]);

  async function onPay() {
    if (processing || items.length === 0) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 400));
    for (const it of items) {
      const fid = it.id;
      const f = frontRefs.current[fid];
      const b = backRefs.current[fid];
      if (f) await downloadAsImage(f, `${fid}-front`);
      if (b) await downloadAsImage(b, `${fid}-back`);
      await new Promise((r) => setTimeout(r, 150));
    }
    clear();
    setProcessing(false);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        {items.length === 0 ? (
          <div className="text-muted-foreground">Your cart is empty.</div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {items.map((it) => (
                <div key={it.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <div className="font-medium">{it.id}</div>
                    <div className="text-sm text-muted-foreground">{it.data?.name || "Your Name"} • {it.data?.company || "Company"}</div>
                  </div>
                  <div className="text-sm">${it.price.toFixed(2)}</div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="font-semibold">Total</div>
                <div className="font-semibold">${total.toFixed(2)}</div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mb-10">
              <Button variant="outline" onClick={() => navigate("/cart")}>Back to Cart</Button>
              <Button onClick={onPay} disabled={processing}>{processing ? "Processing..." : "Pay Now"}</Button>
            </div>

            <div style={{ position: "absolute", left: -99999, top: -99999 }}>
              {items.map((it) => {
                const config = byId[it.id];
                if (!config) return null;
                return (
                  <div key={it.id}>
                    <div ref={(el) => { frontRefs.current[it.id] = el; }}>
                      <ClassicCard
                        data={it.data}
                        config={config}
                        fontFamily={it.selectedFont}
                        fontSize={it.fontSize}
                        textColor={it.textColor}
                        accentColor={it.accentColor}
                      />
                    </div>
                    <div ref={(el) => { backRefs.current[it.id] = el; }}>
                      <BackSideCard
                        data={it.data}
                        background={{
                          style: config.bgStyle === "solid" ? "solid" : "gradient",
                          colors: config.bgColors,
                        }}
                        textColor={it.textColor}
                        accentColor={it.accentColor}
                        fontFamily={it.selectedFont}
                        fontSize={it.fontSize}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

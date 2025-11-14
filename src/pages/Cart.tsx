import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import { PaymentModal } from "@/components/PaymentModal";
import { downloadAsImage } from "@/lib/utils";
import { classicTemplates } from "@/lib/classicTemplates";
import { ClassicCard } from "@/components/templates/ClassicCard";
import { BackSideCard } from "@/components/templates/BackSideCard";

export default function CartPage() {
  const { items, remove, clear, total } = useCart();
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const frontRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const backRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const byId = useMemo(() => {
    const map: Record<string, any> = {};
    for (const t of classicTemplates) map[t.id] = t;
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Cart</h1>
        {items.length === 0 ? (
          <div className="text-muted-foreground">Your cart is empty.</div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <div className="font-medium">{it.id}</div>
                  <div className="text-sm text-muted-foreground">{it.data?.name || "Your Name"} • {it.data?.company || "Company"}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm">${it.price.toFixed(2)}</div>
                  <Button variant="outline" size="sm" onClick={() => remove(it.id)}>Remove</Button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-4">
              <div className="font-semibold">Total</div>
              <div className="font-semibold">${total.toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={clear}>Clear</Button>
              <Button onClick={() => setIsPaymentOpen(true)}>Buy Now</Button>
            </div>
            {/* hidden render targets for download after payment */}
            <div style={{ position: "absolute", left: -99999, top: -99999 }}>
              {items.map((it) => {
                if (it.kind === "classic") {
                  const config = byId[it.id];
                  if (!config) return null;
                  return (
                    <div key={`dl-${it.id}`}>
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
                }
                // server/admin template render for download
                const bg = it.serverMeta?.background_url || undefined;
                const backBg = it.serverMeta?.back_background_url || it.serverMeta?.background_url || undefined;
                const fc = it.textColor || (it.serverMeta?.config?.fontColor || "#000000");
                const fs = it.fontSize || (it.serverMeta?.config?.fontSize || 16);
                const accent = it.accentColor || (it.serverMeta?.config?.accentColor || "#0ea5e9");
                const ff = it.selectedFont || (it.serverMeta?.config?.fontFamily || "Inter, Arial, sans-serif");
                return (
                  <div key={`dl-${it.id}`}>
                    <div
                      ref={(el) => { frontRefs.current[it.id] = el; }}
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
                        {it.data.logo ? (
                          <div className="flex-shrink-0">
                            <img src={it.data.logo} alt="Logo" className="w-16 h-16 object-cover rounded-full border border-white/50 shadow" />
                          </div>
                        ) : <div />}
                        <div className="flex flex-col text-right leading-snug">
                          <h3 className="text-xl font-bold" style={{ fontFamily: ff }}>{it.data.name || "Your Name"}</h3>
                          <p style={{ color: accent }}>{it.data.title || "Job Title"}</p>
                          <p className="text-sm opacity-80">{it.data.company || "Company"}</p>
                        </div>
                      </div>
                    </div>
                    <div ref={(el) => { backRefs.current[it.id] = el; }}>
                      <BackSideCard
                        data={it.data}
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
              })}
            </div>
            <PaymentModal
              isOpen={isPaymentOpen}
              onClose={() => setIsPaymentOpen(false)}
              itemName={`Cart (${items.length} items)`}
              price={`$${total.toFixed(2)}`}
              onPaymentComplete={async () => {
                for (const it of items) {
                  if (frontRefs.current[it.id]) await downloadAsImage(frontRefs.current[it.id]!, `${it.id}-front`);
                  if (backRefs.current[it.id]) await downloadAsImage(backRefs.current[it.id]!, `${it.id}-back`);
                }
                clear();
                setIsPaymentOpen(false);
                navigate("/");
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
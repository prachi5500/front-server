import type React from "react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";
import { classicTemplates } from "@/lib/classicTemplates";
import { listAllTemplates, type Template } from "@/services/templates";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { saveAs } from "file-saver";

interface CardData {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  designation?: string;
  website?: string;
  address?: string;
  [key: string]: any;
}

interface OrderedItem {
  templateId: string;
  title?: string | null;
  price?: number | null;
  templateName?: string | null;
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  pdfUrl?: string | null;
  data?: {
    frontData?: CardData;
    backData?: CardData;
  } | null;
}

interface Payment {
  _id: string;
  amount?: number;
  currency: string;
  status?: string;
  createdAt: string;
  payment_type?: string | null;
  payment_method?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  items?: OrderedItem[];
}

export default function MyOrders() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<{
    payment: Payment;
    item: OrderedItem;
  } | null>(null);

  // Image-download removed: only PDF downloads are supported now.

  const handleDownloadPdf = async (item: OrderedItem) => {
    try {
      if (!item.pdfUrl) {
        alert("PDF not available for this card.");
        return;
      }
      const res = await fetch(item.pdfUrl);
      if (!res.ok) throw new Error("Failed to fetch PDF");
      const blob = await res.blob();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      saveAs(blob, `business-card-${item.templateId || 'download'}-${timestamp}.pdf`);
    } catch (err) {
      console.error('Error downloading pdf:', err);
      alert('Failed to download PDF. Please try again.');
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch("/payments/my");
        const data = res as any;
        setPayments(data.payments || []);
      } catch (e: any) {
        setError(e.message || "Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await listAllTemplates();
        if (alive && Array.isArray(all)) {
          setTemplates(all);
        }
      } catch {
        // ignore template load errors on orders page
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const renderCardField = (label: string, value: any) => {
    if (!value) return null;
    return (
      <div className="text-xs">
        <span className="font-medium">{label}:</span> {value}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/40">
      <main className="container mx-auto max-w-3xl px-4 py-10 flex-grow">
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="text-sm text-muted-foreground">
            View your previous card orders and payment status.
          </p>
        </div>

        {loading && <p className="text-sm">Loading your orders...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && payments.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You don't have any orders yet.
          </p>
        )}

        {!loading && payments.length > 0 && (
          <div className="space-y-4">
            {payments.map((p) => {
              const status = (p.status || "").toLowerCase();
              let statusColor = "bg-gray-100 text-gray-800";
              if (status === "captured" || status === "success") {
                statusColor = "bg-green-100 text-green-800";
              } else if (status === "failed") {
                statusColor = "bg-red-100 text-red-800";
              } else if (status === "pending" || status === "created") {
                statusColor = "bg-yellow-100 text-yellow-800";
              }

              const hasItems = (p.items || []).length > 0;

              return (
                <div
                  key={p._id}
                  className="border rounded-lg p-4 shadow-sm bg-card space-y-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">
                        Order on {new Date(p.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Payment type: {p.payment_type || "-"} · Method:{" "}
                        {p.payment_method || "-"}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-semibold">
                        ₹{p.amount != null ? p.amount.toFixed(2) : "-"}{" "}
                        {p.currency}
                      </div>
                      <span
                        className={
                          "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase " +
                          statusColor
                        }
                      >
                        {p.status || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t text-xs md:text-sm">
                    <div className="font-medium mb-1">Ordered cards</div>
                    {hasItems ? (
                      <div className="space-y-2">
                        {(p.items || []).map((item, idx) => {
                          const rawId = item.templateId || "";
                          const isServer = rawId.startsWith("sb:");
                          const serverId = isServer ? rawId.slice(3) : rawId;
                          const serverTemplate = templates.find(
                            (t) => t.id === serverId
                          );
                          const classicTemplate = classicTemplates.find(
                            (t) => t.id === rawId
                          );

                          let previewStyle: React.CSSProperties | undefined;
                          if (classicTemplate) {
                            if (
                              classicTemplate.bgStyle === "gradient" &&
                              classicTemplate.bgColors.length >= 2
                            ) {
                              previewStyle = {
                                background: `linear-gradient(135deg, ${classicTemplate.bgColors[0]}, ${classicTemplate.bgColors[1]})`,
                              };
                            } else {
                              previewStyle = {
                                backgroundColor: classicTemplate.bgColors[0],
                              };
                            }
                          }

                          const displayName =
                            item.templateName ||
                            serverTemplate?.name ||
                            classicTemplate?.name ||
                            rawId;

                          const itemAny = item as any;

                          // FRONT thumbnail in list: prefer saved front image, fall back to template assets
                          const listFrontSrc =
                            itemAny.frontImageUrl ||
                            serverTemplate?.thumbnail_url ||
                            (serverTemplate as any)?.background_url ||
                            serverTemplate?.back_background_url ||
                            null;

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/60 rounded-md px-2 py-1"
                              onClick={() => setSelected({ payment: p, item })}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {listFrontSrc ? (
                                  <img
                                    src={listFrontSrc}
                                    alt={`${displayName} (front)`}
                                    className="h-14 w-24 object-cover rounded border"
                                  />
                                ) : classicTemplate ? (
                                  <div
                                    className="h-14 w-24 rounded border shadow-sm"
                                    style={previewStyle}
                                  />
                                ) : (
                                  <div className="h-14 w-24 rounded border bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                                    No preview
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <div className="font-medium truncate">
                                    {displayName}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground truncate">
                                    For: {item.title || "Business Card"}
                                  </div>
                                  {item.data?.frontData?.name && (
                                    <div className="text-[11px] text-muted-foreground truncate">
                                      {item.data.frontData.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right whitespace-nowrap">
                                <div className="mt-4 flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelected({ payment: p, item });
                                    }}
                                  >
                                    View Details
                                  </Button>
                                  {/* Image downloads removed — only PDF download is available */}

                                  {item.pdfUrl && (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadPdf(item);
                                      }}
                                      className="gap-1"
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                      PDF
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-[11px]">
                        No card items saved for this order.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selected && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
            <div className="bg-card max-w-4xl w-full rounded-xl shadow-2xl border border-border p-4 md:p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80"
                onClick={() => setSelected(null)}
              >
                Close
              </button>

              {/* Image download (removed). Use the 'Download PDF' button if available. */}

              {selected.item.pdfUrl && (
                <button
                  type="button"
                  className="absolute top-3 right-32 text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-1"
                  onClick={() => handleDownloadPdf(selected.item)}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </button>
              )}

              {(() => {
                const payment = selected.payment;
                const item = selected.item;
                const rawId = item.templateId || "";
                const isServer = rawId.startsWith("sb:");
                const serverId = isServer ? rawId.slice(3) : rawId;
                const serverTemplate = templates.find(
                  (t) => t.id === serverId
                );
                const classicTemplate = classicTemplates.find(
                  (t) => t.id === rawId
                );

                let previewStyle: React.CSSProperties | undefined;
                if (classicTemplate) {
                  if (
                    classicTemplate.bgStyle === "gradient" &&
                    classicTemplate.bgColors.length >= 2
                  ) {
                    previewStyle = {
                      background: `linear-gradient(135deg, ${classicTemplate.bgColors[0]}, ${classicTemplate.bgColors[1]})`,
                    };
                  } else {
                    previewStyle = {
                      backgroundColor: classicTemplate.bgColors[0],
                    };
                  }
                }

                const displayName =
                  item.templateName ||
                  serverTemplate?.name ||
                  classicTemplate?.name ||
                  rawId;

                const fullAddress = [
                  payment.address_line1,
                  payment.address_line2,
                  payment.city,
                  payment.state,
                  payment.pincode,
                ]
                  .filter(Boolean)
                  .join(", ") || "-";

                const itemAny = item as any;

                // Front image in modal
                const modalFrontSrc =
                  itemAny.frontImageUrl ||
                  serverTemplate?.thumbnail_url ||
                  (serverTemplate as any)?.background_url ||
                  serverTemplate?.back_background_url ||
                  null;

                // Back image in modal
                const modalBackSrc =
                  itemAny.backImageUrl ||
                  serverTemplate?.back_background_url ||
                  serverTemplate?.thumbnail_url ||
                  (serverTemplate as any)?.background_url ||
                  null;

                return (
                  <div className="space-y-4 text-sm">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">
                        Card details
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Order on{" "}
                        {new Date(payment.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* FRONT */}
                      <div className="w-full lg:w-1/3 flex flex-col gap-2">
                        <div className="text-[11px] font-medium text-muted-foreground">
                          Front
                        </div>
                        <div className="flex items-center justify-center">
                          {modalFrontSrc ? (
                            <img
                              src={modalFrontSrc}
                              alt={displayName}
                              className="w-full rounded-lg border object-cover"
                            />
                          ) : classicTemplate ? (
                            <div
                              className="w-full aspect-[1.75/1] rounded-lg border shadow-sm"
                              style={previewStyle}
                            />
                          ) : (
                            <div className="w-full aspect-[1.75/1] rounded-lg border bg-muted flex items-center justify-center text-[11px] text-muted-foreground">
                              No preview
                            </div>
                          )}
                        </div>
                        {/* Front Side Data */}
                        {item.data?.frontData && (
                          <div className="mt-2 p-3 bg-muted/20 rounded-lg border border-border">
                            <h4 className="text-xs font-medium mb-2 text-muted-foreground">
                              Front Side Details
                            </h4>
                            {Object.entries(item.data.frontData).map(([key, value]) =>
                              value && renderCardField(
                                key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
                                value
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* BACK */}
                      <div className="w-full lg:w-1/3 flex flex-col gap-2">
                        <div className="text-[11px] font-medium text-muted-foreground">
                          Back
                        </div>
                        <div className="flex items-center justify-center">
                          {modalBackSrc ? (
                            <img
                              src={modalBackSrc}
                              alt={displayName}
                              className="w-full rounded-lg border object-cover"
                            />
                          ) : classicTemplate ? (
                            <div
                              className="w-full aspect-[1.75/1] rounded-lg border shadow-sm"
                              style={previewStyle}
                            />
                          ) : (
                            <div className="w-full aspect-[1.75/1] rounded-lg border bg-muted flex items-center justify-center text-[11px] text-muted-foreground">
                              No preview
                            </div>
                          )}
                        </div>
                        {/* Back Side Data */}
                        {item.data?.backData && (
                          <div className="mt-2 p-3 bg-muted/20 rounded-lg border border-border">
                            <h4 className="text-xs font-medium mb-2 text-muted-foreground">
                              Back Side Details
                            </h4>
                            {Object.entries(item.data.backData).map(([key, value]) =>
                              value && renderCardField(
                                key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
                                value
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* DETAILS */}
                      <div className="w-full lg:w-1/3 space-y-3">
                        <div>
                          <div className="font-semibold text-sm">
                            {displayName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            For: {item.title || "Business Card"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Template ID: {rawId}
                          </div>
                        </div>

                        <div className="p-3 bg-muted/20 rounded-lg border border-border">
                          <h4 className="text-xs font-medium mb-2 text-muted-foreground">
                            Order Summary
                          </h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Amount paid:</span>
                              <span className="font-medium">
                                ₹{item.price != null ? item.price.toFixed(2) : "-"}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Total payment:</span>
                              <span>
                                ₹{payment.amount != null ? payment.amount.toFixed(2) : "-"}{" "}
                                {payment.currency}
                              </span>
                            </div>
                            <div className="pt-2 mt-2 border-t text-xs">
                              <div className="font-medium">Status:</div>
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${(payment.status || "").toLowerCase() === "captured" ||
                                  (payment.status || "").toLowerCase() === "success"
                                  ? "bg-green-100 text-green-800"
                                  : (payment.status || "").toLowerCase() === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                  }`}
                              >
                                {payment.status || "-"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-muted/20 rounded-lg border border-border">
                          <h4 className="text-xs font-medium mb-2 text-muted-foreground">
                            Delivery Address
                          </h4>
                          <div className="text-xs space-y-1">
                            <div>{payment.customer_name || "-"}</div>
                            {payment.customer_phone && (
                              <div>{payment.customer_phone}</div>
                            )}
                            <div className="text-muted-foreground">
                              {fullAddress}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
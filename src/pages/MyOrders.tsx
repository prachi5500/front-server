// import type React from "react";
// import { useEffect, useState } from "react";
// import { apiFetch } from "@/services/api";
// import { classicTemplates } from "@/lib/classicTemplates";
// import { listAllTemplates, type Template } from "@/services/templates";
// import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// // import { Download } from "lucide-react";
// import { saveAs } from "file-saver";

// interface CardData {
//   name?: string;
//   phone?: string;
//   email?: string;
//   company?: string;
//   designation?: string;
//   website?: string;
//   address?: string;
//   [key: string]: any;
// }

// interface OrderedItem {
//   templateId: string;
//   title?: string | null;
//   price?: number | null;
//   templateName?: string | null;
//   frontImageUrl?: string | null;
//   backImageUrl?: string | null;
//   pdfUrl?: string | null;
//   data?: {
//     frontData?: CardData;
//     backData?: CardData;
//   } | null;
// }

// interface Payment {
//   _id: string;
//   amount?: number;
//   currency: string;
//   status?: string;
//   createdAt: string;
//   payment_type?: string | null;
//   payment_method?: string | null;
//   customer_name?: string | null;
//   customer_phone?: string | null;
//   address_line1?: string | null;
//   address_line2?: string | null;
//   city?: string | null;
//   state?: string | null;
//   pincode?: string | null;
//   items?: OrderedItem[];
// }

// export default function MyOrders() {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [templates, setTemplates] = useState<Template[]>([]);
//   const [selected, setSelected] = useState<{
//     payment: Payment;
//     item: OrderedItem;
//   } | null>(null);

//   // Image-download removed: only PDF downloads are supported now.

//   // const handleDownloadPdf = async (item: OrderedItem) => {
//   //   try {
//   //     if (!item.pdfUrl) {
//   //       alert("PDF not available for this card.");
//   //       return;
//   //     }
//   //     const res = await fetch(item.pdfUrl);
//   //     if (!res.ok) throw new Error("Failed to fetch PDF");
//   //     const blob = await res.blob();
//   //     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//   //     saveAs(blob, `business-card-${item.templateId || 'download'}-${timestamp}.pdf`);
//   //   } catch (err) {
//   //     console.error('Error downloading pdf:', err);
//   //     alert('Failed to download PDF. Please try again.');
//   //   }
//   // };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const res = await apiFetch("/payments/my");
//         const data = res as any;
//         setPayments(data.payments || []);
//       } catch (e: any) {
//         setError(e.message || "Failed to load your orders");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, []);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const all = await listAllTemplates();
//         if (alive && Array.isArray(all)) {
//           setTemplates(all);
//         }
//       } catch {
//         // ignore template load errors on orders page
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, []);

//   const renderCardField = (label: string, value: any) => {
//     if (!value) return null;
//     return (
//       <div className="text-xs">
//         <span className="font-medium">{label}:</span> {value}
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/40">
//       <main className="container mx-auto max-w-3xl px-4 py-10 flex-grow">
//         <div className="mb-6 space-y-2">
//           <h1 className="text-3xl font-bold">My Orders</h1>
//           <p className="text-sm text-muted-foreground">
//             View your previous card orders and payment status.
//           </p>
//         </div>

//         {loading && <p className="text-sm">Loading your orders...</p>}
//         {error && <p className="text-sm text-red-500">{error}</p>}
//         {!loading && !error && payments.length === 0 && (
//           <p className="text-sm text-muted-foreground">
//             You don't have any orders yet.
//           </p>
//         )}

//         {!loading && payments.length > 0 && (
//           <div className="space-y-4">
//             {payments.map((p) => {
//               const status = (p.status || "").toLowerCase();
//               let statusColor = "bg-gray-100 text-gray-800";
//               if (status === "captured" || status === "success") {
//                 statusColor = "bg-green-100 text-green-800";
//               } else if (status === "failed") {
//                 statusColor = "bg-red-100 text-red-800";
//               } else if (status === "pending" || status === "created") {
//                 statusColor = "bg-yellow-100 text-yellow-800";
//               }

//               const hasItems = (p.items || []).length > 0;

//               return (
//                 <div
//                   key={p._id}
//                   className="border rounded-lg p-4 shadow-sm bg-card space-y-3 text-sm"
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="space-y-1">
//                       <div className="font-medium">
//                         Order on {new Date(p.createdAt).toLocaleDateString()}
//                       </div>
//                       <div className="text-xs text-muted-foreground">
//                         Payment type: {p.payment_type || "-"} · Method:{" "}
//                         {p.payment_method || "-"}
//                       </div>
//                     </div>
//                     <div className="text-right space-y-1">
//                       <div className="font-semibold">
//                         ₹{p.amount != null ? p.amount.toFixed(2) : "-"}{" "}
//                         {p.currency}
//                       </div>
//                       <span
//                         className={
//                           "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase " +
//                           statusColor
//                         }
//                       >
//                         {p.status || "-"}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="pt-2 border-t text-xs md:text-sm">
//                     <div className="font-medium mb-1">Ordered cards</div>
//                     {hasItems ? (
//                       <div className="space-y-2">
//                         {(p.items || []).map((item, idx) => {
//                           const rawId = item.templateId || "";
//                           const isServer = rawId.startsWith("sb:");
//                           const serverId = isServer ? rawId.slice(3) : rawId;
//                           const serverTemplate = templates.find(
//                             (t) => t.id === serverId
//                           );
//                           const classicTemplate = classicTemplates.find(
//                             (t) => t.id === rawId
//                           );

//                           let previewStyle: React.CSSProperties | undefined;
//                           if (classicTemplate) {
//                             if (
//                               classicTemplate.bgStyle === "gradient" &&
//                               classicTemplate.bgColors.length >= 2
//                             ) {
//                               previewStyle = {
//                                 background: `linear-gradient(135deg, ${classicTemplate.bgColors[0]}, ${classicTemplate.bgColors[1]})`,
//                               };
//                             } else {
//                               previewStyle = {
//                                 backgroundColor: classicTemplate.bgColors[0],
//                               };
//                             }
//                           }

//                           const displayName =
//                             item.templateName ||
//                             serverTemplate?.name ||
//                             classicTemplate?.name ||
//                             rawId;

//                           const itemAny = item as any;

//                           // FRONT thumbnail in list: prefer saved front image, fall back to template assets
//                           const listFrontSrc =
//                             itemAny.frontImageUrl ||
//                             serverTemplate?.thumbnail_url ||
//                             (serverTemplate as any)?.background_url ||
//                             serverTemplate?.back_background_url ||
//                             null;

//                           return (
//                             <div
//                               key={idx}
//                               className="flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/60 rounded-md px-2 py-1"
//                               onClick={() => setSelected({ payment: p, item })}
//                             >
//                               <div className="flex items-center gap-3 min-w-0">
//                                 {listFrontSrc ? (
//                                   <img
//                                     src={listFrontSrc}
//                                     alt={`${displayName} (front)`}
//                                     className="h-14 w-24 object-cover rounded border"
//                                   />
//                                 ) : classicTemplate ? (
//                                   <div
//                                     className="h-14 w-24 rounded border shadow-sm"
//                                     style={previewStyle}
//                                   />
//                                 ) : (
//                                   <div className="h-14 w-24 rounded border bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
//                                     No preview
//                                   </div>
//                                 )}

//                                 <div className="min-w-0">
//                                   <div className="font-medium truncate">
//                                     {displayName}
//                                   </div>
//                                   <div className="text-[11px] text-muted-foreground truncate">
//                                     For: {item.title || "Business Card"}
//                                   </div>
//                                   {item.data?.frontData?.name && (
//                                     <div className="text-[11px] text-muted-foreground truncate">
//                                       {item.data.frontData.name}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="text-right whitespace-nowrap">
//                                 <div className="mt-4 flex gap-2">
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       setSelected({ payment: p, item });
//                                     }}
//                                   >
//                                     View Details
//                                   </Button>
//                                   {/* Image downloads removed — only PDF download is available */}

//                                   {/* {item.pdfUrl && (
//                                     <Button
//                                       size="sm"
//                                       variant="default"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleDownloadPdf(item);
//                                       }}
//                                       className="gap-1"
//                                     >
//                                       <Download className="h-3.5 w-3.5" />
//                                       PDF
//                                     </Button>
//                                   )} */}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     ) : (
//                       <div className="text-muted-foreground text-[11px]">
//                         No card items saved for this order.
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {selected && (
//           <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
//             <div className="bg-card max-w-4xl w-full rounded-xl shadow-2xl border border-border p-4 md:p-6 relative max-h-[90vh] overflow-y-auto">
//               <button
//                 type="button"
//                 className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80"
//                 onClick={() => setSelected(null)}
//               >
//                 Close
//               </button>

//               {/* Image download (removed). Use the 'Download PDF' button if available. */}

//               {/* {selected.item.pdfUrl && (
//                 <button
//                   type="button"
//                   className="absolute top-3 right-32 text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center gap-1"
//                   onClick={() => handleDownloadPdf(selected.item)}
//                 >
//                   <Download className="h-3.5 w-3.5" />
//                   <span>Download PDF</span>
//                 </button>
//               )} */}

//               {(() => {
//                 const payment = selected.payment;
//                 const item = selected.item;
//                 const rawId = item.templateId || "";
//                 const isServer = rawId.startsWith("sb:");
//                 const serverId = isServer ? rawId.slice(3) : rawId;
//                 const serverTemplate = templates.find(
//                   (t) => t.id === serverId
//                 );
//                 const classicTemplate = classicTemplates.find(
//                   (t) => t.id === rawId
//                 );

//                 let previewStyle: React.CSSProperties | undefined;
//                 if (classicTemplate) {
//                   if (
//                     classicTemplate.bgStyle === "gradient" &&
//                     classicTemplate.bgColors.length >= 2
//                   ) {
//                     previewStyle = {
//                       background: `linear-gradient(135deg, ${classicTemplate.bgColors[0]}, ${classicTemplate.bgColors[1]})`,
//                     };
//                   } else {
//                     previewStyle = {
//                       backgroundColor: classicTemplate.bgColors[0],
//                     };
//                   }
//                 }

//                 const displayName =
//                   item.templateName ||
//                   serverTemplate?.name ||
//                   classicTemplate?.name ||
//                   rawId;

//                 const fullAddress = [
//                   payment.address_line1,
//                   payment.address_line2,
//                   payment.city,
//                   payment.state,
//                   payment.pincode,
//                 ]
//                   .filter(Boolean)
//                   .join(", ") || "-";

//                 const itemAny = item as any;

//                 // Front image in modal
//                 const modalFrontSrc =
//                   itemAny.frontImageUrl ||
//                   serverTemplate?.thumbnail_url ||
//                   (serverTemplate as any)?.background_url ||
//                   serverTemplate?.back_background_url ||
//                   null;

//                 // Back image in modal
//                 const modalBackSrc =
//                   itemAny.backImageUrl ||
//                   serverTemplate?.back_background_url ||
//                   serverTemplate?.thumbnail_url ||
//                   (serverTemplate as any)?.background_url ||
//                   null;

//                 return (
//                   <div className="space-y-4 text-sm">
//                     <div>
//                       <h2 className="text-lg font-semibold mb-1">
//                         Card details
//                       </h2>
//                       <p className="text-xs text-muted-foreground">
//                         Order on{" "}
//                         {new Date(payment.createdAt).toLocaleString()}
//                       </p>
//                     </div>

//                     <div className="flex flex-col lg:flex-row gap-4">
//                       {/* FRONT */}
//                       <div className="w-full lg:w-1/3 flex flex-col gap-2">
//                         <div className="text-[11px] font-medium text-muted-foreground">
//                           Front
//                         </div>
//                         <div className="flex items-center justify-center">
//                           {modalFrontSrc ? (
//                             <img
//                               src={modalFrontSrc}
//                               alt={displayName}
//                               className="w-full rounded-lg border object-cover"
//                             />
//                           ) : classicTemplate ? (
//                             <div
//                               className="w-full aspect-[1.75/1] rounded-lg border shadow-sm"
//                               style={previewStyle}
//                             />
//                           ) : (
//                             <div className="w-full aspect-[1.75/1] rounded-lg border bg-muted flex items-center justify-center text-[11px] text-muted-foreground">
//                               No preview
//                             </div>
//                           )}
//                         </div>
//                         {/* Front Side Data */}
//                         {item.data?.frontData && (
//                           <div className="mt-2 p-3 bg-muted/20 rounded-lg border border-border">
//                             <h4 className="text-xs font-medium mb-2 text-muted-foreground">
//                               Front Side Details
//                             </h4>
//                             {Object.entries(item.data.frontData).map(([key, value]) =>
//                               value && renderCardField(
//                                 key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
//                                 value
//                               )
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       {/* BACK */}
//                       <div className="w-full lg:w-1/3 flex flex-col gap-2">
//                         <div className="text-[11px] font-medium text-muted-foreground">
//                           Back
//                         </div>
//                         <div className="flex items-center justify-center">
//                           {modalBackSrc ? (
//                             <img
//                               src={modalBackSrc}
//                               alt={displayName}
//                               className="w-full rounded-lg border object-cover"
//                             />
//                           ) : classicTemplate ? (
//                             <div
//                               className="w-full aspect-[1.75/1] rounded-lg border shadow-sm"
//                               style={previewStyle}
//                             />
//                           ) : (
//                             <div className="w-full aspect-[1.75/1] rounded-lg border bg-muted flex items-center justify-center text-[11px] text-muted-foreground">
//                               No preview
//                             </div>
//                           )}
//                         </div>
//                         {/* Back Side Data */}
//                         {item.data?.backData && (
//                           <div className="mt-2 p-3 bg-muted/20 rounded-lg border border-border">
//                             <h4 className="text-xs font-medium mb-2 text-muted-foreground">
//                               Back Side Details
//                             </h4>
//                             {Object.entries(item.data.backData).map(([key, value]) =>
//                               value && renderCardField(
//                                 key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
//                                 value
//                               )
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       {/* DETAILS */}
//                       <div className="w-full lg:w-1/3 space-y-3">
//                         <div>
//                           <div className="font-semibold text-sm">
//                             {displayName}
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             For: {item.title || "Business Card"}
//                           </div>
//                           <div className="text-xs text-muted-foreground">
//                             Template ID: {rawId}
//                           </div>
//                         </div>

//                         <div className="p-3 bg-muted/20 rounded-lg border border-border">
//                           <h4 className="text-xs font-medium mb-2 text-muted-foreground">
//                             Order Summary
//                           </h4>
//                           <div className="space-y-1">
//                             <div className="flex justify-between text-sm">
//                               <span>Amount paid:</span>
//                               <span className="font-medium">
//                                 ₹{item.price != null ? item.price.toFixed(2) : "-"}
//                               </span>
//                             </div>
//                             <div className="flex justify-between text-xs text-muted-foreground">
//                               <span>Total payment:</span>
//                               <span>
//                                 ₹{payment.amount != null ? payment.amount.toFixed(2) : "-"}{" "}
//                                 {payment.currency}
//                               </span>
//                             </div>
//                             <div className="pt-2 mt-2 border-t text-xs">
//                               <div className="font-medium">Status:</div>
//                               <span
//                                 className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${(payment.status || "").toLowerCase() === "captured" ||
//                                   (payment.status || "").toLowerCase() === "success"
//                                   ? "bg-green-100 text-green-800"
//                                   : (payment.status || "").toLowerCase() === "failed"
//                                     ? "bg-red-100 text-red-800"
//                                     : "bg-yellow-100 text-yellow-800"
//                                   }`}
//                               >
//                                 {payment.status || "-"}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="p-3 bg-muted/20 rounded-lg border border-border">
//                           <h4 className="text-xs font-medium mb-2 text-muted-foreground">
//                             Delivery Address
//                           </h4>
//                           <div className="text-xs space-y-1">
//                             <div>{payment.customer_name || "-"}</div>
//                             {payment.customer_phone && (
//                               <div>{payment.customer_phone}</div>
//                             )}
//                             <div className="text-muted-foreground">
//                               {fullAddress}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })()}
//             </div>
//           </div>
//         )}
//       </main>

//       <Footer />
//     </div>
//   );
// }


// import type React from "react";
// import { useEffect, useState } from "react";
// import { apiFetch } from "@/services/api";
// import { classicTemplates } from "@/lib/classicTemplates";
// import { listAllTemplates, type Template } from "@/services/templates";
// import Footer from "@/components/Footer";
// import { Button } from "@/components/ui/button";
// import { Download, Loader2, Calendar, MapPin, CreditCard, ImageIcon } from "lucide-react";
// import { saveAs } from "file-saver";

// interface CardData {
//   name?: string;
//   phone?: string;
//   email?: string;
//   company?: string;
//   designation?: string;
//   website?: string;
//   address?: string;
//   [key: string]: any;
// }

// interface OrderedItem {
//   templateId: string;
//   title?: string | null;
//   price?: number | null;
//   templateName?: string | null;
//   // Database se aane wale URLs
//   frontImageUrl?: string | null;
//   backImageUrl?: string | null;
//   pdfUrl?: string | null;
//   data?: {
//     frontData?: CardData;
//     backData?: CardData;
//   } | null;
// }

// interface Payment {
//   razorpay_payment_id: string;
//   _id: string;
//   amount?: number;
//   currency: string;
//   status?: string;
//   createdAt: string;
//   payment_type?: string | null;
//   payment_method?: string | null;
//   customer_name?: string | null;
//   customer_phone?: string | null;
//   address_line1?: string | null;
//   address_line2?: string | null;
//   city?: string | null;
//   state?: string | null;
//   pincode?: string | null;
//   items?: OrderedItem[];
//   razorpay_order_id?: string;
// }

// export default function MyOrders() {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [templates, setTemplates] = useState<Template[]>([]);
//   const [selected, setSelected] = useState<{
//     payment: Payment;
//     item: OrderedItem;
//   } | null>(null);

//   // ✅ New Function to download images
//   // const handleDownloadImage = (url: string | null | undefined, filename: string) => {
//   //   if (!url) {
//   //     alert("Image not available");
//   //     return;
//   //   }
//   //   saveAs(url, filename);
//   // };
//   const handleDownloadImage = (url: string | null | undefined, filename: string) => {
//     if (!url) return;
//     saveAs(url, filename);
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const res = await apiFetch("/payments/my");
//         const data = res as any;
//         setPayments(data.payments || []);
//       } catch (e: any) {
//         setError(e.message || "Failed to load your orders");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, []);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const all = await listAllTemplates();
//         if (alive && Array.isArray(all)) {
//           setTemplates(all);
//         }
//       } catch {
//         // ignore template load errors
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, []);

//   const renderCardField = (label: string, value: any) => {
//     if (!value) return null;
//     return (
//       <div className="text-xs">
//         <span className="font-medium text-gray-600">{label}:</span> {value}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
//         <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
//         <p className="text-sm text-muted-foreground">Loading your orders...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <main className="container mx-auto max-w-4xl px-4 py-10 flex-grow">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
//           <p className="text-sm text-muted-foreground mt-1">
//             View your order history and download your cards.
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
//             {error}
//           </div>
//         )}

//         {!error && payments.length === 0 && (
//           <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
//             <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//             <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
//             <p className="text-sm text-muted-foreground mb-6">You haven't placed any orders yet.</p>
//             <Button onClick={() => window.location.href = '/'}>Browse Templates</Button>
//           </div>
//         )}

//         <div className="space-y-6">
//           {payments.map((p) => {
//             const status = (p.status || "").toLowerCase();
//             let statusColor = "bg-gray-100 text-gray-800 border-gray-200";
//             if (status === "captured" || status === "success") {
//               statusColor = "bg-green-50 text-green-700 border-green-200";
//             } else if (status === "failed") {
//               statusColor = "bg-red-50 text-red-700 border-red-200";
//             } else if (status === "pending") {
//               statusColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
//             }

//             return (
//               <div
//                 key={p._id}
//                 className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
//               >
//                 {/* Order Header */}
//                 <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
//                   <div className="flex gap-6 text-sm">
//                     <div>
//                       <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date Placed</p>
//                       <p className="font-medium text-gray-900 flex items-center gap-1.5 mt-0.5">
//                         <Calendar className="w-3.5 h-3.5 text-gray-400" />
//                         {new Date(p.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Amount</p>
//                       <p className="font-medium text-gray-900 mt-0.5">
//                         ₹{p.amount != null ? p.amount.toFixed(2) : "-"}
//                       </p>
//                     </div>
//                     <div className="hidden sm:block">
//                       <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</p>
//                       <p className="font-mono text-gray-600 mt-0.5 text-xs">{p.razorpay_order_id || p._id}</p>
//                     </div>
//                   </div>
                  
//                   <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor} capitalize flex items-center gap-1.5`}>
//                     <span className={`w-2 h-2 rounded-full ${status === 'success' || status === 'captured' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
//                     {p.status || "Unknown"}
//                   </div>
//                 </div>

//                 {/* Order Items */}
//                 <div className="p-6">
//                   <div className="space-y-8">
//                     {(p.items || []).map((item, idx) => {
//                       const itemAny = item as any;
//                       const displayName = item.templateName || item.title || "Custom Card";

//                       return (
//                         <div key={idx} className="flex flex-col lg:flex-row gap-6">
                          
//                           {/* Images Section - Showing Saved URLs */}
//                           <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
//                             {/* Front Image */}
//                             <div className="space-y-2">
//                               <div className="relative w-[240px] aspect-[1.75/1] bg-gray-100 rounded-lg border overflow-hidden group">
//                                 {itemAny.frontImageUrl ? (
//                                   <img 
//                                     src={itemAny.frontImageUrl} 
//                                     alt="Front" 
//                                     className="w-full h-full object-cover" 
//                                   />
//                                 ) : (
//                                   <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Processing...</div>
//                                 )}
//                                 <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">Front</div>
//                               </div>
//                               {itemAny.frontImageUrl && (
//                                 <Button 
//                                   variant="outline" 
//                                   size="sm" 
//                                   className="w-full h-8 text-xs gap-1.5"
//                                   onClick={() => handleDownloadImage(itemAny.frontImageUrl, `card-front-${idx}.png`)}
//                                 >
//                                   <Download className="w-3 h-3" /> Download Front
//                                 </Button>
//                               )}
//                             </div>

//                             {/* Back Image */}
//                             <div className="space-y-2">
//                               <div className="relative w-[240px] aspect-[1.75/1] bg-gray-100 rounded-lg border overflow-hidden group">
//                                 {itemAny.backImageUrl ? (
//                                   <img 
//                                     src={itemAny.backImageUrl} 
//                                     alt="Back" 
//                                     className="w-full h-full object-cover" 
//                                   />
//                                 ) : (
//                                   <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Back Image</div>
//                                 )}
//                                 <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">Back</div>
//                               </div>
//                               {itemAny.backImageUrl && (
//                                 <Button 
//                                   variant="outline" 
//                                   size="sm" 
//                                   className="w-full h-8 text-xs gap-1.5"
//                                   onClick={() => handleDownloadImage(itemAny.backImageUrl, `card-back-${idx}.png`)}
//                                 >
//                                   <Download className="w-3 h-3" /> Download Back
//                                 </Button>
//                               )}
//                             </div>
//                           </div>

//                           {/* Details Section */}
//                           <div className="flex-1 min-w-0">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <h4 className="font-bold text-lg text-gray-900">{displayName}</h4>
//                                 <p className="text-sm text-muted-foreground mt-0.5">Template ID: {item.templateId}</p>
//                               </div>
//                               <p className="font-semibold text-gray-900">₹{item.price}</p>
//                             </div>

//                             <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
//                               {item.data?.frontData && (
//                                 <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
//                                   <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Card Details</p>
//                                   <div className="space-y-1">
//                                     {renderCardField("Name", item.data.frontData.name)}
//                                     {renderCardField("Title", item.data.frontData.title)}
//                                     {renderCardField("Company", item.data.frontData.company)}
//                                   </div>
//                                 </div>
//                               )}
                              
//                               <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
//                                 <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Delivery Info</p>
//                                 <div className="text-xs text-gray-600 space-y-1">
//                                   <p><span className="font-medium">To:</span> {p.customer_name}</p>
//                                   <p><span className="font-medium">Phone:</span> {p.customer_phone}</p>
//                                   <p className="truncate max-w-[200px]" title={[p.city, p.state].join(', ')}>
//                                     <span className="font-medium">Location:</span> {p.city}, {p.state}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>

//                             <div className="mt-4 pt-4 border-t flex gap-3">
//                               <Button 
//                                 size="sm" 
//                                 variant="secondary"
//                                 onClick={() => setSelected({ payment: p, item })}
//                               >
//                                 View Full Details
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Modal for Details */}
//         {selected && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm p-4">
//             <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
//               <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
//                 <h2 className="text-lg font-bold">Card Details</h2>
//                 <button
//                   type="button"
//                   className="p-2 hover:bg-gray-200 rounded-full transition-colors"
//                   onClick={() => setSelected(null)}
//                 >
//                   <span className="sr-only">Close</span>
//                   <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//                 </button>
//               </div>

//               <div className="p-6 overflow-y-auto">
//                 <div className="flex flex-col gap-8">
//                   {/* Images in Modal */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Front */}
//                     <div className="space-y-3">
//                       <h4 className="font-medium text-sm text-gray-500 text-center">Front Side</h4>
//                       <div className="rounded-xl border shadow-sm overflow-hidden bg-gray-100 aspect-[1.75/1]">
//                         {(selected.item as any).frontImageUrl ? (
//                           <img src={(selected.item as any).frontImageUrl} className="w-full h-full object-cover" alt="Front" />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Image</div>
//                         )}
//                       </div>
//                       {(selected.item as any).frontImageUrl && (
//                         <Button 
//                           className="w-full" 
//                           variant="outline"
//                           onClick={() => handleDownloadImage((selected.item as any).frontImageUrl, `card-front.png`)}
//                         >
//                           <Download className="w-4 h-4 mr-2" /> Download Front Image
//                         </Button>
//                       )}
//                     </div>

//                     {/* Back */}
//                     <div className="space-y-3">
//                       <h4 className="font-medium text-sm text-gray-500 text-center">Back Side</h4>
//                       <div className="rounded-xl border shadow-sm overflow-hidden bg-gray-100 aspect-[1.75/1]">
//                         {(selected.item as any).backImageUrl ? (
//                           <img src={(selected.item as any).backImageUrl} className="w-full h-full object-cover" alt="Back" />
//                         ) : (
//                           <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Image</div>
//                         )}
//                       </div>
//                       {(selected.item as any).backImageUrl && (
//                         <Button 
//                           className="w-full" 
//                           variant="outline"
//                           onClick={() => handleDownloadImage((selected.item as any).backImageUrl, `card-back.png`)}
//                         >
//                           <Download className="w-4 h-4 mr-2" /> Download Back Image
//                         </Button>
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t">
//                     <div>
//                       <h4 className="font-bold text-gray-900 mb-3">Order Information</h4>
//                       <div className="space-y-2 text-sm text-gray-600">
//                         <div className="flex justify-between border-b pb-2">
//                           <span>Order Date</span>
//                           <span className="font-medium text-gray-900">{new Date(selected.payment.createdAt).toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between border-b pb-2">
//                           <span>Payment Method</span>
//                           <span className="font-medium text-gray-900">{selected.payment.payment_method || "Online"}</span>
//                         </div>
//                         <div className="flex justify-between border-b pb-2">
//                           <span>Transaction ID</span>
//                           <span className="font-medium text-gray-900 font-mono text-xs">{selected.payment.razorpay_payment_id || "-"}</span>
//                         </div>
//                         <div className="flex justify-between pt-1">
//                           <span>Total Amount</span>
//                           <span className="font-bold text-green-600 text-lg">₹{selected.payment.amount}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <h4 className="font-bold text-gray-900 mb-3">Shipping Address</h4>
//                       <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
//                         <p className="font-semibold text-gray-900">{selected.payment.customer_name}</p>
//                         <p>{selected.payment.address_line1}</p>
//                         {selected.payment.address_line2 && <p>{selected.payment.address_line2}</p>}
//                         <p>{selected.payment.city}, {selected.payment.state} - {selected.payment.pincode}</p>
//                         <div className="pt-2 mt-2 border-t border-gray-200 flex items-center gap-2 text-gray-500">
//                           <MapPin className="w-4 h-4" />
//                           <span>Phone: {selected.payment.customer_phone}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="p-4 bg-gray-50 border-t flex justify-end">
//                 <Button onClick={() => setSelected(null)}>Close Details</Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>

//       <Footer />
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Calendar, MapPin, ImageIcon, AlertCircle } from "lucide-react";
import { saveAs } from "file-saver"; // npm install file-saver --save

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
  // Database se aane wale URLs (Cloudinary)
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  pdfUrl?: string | null;
  quantity?: number;
  data?: {
    frontData?: CardData;
    backData?: CardData;
  } | null;
}

interface Payment {
  razorpay_payment_id: string;
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
  razorpay_order_id?: string;
}

export default function MyOrders() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<{
    payment: Payment;
    item: OrderedItem;
  } | null>(null);

  // ✅ Function to download images using FileSaver
  const handleDownloadImage = (url: string | null | undefined, filename: string) => {
    if (!url) {
      alert("Image not available");
      return;
    }
    // FileSaver.saveAs handles the download
    saveAs(url, filename);
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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 font-medium">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="container mx-auto max-w-5xl px-4 py-10 flex-grow">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">
              Track your orders and download your card designs.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {!error && payments.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't purchased any cards yet.</p>
            <Button onClick={() => window.location.href = '/'} className="bg-blue-600 hover:bg-blue-700">
              Create a Card
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {payments.map((p) => {
            const status = (p.status || "").toLowerCase();
            let statusBadge = "bg-gray-100 text-gray-800 border-gray-200";
            
            if (status === "captured" || status === "success") {
              statusBadge = "bg-green-50 text-green-700 border-green-200";
            } else if (status === "failed") {
              statusBadge = "bg-red-50 text-red-700 border-red-200";
            } else if (status === "created" || status === "pending") {
              statusBadge = "bg-yellow-50 text-yellow-700 border-yellow-200";
            }

            return (
              <div
                key={p._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
              >
                {/* Order Header */}
                <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-8 text-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Placed On</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(p.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total</p>
                      <p className="font-bold text-gray-900">
                        ₹{p.amount != null ? p.amount.toFixed(2) : "-"}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                      <p className="font-mono text-gray-600 text-xs bg-gray-200 px-2 py-0.5 rounded">
                        {p.razorpay_order_id || p._id}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge} uppercase tracking-wide flex items-center gap-1.5`}>
                    <span className={`w-2 h-2 rounded-full ${status === 'success' || status === 'captured' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                    {p.status || "Unknown"}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-8 divide-y divide-gray-100">
                    {(p.items || []).map((item, idx) => {
                      const displayName = item.templateName || item.title || "Custom Business Card";

                      return (
                        <div key={idx} className={`flex flex-col lg:flex-row gap-6 ${idx > 0 ? 'pt-8' : ''}`}>
                          
                          {/* Images Section - Shows Cloudinary URLs from DB */}
                          <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0 shrink-0">
                            {/* Front Image */}
                            <div className="space-y-2 group">
                              <div className="relative w-[240px] aspect-[1.75/1] bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                {item.frontImageUrl ? (
                                  <img 
                                    src={item.frontImageUrl} 
                                    alt="Front Design" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-xs">Processing...</span>
                                  </div>
                                )}
                                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium backdrop-blur-sm">FRONT</div>
                              </div>
                              {/* {item.frontImageUrl && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full h-8 text-xs gap-1.5 border-gray-300 hover:bg-gray-50"
                                  onClick={() => handleDownloadImage(item.frontImageUrl, `card-front-${idx + 1}.png`)}
                                >
                                  <Download className="w-3.5 h-3.5" /> Download Front
                                </Button>
                              )} */}
                            </div>

                            {/* Back Image */}
                            <div className="space-y-2 group">
                              <div className="relative w-[240px] aspect-[1.75/1] bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                {item.backImageUrl ? (
                                  <img 
                                    src={item.backImageUrl} 
                                    alt="Back Design" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 text-xs">No Back Image</div>
                                )}
                                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium backdrop-blur-sm">BACK</div>
                              </div>
                              {/* {item.backImageUrl && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full h-8 text-xs gap-1.5 border-gray-300 hover:bg-gray-50"
                                  onClick={() => handleDownloadImage(item.backImageUrl, `card-back-${idx + 1}.png`)}
                                >
                                  <Download className="w-3.5 h-3.5" /> Download Back
                                </Button>
                              )} */}
                            </div>
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-lg text-gray-900">{displayName}</h4>
                                <div className="text-sm text-gray-500 flex gap-4 mt-1">
                                  <span>Quantity: {item.quantity || 1}</span>
                                  <span>•</span>
                                  <span>ID: {item.templateId.substring(0, 8)}...</span>
                                </div>
                              </div>
                              <p className="font-bold text-lg text-gray-900">₹{item.price}</p>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">Delivery Details</p>
                                <div className="text-sm text-gray-700 space-y-1">
                                  <p className="font-medium">{p.customer_name}</p>
                                  <p className="text-xs text-gray-500">{p.address_line1}, {p.city}</p>
                                  <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-600">
                                    <MapPin className="w-3 h-3" />
                                    <span>{p.city}, {p.state} - {p.pincode}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-end justify-end">
                                <Button 
                                  onClick={() => setSelected({ payment: p, item })}
                                  variant="secondary"
                                  className="w-full md:w-auto"
                                >
                                  View Full Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Full Details */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={() => setSelected(null)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Front Preview Large */}
                  <div className="space-y-3">
                     <h4 className="font-medium text-sm text-gray-500 text-center uppercase tracking-wide">Front Design</h4>
                     <div className="rounded-xl border shadow-lg overflow-hidden bg-gray-100 aspect-[1.75/1]">
                       {(selected.item as any).frontImageUrl ? (
                         <img src={(selected.item as any).frontImageUrl} className="w-full h-full object-cover" alt="Front" />
                       ) : <div className="flex items-center justify-center h-full text-gray-400">N/A</div>}
                     </div>
                  </div>

                  {/* Back Preview Large */}
                  <div className="space-y-3">
                     <h4 className="font-medium text-sm text-gray-500 text-center uppercase tracking-wide">Back Design</h4>
                     <div className="rounded-xl border shadow-lg overflow-hidden bg-gray-100 aspect-[1.75/1]">
                       {(selected.item as any).backImageUrl ? (
                         <img src={(selected.item as any).backImageUrl} className="w-full h-full object-cover" alt="Back" />
                       ) : <div className="flex items-center justify-center h-full text-gray-400">N/A</div>}
                     </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Shipping Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs uppercase mb-1">Receiver Name</p>
                      <p className="font-semibold text-lg text-gray-900">{selected.payment.customer_name}</p>
                      
                      <p className="text-gray-500 text-xs uppercase mb-1 mt-4">Contact Phone</p>
                      <p className="font-medium text-gray-900">{selected.payment.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase mb-1">Full Address</p>
                      <p className="text-gray-800 leading-relaxed bg-white p-3 rounded border border-gray-200">
                        {selected.payment.address_line1}
                        {selected.payment.address_line2 && <>, <br/>{selected.payment.address_line2}</>}
                        <br />
                        {selected.payment.city}, {selected.payment.state}
                        <br />
                        <span className="font-bold">PIN: {selected.payment.pincode}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                {(selected.item as any).frontImageUrl && (
                   <Button onClick={() => handleDownloadImage((selected.item as any).frontImageUrl, 'card-design.png')}>
                     <Download className="w-4 h-4 mr-2" /> Download Image
                   </Button>
                )}
              </div> */}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
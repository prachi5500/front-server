// import { useEffect, useMemo, useRef, useState } from "react";
// import { useCart } from "@/contexts/CartContext";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { classicTemplates } from "@/lib/classicTemplates";
// import { ClassicCard } from "@/components/templates/ClassicCard";
// import { BackSideCard } from "@/components/templates/BackSideCard";
// import { captureElementAndUpload } from "@/lib/utils";
// import { apiFetch } from "@/services/api";
// import { useAuth } from "@/contexts/AuthContext";
// import { listPublishedTemplates, type Template } from "@/services/templates";
// import { it } from "node:test";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// // Helper: Convert Base64 DataURI to Blob for upload
// function dataURItoBlob(dataURI: string) {
//   try {
//     const byteString = atob(dataURI.split(',')[1]);
//     const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: mimeString });
//   } catch (e) {
//     console.error("Blob conversion failed", e);
//     return null;
//   }
// }

// export default function CheckoutPage() {
//   const { items, total, clear } = useCart();
//   const navigate = useNavigate();
//   const { user, loading } = useAuth();
//   const [processing, setProcessing] = useState(false);
//   const [showErrors, setShowErrors] = useState(false);

//   const [customerName, setCustomerName] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [addressLine1, setAddressLine1] = useState("");
//   const [addressLine2, setAddressLine2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [pincode, setPincode] = useState("");

//   const primaryItem = items[0];
//   const effectiveNameDisplay =
//     customerName.trim() || primaryItem?.data?.name || "";
//   const effectivePhoneDisplay =
//     customerPhone.trim() || primaryItem?.data?.phone || "";

//   const trimmedPincode = pincode.trim();
//   const isPincodeValid = /^[1-9][0-9]{5}$/.test(trimmedPincode);

//   const isFormValid = !!(
//     effectiveNameDisplay &&
//     effectivePhoneDisplay &&
//     addressLine1.trim() &&
//     city.trim() &&
//     state.trim() &&
//     isPincodeValid
//   );

//   const frontRefs = useRef<Record<string, HTMLDivElement | null>>({});
//   const backRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   // Store server templates
//   const [sbTemplates, setSbTemplates] = useState<Template[]>([]);

//   // Modals
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [pendingAddress, setPendingAddress] = useState("");
//   const [pendingName, setPendingName] = useState("");
//   const [pendingPhone, setPendingPhone] = useState("");

//   async function getLiveLocationString(): Promise<string | null> {
//     if (!("geolocation" in navigator)) return null;
//     return new Promise((resolve) => {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           resolve(`${pos.coords.latitude},${pos.coords.longitude}`);
//         },
//         () => resolve(null),
//         { enableHighAccuracy: true, timeout: 5000 }
//       );
//     });
//   }

//   const byId = useMemo(() => {
//     const map: Record<string, any> = {};
//     for (const t of classicTemplates) map[t.id] = t;
//     return map;
//   }, []);

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const data = await listPublishedTemplates();
//         if (alive) setSbTemplates(Array.isArray(data) ? data : []);
//       } catch { }
//     })();
//     return () => { alive = false; };
//   }, []);

//   useEffect(() => {
//     // cart empty hai to checkout ka koi sense nahi
//     if (items.length === 0) {
//       navigate("/cart");
//       return;
//     }
//     // jab tak auth loading hai, kuch mat karo
//   }, [items.length, navigate]);

//   useEffect(() => {
//     if (loading) return;
//     if (!user) {
//       setShowLoginModal(true);
//     }
//   }, [user, loading]);

//   const handleLoginConfirm = () => {
//     setShowLoginModal(false);
//     navigate("/login");
//   };

//   const handleLoginCancel = () => {
//     setShowLoginModal(false);
//     navigate("/"); // ya "/cart"
//   };

//   const handleAddressConfirm = () => {
//     setShowAddressModal(false);
//     startPayment(pendingName, pendingPhone);
//   };

//   const handleAddressCancel = () => {
//     setShowAddressModal(false);
//   };

//   async function startPayment(customer_name: string, customer_phone: string) {
//     setProcessing(true);

//     try {
//       const res = await apiFetch("/payments/create-order", {
//         method: "POST",
//         body: JSON.stringify({
//           amount: Math.round(total),
//         }),
//       });

//       const { order } = res as any;
//       const live_location = await getLiveLocationString();

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         name: "Business Card Purchase",
//         description: "Business card templates",
//         order_id: order.id,
//         prefill: {
//           email: user?.email || "",
//            contact: customer_phone, 
//           name: customer_name      
//         },
//         handler: async (response: any) => {
//           try {
//             // 1) Pehle har cart item ke front/back ko capture + upload karo
//             const itemsWithImages = [];
//             for (const it of items) {
//               const fid = it.id;
//               // const frontEl = frontRefs.current[fid];
//               // const backEl = backRefs.current[fid];

//               let frontImageUrl: it.frontImageUrl;
//               let backImageUrl: it.backImageUrl;

//               // Agar Cart me URL nahi hai, tabhi Dobara Capture karein (Fallback)
//               if (!frontImageUrl && frontRefs.current[fid]) {
//                 console.log("Generating Front Image fallback...");
//                 frontImageUrl = (await captureElementAndUpload(frontRefs.current[fid], `${fid}-front`)) || null;
//               }
              
//               if (!backImageUrl && backRefs.current[fid]) {
//                 console.log("Generating Back Image fallback...");
//                 backImageUrl = (await captureElementAndUpload(backRefs.current[fid], `${fid}-back`)) || null;
//               }

//               // if (frontEl) {
//               //   frontImageUrl =
//               //     (await captureElementAndUpload(
//               //       frontEl,
//               //       `${fid}-front`
//               //     )) || null;
//               // }
//               // if (backEl) {
//               //   backImageUrl =
//               //     (await captureElementAndUpload(
//               //       backEl,
//               //       `${fid}-back`
//               //     )) || null;
//               // }

//               itemsWithImages.push({
//                 templateId: it.id,
//                 title: it.data?.name || "Business Card",
//                 price: it.price,
//                 templateName: (it as any).templateName || byId[it.id]?.name ||  "Custom Design",
//                 // frontImageUrl,
//                 // backImageUrl,
//                  frontImageUrl: frontImageUrl,
//                 backImageUrl: backImageUrl,
//                 // include any edited data so server can save it as template if requested
//                 saveAsTemplate: !!(it as any).saveAsTemplate,
//                 // data: {
//                 //   frontData: (it as any).frontData ?? (it.data as any) ?? null,
//                 //   backData: (it as any).backData ?? (it.data as any) ?? null,
//                 // },
//                 data: {
//                   ...it.data,
//                   frontData: (it as any).frontData || (it as any).design,
//                   backData: (it as any).backData || (it as any).design,
//                 },
//               });
//             }

//             // 2) Ab verify ko ye URLs ke saath bhejo
//             const verifyRes = await apiFetch("/payments/verify", {
//               method: "POST",
//               body: JSON.stringify({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 amount: Math.round(total),
//                 customer_name,
//                 customer_phone,
//                 live_location,
//                 address_line1: addressLine1,
//                 address_line2: addressLine2,
//                 city,
//                 state,
//                 pincode,
//                 // yahan se admin ke liye order items save honge
//                 items: itemsWithImages,
//               }),
//             });

//             if ((verifyRes as any).success) {
//               // images already upload ho chuki hain, local download ki zarurat nahi
//               clear();
//               navigate("/my-orders");
//             } else {
//               alert("Payment verification failed");
//             }
//           } catch (e: any) {
//             alert(e.message || "Payment verification error");
//           } finally {
//             setProcessing(false);
//           }
//         },
//         modal: {
//           ondismiss: () => {
//             setProcessing(false);
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (e: any) {
//       alert(e.message || "Unable to start payment");
//       setProcessing(false);
//     }
//   }

//   async function onPay() {
//     if (processing || items.length === 0) return;

//     // extra safety guard
//     if (!user) {
//       setShowLoginModal(true);
//       return;
//     }

//     setShowErrors(true);

//     const effectiveName =
//       customerName.trim() || primaryItem?.data?.name || "";
//     const effectivePhone =
//       customerPhone.trim() || primaryItem?.data?.phone || "";

//     if (
//       !effectiveName ||
//       !effectivePhone ||
//       !addressLine1.trim() ||
//       !city.trim() ||
//       !state.trim() ||
//       !pincode.trim()
//     ) {
//       alert("Please fill all required address details before payment.");
//       return;
//     }

//     const deliveryAddress = [
//       effectiveName,
//       addressLine1,
//       addressLine2,
//       city,
//       state,
//       pincode,
//     ]
//       .filter((x) => x && x.trim())
//       .join(", ");

//     setPendingAddress(deliveryAddress);
//     setPendingName(effectiveName);
//     setPendingPhone(effectivePhone);
//     setShowAddressModal(true);
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
//       <main className="container mx-auto max-w-4xl px-4 py-10">
//         <div className="mb-6 space-y-2">
//           <h1 className="text-3xl font-bold">Checkout</h1>
//           <p className="text-sm text-muted-foreground">
//             Review your details and complete your secure payment.
//           </p>
//           <div className="flex items-center gap-3 text-sm text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
//                 1
//               </div>
//               <span>Customer Details</span>
//             </div>
//             <div className="h-px w-8 bg-border" />
//             <div className="flex items-center gap-2 opacity-80">
//               <div className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-semibold">
//                 2
//               </div>
//               <span>Payment</span>
//             </div>
//           </div>
//         </div>

//         {items.length === 0 ? (
//           <div className="text-muted-foreground">Your cart is empty.</div>
//         ) : (
//           <>
//             <div className="grid gap-8 mb-10 md:grid-cols-[2fr,1.5fr]">
//               <div className="space-y-4 border rounded-xl p-4 md:p-5 bg-card shadow-sm">
//                 <h2 className="text-lg font-semibold mb-1">
//                   Shipping Details
//                 </h2>
//                 <p className="text-xs text-muted-foreground mb-1">
//                   We'll use these details to deliver your printed cards.
//                 </p>
//                 <div className="grid gap-3">
//                   <div className="grid gap-1">
//                     <label className="text-sm font-medium">Full Name *</label>
//                     <input
//                       className="border rounded px-3 py-2 text-sm"
//                       value={customerName}
//                       onChange={(e) => setCustomerName(e.target.value)}
//                       placeholder={primaryItem?.data?.name || "Your Name"}
//                     />
//                     {showErrors && !effectiveNameDisplay && (
//                       <p className="text-xs text-red-500 mt-1">
//                         Full name is required.
//                       </p>
//                     )}
//                   </div>
//                   <div className="grid gap-1">
//                     <label className="text-sm font-medium">Phone *</label>
//                     <input
//                       className="border rounded px-3 py-2 text-sm"
//                       value={customerPhone}
//                       onChange={(e) => setCustomerPhone(e.target.value)}
//                       placeholder={primaryItem?.data?.phone || "Phone number"}
//                     />
//                     {showErrors && !effectivePhoneDisplay && (
//                       <p className="text-xs text-red-500 mt-1">
//                         Phone number is required.
//                       </p>
//                     )}
//                   </div>
//                   <div className="grid gap-1">
//                     <label className="text-sm font-medium">
//                       Address Line 1 *
//                     </label>
//                     <input
//                       className="border rounded px-3 py-2 text-sm"
//                       value={addressLine1}
//                       onChange={(e) => setAddressLine1(e.target.value)}
//                       placeholder="House / Flat, Street"
//                     />
//                     {showErrors && !addressLine1.trim() && (
//                       <p className="text-xs text-red-500 mt-1">
//                         Address line 1 is required.
//                       </p>
//                     )}
//                   </div>
//                   <div className="grid gap-1">
//                     <label className="text-sm font-medium">
//                       Address Line 2
//                     </label>
//                     <input
//                       className="border rounded px-3 py-2 text-sm"
//                       value={addressLine2}
//                       onChange={(e) => setAddressLine2(e.target.value)}
//                       placeholder="Area, Landmark (optional)"
//                     />
//                   </div>
//                   <div className="grid gap-3 md:grid-cols-1">
//                     <div className="grid gap-1">
//                       <label className="text-sm font-medium">
//                         City *
//                       </label>
//                       <input
//                         className="border rounded px-3 py-2 text-sm"
//                         value={city}
//                         onChange={(e) => setCity(e.target.value)}
//                       />
//                       {showErrors && !city.trim() && (
//                         <p className="text-xs text-red-500 mt-1">
//                           City is required.
//                         </p>
//                       )}
//                     </div>
//                     <div className="grid gap-1">
//                       <label className="text-sm font-medium">
//                         State *
//                       </label>
//                       <select
//                         className="border rounded px-3 py-2 text-sm bg-background"
//                         value={state}
//                         onChange={(e) => setState(e.target.value)}
//                       >
//                         <option value="">Select state</option>
//                         {/* States */}
//                         <option value="Andhra Pradesh">Andhra Pradesh</option>
//                         <option value="Arunachal Pradesh">Arunachal Pradesh</option>
//                         <option value="Assam">Assam</option>
//                         <option value="Bihar">Bihar</option>
//                         <option value="Chhattisgarh">Chhattisgarh</option>
//                         <option value="Goa">Goa</option>
//                         <option value="Gujarat">Gujarat</option>
//                         <option value="Haryana">Haryana</option>
//                         <option value="Himachal Pradesh">Himachal Pradesh</option>
//                         <option value="Jharkhand">Jharkhand</option>
//                         <option value="Karnataka">Karnataka</option>
//                         <option value="Kerala">Kerala</option>
//                         <option value="Madhya Pradesh">Madhya Pradesh</option>
//                         <option value="Maharashtra">Maharashtra</option>
//                         <option value="Manipur">Manipur</option>
//                         <option value="Meghalaya">Meghalaya</option>
//                         <option value="Mizoram">Mizoram</option>
//                         <option value="Nagaland">Nagaland</option>
//                         <option value="Odisha">Odisha</option>
//                         <option value="Punjab">Punjab</option>
//                         <option value="Rajasthan">Rajasthan</option>
//                         <option value="Sikkim">Sikkim</option>
//                         <option value="Tamil Nadu">Tamil Nadu</option>
//                         <option value="Telangana">Telangana</option>
//                         <option value="Tripura">Tripura</option>
//                         <option value="Uttar Pradesh">Uttar Pradesh</option>
//                         <option value="Uttarakhand">Uttarakhand</option>
//                         <option value="West Bengal">West Bengal</option>
//                         {/* Union Territories */}
//                         <option value="Andaman and Nicobar Islands">
//                           Andaman and Nicobar Islands
//                         </option>
//                         <option value="Chandigarh">Chandigarh</option>
//                         <option value="Dadra and Nagar Haveli and Daman and Diu">
//                           Dadra and Nagar Haveli and Daman and Diu
//                         </option>
//                         <option value="Delhi">Delhi</option>
//                         <option value="Jammu and Kashmir">Jammu and Kashmir</option>
//                         <option value="Ladakh">Ladakh</option>
//                         <option value="Lakshadweep">Lakshadweep</option>
//                         <option value="Puducherry">Puducherry</option>
//                       </select>
//                       {showErrors && !state.trim() && (
//                         <p className="text-xs text-red-500 mt-1">
//                           State is required.
//                         </p>
//                       )}
//                     </div>
//                     <div className="grid gap-1">
//                       <label className="text-sm font-medium">
//                         Pincode *
//                       </label>
//                       <input
//                         className="border rounded px-3 py-2 text-sm"
//                         value={pincode}
//                         onChange={(e) => setPincode(e.target.value)}
//                         maxLength={6}
//                         inputMode="numeric"
//                         pattern="[0-9]*"
//                       />
//                       {showErrors && !isPincodeValid && (
//                         <p className="text-xs text-red-500 mt-1">
//                           Enter a valid 6-digit pincode.
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="pt-2 border-t mt-2 text-xs text-muted-foreground">
//                   <span className="font-medium">Deliver to:&nbsp;</span>
//                   {addressLine1 || addressLine2 || city || state || pincode
//                     ? [
//                       addressLine1,
//                       addressLine2,
//                       city,
//                       state,
//                       pincode,
//                     ]
//                       .filter((x) => x && x.trim())
//                       .join(", ")
//                     : "Add your full address above"}
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div className="border rounded-xl p-4 bg-card shadow-sm space-y-3">
//                   <div className="flex items-center justify-between mb-1">
//                     <h2 className="text-sm font-semibold">Order Summary</h2>
//                     <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-600/90 text-emerald-50 border border-emerald-700">
//                       Secure payment
//                     </span>
//                   </div>
//                   <div className="space-y-2">
//                     {items.map((it) => (
//                       <div
//                         key={it.id}
//                         className="flex items-center justify-between text-sm"
//                       >
//                         <div>
//                           <div className="font-medium">{it.id}</div>
//                           <div className="text-xs text-muted-foreground">
//                             {it.data?.name || "Your Name"} •{" "}
//                             {it.data?.company || "Company"}
//                           </div>
//                         </div>
//                         <div className="text-sm font-medium">
//                           ₹{it.price.toFixed(2)}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="flex items-center justify-between border-t pt-3 mt-2 text-sm">
//                     <div className="font-semibold">Total</div>
//                     <div className="font-semibold">
//                       ₹{total.toFixed(2)}
//                     </div>
//                   </div>
//                   <p className="text-[11px] text-muted-foreground mt-1">
//                     Payments are processed securely via Razorpay.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-end gap-2 mb-4 md:mb-10">
//               <Button variant="outline" onClick={() => navigate("/cart")}>
//                 Back to Cart
//               </Button>
//               <Button
//                 onClick={onPay}
//                 disabled={processing || !isFormValid}
//               >
//                 {processing
//                   ? "Processing..."
//                   : isFormValid
//                     ? "Pay Now"
//                     : "Complete details to pay"}
//               </Button>
//             </div>

//             {/* Hidden render for capture (front/back) */}
//             <div
//               style={{
//                 position: "absolute",
//                 left: -99999,
//                 top: -99999,
//               }}
//             >
//               {items.map((it) => {
//                 const isServer = it.id.startsWith("sb:");
//                 const serverId = isServer ? it.id.slice(3) : null;
//                 const serverTemplate = isServer
//                   ? sbTemplates.find((t) => t.id === serverId)
//                   : null;
//                 const classicConfig = !isServer ? byId[it.id] : null;

//                 // For server templates: render simple div with background image
//                 if (isServer && serverTemplate) {
//                   const bg = serverTemplate.background_url;
//                   const backBg = serverTemplate.back_background_url || bg;
//                   const cfg: any = serverTemplate.config || {};
//                   const fc = cfg.fontColor || "#000000";
//                   const fs = cfg.fontSize || 16;
//                   const accent = cfg.accentColor || "#0ea5e9";
//                   const ff = cfg.fontFamily || "Inter, Arial, sans-serif";

//                   return (
//                     <div key={it.id}>
//                       {/* Server template front */}
//                       <div
//                         ref={(el) => {
//                           frontRefs.current[it.id] = el;
//                         }}
//                         style={{
//                           width: "560px",
//                           height: "320px",
//                           backgroundColor: bg ? undefined : "#f3f4f6",
//                           backgroundImage: bg ? `url(${bg})` : undefined,
//                           backgroundSize: "cover",
//                           backgroundPosition: "center",
//                           color: fc,
//                           fontFamily: ff,
//                           fontSize: `${fs}px`,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           padding: "16px",
//                           gap: "16px",
//                           boxSizing: "border-box",
//                         }}
//                       >
//                         {it.data?.logo && (
//                           <img
//                             src={it.data.logo}
//                             alt="logo"
//                             style={{
//                               width: "64px",
//                               height: "64px",
//                               borderRadius: "50%",
//                               objectFit: "cover",
//                               border: "2px solid rgba(255,255,255,0.5)",
//                               boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                             }}
//                           />
//                         )}
//                         <div style={{ textAlign: "right" }}>
//                           <div style={{ fontWeight: "bold", fontSize: fs + 6 }}>
//                             {it.data?.name || "Your Name"}
//                           </div>
//                           {it.data?.title && (
//                             <div style={{ color: accent, fontSize: fs + 2 }}>
//                               {it.data.title}
//                             </div>
//                           )}
//                           {it.data?.company && (
//                             <div style={{ opacity: 0.8, fontSize: Math.max(12, fs) }}>
//                               {it.data.company}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Server template back */}
//                       <div
//                         ref={(el) => {
//                           backRefs.current[it.id] = el;
//                         }}
//                         style={{
//                           width: "560px",
//                           height: "320px",
//                           backgroundColor: backBg ? undefined : "#f3f4f6",
//                           backgroundImage: backBg ? `url(${backBg})` : undefined,
//                           backgroundSize: "cover",
//                           backgroundPosition: "center",
//                           color: fc,
//                           fontFamily: ff,
//                           fontSize: `${fs}px`,
//                           padding: "16px",
//                           boxSizing: "border-box",
//                         }}
//                       >
//                         {/* Minimal back content */}
//                         <div style={{ fontSize: fs }}>
//                           <div>
//                             <strong style={{ color: accent }}>✉</strong>{" "}
//                             {it.data?.email || "email@example.com"}
//                           </div>
//                           <div>
//                             <strong style={{ color: accent }}>✆</strong>{" "}
//                             {it.data?.phone || "+91 00000 00000"}
//                           </div>
//                           {it.data?.website && (
//                             <div>
//                               <strong style={{ color: accent }}>⌂</strong>{" "}
//                               {it.data.website}
//                             </div>
//                           )}
//                           {it.data?.address && (
//                             <div>
//                               <strong style={{ color: accent }}>📍</strong>{" "}
//                               {it.data.address}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 }

//                 // For classic templates
//                 if (!isServer && classicConfig) {
//                   return (
//                     <div key={it.id}>
//                       <div
//                         ref={(el) => {
//                           frontRefs.current[it.id] = el;
//                         }}
//                       >
//                         <ClassicCard
//                           data={it.data}
//                           config={classicConfig}
//                           fontFamily={it.selectedFont}
//                           fontSize={it.fontSize}
//                           textColor={it.textColor}
//                           accentColor={it.accentColor}
//                         />
//                       </div>
//                       <div
//                         ref={(el) => {
//                           backRefs.current[it.id] = el;
//                         }}
//                       >
//                         <BackSideCard
//                           data={it.data}
//                           background={{
//                             style:
//                               classicConfig.bgStyle === "solid"
//                                 ? "solid"
//                                 : "gradient",
//                             colors: classicConfig.bgColors,
//                           }}
//                           textColor={it.textColor}
//                           accentColor={it.accentColor}
//                           fontFamily={it.selectedFont}
//                           fontSize={it.fontSize}
//                         />
//                       </div>
//                     </div>
//                   );
//                 }

//                 return null;
//               })}
//             </div>
//           </>
//         )}

//         {/* Login modal (center, bigger) */}
//         {showLoginModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//             <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-base">
//               <h2 className="text-lg font-semibold mb-3">Login required</h2>
//               <p className="text-[15px] text-gray-700 mb-5 leading-relaxed">
//                 Please login or sign up before making a payment. Do you want to
//                 go to the login page now?
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
//                   onClick={handleLoginCancel}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground hover:brightness-95"
//                   onClick={handleLoginConfirm}
//                 >
//                   Go to Login
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Address confirm modal (center, bigger) */}
//         {showAddressModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//             <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-base">
//               <h2 className="text-lg font-semibold mb-3">
//                 Confirm delivery address
//               </h2>
//               <p className="text-[15px] text-gray-700 mb-4 leading-relaxed">
//                 Please confirm your delivery address before proceeding to
//                 payment:
//               </p>
//               <div className="border rounded-lg bg-gray-50 p-4 text-sm mb-5">
//                 {pendingAddress || "-"}
//               </div>
//               <div className="flex justify-end gap-3">
//                 <button
//                   className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
//                   onClick={handleAddressCancel}
//                 >
//                   Edit address
//                 </button>
//                 <button
//                   className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground hover:brightness-95"
//                   onClick={handleAddressConfirm}
//                 >
//                   Confirm &amp; Pay
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import { useCart } from "@/contexts/CartContext";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { apiFetch } from "@/services/api";
// import { useAuth } from "@/contexts/AuthContext";
// import { Loader2, ShieldCheck } from "lucide-react";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// // Helper: Convert Base64 DataURI to Blob for upload
// function dataURItoBlob(dataURI: string) {
//   try {
//     if (!dataURI || !dataURI.includes(',')) return null;
//     const byteString = atob(dataURI.split(',')[1]);
//     const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: mimeString });
//   } catch (e) {
//     console.error("Blob conversion failed", e);
//     return null;
//   }
// }

// export default function CheckoutPage() {
//   const { items, total, clear } = useCart();
//   const navigate = useNavigate();
//   const { user } = useAuth();
  
//   const [processing, setProcessing] = useState(false);
//   const [uploadingImages, setUploadingImages] = useState(false);
  
//   // Address State
//   const [customerName, setCustomerName] = useState("");
//   const [customerPhone, setCustomerPhone] = useState("");
//   const [addressLine1, setAddressLine1] = useState("");
//   const [addressLine2, setAddressLine2] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [pincode, setPincode] = useState("");

//   const [showAddressModal, setShowAddressModal] = useState(false);

//   // Load defaults from first item or user profile if available
//   useEffect(() => {
//     if (items.length === 0) {
//       navigate('/cart');
//       return;
//     }
//     const first = items[0];
//     if (!customerName && first.data?.name) setCustomerName(first.data.name);
//     if (!customerPhone && first.data?.phone) setCustomerPhone(first.data.phone);
//   }, [items, navigate]);

//   const onPayClick = () => {
//     if (!user) {
//       alert("Please login to continue");
//       navigate("/login");
//       return;
//     }
//     if (!customerName || !customerPhone || !addressLine1 || !city || !state || !pincode) {
//       alert("Please fill in all shipping details");
//       return;
//     }
//     if (pincode.length !== 6) {
//       alert("Please enter a valid 6-digit Pincode");
//       return;
//     }
//     setShowAddressModal(true);
//   };

//   // ✅ Image Upload Helper
//   const uploadImageToCloudinary = async (base64OrUrl: string | null | undefined) => {
//     if (!base64OrUrl) return null;
    
//     // If it's already a URL (http...), return it directly
//     if (base64OrUrl.startsWith('http')) return base64OrUrl;

//     // If it's Base64, Upload it
//     if (base64OrUrl.startsWith('data:image')) {
//       try {
//         const blob = dataURItoBlob(base64OrUrl);
//         if (!blob) return null;

//         const formData = new FormData();
//         formData.append('file', blob, 'card_image.png');

//         const token = localStorage.getItem('token');
//         // Use standard fetch to avoid Content-Type header issues with FormData
//         const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3003'}/upload`, {
//           method: 'POST',
//           headers: {
//             'Authorization': token ? `Bearer ${token}` : ''
//           },
//           body: formData
//         });

//         if (!res.ok) throw new Error("Upload failed");
        
//         const data = await res.json();
//         return data.url; // Returns Cloudinary URL
//       } catch (error) {
//         console.error("Image upload failed", error);
//         return null;
//       }
//     }
//     return null;
//   };

//   const startPayment = async () => {
//     setShowAddressModal(false);
//     setProcessing(true);

//     try {
//       // 1. Create Razorpay Order
//       const orderRes = await apiFetch("/payments/create-order", {
//         method: "POST",
//         body: JSON.stringify({ amount: Math.round(total) }),
//       });
//       const { order } = orderRes as any;

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         name: "Business Card Store",
//         description: "Payment for card printing",
//         order_id: order.id,
//         prefill: {
//           name: customerName,
//           email: user?.email,
//           contact: customerPhone,
//         },
//         handler: async (response: any) => {
//           try {
//             setUploadingImages(true); // Show uploading state

//             // ✅ 2. Upload Images to Cloudinary BEFORE Verification
//             // We iterate over all cart items and convert Base64 to URL
//             const processedItems = await Promise.all(items.map(async (item) => {
              
//               // Upload Front & Back images
//               const frontUrl = await uploadImageToCloudinary(item.frontImageUrl);
//               const backUrl = await uploadImageToCloudinary(item.backImageUrl);

//               // Create new item object with URLs instead of Base64
//               return {
//                 templateId: item.productId || item.id,
//                 title: item.data?.name || "Business Card",
//                 price: item.price,
//                 templateName: item.serverMeta?.name || "Custom Design",
                
//                 // 👇 Save URLs here
//                 frontImageUrl: frontUrl,
//                 backImageUrl: backUrl,
                
//                 quantity: item.quantity || 1,
                
//                 // Save design data for future edits
//                 data: {
//                   ...item.data,
//                   frontData: item.frontData || item.design,
//                   backData: item.backData
//                 }
//               };
//             }));

//             setUploadingImages(false);

//             // ✅ 3. Verify Payment & Save to DB
//             const verifyRes = await apiFetch("/payments/verify", {
//               method: "POST",
//               body: JSON.stringify({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//                 amount: total,
                
//                 // Shipping Data
//                 customer_name: customerName,
//                 customer_phone: customerPhone,
//                 address_line1,
//                 address_line2,
//                 city,
//                 state,
//                 pincode,

//                 // 👇 Processed Items (with URLs)
//                 items: processedItems 
//               }),
//             });

//             if ((verifyRes as any).success) {
//               clear(); // Clear Cart
//               navigate("/my-orders"); // Go to Orders
//             } else {
//               alert("Payment verification failed. Please contact support.");
//             }

//           } catch (e) {
//             console.error(e);
//             alert("Error processing order. If money was deducted, it will be refunded.");
//           } finally {
//             setProcessing(false);
//             setUploadingImages(false);
//           }
//         },
//         modal: {
//           ondismiss: () => {
//             setProcessing(false);
//             setUploadingImages(false);
//           }
//         }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();

//     } catch (e: any) {
//       console.error(e);
//       alert("Failed to initiate payment. Please try again.");
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="container mx-auto max-w-5xl">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
//         <div className="grid lg:grid-cols-3 gap-8">
          
//           {/* Shipping Form - Left Side */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//               <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
//                 1. Shipping Details
//               </h2>
              
//               <div className="grid md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Full Name</label>
//                   <input 
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
//                     value={customerName} 
//                     onChange={e => setCustomerName(e.target.value)} 
//                     placeholder="John Doe"
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Phone Number</label>
//                   <input 
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
//                     value={customerPhone} 
//                     onChange={e => setCustomerPhone(e.target.value)} 
//                     placeholder="+91 98765 43210"
//                   />
//                 </div>

//                 <div className="md:col-span-2 space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Address Line 1</label>
//                   <input 
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
//                     value={addressLine1} 
//                     onChange={e => setAddressLine1(e.target.value)} 
//                     placeholder="House No, Building, Street Area"
//                   />
//                 </div>

//                 <div className="md:col-span-2 space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
//                   <input 
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
//                     value={addressLine2} 
//                     onChange={e => setAddressLine2(e.target.value)} 
//                     placeholder="Landmark, etc."
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">City</label>
//                   <input 
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
//                     value={city} 
//                     onChange={e => setCity(e.target.value)} 
//                     placeholder="City Name"
//                   />
//                 </div>
//                  <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">State</label>
//                   <input 
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
//                     value={state} 
//                     onChange={e => setState(e.target.value)} 
//                     placeholder="State Name"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">Pincode</label>
//                   <input 
//                     className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
//                     value={pincode} 
//                     onChange={e => setPincode(e.target.value)} 
//                     maxLength={6} 
//                     placeholder="110001"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Order Summary - Right Side */}
//           <div className="lg:col-span-1">
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
//               <h2 className="text-xl font-semibold mb-5">Order Summary</h2>
              
//               <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-1">
//                 {items.map(item => (
//                   <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
//                     <div className="flex-1 pr-4">
//                       <p className="font-medium text-gray-800">{item.data?.name || "Business Card"}</p>
//                       <p className="text-xs text-gray-500">{item.kind === 'server' ? 'Premium Template' : 'Classic Design'}</p>
//                     </div>
//                     <span className="font-semibold text-gray-900">₹{item.price.toFixed(0)}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="border-t border-dashed pt-4 mb-6">
//                 <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
//                   <span>Subtotal</span>
//                   <span>₹{total.toFixed(0)}</span>
//                 </div>
//                 <div className="flex justify-between items-center mb-2 text-sm text-green-600">
//                   <span>Delivery</span>
//                   <span>FREE</span>
//                 </div>
//                 <div className="flex justify-between items-center pt-2 border-t mt-2">
//                   <span className="font-bold text-lg text-gray-900">Total</span>
//                   <span className="font-bold text-lg text-blue-600">₹{total.toFixed(0)}</span>
//                 </div>
//               </div>

//               <Button 
//                 className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-md" 
//                 size="lg" 
//                 onClick={onPayClick}
//                 disabled={processing || items.length === 0}
//               >
//                 {processing ? (
//                   <div className="flex items-center gap-2">
//                     <Loader2 className="animate-spin w-5 h-5" />
//                     {uploadingImages ? "Finalizing..." : "Processing..."}
//                   </div>
//                 ) : (
//                   "Proceed to Pay"
//                 )}
//               </Button>

//               <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
//                 <ShieldCheck className="w-4 h-4 text-green-600" />
//                 Secure Payment via Razorpay
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Confirmation Modal */}
//       {showAddressModal && (
//          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//            <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl animate-fade-in">
//              <h3 className="text-xl font-bold mb-4 text-gray-900">Confirm Details</h3>
//              <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm border border-gray-100">
//                <p className="text-gray-500 text-xs uppercase font-bold mb-1">Shipping To</p>
//                <p className="font-bold text-gray-800 text-base">{customerName}</p>
//                <p className="text-gray-700">{customerPhone}</p>
//                <div className="h-px bg-gray-200 my-2"></div>
//                <p className="text-gray-600 leading-relaxed">
//                  {addressLine1}, {addressLine2 ? addressLine2 + ', ' : ''}
//                  <br />
//                  {city}, {state} - <span className="font-semibold text-gray-900">{pincode}</span>
//                </p>
//              </div>
             
//              <div className="flex gap-3 justify-end">
//                <Button 
//                 variant="outline" 
//                 onClick={() => setShowAddressModal(false)}
//                 className="border-gray-300"
//                >
//                  Edit Address
//                </Button>
//                <Button 
//                 onClick={startPayment} 
//                 disabled={processing}
//                 className="bg-blue-600 hover:bg-blue-700 px-6"
//                >
//                  {processing ? (
//                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
//                  ) : null}
//                  Pay ₹{total.toFixed(0)}
//                </Button>
//              </div>
//            </div>
//          </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShieldCheck } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Helper: Convert Base64 DataURI to Blob for upload
function dataURItoBlob(dataURI: string) {
  try {
    if (!dataURI || !dataURI.includes(',')) return null;
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  } catch (e) {
    console.error("Blob conversion failed", e);
    return null;
  }
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [processing, setProcessing] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // ✅ Address State Variables (CamelCase)
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [showAddressModal, setShowAddressModal] = useState(false);

  // Load defaults
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    const first = items[0];
    if (!customerName && first.data?.name) setCustomerName(first.data.name);
    if (!customerPhone && first.data?.phone) setCustomerPhone(first.data.phone);
  }, [items, navigate]);

  const onPayClick = () => {
    if (!user) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }
    if (!customerName || !customerPhone || !addressLine1 || !city || !state || !pincode) {
      alert("Please fill in all shipping details");
      return;
    }
    if (pincode.length !== 6) {
      alert("Please enter a valid 6-digit Pincode");
      return;
    }
    setShowAddressModal(true);
  };

  // Image Upload Helper
  const uploadImageToCloudinary = async (base64OrUrl: string | null | undefined) => {
    if (!base64OrUrl) return null;
    if (base64OrUrl.startsWith('http')) return base64OrUrl;

    if (base64OrUrl.startsWith('data:image')) {
      try {
        const blob = dataURItoBlob(base64OrUrl);
        if (!blob) return null;

        const formData = new FormData();
        formData.append('file', blob, 'card_image.png');

        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3003'}/upload`, {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: formData
        });

        if (!res.ok) throw new Error("Upload failed");
        
        const data = await res.json();
        return data.url;
      } catch (error) {
        console.error("Image upload failed", error);
        return null;
      }
    }
    return null;
  };

  const startPayment = async () => {
    setShowAddressModal(false);
    setProcessing(true);

    try {
      // 1. Create Razorpay Order
      const orderRes = await apiFetch("/payments/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: Math.round(total) }),
      });
      const { order } = orderRes as any;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Business Card Store",
        description: "Payment for card printing",
        order_id: order.id,
        prefill: {
          name: customerName,
          email: user?.email,
          contact: customerPhone,
        },
        handler: async (response: any) => {
          try {
            setUploadingImages(true);

            // 2. Upload Images
            const processedItems = await Promise.all(items.map(async (item) => {
              const frontUrl = await uploadImageToCloudinary(item.frontImageUrl);
              const backUrl = await uploadImageToCloudinary(item.backImageUrl);

              return {
                templateId: item.productId || item.id,
                title: item.data?.name || "Business Card",
                price: item.price,
                templateName: item.serverMeta?.name || "Custom Design",
                frontImageUrl: frontUrl,
                backImageUrl: backUrl,
                quantity: item.quantity || 1,
                data: {
                  ...item.data,
                  frontData: item.frontData || item.design,
                  backData: item.backData
                }
              };
            }));

            setUploadingImages(false);

            // ✅ 3. Verify Payment & Save to DB
            // FIXED: Mapping state variables correctly to API keys
            const verifyRes = await apiFetch("/payments/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: total,
                
                // Shipping Data Correctly Mapped
                customer_name: customerName,
                customer_phone: customerPhone,
                address_line1: addressLine1, // ✅ Fixed: using state variable
                address_line2: addressLine2, // ✅ Fixed: using state variable
                city,
                state,
                pincode,

                items: processedItems 
              }),
            });

            if ((verifyRes as any).success) {
              clear();
              navigate("/my-orders");
            } else {
              alert("Payment verification failed. Please contact support.");
            }

          } catch (e: any) {
            console.error("Processing Error:", e);
            // Show exact error in alert for debugging
            alert(`Error processing order: ${e.message}`);
          } finally {
            setProcessing(false);
            setUploadingImages(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setUploadingImages(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (e: any) {
      console.error(e);
      alert("Failed to initiate payment. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-5 flex items-center gap-2">
                1. Shipping Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <input 
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={customerName} 
                    onChange={e => setCustomerName(e.target.value)} 
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <input 
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={customerPhone} 
                    onChange={e => setCustomerPhone(e.target.value)} 
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address Line 1</label>
                  <input 
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={addressLine1} 
                    onChange={e => setAddressLine1(e.target.value)} 
                    placeholder="House No, Building, Street Area"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                  <input 
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={addressLine2} 
                    onChange={e => setAddressLine2(e.target.value)} 
                    placeholder="Landmark, etc."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <input 
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={city} 
                    onChange={e => setCity(e.target.value)} 
                    placeholder="City Name"
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <input 
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={state} 
                    onChange={e => setState(e.target.value)} 
                    placeholder="State Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pincode</label>
                  <input 
                    className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={pincode} 
                    onChange={e => setPincode(e.target.value)} 
                    maxLength={6} 
                    placeholder="110001"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-semibold mb-5">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-gray-800">{item.data?.name || "Business Card"}</p>
                      <p className="text-xs text-gray-500">{item.kind === 'server' ? 'Premium Template' : 'Classic Design'}</p>
                    </div>
                    <span className="font-semibold text-gray-900">₹{item.price.toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed pt-4 mb-6">
                <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center mb-2 text-sm text-green-600">
                  <span>Delivery</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t mt-2">
                  <span className="font-bold text-lg text-gray-900">Total</span>
                  <span className="font-bold text-lg text-blue-600">₹{total.toFixed(0)}</span>
                </div>
              </div>

              <Button 
                className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-md" 
                size="lg" 
                onClick={onPayClick}
                disabled={processing || items.length === 0}
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" />
                    {uploadingImages ? "Finalizing..." : "Processing..."}
                  </div>
                ) : (
                  "Proceed to Pay"
                )}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Secure Payment via Razorpay
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showAddressModal && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
           <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl animate-fade-in">
             <h3 className="text-xl font-bold mb-4 text-gray-900">Confirm Details</h3>
             <div className="bg-gray-50 p-4 rounded-xl mb-6 text-sm border border-gray-100">
               <p className="text-gray-500 text-xs uppercase font-bold mb-1">Shipping To</p>
               <p className="font-bold text-gray-800 text-base">{customerName}</p>
               <p className="text-gray-700">{customerPhone}</p>
               <div className="h-px bg-gray-200 my-2"></div>
               <p className="text-gray-600 leading-relaxed">
                 {addressLine1}, {addressLine2 ? addressLine2 + ', ' : ''}
                 <br />
                 {city}, {state} - <span className="font-semibold text-gray-900">{pincode}</span>
               </p>
             </div>
             
             <div className="flex gap-3 justify-end">
               <Button 
                variant="outline" 
                onClick={() => setShowAddressModal(false)}
                className="border-gray-300"
               >
                 Edit Address
               </Button>
               <Button 
                onClick={startPayment} 
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700 px-6"
               >
                 {processing ? (
                   <Loader2 className="animate-spin w-4 h-4 mr-2" />
                 ) : null}
                 Pay ₹{total.toFixed(0)}
               </Button>
             </div>
           </div>
         </div>
      )}
    </div>
  );
}
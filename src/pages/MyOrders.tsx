import { useEffect, useState } from "react";
import { apiFetch } from "@/services/api";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin, ImageIcon, AlertCircle, X, Eye } from "lucide-react";
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
      <main className="container mx-auto max-w-5xl px-4 py-6 md:py-10 flex-grow">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your orders and view design details.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {!error && payments.length === 0 && (
          <div className="text-center py-16 md:py-20 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm mx-auto max-w-lg">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6 px-4">Looks like you haven't purchased any cards yet.</p>
            <Button onClick={() => window.location.href = '/'} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              Create a Card
            </Button>
          </div>
        )}

        <div className="space-y-4 md:space-y-6">
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
                <div className="bg-gray-50/80 px-4 md:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="grid grid-cols-2 sm:flex sm:gap-8 gap-y-2 text-sm w-full sm:w-auto">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Placed On</p>
                      <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(p.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                    {/* <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total</p>
                      <p className="font-bold text-gray-900">
                        ₹{p.amount != null ? p.amount.toFixed(2) : "-"}
                      </p>
                    </div> */}
                  </div>
                  
                  <div className={`self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold border ${statusBadge} uppercase tracking-wide flex items-center gap-1.5`}>
                    <span className={`w-2 h-2 rounded-full ${status === 'success' || status === 'captured' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                    {p.status || "Unknown"}
                  </div>
                </div>

                {/* Order Items List */}
                <div className="p-4 md:p-6">
                  <div className="space-y-8 divide-y divide-gray-100">
                    {(p.items || []).map((item, idx) => {
                      const displayName = item.templateName || item.title || "Custom Business Card";
                      
                      // LOGIC: Show Front Image as thumbnail, if not available then Back Image
                      const thumbnailImage = item.frontImageUrl || item.backImageUrl;

                      return (
                        <div key={idx} className={`flex flex-col sm:flex-row gap-6 ${idx > 0 ? 'pt-8' : ''}`}>
                          
                          {/* 1. THUMBNAIL (List View Only) */}
                          <div className="shrink-0 w-full sm:w-[200px]">
                            <div 
                              className="relative w-full aspect-[1.75/1] bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shadow-sm cursor-pointer group"
                              onClick={() => setSelected({ payment: p, item })}
                            >
                              {thumbnailImage ? (
                                <>
                                  <img 
                                    src={thumbnailImage} 
                                    alt="Card Preview" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                  />
                                  {/* Hover Overlay */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                     <Eye className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity" />
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                                  <span className="text-xs">No Preview</span>
                                </div>
                              )}
                              <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium backdrop-blur-sm">
                                PREVIEW
                              </div>
                            </div>
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-gray-900 break-words pr-2">{displayName}</h4>
                                <p className="font-bold text-lg text-gray-900 whitespace-nowrap">₹{item.price}</p>
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-2 mb-3">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">Qty: {item.quantity || 1}</span>
                                <span className="text-gray-300">|</span>
                                <span className="text-xs">ID: {item.templateId.substring(0, 8)}</span>
                              </div>
                              
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                Delivery to: <span className="font-medium text-gray-900">{p.customer_name}</span> at {p.city}, {p.state}.
                              </p>
                            </div>

                            <div className="mt-3 flex justify-start sm:justify-end">
                              <Button 
                                onClick={() => setSelected({ payment: p, item })}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                View Full Details & Designs
                              </Button>
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

        {/* 2. MODAL (Full Details View) - Shows Both Front & Back */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:px-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full h-[95vh] sm:h-auto sm:max-h-[90vh] sm:max-w-4xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              
              <div className="px-4 md:px-6 py-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
                <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  onClick={() => setSelected(null)}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-4 md:p-6 overflow-y-auto">
                <div className="mb-6">
                  <h3 className="text-md font-bold text-gray-900 mb-4">Card Designs</h3>
                  
                  {/* Grid showing Front and Back Side-by-Side (Stacked on Mobile) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    
                    {/* Front Design */}
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <h4 className="font-medium text-xs text-gray-500 uppercase tracking-wide">Front Side</h4>
                         {/* Optional: Download Button logic here */}
                       </div>
                       <div className="rounded-xl border shadow-md overflow-hidden bg-gray-100 aspect-[1.75/1] relative">
                         {(selected.item as any).frontImageUrl ? (
                           <img src={(selected.item as any).frontImageUrl} className="w-full h-full object-cover" alt="Front Design" />
                         ) : <div className="flex items-center justify-center h-full text-gray-400 text-sm">Front Image Not Available</div>}
                       </div>
                    </div>

                    {/* Back Design */}
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <h4 className="font-medium text-xs text-gray-500 uppercase tracking-wide">Back Side</h4>
                       </div>
                       <div className="rounded-xl border shadow-md overflow-hidden bg-gray-100 aspect-[1.75/1] relative">
                         {(selected.item as any).backImageUrl ? (
                           <img src={(selected.item as any).backImageUrl} className="w-full h-full object-cover" alt="Back Design" />
                         ) : <div className="flex items-center justify-center h-full text-gray-400 text-sm">Back Image Not Available</div>}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Shipping Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs uppercase mb-1">Receiver Name</p>
                      <p className="font-semibold text-lg text-gray-900">{selected.payment.customer_name}</p>
                      
                      <p className="text-gray-500 text-xs uppercase mb-1 mt-4">Contact Phone</p>
                      <p className="font-medium text-gray-900">{selected.payment.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase mb-1">Full Address</p>
                      <div className="text-gray-800 leading-relaxed bg-white p-3 rounded border border-gray-200">
                        <p>{selected.payment.address_line1}</p>
                        {selected.payment.address_line2 && <p>{selected.payment.address_line2}</p>}
                        <p className="mt-1">{selected.payment.city}, {selected.payment.state}</p>
                        <p className="font-bold mt-1">PIN: {selected.payment.pincode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
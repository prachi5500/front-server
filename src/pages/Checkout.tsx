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

            //  3. Verify Payment & Save to DB
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
                address_line1: addressLine1, 
                address_line2: addressLine2, 
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
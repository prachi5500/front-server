import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, X, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { CardPreviewWithDesign } from "@/components/CardPreviewWithDesign";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { items, remove, total, isLoading, clearCache } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            {/* <h1
              className="text-2xl lg:text-4xl font-bold text-blue-700 cursor-pointer select-none"
              onClick={() => navigate("/")}
            >
              Businesscard
            </h1> */}
            <img
  src="/logo.png"
  alt="Businesscard Logo"
  className="h-10 lg:h-14 cursor-pointer"
  onClick={() => navigate("/")}
/>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-10">
              <div className="flex items-center bg-gray-100 rounded-lg px-5 py-3 w-full">
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500 w-full"
                />
              </div>
            </div>

            {/* Desktop Progress Bar */}
            <div className="hidden lg:flex items-center gap-8 text-xs font-medium">
              {["Cart", "Address", "Payment", "Summary"].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    {i + 1}
                  </div>
                  <span className={i === 0 ? "text-blue-600 font-semibold" : "text-gray-600"}>
                    {step}
                  </span>
                  {i < 3 && <div className="w-12 h-px bg-gray-300" />}
                </div>
              ))}
            </div>

            {/* Mobile Search + Cart */}
            <div className="flex items-center gap-4">
              <button onClick={() => setSearchOpen(!searchOpen)} className="lg:hidden">
                <Search className="w-6 h-6 text-gray-700" />
              </button>
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-gray-700" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {items.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Dropdown */}
          {searchOpen && (
            <div className="lg:hidden border-t bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 outline-none"
                  autoFocus
                />
                <button onClick={() => setSearchOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          )}

          {/* MOBILE PROGRESS BAR */}
          <div className="lg:hidden border-t bg-gray-50">
            <div className="px-4 py-4">
              <div className="flex items-center justify-center gap-3 text-xs font-medium">
                {/* Step 1 - Cart (Active) */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-blue-600 font-semibold">Cart</span>
                </div>

                <div className="w-10 h-px bg-gray-300"></div>

                {/* Step 2 */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <span className="text-gray-500">Address</span>
                </div>

                <div className="w-10 h-px bg-gray-300"></div>

                {/* Step 3 */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <span className="text-gray-500">Payment</span>
                </div>

                <div className="w-10 h-px bg-gray-300"></div>

                {/* Step 4 */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <span className="text-gray-500">Summary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Empty Cart */}
          {items.length === 0 ? (
            <div className="text-center py-20 lg:py-32">
              <div className="mb-10">
                <div className="inline-block p-12 bg-white rounded-3xl shadow-lg">
                  <ShoppingBag className="w-24 h-24 lg:w-32 lg:h-32 text-gray-300" />
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                Your cart is empty!
              </h2>
              <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added anything yet.</p>
              <Button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                      My Cart ({items.length} {items.length > 1 ? "Items" : "Item"})
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {items.map((item) => {
                      const hasCustomizations = 
                        item.selectedFont !== "Arial, sans-serif" ||
                        item.fontSize !== 16 ||
                        item.textColor !== "#000000" ||
                        item.accentColor !== "#0ea5e9" ||
                        item.design?.isEditLayout;

                      return (
                        <div
                          key={item.id}
                          className="bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="p-5 lg:p-6">
                            <div className="space-y-4">
                              {/* Card Preview Section */}
                              <div className="flex flex-col sm:flex-row gap-4">
                                {/* Front Side Preview */}
                                <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-md relative aspect-[1.75/1] min-h-[160px]">
                                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
                                    Front
                                  </div>
                                  <CardPreviewWithDesign 
                                    item={item} 
                                    type="front" 
                                    size="medium"
                                  />
                                </div>

                                {/* Back Side Preview */}
                                <div className="flex-1 bg-white rounded-lg overflow-hidden shadow-md relative aspect-[1.75/1] min-h-[160px]">
                                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
                                    Back
                                  </div>
                                  <CardPreviewWithDesign 
                                    item={item} 
                                    type="back" 
                                    size="medium"
                                  />
                                </div>
                              </div>

                              {/* Item Details */}
                              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-4 border-t border-dashed border-gray-200">
                                <div className="space-y-2 text-sm text-gray-600">
                                  {/* Design Status */}
                                  {hasCustomizations ? (
                                    <span className="inline-block text-xs uppercase tracking-wide text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                      ✓ Custom Design
                                    </span>
                                  ) : (
                                    <span className="inline-block text-xs uppercase tracking-wide text-gray-600 font-semibold bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                                      Standard Design
                                    </span>
                                  )}

                                  <h3 className="text-xl font-semibold text-gray-900 mt-2">
                                    {item.serverMeta?.name || "Business Card"}
                                  </h3>

                                  <div className="space-y-1">
                                    <p><span className="font-medium">Card Type:</span> {item.data?.cardType || "Standard"}</p>
                                    <p><span className="font-medium">Paper:</span> {item.data?.paperType || "300 GSM Matte"}</p>

                                    {/* Customization Details */}
                                    {hasCustomizations && item.design && (
                                      <div className="pt-2 border-t border-gray-100 mt-2">
                                        <p className="text-xs font-medium text-gray-700 mb-1">Customizations Applied:</p>
                                        <div className="flex flex-wrap gap-2">
                                          {item.selectedFont !== "Arial, sans-serif" && (
                                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                                              Font: {item.selectedFont.split(',')[0]}
                                            </span>
                                          )}
                                          {item.fontSize !== 16 && (
                                            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                                              Size: {item.fontSize}px
                                            </span>
                                          )}
                                          {item.design.positionsBack && (
                                            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100">
                                              Layout: Custom Positions
                                            </span>
                                          )}
                                        </div>
                                        
                                        {/* Show position details for debugging */}
                                        <div className="mt-2 text-xs text-gray-500">
                                          <p>QR Position: X: {item.design.positionsBack?.qr?.x}%, Y: {item.design.positionsBack?.qr?.y}%</p>
                                          <p>QR Size: {item.design.backSizes?.qr}px</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                                    ₹{item.price.toFixed(0)}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(item.id)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full h-10 w-10"
                                  >
                                    <X className="w-5 h-5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Price Summary - Right Side */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-800 mb-5">Order Summary</h2>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total MRP</span>
                      <span className="font-medium">₹{(total * 2).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount (20%)</span>
                      <span className="text-green-600 font-medium">-₹{(total * 0.2).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Charges</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>

                    <div className="border-t-2 border-dashed pt-4 mt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-2xl text-blue-600">₹{total.toFixed(0)}</span>
                      </div>
                    </div>

                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium text-center">
                      You saved ₹{(total * 0.2).toFixed(0)} on this order!
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/checkout")}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Secure checkout • No payment charged yet
                  </p>

                  <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-sm font-medium text-gray-700 flex items-center justify-center gap-2">
                      <span className="text-green-600">🔒</span>
                      100% Safe & Secure Payments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
// src/pages/Cart.tsx
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, X, Menu } from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, remove, total } = useCart();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Header - Fully Responsive */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <h1
              className="text-2xl lg:text-4xl font-bold text-blue-700 cursor-pointer select-none"
              onClick={() => navigate("/")}
            >
              Businesscard
            </h1>

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

            {/* Desktop Progress Bar - Tumhare original jaisa, bas compact */}
            <div className="hidden lg:flex items-center gap-8 text-xs font-medium">
              {["Cart", "Address", "Payment", "Summary"].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                      }`}
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

          {/* MOBILE PROGRESS BAR – Ek Line Mein, Super Chhota, Perfect Center */}
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
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
                    My Cart ({items.length} {items.length > 1 ? "Items" : "Item"})
                  </h2>

                  <div className="space-y-6">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-5 lg:p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Card Preview */}
                            <div className="w-full lg:w-64 h-48 bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col justify-between shadow-inner">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">
                                  {item.data?.name || "John Doe"}
                                </h3>
                                <p className="text-blue-600 font-medium">
                                  {item.data?.title || "Software Engineer"}
                                </p>
                              </div>
                              <div className="text-sm">
                                <p className="font-medium text-gray-800">
                                  {item.data?.company || "Tech Corp"}
                                </p>
                                <p className="text-gray-600">{item.data?.email || "john@tech.com"}</p>
                                <p className="text-gray-600">{item.data?.phone || "+91 98765 43210"}</p>
                              </div>
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {item.data?.cardType || "Premium Matte Business Cards"}
                                </h3>
                                <div className="mt-2 space-y-1 text-sm text-gray-600">
                                  <p>Card Type: <span className="font-medium">{item.data?.cardType || "Standard"}</span></p>
                                  <p>Paper: <span className="font-medium">{item.data?.paperType || "300 GSM Matte"}</span></p>
                                  <p>Quantity: <span className="font-medium">100 cards</span></p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-6">
                                <div className="text-3xl font-bold text-gray-900">
                                  ₹{item.price.toFixed(0)}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(item.id)}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full h-12 w-12"
                                >
                                  <X className="w-6 h-6" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Summary - Right Side (Sticky on Desktop) */}
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
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-7 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                  >
                    Proceed to Checkout
                  </Button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    Secure checkout • No payment charged yet
                  </p>

                  <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-sm font-medium text-gray-700 flex items-center justify-center gap-2">
                      <span className="text-green-600">Lock Icon</span>
                      100% Safe & Secure Payments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
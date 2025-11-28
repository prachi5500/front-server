// src/pages/Cart.tsx
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, X } from "lucide-react";

export default function CartPage() {
  const { items, remove, total } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {/* Top Bar – Logo + Search Bar + Progress Bar – All in ONE line */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <h1
              className="text-4xl font-medium text-blue-700 cursor-pointer select-none"
              onClick={() => navigate("/")}
            >
              Businesscard
            </h1>

            {/* Search Bar – Center mein */}
            <div className="flex-1 max-w-2xl mx-10">
              <div className="flex items-center bg-gray-100 rounded-lg px-5 py-3">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="ml-3 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500 w-full"
                />
              </div>
            </div>

            {/* Progress Bar – Right side, same line */}
            <div className="flex items-center text-sm">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium mr-1.5">
                    1
                  </div>
                  <span className="text-blue-500 font-medium mx-1.5">Cart</span>
                </div>

                <div className="w-8 h-px bg-gray-300 mx-1.5"></div>

                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium mr-1.5">
                    2
                  </div>
                  <span className="text-gray-500 mx-1.5">Address</span>
                </div>

                <div className="w-8 h-px bg-gray-300 mx-1.5"></div>

                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium mr-1.5">
                    3
                  </div>
                  <span className="text-gray-500 mx-1.5">Payment</span>
                </div>

                <div className="w-8 h-px bg-gray-300 mx-1.5"></div>

                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium mr-1.5">
                    4
                  </div>
                  <span className="text-gray-500 mx-1.5">Summary</span>
                </div>
              </div>
            </div>

            {/* Cart Icon (optional – chhota rakha hai) */}
            <div className="relative ml-6">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {items.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Baki cart content same as before */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-12">

          {/* Empty Cart */}
          {items.length === 0 ? (
            <div className="text-center py-32">
              <div className="mb-12">
                <div className="inline-block p-12 bg-white rounded-3xl shadow-md">
                  <ShoppingBag className="w-24 h-24 text-gray-300" />
                </div>
              </div>
              <h2 className="text-2xl font-medium text-gray-800 mb-3">Your cart is empty!</h2>
              <p className="text-gray-600 mb-10">Add items to it now.</p>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-xl font-medium"
                onClick={() => navigate("/")}
              >
                Shop now
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Product Details ({items.length} Item{items.length > 1 ? 's' : ''})</h2>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Business Card Preview */}
                            <div className="w-full md:w-64 h-40 bg-white border-2 border-gray-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
                              <div>
                                <h3 className="font-bold text-lg text-gray-800">{item.data?.name || "Your Name"}</h3>
                                <p className="text-sm text-blue-600 font-medium">{item.data?.designation || "Your Designation"}</p>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-700">{item.data?.company || "Your Company"}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.data?.email || "email@example.com"}</p>
                                <p className="text-xs text-gray-500">{item.data?.phone || "+91 XXXXXXXXXX"}</p>
                              </div>
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-gray-900 text-lg">
                                    {item.data?.cardType || "Premium Business Card"}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity || 1}</p>
                                  <p className="text-sm text-gray-600">Card Type: {item.data?.cardType || "Standard"}</p>
                                  <p className="text-sm text-gray-600">Paper Type: {item.data?.paperType || "Matte"}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-gray-900">
                                    ₹{item.price.toFixed(0)}
                                  </div>
                                  <p className="text-sm text-gray-500">per 100 cards</p>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(item.id)}
                              className="text-gray-500 hover:text-red-600 hover:bg-red-50 h-10 w-10 rounded-full"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Details - Right Side */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Price Details ({items.length} Item{items.length > 1 ? 's' : ''})</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total MRP</span>
                      <span>₹{(total * 2).toFixed(0)}</span>
                    </div>
          
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount on MRP</span>
                      <span className="text-green-600">-₹{(total * 0.2).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-3">
                      <span className="text-gray-600">Delivery Charges</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-base mb-2">
                        <span>Total Amount</span>
                        <span className="text-2xl">₹{total.toFixed(0)}</span>
                      </div>
                      <div className="text-green-600 text-sm mb-4">You will save ₹{(total * 0.2).toFixed(0)} on this order</div>
                    </div>
                  </div>

                  <div className="mt-8 mb-4">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                      onClick={() => navigate("/checkout")}
                    >
                      Continue to Checkout
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Clicking on ‘Continue’ will not deduct any money
                  </p>

                  {/* Safety Message */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-3 text-xs text-gray-600">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-blue-600">Your Safety, Our Priority</div>
                        <div>We make sure that your package is safe at every point of contact.</div>
                      </div>
                    </div>
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
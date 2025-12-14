import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, LogOut, User, Mail, Phone } from "lucide-react";

const MyAccount: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f6f7] py-12">
      <div className="max-w-4xl mx-auto p-6">

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-[#4A70A9] to-[#8FABD4] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-[#000000]">My Account</h1>
          <p className="text-[#4A70A9] text-lg font-medium">Welcome to your personal space</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8 transition-all hover:shadow-3xl">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-[#4A70A9] font-medium mb-2">
                <User className="h-4 w-4 mr-2" />
                Full Name
              </div>
              <div className="font-semibold text-[#000000] p-4 bg-[#f8f8f8] rounded-xl border border-[#8FABD4]/30">
                {profile?.name ?? "-"}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-[#4A70A9] font-medium mb-2">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number
              </div>
              <div className="font-semibold text-[#000000] p-4 bg-[#f8f8f8] rounded-xl border border-[#8FABD4]/30">
                {profile?.phone ?? "-"}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-3">
              <div className="flex items-center text-sm text-[#4A70A9] font-medium mb-2">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </div>
              <div className="font-semibold text-[#000000] p-4 bg-[#f8f8f8] rounded-xl border border-[#8FABD4]/30">
                {user?.email ?? "-"}
              </div>
            </div>

          </div>

          {/* Logout */}
          <div className="pt-8 mt-8 border-t border-[#8FABD4]/20">
            <Button
              className="w-full md:w-auto bg-gradient-to-r from-[#4A70A9] to-[#8FABD4] text-white hover:from-[#3A6099] hover:to-[#7F9BC4] transition-all shadow-lg hover:shadow-xl border-0"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Action Cards (Orders + Cart) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            role="button"
            onClick={() => navigate('/my-orders')}
            className="group relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <div className="h-36 bg-gradient-to-br from-[#4A70A9] to-[#8FABD4] p-6 flex items-center justify-between relative">
              <div className="text-left z-10">
                <h3 className="text-2xl font-bold text-white mb-3">My Orders</h3>
                <p className="text-white/90 text-sm">Track your purchases & history</p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div
            role="button"
            onClick={() => navigate('/cart')}
            className="group relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <div className="h-36 bg-gradient-to-br from-[#EFECE3] to-[#8FABD4] p-6 flex items-center justify-between relative">
              <div className="text-left z-10">
                <h3 className="text-2xl font-bold text-[#000000] mb-3">Shopping Cart</h3>
                <p className="text-[#4A70A9] text-sm font-medium">Review your items</p>
              </div>
              <div className="bg-[#4A70A9]/20 p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform">
                <ShoppingCart className="h-8 w-8 text-[#4A70A9]" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center p-6">
          <p className="text-[#4A70A9] font-medium">
            Need assistance? Our support team is here to help you
          </p>
        </div>

      </div>
    </div>
  );
};

export default MyAccount;
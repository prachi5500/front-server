import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/services/api";

const Login = () => {
  const { signIn, requestSignupOTP, verifySignupOTP } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("signup") === "1") setIsSignup(true);
  }, [location.search]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
    } else {
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

// Validate name and phone before sending OTP
    if (!name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }
    
    if (!phone.trim()) {
      setError("Phone number is required");
      setLoading(false);
      return;
    }
    
    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }



    try {
      const { error } = await requestSignupOTP(email, name, phone);
      if (error) {
        setError(error);
      } else {
        setOtpSent(true);
      }
    } catch (e: any) {
      setError(e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await verifySignupOTP(email, otp, password, name, phone);
      if (error) {
        setError(error);
      } else {
        // ✅ Signup successful - automatically login
      const loginResult = await signIn(email, password);
            if (loginResult.error) {
        setError(loginResult.error);
      } else {
        // ✅ Success - redirect to home/dashboard
        navigate(from, { replace: true });
      }
    }

      
    } catch (e: any) {
      setError(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <form 
        onSubmit={isSignup ? (otpSent ? handleVerifyOTP : handleRequestOTP) : handleLogin} 
        className="w-full max-w-md sm:max-w-lg space-y-4 border rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">{isSignup ? "Sign Up" : "Login"}</h1>
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setOtpSent(false);
              setError(null);
               setName("");
              setPhone("");
            }}
            className="text-sm sm:text-base underline hover:text-blue-700 transition-colors"
          >
            {isSignup ? "Have an account? Login" : "New user? Sign Up"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm sm:text-base text-center sm:text-left">{error}</p>}
        
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-medium">Email</label>
          <input
            className="w-full border rounded-lg px-3 py-3 sm:py-4 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSignup && otpSent}
            placeholder="Enter your email"
          />
        </div>


         {isSignup && !otpSent && (
          <>
            {/* Name field - OTP bhejne se pehle */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-medium">Full Name</label>
              <input
                className="w-full border rounded-lg px-3 py-3 sm:py-4 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            {/* Phone number field - OTP bhejne se pehle */}
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-medium">Phone Number</label>
              <input
                className="w-full border rounded-lg px-3 py-3 sm:py-4 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter your 10-digit phone number"
                maxLength={10}
              />
              <p className="text-xs text-gray-500">10-digit mobile number without country code</p>
            </div>
          </>
        )}

        {isSignup ? (
          otpSent ? (
            <>

 {/* OTP ke baad bhi name aur phone show karein (readonly) */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium">Name</label>
                <input
                  className="w-full border rounded-lg px-3 py-3 sm:py-4 text-sm sm:text-base bg-gray-50"
                  type="text"
                  value={name}
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium">Phone No.</label>
                <input
                  className="w-full border rounded-lg px-3 py-3 sm:py-4 text-sm sm:text-base bg-gray-50"
                  type="tel"
                  value={phone}
                  readOnly
                />
              </div>



              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium">OTP</label>
                <input
                  className="w-full border rounded-lg px-3 py-3 sm:py-4 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter OTP sent to your email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium">Name</label>
                <input
                  className="w-full border rounded-lg px-3 py-3 sm:py-4 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium">Phone No.</label>
                <input
                  className="w-full border rounded-lg px-3 py-3 sm:py-4 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium">Password</label>
                <input
                  className="w-full border rounded-lg px-3 py-3 sm:py-4 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Create a password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          )
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-medium">Password</label>
              <input
                className="w-full border rounded-lg px-3 py-3 sm:py-4 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 text-sm sm:text-base">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setOtpSent(false);
                  setError(null);
                }}
                className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                New user? Sign Up
              </button>
              <button
                type="button"
                onClick={() => {
                  // Navigate to forgot password page or show forgot password modal
                  window.location.href = '/forgot-password';
                }}
                className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default Login;
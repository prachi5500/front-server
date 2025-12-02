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
    try {
      const { error } = await requestSignupOTP(email);
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
        navigate(from, { replace: true });
      }
    } catch (e: any) {
      setError(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form 
        onSubmit={isSignup ? (otpSent ? handleVerifyOTP : handleRequestOTP) : handleLogin} 
        className="w-full max-w-sm space-y-4 border rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{isSignup ? "Sign Up" : "Login"}</h1>
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setOtpSent(false);
              setError(null);
            }}
            className="text-sm underline"
          >
            {isSignup ? "Have an account? Login" : "New user? Sign Up"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSignup && otpSent}
          />
        </div>

        {isSignup ? (
          otpSent ? (
            <>
              <div className="space-y-1">
                <label className="text-sm">OTP</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter OTP sent to your email"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Phone No.</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Password</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          )
        ) : (
          <>
            <div className="space-y-1">
              <label className="text-sm">Password</label>
              <input
                className="w-full border rounded px-3 py-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setOtpSent(false);
                  setError(null);
                }}
                className="text-blue-600 hover:underline"
              >
                New user? Sign Up
              </button>
              <button
                type="button"
                onClick={() => {
                  // Navigate to forgot password page or show forgot password modal
                  window.location.href = '/forgot-password';
                }}
                className="text-blue-600 hover:underline"
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

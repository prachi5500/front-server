// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { apiFetch } from "@/services/api";

// const Login = () => {
//   const { signIn } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [isSignup, setIsSignup] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation() as any;
//   const from = location.state?.from?.pathname || "/";

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     if (params.get("signup") === "1") setIsSignup(true);
//   }, [location.search]);

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     if (isSignup) {
//       try {
//         const res = await apiFetch("/auth/signup", { method: "POST", body: JSON.stringify({ email, password, name, phone }) });
//         localStorage.setItem("token", res.token);
//         navigate(from, { replace: true });
//       } catch (e: any) {
//         setError(e.message ?? "Signup failed");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       const { error } = await signIn(email, password);
//       setLoading(false);
//       if (error) {
//         setError(error);
//       } else {
//         navigate(from, { replace: true });
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-lg p-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-xl font-semibold">{isSignup ? "Sign Up" : "Login"}</h1>
//           <button
//             type="button"
//             onClick={() => setIsSignup((s) => !s)}
//             className="text-sm underline"
//           >
//             {isSignup ? "Have an account? Login" : "New user? Sign Up"}
//           </button>
//         </div>
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         {isSignup && (
//           <div className="space-y-1">
//             <label className="text-sm">Name</label>
//             <input
//               className="w-full border rounded px-3 py-2"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//         )}
//         {isSignup && (
//           <div className="space-y-1">
//             <label className="text-sm">Phone No.</label>
//             <input
//               className="w-full border rounded px-3 py-2"
//               type="tel"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               required
//             />
//           </div>
//         )}
//         <div className="space-y-1">
//           <label className="text-sm">Email</label>
//           <input
//             className="w-full border rounded px-3 py-2"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="space-y-1">
//           <label className="text-sm">Password</label>
//           <input
//             className="w-full border rounded px-3 py-2"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />




// {/* forgot psss */}
// {!isSignup && (
//   <p
//     className="text-sm text-blue-600 underline cursor-pointer"
//     onClick={() => navigate("/forgot-password")}
//   >
//     Forgot Password?
//   </p>
// )}


//         </div>
//         <button
//           type="submit"
//           className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? (isSignup ? "Signing up..." : "Signing in...") : (isSignup ? "Sign Up" : "Sign In")}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;



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

        {isSignup ? (
          otpSent ? (
            <>
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
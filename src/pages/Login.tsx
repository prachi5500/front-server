import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/services/api";

const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("signup") === "1") setIsSignup(true);
  }, [location.search]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (isSignup) {
      try {
        const res = await apiFetch("/auth/signup", { method: "POST", body: JSON.stringify({ email, password, name, phone }) });
        localStorage.setItem("token", res.token);
        navigate(from, { replace: true });
      } catch (e: any) {
        setError(e.message ?? "Signup failed");
      } finally {
        setLoading(false);
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        setError(error);
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{isSignup ? "Sign Up" : "Login"}</h1>
          <button
            type="button"
            onClick={() => setIsSignup((s) => !s)}
            className="text-sm underline"
          >
            {isSignup ? "Have an account? Login" : "New user? Sign Up"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {isSignup && (
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
        )}
        {isSignup && (
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
        )}
        <div className="space-y-1">
          <label className="text-sm">Email</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />




{/* forgot psss */}
{!isSignup && (
  <p
    className="text-sm text-blue-600 underline cursor-pointer"
    onClick={() => navigate("/forgot-password")}
  >
    Forgot Password?
  </p>
)}


        </div>
        <button
          type="submit"
          className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (isSignup ? "Signing up..." : "Signing in...") : (isSignup ? "Sign Up" : "Sign In")}
        </button>
      </form>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiFetch } from "@/services/api";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = decodeURIComponent(params.get("token") || "");

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!token) return setMessage("Invalid link");

    try {
      const res = await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password })
      });

      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setMessage(err.message || "Failed to reset");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border p-6 rounded-lg space-y-4">
        <h1 className="text-xl font-semibold">Reset Password</h1>

        {message && <p className="text-red-500">{message}</p>}

        <div className="space-y-1">
          <label className="text-sm">New Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="w-full bg-black text-white py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

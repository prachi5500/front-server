import { useState } from "react";
import { apiFetch } from "@/services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await apiFetch("/auth/request-reset", {
        method: "POST",
        body: JSON.stringify({ email })
      });

      setSent(true);
    } catch (e: any) {
      setError(e.message ?? "Unable to send reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border rounded-lg p-6 space-y-4"
      >
        <h1 className="text-xl font-semibold">Forgot Password</h1>

        {sent ? (
          <p className="text-green-600">
            Reset link sent to your email. Check inbox.
          </p>
        ) : (
          <>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="space-y-1">
              <label className="text-sm">Enter your email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white rounded py-2 mt-2"
            >
              Send Reset Link
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;

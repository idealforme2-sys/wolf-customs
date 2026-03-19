import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, Mail } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/quotes");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Enter your email first."); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetMsg("Password reset email sent! Check your inbox.");
      setError("");
    } catch {
      setError("Could not send reset email. Check the address.");
    }
  };

  return (
    <div className="min-h-screen bg-wolf-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold uppercase tracking-widest text-white">
            Wolf <span className="text-wolf-red">Customs</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 tracking-wide">Owner Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-wolf-gray border border-wolf-gunmetal p-8 space-y-6 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-wolf-red" />

          <div>
            <label className="block text-xs font-heading uppercase tracking-widest text-gray-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-wolf-black border border-wolf-gunmetal pl-10 pr-4 py-3 text-white focus:outline-none focus:border-wolf-red transition-colors"
                placeholder="owner@wolfcustoms.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading uppercase tracking-widest text-gray-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-wolf-black border border-wolf-gunmetal pl-10 pr-4 py-3 text-white focus:outline-none focus:border-wolf-red transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {resetMsg && <p className="text-green-400 text-sm">{resetMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-wolf-red text-white font-heading tracking-widest uppercase py-3 hover:bg-wolf-red-hover transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing In...</> : "Sign In"}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-center text-xs text-gray-500 hover:text-wolf-red transition-colors mt-2"
          >
            Forgot your password?
          </button>
        </form>
      </div>
    </div>
  );
}

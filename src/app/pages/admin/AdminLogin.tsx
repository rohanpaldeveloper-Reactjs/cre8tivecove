import { useState } from "react";
import { useNavigate } from "react-router";
import { Film, ArrowRight, Lock } from "lucide-react";
import { setToken, api } from "../../api/client.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Admin Login | Cre8tiveCove";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      setToken(response.accessToken);
      navigate("/admin");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(200,169,107,0.06) 0%, transparent 60%)" }} />

      <div className="w-full max-w-[420px] bg-[#111] rounded-3xl p-10 border border-white/[0.05] relative z-10" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
        <div className="text-center mb-10">
          <img
            src="/logo.png"
            alt="Cre8tiveCove Logo"
            className="h-14 w-auto object-contain brightness-0 invert mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Portal</h2>
          <p className="text-xs text-white/40 mt-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>Enter credentials to manage creative content</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] block mb-2 text-white/50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@cre8tivecove.com"
              className="w-full px-4 py-3.5 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] transition-colors placeholder-white/20"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] block mb-2 text-white/50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl text-[13px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-[#C8A96B] transition-colors placeholder-white/20"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {errorMsg && (
            <p className="text-red-400 text-xs font-semibold">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group w-full py-4 rounded-xl text-[13px] font-semibold transition-all hover:-translate-y-px hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer bg-[#C8A96B] text-white disabled:bg-gray-700"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {loading ? "Authenticating..." : "Login to Workspace"}
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

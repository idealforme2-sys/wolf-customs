import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { LayoutDashboard, FileText, LogOut, PenSquare, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    navigate("/");
    setTimeout(() => signOut(auth), 100);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center justify-center gap-3 rounded-[20px] px-4 py-3.5 text-xs font-heading uppercase tracking-[0.2em] transition-all duration-300 md:justify-start ${
      isActive 
      ? "bg-[linear-gradient(135deg,rgba(230,0,0,0.8),rgba(180,0,0,0.9))] text-white shadow-[0_0_20px_rgba(230,0,0,0.4)]" 
      : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row relative overflow-hidden">
      {/* Deep Ambient Background */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="absolute top-[-10%] left-[-10%] h-[50vh] w-[50vh] rounded-full bg-wolf-red/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[60vh] w-[60vh] rounded-full bg-wolf-red/5 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Floating Glassy Sidebar */}
      <aside className="relative z-20 flex w-full flex-col shrink-0 md:w-72 md:p-6 p-4">
        <div className="flex h-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] shadow-[0_40px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_40px_100px_rgba(230,0,0,0.08)]">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-wolf-red/0 via-wolf-red/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,rgba(230,0,0,0.2),rgba(230,0,0,0.05))] border border-wolf-red/20 shadow-[0_0_15px_rgba(230,0,0,0.2)]">
                <Shield className="h-6 w-6 text-wolf-red" />
              </div>
              <div>
                <p className="text-[9px] font-heading font-bold uppercase tracking-[0.3em] text-wolf-red">Owner Panel</p>
                <h1 className="text-xl font-heading font-black uppercase tracking-[0.1em] text-white mt-0.5">Wolf <span className="text-gray-500 font-light">Admin</span></h1>
              </div>
            </div>
            {/* Mobile quick logout */}
            <button onClick={handleLogout} className="p-2 text-gray-400 transition-colors hover:text-wolf-red md:hidden relative z-10">
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4 md:p-6 overflow-y-auto">
            <p className="mb-4 ml-2 text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-gray-600">Main Menu</p>
            <NavLink to="/admin/dashboard" className={linkClass}>
              <LayoutDashboard className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" /> <span className="mt-0.5">Overview</span>
            </NavLink>
            <NavLink to="/admin/quotes" className={linkClass}>
              <FileText className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" /> <span className="mt-0.5">Quotes</span>
            </NavLink>
            <NavLink to="/admin/content" className={linkClass}>
              <PenSquare className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" /> <span className="mt-0.5">Content</span>
            </NavLink>
          </nav>

          {/* Footer Logout */}
          <div className="p-6 border-t border-white/5 hidden md:block">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center justify-center gap-3 rounded-[20px] bg-black/40 border border-white/5 px-4 py-4 text-xs font-heading font-bold uppercase tracking-[0.2em] text-gray-400 transition-all duration-300 hover:border-wolf-red/30 hover:bg-wolf-red/5 hover:text-wolf-red hover:shadow-[0_0_20px_rgba(230,0,0,0.1)]"
            >
              <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Framer Motion Page Transitions */}
      <main className="relative z-10 flex-1 min-w-0 md:py-6 md:pr-6 md:pl-0 p-4">
        <div className="h-full rounded-[32px] md:border border-transparent md:border-white/5 md:bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] md:backdrop-blur-xl md:shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full overflow-y-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

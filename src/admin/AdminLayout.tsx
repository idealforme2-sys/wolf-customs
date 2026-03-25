import { useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { LayoutDashboard, FileText, LogOut, PenSquare, Globe } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  const handleLogout = async () => {
    navigate("/");
    setTimeout(() => signOut(auth), 100);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-heading uppercase tracking-widest transition-all duration-200 ${
      isActive
        ? "bg-[linear-gradient(135deg,#fff1c4_0%,#ffcb6c_24%,#f29b34_56%,#bf5900_100%)] text-wolf-black shadow-[0_14px_30px_rgba(243,163,55,0.24),inset_0_1px_0_rgba(255,246,216,0.38)]"
        : "text-gray-200 hover:text-white hover:bg-[linear-gradient(180deg,rgba(255,244,214,0.09),rgba(37,20,4,0.82))] hover:border-wolf-red/25"
    }`;

  return (
    <div className="min-h-screen bg-wolf-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="relative z-30 w-full md:w-64 bg-[linear-gradient(180deg,rgba(34,21,7,0.995),rgba(14,8,2,0.995))] border-b md:border-b-0 md:border-r border-wolf-gunmetal flex flex-col shrink-0 md:sticky md:top-0 md:h-screen md:self-start md:overflow-y-auto shadow-[24px_0_80px_rgba(0,0,0,0.34)]">
        <div className="p-4 md:p-6 border-b border-wolf-gunmetal">
          <div className="flex items-center justify-between gap-3 md:flex-col md:items-stretch md:gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-heading font-bold uppercase tracking-[0.26em] text-gray-300">
                Owner Panel
              </p>
              <h1 className="text-lg font-luxury font-bold uppercase tracking-widest">
                Wolf <span className="text-wolf-red">Admin</span>
              </h1>
            </div>

            {/* Mobile quick actions */}
            <div className="flex items-center gap-1 md:hidden">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-200 transition-colors hover:text-white"
                title="View Live Site"
              >
                <Globe className="w-5 h-5" />
              </a>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-200 transition-colors hover:text-white"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop quick actions */}
            <div className="hidden grid-cols-2 gap-2 md:grid">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border border-wolf-gunmetal bg-[linear-gradient(180deg,rgba(255,244,214,0.08),rgba(17,10,3,0.9))] px-3 py-2.5 text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-gray-200 transition-colors duration-200 hover:border-white hover:text-white"
              >
                <Globe className="h-3.5 w-3.5" /> Live Site
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-2xl border border-wolf-gunmetal bg-[linear-gradient(180deg,rgba(255,244,214,0.08),rgba(17,10,3,0.9))] px-3 py-2.5 text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-gray-200 transition-colors duration-200 hover:border-wolf-red/40 hover:text-wolf-red"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-none md:flex-1 flex flex-row md:flex-col overflow-x-auto py-2 md:py-4 px-2 md:px-3 space-x-2 md:space-x-0 md:space-y-1">
          <NavLink to="/admin/dashboard" className={linkClass}>
            <LayoutDashboard className="w-4 h-4" /> Overview
          </NavLink>
          <NavLink to="/admin/quotes" className={linkClass}>
            <FileText className="w-4 h-4" /> Quotes
          </NavLink>
          <NavLink to="/admin/content" className={linkClass}>
            <PenSquare className="w-4 h-4" /> Content
          </NavLink>
        </nav>


      </aside>

      {/* Main Content */}
      <main className="relative z-0 min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

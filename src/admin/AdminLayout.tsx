import { useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { LayoutDashboard, FileText, LogOut, PenSquare, Globe, ArrowUpRight } from "lucide-react";

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
    <div className="min-h-screen overflow-x-hidden bg-wolf-black text-white flex flex-col md:flex-row">
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
            <div className="hidden gap-2 md:grid">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-[22px] border border-[rgba(255,222,150,0.12)] bg-[linear-gradient(180deg,rgba(255,224,168,0.08),rgba(17,10,3,0.94))] px-3 py-3 text-left shadow-[0_14px_34px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,246,216,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-wolf-red/30 hover:shadow-[0_18px_44px_rgba(243,163,55,0.12)]"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-wolf-red/15 bg-[linear-gradient(180deg,rgba(255,226,171,0.05),rgba(24,13,3,0.86))] shadow-[0_0_18px_rgba(243,163,55,0.08)]">
                    <Globe className="h-4 w-4 text-wolf-red" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] font-heading font-bold uppercase tracking-[0.18em] text-gray-500">Preview</span>
                    <span className="mt-1 block text-[11px] font-heading font-bold uppercase tracking-[0.16em] text-white">Live Site</span>
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-gray-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-wolf-red" />
              </a>
              <button
                onClick={handleLogout}
                className="group flex items-center justify-between rounded-[22px] border border-[rgba(255,222,150,0.1)] bg-[linear-gradient(180deg,rgba(255,236,200,0.04),rgba(16,9,3,0.96))] px-3 py-3 text-left shadow-[0_14px_34px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,246,216,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-wolf-red/25 hover:bg-[linear-gradient(180deg,rgba(255,224,168,0.08),rgba(33,15,3,0.94))]"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-wolf-red/12 bg-[linear-gradient(180deg,rgba(255,226,171,0.03),rgba(20,11,3,0.88))] shadow-[0_0_14px_rgba(243,163,55,0.06)]">
                    <LogOut className="h-4 w-4 text-wolf-red transition-colors duration-300 group-hover:text-white" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] font-heading font-bold uppercase tracking-[0.18em] text-gray-500">Secure</span>
                    <span className="mt-1 block text-[11px] font-heading font-bold uppercase tracking-[0.16em] text-white">Sign Out</span>
                  </span>
                </span>
                <span className="text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-wolf-red transition-colors duration-300 group-hover:text-white">
                  Exit
                </span>
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
      <main className="relative z-0 min-w-0 w-full flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

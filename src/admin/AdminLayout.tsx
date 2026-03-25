import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { LayoutDashboard, FileText, LogOut, PenSquare, Globe } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate("/");
    setTimeout(() => signOut(auth), 100);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-xs font-heading uppercase tracking-[0.18em] whitespace-nowrap transition-colors duration-200 md:justify-start md:gap-3 md:rounded-none md:px-4 md:text-sm md:tracking-widest ${
      isActive ? "bg-wolf-red text-white" : "text-gray-400 hover:text-white hover:bg-wolf-gunmetal"
    }`;

  return (
    <div className="min-h-screen bg-wolf-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-wolf-gray border-b md:border-b-0 md:border-r border-wolf-gunmetal flex flex-col shrink-0">
        <div className="border-b border-wolf-gunmetal p-4 md:p-6">
          <div className="flex items-center justify-between gap-3 md:flex-col md:items-stretch md:gap-4">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-heading font-bold uppercase tracking-[0.26em] text-gray-500">
                Owner Panel
              </p>
              <h1 className="text-lg font-heading font-bold uppercase tracking-widest">
                Wolf <span className="text-wolf-red">Admin</span>
              </h1>
            </div>

            {/* Mobile quick actions */}
            <div className="flex items-center gap-1 md:hidden">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 transition-colors hover:text-white"
                title="View Live Site"
              >
                <Globe className="w-5 h-5" />
              </a>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 transition-colors hover:text-white"
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
                className="flex items-center justify-center gap-2 rounded-2xl border border-wolf-gunmetal bg-black/30 px-3 py-2.5 text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-gray-400 transition-colors duration-200 hover:border-white hover:text-white"
              >
                <Globe className="h-3.5 w-3.5" /> Live Site
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-2xl border border-wolf-gunmetal bg-black/30 px-3 py-2.5 text-[10px] font-heading font-bold uppercase tracking-[0.18em] text-gray-400 transition-colors duration-200 hover:border-wolf-red/40 hover:text-wolf-red"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        <nav className="grid grid-cols-3 gap-2 p-3 md:flex md:flex-1 md:flex-col md:gap-1 md:px-0 md:py-4">
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
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

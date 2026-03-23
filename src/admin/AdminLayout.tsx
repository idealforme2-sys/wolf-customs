import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { LayoutDashboard, FileText, LogOut, PenSquare } from "lucide-react";

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
        <div className="p-4 md:p-6 border-b border-wolf-gunmetal flex justify-between items-center md:block">
          <h1 className="text-lg font-heading font-bold uppercase tracking-widest">
            Wolf <span className="text-wolf-red">Admin</span>
          </h1>
          {/* Mobile quick logout */}
          <button onClick={handleLogout} className="md:hidden text-gray-400 hover:text-white p-2">
            <LogOut className="w-5 h-5" />
          </button>
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

        <div className="px-4 py-3 md:p-4 border-t border-wolf-gunmetal hidden md:block">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-heading uppercase tracking-widest text-gray-400 hover:text-wolf-red hover:bg-wolf-gunmetal transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

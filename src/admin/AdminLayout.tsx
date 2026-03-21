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
    `flex items-center gap-3 px-4 py-3 text-sm font-heading uppercase tracking-widest transition-colors duration-200 ${
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

        <nav className="flex-none md:flex-1 flex flex-row md:flex-col overflow-x-auto py-2 md:py-4 px-2 md:px-0 space-x-2 md:space-x-0 md:space-y-1">
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
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

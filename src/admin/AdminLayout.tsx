import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-heading uppercase tracking-widest transition-colors duration-200 ${
      isActive ? "bg-wolf-red text-white" : "text-gray-400 hover:text-white hover:bg-wolf-gunmetal"
    }`;

  return (
    <div className="min-h-screen bg-wolf-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-wolf-gray border-r border-wolf-gunmetal flex flex-col shrink-0">
        <div className="p-6 border-b border-wolf-gunmetal">
          <h1 className="text-lg font-heading font-bold uppercase tracking-widest">
            Wolf <span className="text-wolf-red">Admin</span>
          </h1>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          <NavLink to="/admin/quotes" className={linkClass}>
            <FileText className="w-4 h-4" /> Quotes
          </NavLink>
          <NavLink to="/admin/dashboard" className={linkClass}>
            <LayoutDashboard className="w-4 h-4" /> Overview
          </NavLink>
        </nav>

        <div className="p-4 border-t border-wolf-gunmetal">
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

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { 
  Loader2, 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Activity,
  Calendar,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: any;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  // Using explicit classes for Tailwind safely evaluating colors
  const colorMap: Record<
    string,
    { text: string; border: string; bg: string; glow: string; orb: string; plateBorder: string; plateBg: string }
  > = {
    "white": {
      text: "text-white",
      border: "group-hover:border-white/50",
      bg: "group-hover:bg-white/10",
      glow: "hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]",
      orb: "bg-white/5",
      plateBorder: "border-white/10 group-hover:border-white/30",
      plateBg: "bg-white/5 group-hover:bg-white/10",
    },
    "wolf-red": {
      text: "text-wolf-red",
      border: "group-hover:border-wolf-red/50",
      bg: "group-hover:bg-wolf-red/10",
      glow: "hover:shadow-[0_0_30px_rgba(243,163,55,0.16)]",
      orb: "bg-wolf-red/10",
      plateBorder: "border-wolf-red/20 group-hover:border-wolf-red/40",
      plateBg: "bg-wolf-red/10 group-hover:bg-wolf-red/15",
    },
    "sky-400": {
      text: "text-sky-300",
      border: "group-hover:border-sky-400/50",
      bg: "group-hover:bg-sky-400/10",
      glow: "hover:shadow-[0_0_30px_rgba(56,189,248,0.14)]",
      orb: "bg-sky-400/10",
      plateBorder: "border-sky-400/20 group-hover:border-sky-400/40",
      plateBg: "bg-sky-400/10 group-hover:bg-sky-400/15",
    },
    "green-400": {
      text: "text-green-400",
      border: "group-hover:border-green-400/50",
      bg: "group-hover:bg-green-400/10",
      glow: "hover:shadow-[0_0_30px_rgba(74,222,128,0.1)]",
      orb: "bg-green-400/10",
      plateBorder: "border-green-400/20 group-hover:border-green-400/40",
      plateBg: "bg-green-400/10 group-hover:bg-green-400/15",
    },
  };
  const theme = colorMap[color] || colorMap["white"];

  return (
    <div className={`relative overflow-hidden group border border-wolf-gunmetal bg-wolf-black/40 backdrop-blur-sm p-5 transition-all duration-500 ${theme.border} hover:bg-wolf-gray ${theme.glow} sm:p-6`}>
      <div className={`absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150 ${theme.orb}`}></div>
      <div className="relative flex items-start justify-between gap-4 z-10">
        <div className="min-w-0">
          <p className="text-xs font-heading uppercase tracking-widest text-gray-500 mb-2 transition-colors group-hover:text-gray-300">{title}</p>
          <h3 className="text-2xl font-heading font-bold text-white sm:text-3xl tracking-tight">{value}</h3>
        </div>
        <div className={`shrink-0 border bg-wolf-black p-3 transition-all duration-500 ${theme.plateBorder} ${theme.plateBg} ${theme.bg} group-hover:scale-110 shadow-lg`}>
          <Icon className={`w-5 h-5 ${theme.text} transition-transform duration-500 group-hover:rotate-12`} />
        </div>
      </div>
    </div>
  );
}

interface Quote {
  id: string;
  name: string;
  service: string;
  status: string;
  createdAt: { seconds: number } | null;
}

export default function OverviewDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    completed: 0
  });
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const quotes = snap.docs.map(d => ({ id: d.id, ...d.data() } as Quote));
      
      setStats({
        total: quotes.length,
        new: quotes.filter(q => q.status === "new" || !q.status).length,
        inProgress: quotes.filter(q => q.status === "in-progress").length,
        completed: quotes.filter(q => q.status === "completed").length
      });
      
      setRecentQuotes(quotes.slice(0, 5));
      setLoading(false);
    });

    return unsub;
  }, []);

  const formatDate = (ts: { seconds: number } | null) => {
    if (!ts) return "Just now";
    return new Date(ts.seconds * 1000).toLocaleDateString("en-AU", {
      day: "numeric", month: "short"
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-wolf-red animate-spin" />
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden space-y-6 p-4 sm:space-y-8 sm:p-6 md:p-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-12 bg-wolf-red hidden sm:block shadow-[0_0_15px_rgba(224,30,40,0.5)]"></div>
        <h1 className="text-2xl font-heading font-bold uppercase tracking-widest sm:text-3xl text-white">
          Dashboard <span className="text-wolf-red">Overview</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2 font-medium">Welcome back. Here's a summary of your business activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Requests" value={stats.total} icon={FileText} color="white" />
        <StatCard title="New Leads" value={stats.new} icon={Clock} color="wolf-red" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Activity} color="sky-400" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="green-400" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="min-w-0 space-y-4 lg:col-span-2">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <h2 className="text-sm font-heading uppercase tracking-widest text-gray-400">Recent Submissions</h2>
            <Link to="/admin/quotes" className="inline-flex items-center gap-1 text-xs text-wolf-red hover:text-white transition-colors uppercase tracking-widest font-heading group">
              View All <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          
          <div className="overflow-hidden rounded-[24px] border border-wolf-gunmetal bg-wolf-black/20 backdrop-blur-md shadow-2xl">
            {recentQuotes.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-medium">No recent activity</div>
            ) : (
              recentQuotes.map((q) => (
                <div key={q.id} className="group relative flex flex-col gap-4 border-b border-wolf-gunmetal/50 p-4 transition-all duration-300 last:border-b-0 hover:bg-wolf-gunmetal/30 sm:flex-row sm:items-center sm:justify-between">
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-wolf-red/0 to-transparent group-hover:via-wolf-red/50 transition-all duration-500"></div>
                  <div className="relative z-10 flex min-w-0 w-full items-center gap-3 sm:w-auto sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-wolf-black border border-wolf-gunmetal text-xs font-bold text-wolf-red shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:border-wolf-red/30 group-hover:text-white">
                      {q.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-medium leading-snug text-white transition-colors group-hover:text-wolf-red">{q.name}</p>
                      <p className="mt-1 break-words text-xs leading-snug text-gray-400">{q.service}</p>
                    </div>
                  </div>
                  <div className="relative z-10 flex w-full min-w-0 flex-col items-start gap-2 sm:w-auto sm:items-end sm:text-right">
                    <p className="inline-flex max-w-full items-center border border-wolf-gunmetal bg-wolf-black px-2 py-1 text-xs font-mono text-gray-300">{formatDate(q.createdAt)}</p>
                    <span className={`inline-flex max-w-full items-center border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                      q.status === 'completed' ? 'text-green-400 border-green-400/20 bg-green-400/5' : 
                      q.status === 'in-progress' ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5' : 
                      'text-wolf-red border-wolf-red/20 bg-wolf-red/5'
                    }`}>
                      {q.status || "new"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="min-w-0 space-y-4">
          <h2 className="text-sm font-heading uppercase tracking-widest text-gray-400">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/content"
              className="group flex w-full items-start gap-3 rounded-[24px] border border-wolf-gunmetal bg-wolf-black/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-wolf-red hover:shadow-[0_0_20px_rgba(224,30,40,0.1)] sm:items-center sm:justify-between sm:hover:-translate-y-0.5"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
                <div className="shrink-0 border border-wolf-gunmetal bg-wolf-gunmetal/30 p-2 transition-colors group-hover:border-wolf-red/30 group-hover:bg-wolf-red/10">
                  <Users className="w-4 h-4 text-gray-400 group-hover:text-wolf-red transition-colors" />
                </div>
                <div className="min-w-0">
                  <span className="block break-words text-sm font-medium leading-snug text-white transition-colors group-hover:text-wolf-red">Manage Content</span>
                  <span className="mt-1 block text-xs leading-snug text-gray-400">Update website copy, images, and featured sections.</span>
                </div>
              </div>
              <ChevronRight className="mt-1 hidden h-4 w-4 shrink-0 text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-white sm:block" />
            </Link>

            <Link 
              to="/admin/quotes" 
              className="group flex w-full items-start gap-3 rounded-[24px] border border-wolf-gunmetal bg-wolf-black/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-wolf-red hover:shadow-[0_0_20px_rgba(224,30,40,0.1)] sm:items-center sm:justify-between sm:hover:-translate-y-0.5"
            >
              <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
                <div className="shrink-0 border border-wolf-gunmetal bg-wolf-gunmetal/30 p-2 transition-colors group-hover:border-wolf-red/30 group-hover:bg-wolf-red/10">
                  <FileText className="w-4 h-4 text-gray-400 group-hover:text-wolf-red transition-colors" />
                </div>
                <div className="min-w-0">
                  <span className="block break-words text-sm font-medium leading-snug text-white transition-colors group-hover:text-wolf-red">Manage Quotes</span>
                  <span className="mt-1 block text-xs leading-snug text-gray-400">Review incoming requests and follow up from one place.</span>
                </div>
              </div>
              <ChevronRight className="mt-1 hidden h-4 w-4 shrink-0 text-gray-600 transition-all group-hover:translate-x-1 group-hover:text-white sm:block" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

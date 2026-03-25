import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
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
  ChevronRight,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  delay: number;
}

function StatCard({ title, value, icon: Icon, color, delay }: StatCardProps) {
  const colorMap: Record<string, { text: string, border: string, glowPath: string }> = {
    "white": { text: "text-white", border: "group-hover:border-white/30", glowPath: "bg-white/5 group-hover:bg-white/10" },
    "wolf-red": { text: "text-wolf-red", border: "group-hover:border-wolf-red/30", glowPath: "bg-wolf-red/5 group-hover:bg-wolf-red/15" },
    "yellow-400": { text: "text-yellow-400", border: "group-hover:border-yellow-400/30", glowPath: "bg-yellow-400/5 group-hover:bg-yellow-400/15" },
    "green-400": { text: "text-green-400", border: "group-hover:border-green-400/30", glowPath: "bg-green-400/5 group-hover:bg-green-400/15" },
  };
  const theme = colorMap[color] || colorMap["white"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden group rounded-[32px] border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] p-6 sm:p-8 backdrop-blur-2xl transition-all duration-700 ${theme.border} hover:-translate-y-1`}
    >
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -mr-32 -mt-32 transition-colors duration-700 ${theme.glowPath}`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className={`p-4 rounded-[20px] bg-[#050505] border border-white/5 transition-colors duration-500 shadow-inner ${theme.border}`}>
            <Icon className={`w-6 h-6 ${theme.text} transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6`} />
          </div>
        </div>
        <div>
          <h3 className="text-5xl font-heading font-black text-white tracking-tighter drop-shadow-lg">{value}</h3>
          <p className="mt-3 text-[10px] font-heading uppercase tracking-[0.25em] text-gray-500 group-hover:text-gray-300 transition-colors duration-500">{title}</p>
        </div>
      </div>
    </motion.div>
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
      day: "2-digit", month: "short"
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <Loader2 className="w-8 h-8 text-wolf-red animate-spin" />
    </div>
  );

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 md:space-y-12 pb-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full bg-wolf-red hidden md:block shadow-[0_0_20px_rgba(230,0,0,0.6)]"></div>
        <h1 className="text-3xl font-heading font-black uppercase tracking-[0.1em] sm:text-4xl text-white">
          Dashboard <span className="text-wolf-red">Overview</span>
        </h1>
        <p className="text-gray-400 text-sm mt-2 font-medium">Business activity and metrics at a glance.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Requests" value={stats.total} icon={FileText} color="white" delay={0.1} />
        <StatCard title="New Leads" value={stats.new} icon={Zap} color="wolf-red" delay={0.2} />
        <StatCard title="In Progress" value={stats.inProgress} icon={Activity} color="yellow-400" delay={0.3} />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="green-400" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="xl:col-span-2 flex flex-col h-full"
        >
          <div className="flex items-center justify-between gap-2 mb-6">
            <h2 className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-gray-400">Recent Submissions</h2>
            <Link to="/admin/quotes" className="group inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 text-[10px] uppercase font-heading font-bold tracking-[0.2em] text-gray-300 transition-all hover:bg-white/10 hover:text-white">
              View All <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          
          <div className="flex-1 rounded-[32px] border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] backdrop-blur-xl shadow-2xl p-2 md:p-3">
            {recentQuotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]">
                <div className="p-4 rounded-full bg-white/5 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium">All caught up.</p>
                <p className="text-sm text-gray-600 mt-1">No recent quote submissions.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentQuotes.map((q, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + (i * 0.1) }}
                    key={q.id} 
                    className="group relative flex flex-col gap-4 rounded-[24px] p-4 md:p-5 transition-all duration-500 hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="absolute inset-y-0 left-0 w-1 rounded-full bg-wolf-red scale-y-0 group-hover:scale-y-100 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(230,0,0,0.8)]" />
                    
                    <div className="flex min-w-0 items-center gap-4 relative z-10 pl-2">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#050505] border border-white/5 text-sm font-black font-heading text-white shadow-inner transition-all duration-500 group-hover:border-wolf-red/30 group-hover:text-wolf-red">
                        {q.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-heading font-bold text-white transition-colors group-hover:text-wolf-red">{q.name}</p>
                        <p className="truncate text-xs text-gray-500">{q.service}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-6 pl-2 sm:pl-0 sm:justify-end relative z-10 w-full sm:w-auto">
                      <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(q.createdAt)}
                      </div>
                      <span className={`px-3 py-1.5 text-[10px] font-heading font-bold uppercase tracking-[0.2em] rounded-full border ${
                        q.status === 'completed' ? 'text-green-400 border-green-400/20 bg-green-400/5' : 
                        q.status === 'in-progress' ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5' : 
                        'text-wolf-red border-wolf-red/20 bg-wolf-red/5'
                      }`}>
                        {q.status || "new"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions Bento */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col h-full"
        >
          <h2 className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-gray-400 mb-6">Quick Actions</h2>
          <div className="grid gap-4 flex-1">
            <Link
              to="/admin/content"
              className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] p-6 md:p-8 transition-all duration-500 hover:border-wolf-red/30 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(230,0,0,0.1)] backdrop-blur-2xl"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-wolf-red/5 rounded-full blur-[60px] -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-150 group-hover:bg-wolf-red/10" />
              <div className="relative z-10 flex items-center justify-between mb-8">
                <div className="p-4 rounded-[20px] bg-[#050505] border border-white/5 group-hover:border-wolf-red/30 transition-colors shadow-inner">
                  <Users className="w-6 h-6 text-gray-400 group-hover:text-wolf-red transition-colors duration-500" />
                </div>
                <div className="p-3 rounded-full bg-white/5 transition-transform duration-500 group-hover:bg-wolf-red group-hover:-rotate-45">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xl font-heading font-black uppercase tracking-[0.1em] text-white">Manage Content</p>
                <p className="mt-2 text-sm text-gray-500">Edit website sections & portfolio layout</p>
              </div>
            </Link>

            <Link 
              to="/admin/quotes" 
              className="group relative flex flex-col justify-between overflow-hidden rounded-[32px] border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005))] p-6 md:p-8 transition-all duration-500 hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,255,255,0.05)] backdrop-blur-2xl"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[60px] -mr-24 -mt-24 transition-transform duration-700 group-hover:scale-150 group-hover:bg-white/10" />
              <div className="relative z-10 flex items-center justify-between mb-8">
                <div className="p-4 rounded-[20px] bg-[#050505] border border-white/5 group-hover:border-white/30 transition-colors shadow-inner">
                  <FileText className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="p-3 rounded-full bg-white/5 transition-transform duration-500 group-hover:bg-white group-hover:-rotate-45">
                  <ArrowUpRight className="w-4 h-4 text-white group-hover:text-black" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xl font-heading font-black uppercase tracking-[0.1em] text-white">Review Quotes</p>
                <p className="mt-2 text-sm text-gray-500">Respond to incoming client requests</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

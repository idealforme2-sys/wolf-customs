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
  return (
    <div className="bg-wolf-gray border border-wolf-gunmetal p-6 hover:border-wolf-red/50 transition-colors group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-heading uppercase tracking-widest text-gray-500 mb-2">{title}</p>
          <h3 className="text-3xl font-heading font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 bg-wolf-black border border-wolf-gunmetal group-hover:border-${color}/50 transition-colors`}>
          <Icon className={`w-5 h-5 text-${color}`} />
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
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold uppercase tracking-widest">
          Dashboard <span className="text-wolf-red">Overview</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back. Here's a summary of your business activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Requests" value={stats.total} icon={FileText} color="white" />
        <StatCard title="New Leads" value={stats.new} icon={Clock} color="wolf-red" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Activity} color="yellow-400" />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="green-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-heading uppercase tracking-widest text-gray-400">Recent Submissions</h2>
            <Link to="/admin/quotes" className="text-xs text-wolf-red hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="bg-wolf-gray border border-wolf-gunmetal divide-y divide-wolf-gunmetal">
            {recentQuotes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No recent activity</div>
            ) : (
              recentQuotes.map((q) => (
                <div key={q.id} className="p-4 flex items-center justify-between hover:bg-wolf-gunmetal/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-wolf-black border border-wolf-gunmetal flex items-center justify-center text-[10px] font-bold text-wolf-red">
                      {q.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{q.name}</p>
                      <p className="text-gray-500 text-xs">{q.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xs font-mono">{formatDate(q.createdAt)}</p>
                    <span className="text-[10px] uppercase tracking-tighter text-gray-500">{q.status || "new"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-sm font-heading uppercase tracking-widest text-gray-400">Quick Actions</h2>
          <div className="space-y-2">
            <Link 
              to="/admin/quotes" 
              className="flex items-center justify-between p-4 bg-wolf-black border border-wolf-gunmetal hover:border-wolf-red transition-all group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-400 group-hover:text-wolf-red transition-colors" />
                <span className="text-sm text-white">Manage Quotes</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
            </Link>
            
            <button 
              className="w-full flex items-center justify-between p-4 bg-wolf-black border border-wolf-gunmetal hover:border-wolf-red transition-all group opacity-50 cursor-not-allowed"
              title="Coming in Phase 4"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">Manage Content</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

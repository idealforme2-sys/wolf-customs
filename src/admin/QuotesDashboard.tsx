import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Loader2, Phone, Calendar, ChevronDown, ChevronUp, ExternalLink, Search } from "lucide-react";

interface Quote {
  id: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  images: string[];
  status: string;
  createdAt: { seconds: number } | null;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-green-500/20 text-green-400 border-green-500/50",
  "in-progress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  archived: "bg-gray-500/20 text-gray-400 border-gray-500/50",
};

const STATUS_OPTIONS = ["new", "in-progress", "completed", "archived"];

export default function QuotesDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setQuotes(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Quote)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "quotes", id), { status });
  };

  const formatDate = (ts: { seconds: number } | null) => {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleDateString("en-AU", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const filtered = quotes.filter((q) =>
    q.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.service?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-wolf-red animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold uppercase tracking-widest">
            Quote <span className="text-wolf-red">Requests</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">{quotes.length} total submissions</p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search quotes..."
            className="bg-wolf-gray border border-wolf-gunmetal pl-10 pr-4 py-3 md:py-2 text-sm text-white focus:outline-none focus:border-wolf-red transition-colors w-full md:w-72"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No quotes found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <div key={q.id} className="bg-wolf-gray border border-wolf-gunmetal overflow-hidden">
              {/* Row Header */}
              <button
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                className="w-full flex items-center justify-between px-4 py-4 md:px-6 hover:bg-wolf-gunmetal/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-left">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-[10px] md:text-xs font-heading uppercase tracking-widest border ${STATUS_COLORS[q.status] || STATUS_COLORS.new}`}>
                      {q.status || "new"}
                    </span>
                    <span className="font-heading font-bold text-white text-sm md:text-base">{q.name}</span>
                  </div>
                  <span className="text-gray-500 text-xs md:text-sm truncate max-w-[200px] md:max-w-none">{q.service}</span>
                </div>
                <div className="flex items-center gap-3 md:gap-4 shrink-0">
                  <span className="text-gray-500 text-xs hidden md:flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(q.createdAt)}
                  </span>
                  {expandedId === q.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === q.id && (
                <div className="px-4 md:px-6 pb-6 border-t border-wolf-gunmetal pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
                    <div>
                      <p className="text-xs font-heading uppercase tracking-widest text-gray-500 mb-1">Phone</p>
                      <p className="text-white flex items-center gap-2"><Phone className="w-4 h-4 text-wolf-red" /> {q.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs font-heading uppercase tracking-widest text-gray-500 mb-1">Service</p>
                      <p className="text-white">{q.service}</p>
                    </div>
                    <div>
                      <p className="text-xs font-heading uppercase tracking-widest text-gray-500 mb-1">Status</p>
                      <select
                        value={q.status || "new"}
                        onChange={(e) => updateStatus(q.id, e.target.value)}
                        className="bg-wolf-black border border-wolf-gunmetal px-3 py-1 text-sm text-white focus:outline-none focus:border-wolf-red cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-heading uppercase tracking-widest text-gray-500 mb-1">Message</p>
                    <p className="text-gray-300 bg-wolf-black border border-wolf-gunmetal p-4 text-sm">{q.message}</p>
                  </div>

                  {q.images && q.images.length > 0 && (
                    <div>
                      <p className="text-xs font-heading uppercase tracking-widest text-gray-500 mb-2">Photos ({q.images.length})</p>
                      <div className="flex gap-3 flex-wrap">
                        {q.images.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative group">
                            <img src={url} alt={`Photo ${i + 1}`} className="w-32 h-32 object-cover border border-wolf-gunmetal hover:border-wolf-red transition-colors" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ExternalLink className="w-5 h-5 text-white" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

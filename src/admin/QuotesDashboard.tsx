import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Loader2, Phone, Calendar, ChevronDown, ChevronUp, ExternalLink, Search } from "lucide-react";
import { isPlaceholderQuote } from "./quoteFilters";

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
  new: "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]",
  "in-progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(250,204,21,0.1)]",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]",
  archived: "bg-gray-500/10 text-gray-400 border-gray-500/20",
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
      setQuotes(
        snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Quote))
          .filter((quote) => !isPlaceholderQuote(quote))
      );
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
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4 relative z-10">
        <div className="relative">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-10 bg-wolf-red hidden sm:block shadow-[0_0_15px_rgba(224,30,40,0.5)]"></div>
          <h1 className="text-2xl font-heading font-bold uppercase tracking-widest sm:text-3xl text-white">
            Quote <span className="text-wolf-red drop-shadow-[0_0_10px_rgba(224,30,40,0.3)]">Requests</span>
          </h1>
          <p className="text-gray-400 font-medium text-sm mt-1">{quotes.length} total submissions</p>
        </div>

        <div className="relative w-full md:w-auto group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-wolf-red transition-colors duration-300" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search quotes..."
            className="bg-wolf-black/60 backdrop-blur-sm border border-wolf-gunmetal pl-10 pr-4 py-3 md:py-2 text-sm text-white focus:outline-none focus:border-wolf-red focus:shadow-[0_0_20px_rgba(224,30,40,0.15)] transition-all duration-300 w-full md:w-72"
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
            <div key={q.id} className={`group bg-wolf-black/40 backdrop-blur-md border transition-all duration-500 ${expandedId === q.id ? 'border-wolf-red/60 shadow-[0_0_30px_rgba(224,30,40,0.15)] overflow-visible relative z-20' : 'border-wolf-gunmetal hover:border-wolf-red/30 hover:bg-wolf-gray/50 hover:shadow-[0_4_20px_rgba(0,0,0,0.5)] overflow-hidden relative z-10'}`}>
              {/* Row Header */}
              <button
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                className="w-full flex items-center justify-between px-4 py-5 md:px-6 hover:bg-wolf-gunmetal/20 transition-all duration-300 group-hover:pl-5 md:group-hover:pl-8 relative"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-wolf-red scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center shadow-[0_0_10px_rgba(224,30,40,0.5)]"></div>
                <div className="min-w-0 flex flex-1 flex-col gap-2 text-left">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <span className={`px-3 py-1 text-[10px] md:text-xs font-heading font-bold uppercase tracking-widest border transition-all ${STATUS_COLORS[q.status] || STATUS_COLORS.new}`}>
                      {q.status || "new"}
                    </span>
                    <span className="break-words font-heading text-base font-bold text-white md:text-lg tracking-tight group-hover:text-wolf-red transition-colors">{q.name}</span>
                  </div>
                  <span className="break-words text-xs text-gray-400 md:text-sm">{q.service}</span>
                </div>
                <div className="flex items-center gap-3 md:gap-6 shrink-0">
                  <span className="text-gray-400 text-xs hidden md:flex items-center gap-2 font-mono bg-wolf-black/50 border border-wolf-gunmetal px-3 py-1.5">
                    <Calendar className="w-3.5 h-3.5 text-wolf-red" /> {formatDate(q.createdAt)}
                  </span>
                  <div className={`p-2 rounded-full border transition-all duration-300 ${expandedId === q.id ? 'bg-wolf-red/10 border-wolf-red/50 text-wolf-red rotate-180' : 'bg-wolf-gunmetal/20 border-wolf-gunmetal text-gray-400 group-hover:border-wolf-red/30 group-hover:text-white'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              <div
                className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedId === q.id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 md:px-6 pb-6 border-t border-wolf-gunmetal/50 pt-6 space-y-6 bg-gradient-to-b from-wolf-gunmetal/10 to-transparent">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                      <div className="bg-wolf-black/60 border border-wolf-gunmetal p-4 hover:border-wolf-gunmetal/80 transition-colors">
                        <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-wolf-red mb-2">Phone</p>
                        <p className="text-white flex items-center gap-2 font-medium text-lg"><Phone className="w-4 h-4 text-gray-500" /> {q.phone}</p>
                      </div>
                      <div className="bg-wolf-black/60 border border-wolf-gunmetal p-4 hover:border-wolf-gunmetal/80 transition-colors">
                        <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-wolf-red mb-2">Service Expected</p>
                        <p className="text-white font-medium">{q.service}</p>
                      </div>
                      <div className="bg-wolf-black/60 border border-wolf-gunmetal p-4 hover:border-wolf-red/30 transition-colors">
                        <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-wolf-red mb-2">Change Status</p>
                        <select
                          value={q.status || "new"}
                          onChange={(e) => updateStatus(q.id, e.target.value)}
                          className="w-full cursor-pointer bg-wolf-black border-b border-wolf-gunmetal pb-2 pt-1 text-sm font-bold text-white focus:outline-none focus:border-wolf-red transition-colors appearance-none"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="bg-wolf-black font-medium">{s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-wolf-black/60 border border-wolf-gunmetal p-5">
                    <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-wolf-red mb-3">Client Message</p>
                    <p className="break-words text-sm text-gray-300 leading-relaxed max-w-4xl">{q.message}</p>
                  </div>

                  {q.images && q.images.length > 0 && (
                    <div className="bg-wolf-black/60 border border-wolf-gunmetal p-5">
                      <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-wolf-red mb-3">Included Photos ({q.images.length})</p>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {q.images.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="relative group overflow-hidden border border-wolf-gunmetal transition-all duration-300 hover:border-wolf-red hover:shadow-[0_0_15px_rgba(224,30,40,0.3)] hover:-translate-y-1 block bg-black">
                            <img src={url} alt={`Photo ${i + 1}`} className="aspect-square w-full object-cover opacity-80 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-wolf-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-white tracking-widest uppercase bg-wolf-red/90 px-3 py-1.5 rounded-sm backdrop-blur-md shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                View Full
                                <ExternalLink className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

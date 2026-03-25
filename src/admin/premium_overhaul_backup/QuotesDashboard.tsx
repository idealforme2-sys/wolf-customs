import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Loader2, Phone, Calendar, ChevronDown, ExternalLink, Search, Mail, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  new: "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.15)]",
  "in-progress": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_rgba(250,204,21,0.15)]",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
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
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <Loader2 className="w-8 h-8 text-wolf-red animate-spin" />
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] p-4 sm:p-6 md:p-8 space-y-6 md:space-y-10 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10"
      >
        <div className="relative">
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 rounded-r-full bg-wolf-red hidden md:block shadow-[0_0_20px_rgba(230,0,0,0.6)]"></div>
          <h1 className="text-3xl font-heading font-black uppercase tracking-[0.1em] sm:text-4xl text-white">
            Client <span className="text-wolf-red drop-shadow-[0_0_15px_rgba(230,0,0,0.4)]">Quotes</span>
          </h1>
          <p className="text-gray-400 font-medium text-sm mt-2">{quotes.length} total request{quotes.length === 1 ? '' : 's'} to review</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-wolf-red transition-colors duration-300" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or service..."
            className="w-full rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] backdrop-blur-xl border border-white/10 pl-11 pr-5 py-3.5 text-sm text-white focus:outline-none focus:border-wolf-red/60 focus:bg-white/5 focus:shadow-[0_0_30px_rgba(230,0,0,0.15)] transition-all duration-300 placeholder:text-gray-600"
          />
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-32 rounded-[32px] border border-white/5 bg-black/20 backdrop-blur-xl"
        >
          <div className="inline-flex p-5 rounded-full bg-white/5 border border-white/5 mb-4">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-xl font-heading font-bold text-gray-400 uppercase tracking-widest">No quotes found</p>
          <p className="text-sm text-gray-600 mt-2">Try adjusting your search terms.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((q, i) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                key={q.id} 
                className={`group bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] backdrop-blur-2xl border transition-all duration-500 rounded-[32px] overflow-hidden ${expandedId === q.id ? 'border-wolf-red/40 shadow-[0_30px_60px_rgba(230,0,0,0.15)] relative z-20 bg-white/[0.03]' : 'border-white/5 hover:border-wolf-red/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:bg-white/[0.02] relative z-10'}`}
              >
                {/* Row Header */}
                <button
                  onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                  className="w-full flex items-center justify-between px-6 py-6 md:px-8 hover:bg-white/5 transition-all duration-300 group-hover:pl-8 md:group-hover:pl-10 relative"
                >
                  <div className="absolute inset-y-0 left-0 w-1.5 rounded-r-full bg-gradient-to-b from-wolf-red to-red-900 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center drop-shadow-[0_0_10px_rgba(230,0,0,0.6)]"></div>
                  <div className="min-w-0 flex flex-1 flex-col gap-3 text-left">
                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                      <span className={`px-4 py-1.5 text-[10px] md:text-[11px] font-heading font-bold uppercase tracking-[0.2em] rounded-full border transition-all ${STATUS_COLORS[q.status] || STATUS_COLORS.new}`}>
                        {q.status || "new"}
                      </span>
                      <span className="break-words font-heading text-xl font-black text-white md:text-2xl tracking-wide group-hover:text-wolf-red transition-colors duration-300 drop-shadow-md">{q.name}</span>
                    </div>
                    <span className="break-words text-sm text-gray-400 font-medium">{q.service}</span>
                  </div>
                  <div className="flex items-center gap-4 md:gap-8 shrink-0">
                    <span className="text-gray-400 text-xs hidden md:flex items-center gap-2 font-mono bg-[#050505] border border-white/5 px-4 py-2 rounded-full shadow-inner">
                      <Calendar className="w-3.5 h-3.5 text-wolf-red" /> {formatDate(q.createdAt)}
                    </span>
                    <div className={`p-3 rounded-[16px] border transition-all duration-500 ${expandedId === q.id ? 'bg-wolf-red hover:bg-wolf-red-hover border-wolf-red text-white rotate-180 shadow-[0_0_20px_rgba(230,0,0,0.4)]' : 'bg-[#050505] border-white/5 text-gray-400 group-hover:border-wolf-red/40 group-hover:text-white group-hover:bg-white/5'}`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </button>

                {/* Expanded Details - Dossier Style */}
                <AnimatePresence initial={false}>
                  {expandedId === q.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 bg-[linear-gradient(180deg,rgba(0,0,0,0.4),rgba(0,0,0,0.1))]">
                        
                        <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                          {/* Top Dossier Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            
                            <div className="p-5 rounded-[24px] bg-[#050505] border border-white/5 shadow-inner hover:border-wolf-red/20 transition-colors group/card">
                              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-wolf-red mb-3 opacity-80">Phone Contact</p>
                              <a href={`tel:${q.phone}`} className="inline-flex items-center gap-3 text-lg font-medium text-white hover:text-wolf-red transition-colors">
                                <span className="p-2 rounded-xl bg-white/5 group-hover/card:bg-wolf-red/10 transition-colors"><Phone className="w-4 h-4" /></span>
                                {q.phone}
                              </a>
                            </div>

                            <div className="p-5 rounded-[24px] bg-[#050505] border border-white/5 shadow-inner hover:border-wolf-red/20 transition-colors group/card">
                              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-wolf-red mb-3 opacity-80">Desired Service</p>
                              <div className="inline-flex items-center gap-3 text-lg font-medium text-white">
                                <span className="p-2 rounded-xl bg-white/5 group-hover/card:bg-wolf-red/10 transition-colors"><Wrench className="w-4 h-4" /></span>
                                {q.service}
                              </div>
                            </div>

                            <div className="p-5 rounded-[24px] bg-[#050505] border border-white/5 shadow-inner hover:border-wolf-red/40 transition-colors group/card sm:col-span-2 lg:col-span-1">
                              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-wolf-red mb-3 opacity-80">Workflow Status</p>
                              <div className="relative">
                                <select
                                  value={q.status || "new"}
                                  onChange={(e) => updateStatus(q.id, e.target.value)}
                                  className="w-full cursor-pointer bg-transparent border-b border-white/10 pb-2 pt-1 text-lg font-bold text-white focus:outline-none focus:border-wolf-red transition-colors appearance-none"
                                >
                                  {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s} className="bg-wolf-black text-sm">{s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none group-hover/card:text-wolf-red transition-colors" />
                              </div>
                            </div>
                          </div>

                          {/* Client Message */}
                          <div className="p-6 md:p-8 rounded-[28px] bg-[#050505] border border-white/5 shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
                            <div className="relative z-10 flex gap-4">
                              <div className="hidden sm:block mt-1">
                                <span className="p-3 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                  <Mail className="w-5 h-5 text-gray-400" />
                                </span>
                              </div>
                              <div>
                                <p className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-wolf-red mb-4">Client Message</p>
                                <p className="text-base text-gray-300 leading-relaxed font-light whitespace-pre-wrap">{q.message}</p>
                              </div>
                            </div>
                          </div>

                          {/* Image Gallery */}
                          {q.images && q.images.length > 0 && (
                            <div className="p-6 md:p-8 rounded-[28px] bg-[#050505] border border-white/5 shadow-inner relative">
                              <p className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-wolf-red mb-6">Attached Reference Media ({q.images.length})</p>
                              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {q.images.map((url, imgIndex) => (
                                  <motion.a 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: imgIndex * 0.1 }}
                                    key={imgIndex} 
                                    href={url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="relative group overflow-hidden rounded-[20px] border border-white/10 bg-black aspect-square transition-all duration-500 hover:border-wolf-red hover:shadow-[0_10px_30px_rgba(230,0,0,0.3)] hover:-translate-y-2 block"
                                  >
                                    <img src={url} alt={`Reference ${imgIndex + 1}`} className="w-full h-full object-cover opacity-70 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                                      <span className="flex items-center gap-2 text-[10px] font-heading font-bold text-white tracking-[0.15em] uppercase bg-white/10 border border-white/20 px-4 py-2 rounded-full backdrop-blur-xl shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:bg-wolf-red hover:border-wolf-red">
                                        View <ExternalLink className="w-3.5 h-3.5" />
                                      </span>
                                    </div>
                                  </motion.a>
                                ))}
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

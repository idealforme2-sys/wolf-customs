import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Loader2, Plus, Trash2, Save, X, Upload, GripVertical } from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  order: number;
}

const ICON_OPTIONS = ["Wrench", "Car", "Paintbrush", "ShieldAlert", "Palette", "SprayCan", "Shield", "Star", "Zap", "Settings"];

const CLOUDINARY_CLOUD = "dqfltczlj";
const CLOUDINARY_PRESET = "WolfCustoms";

export default function ContentEditor() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ServiceItem>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState({ title: "", description: "", image: "", icon: "Wrench", order: 99 });

  useEffect(() => {
    const q = query(collection(db, "services"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceItem)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: "POST", body: formData });
    const data = await res.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "edit" | "new") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (target === "edit") setEditData((prev) => ({ ...prev, image: url }));
      else setNewService((prev) => ({ ...prev, image: url }));
    } catch { alert("Upload failed"); }
    setUploading(false);
  };

  const startEdit = (s: ServiceItem) => {
    setEditingId(s.id);
    setEditData({ title: s.title, description: s.description, image: s.image, icon: s.icon, order: s.order });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    await updateDoc(doc(db, "services", editingId), editData);
    setEditingId(null);
    setSaving(false);
  };

  const addService = async () => {
    if (!newService.title) return;
    setSaving(true);
    await addDoc(collection(db, "services"), newService);
    setNewService({ title: "", description: "", image: "", icon: "Wrench", order: 99 });
    setShowAdd(false);
    setSaving(false);
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service permanently?")) return;
    await deleteDoc(doc(db, "services", id));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-8 h-8 text-wolf-red animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold uppercase tracking-widest">
            Manage <span className="text-wolf-red">Services</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} services configured</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-5 py-2.5 bg-wolf-red text-white font-heading text-xs uppercase tracking-widest hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Add New Service Form */}
      {showAdd && (
        <div className="bg-wolf-gray border border-wolf-gunmetal p-6 mb-6 space-y-4">
          <h2 className="font-heading text-sm uppercase tracking-widest text-gray-400">New Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} placeholder="Service title" className="bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-sm text-white focus:outline-none focus:border-wolf-red" />
            <select value={newService.icon} onChange={(e) => setNewService({ ...newService, icon: e.target.value })} className="bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-sm text-white focus:outline-none focus:border-wolf-red">
              {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <textarea value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} placeholder="Description" rows={3} className="w-full bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-sm text-white focus:outline-none focus:border-wolf-red" />
          <div className="flex items-center gap-4">
            <input type="number" value={newService.order} onChange={(e) => setNewService({ ...newService, order: parseInt(e.target.value) || 0 })} placeholder="Order" className="w-24 bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-sm text-white focus:outline-none focus:border-wolf-red" />
            <label className="flex items-center gap-2 px-4 py-3 bg-wolf-black border border-wolf-gunmetal text-gray-400 text-sm cursor-pointer hover:border-wolf-red transition-colors">
              <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Image"}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "new")} className="hidden" />
            </label>
            {newService.image && <img src={newService.image} alt="Preview" className="w-16 h-16 object-cover border border-wolf-gunmetal" />}
          </div>
          <div className="flex gap-3">
            <button onClick={addService} disabled={saving || !newService.title} className="px-6 py-2.5 bg-wolf-red text-white font-heading text-xs uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50">
              <Save className="w-4 h-4 inline mr-2" />{saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 border border-wolf-gunmetal text-gray-400 font-heading text-xs uppercase tracking-widest hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-20 text-gray-500 space-y-4">
          <p className="text-lg">No services in Firestore yet.</p>
          <p className="text-sm">The public site is showing hardcoded defaults. Add services here to override them.</p>
        </div>
      )}

      {/* Service Cards */}
      <div className="space-y-3">
        {services.map((s) => (
          <div key={s.id} className="bg-wolf-gray border border-wolf-gunmetal overflow-hidden">
            {editingId === s.id ? (
              /* Edit Mode */
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={editData.title || ""} onChange={(e) => setEditData({ ...editData, title: e.target.value })} className="bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-sm text-white focus:outline-none focus:border-wolf-red" />
                  <div className="flex gap-3">
                    <select value={editData.icon || ""} onChange={(e) => setEditData({ ...editData, icon: e.target.value })} className="flex-1 bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-sm text-white focus:outline-none focus:border-wolf-red">
                      {ICON_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <input type="number" value={editData.order ?? 0} onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) || 0 })} className="w-24 bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-sm text-white focus:outline-none focus:border-wolf-red" placeholder="Order" />
                  </div>
                </div>
                <textarea value={editData.description || ""} onChange={(e) => setEditData({ ...editData, description: e.target.value })} rows={3} className="w-full bg-wolf-black border border-wolf-gunmetal px-4 py-3 text-sm text-white focus:outline-none focus:border-wolf-red" />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-3 bg-wolf-black border border-wolf-gunmetal text-gray-400 text-sm cursor-pointer hover:border-wolf-red transition-colors">
                    <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Change Image"}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "edit")} className="hidden" />
                  </label>
                  {editData.image && <img src={editData.image} alt="Preview" className="w-16 h-16 object-cover border border-wolf-gunmetal" />}
                </div>
                <div className="flex gap-3">
                  <button onClick={saveEdit} disabled={saving} className="px-6 py-2.5 bg-wolf-red text-white font-heading text-xs uppercase tracking-widest hover:bg-red-700 disabled:opacity-50">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={() => setEditingId(null)} className="px-6 py-2.5 border border-wolf-gunmetal text-gray-400 font-heading text-xs uppercase tracking-widest hover:text-white">
                    <X className="w-4 h-4 inline mr-1" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <div className="flex items-center gap-4 px-4 md:px-6 py-4">
                <GripVertical className="w-4 h-4 text-gray-600 shrink-0" />
                {s.image && <img src={s.image} alt={s.title} className="w-16 h-16 object-cover border border-wolf-gunmetal shrink-0 hidden md:block" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 font-mono">#{s.order}</span>
                    <span className="font-heading font-bold text-white text-sm md:text-base">{s.title}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-wolf-gunmetal text-gray-400 uppercase tracking-widest">{s.icon}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 truncate">{s.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEdit(s)} className="px-4 py-2 text-xs font-heading uppercase tracking-widest text-gray-400 hover:text-white border border-wolf-gunmetal hover:border-wolf-red transition-colors">
                    Edit
                  </button>
                  <button onClick={() => deleteService(s.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

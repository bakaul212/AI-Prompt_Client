'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import useAxiosPublic from '@/hooks/useAxiosSecure';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  IoAddCircleOutline, IoBriefcaseOutline, IoBookmarkOutline, 
  IoStarOutline, IoPersonOutline, IoCloudUploadOutline, IoTrashOutline, 
  IoPencilOutline, IoCloseOutline, IoMenuOutline 
} from 'react-icons/io5';

// Recharts Components Import
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

export default function DashboardPage() {
  // AuthContext থেকে user এর সাথে loading স্টেটটি আনা হলো
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const router = useRouter();

  // Active Tab & Responsive Mobile Menu States
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  // Dynamic User Profile States
  const [userRole, setUserRole] = useState('User');
  const [userStatus, setUserStatus] = useState('Free'); 
  const [summary, setSummary] = useState({ totalPrompts: 0, totalCopies: 0, totalBookmarks: 0, chartData: [] });
  
  // Sub-tabs Content Data States
  const [myPrompts, setMyPrompts] = useState([]);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Prompt Form State
  const [form, setForm] = useState({
    title: '', description: '', content: '', category: 'Web Development',
    aiTool: 'ChatGPT', tags: '', difficulty: 'Beginner', visibility: 'Public', thumbnail: ''
  });

  // Edit Prompt State Modal
  const [editingPrompt, setEditingPrompt] = useState(null); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 🛡️ SECURITY STEP: আন-অথরাইজড ইউজার প্রোটেকশন চেক (Private Route Guard)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // ড্যাশবোর্ড ডেটা সিঙ্ক করার মেইন ইফেক্ট
  useEffect(() => {
    if (user?.email) {
      const headers = { Authorization: `Bearer ${localStorage.getItem('access-token')}` };

      // ১. ইউজারের মেইন ডাটা, রোল ও সাবস্ক্রিপশন স্ট্যাটাস লোড করা
      axiosPublic.get(`/users/role/${user.email}`, { headers })
        .then(res => {
          setUserRole(res.data.role || 'User');
          setUserStatus(res.data.status || 'Free'); 
        })
        .catch(() => console.error("Error syncing role framework."));

      // ২. অ্যানালিটিক্স সামারি ও চার্ট ডাটা নেওয়া
      axiosPublic.get(`/user-summary/${user.email}`, { headers })
        .then(res => {
          const defaultChartData = [
            { name: 'Jan', copies: 4, growth: 1 },
            { name: 'Feb', copies: 12, growth: 3 },
            { name: 'Mar', copies: 25, growth: 8 },
            { name: 'Apr', copies: 45, growth: 15 },
          ];
          setSummary({
            totalPrompts: res.data.totalPrompts || 0,
            totalCopies: res.data.totalCopies || 0,
            totalBookmarks: res.data.totalBookmarks || 0,
            chartData: res.data.chartData || defaultChartData
          });
        })
        .catch(() => console.error("Error compiling system logs."));
    }
  }, [user, axiosPublic]);

  // ট্যাব চেঞ্জ লজিক ও ডেটা ফেচিং
  const loadTabContent = async (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false); 
    if (!user?.email) return;
    setLoading(true);

    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('access-token')}` };
      if (tabName === 'my-prompts') {
        const res = await axiosPublic.get(`/my-prompts/${user.email}`, { headers });
        setMyPrompts(res.data);
      } else if (tabName === 'saved-prompts') {
        const res = await axiosPublic.get(`/my-bookmarks/${user.email}`, { headers });
        setSavedPrompts(res.data);
      } else if (tabName === 'my-reviews') {
        const res = await axiosPublic.get(`/my-reviews/${user.email}`, { headers });
        setMyReviews(res.data);
      }
    } catch (err) {
      console.error("Matrix data Sync Error");
    } finally {
      setLoading(false);
    }
  };

  // Base64 ইমেজ আপলোড হ্যান্ডলার
  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("File size too large. Please select an image under 2MB.");
    }

    const toastId = toast.loading("Converting image into matrix data...");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      const base64Url = reader.result;
      if (isEdit) {
        setEditingPrompt(prev => ({ ...prev, thumbnail: base64Url }));
      } else {
        setForm(prev => ({ ...prev, thumbnail: base64Url }));
      }
      toast.update(toastId, { render: "Image compiled successfully!", type: "success", isLoading: false, autoClose: 3000 });
    };

    reader.onerror = () => {
      toast.update(toastId, { render: "Failed to read image structure.", type: "error", isLoading: false, autoClose: 3000 });
    };
  };

  // নতুন প্রম্পট সাবমিট
  const handleAddPrompt = async (e) => {
    e.preventDefault();
    if (!form.thumbnail) return toast.error("Please deploy a thumbnail image node.");

    const promptPayload = {
      ...form,
      creatorName: user?.displayName || "Anonymous Forge Creator",
      creatorEmail: user?.email,
      copyCount: 0,
      status: 'pending'
    };

    try {
      const res = await axiosPublic.post('/add-prompt', promptPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });

      if (res.data.limitReached) {
        toast.error(res.data.message);
      } else if (res.data.insertedId) {
        toast.success("Prompt uploaded! Awaiting Admin verification loop.");
        setForm({ title: '', description: '', content: '', category: 'Web Development', aiTool: 'ChatGPT', tags: '', difficulty: 'Beginner', visibility: 'Public', thumbnail: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal submission protocol aborted.");
    }
  };

  const openEditModal = (prompt) => {
    setEditingPrompt(prompt);
    setIsEditModalOpen(true);
  };

  // প্রম্পট আপডেট
  const handleUpdatePrompt = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('access-token')}` };
      const updatedData = { ...editingPrompt, status: 'pending' }; 
      const res = await axiosPublic.put(`/prompt-update/${editingPrompt._id}`, updatedData, { headers });
      
      if (res.data.modifiedCount > 0) {
        toast.success("Prompt architecture updated successfully.");
        setIsEditModalOpen(false);
        setMyPrompts(myPrompts.map(p => p._id === editingPrompt._id ? updatedData : p));
      }
    } catch (err) {
      toast.error("Failed to update prompt node.");
    }
  };

  // প্রম্পট ডিলিট
  const handleDeletePrompt = async (id) => {
    if(!confirm("Execute permanent removal string?")) return;
    try {
      await axiosPublic.delete(`/prompt-delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
      toast.success("Node successfully wiped.");
      setMyPrompts(myPrompts.filter(p => p._id !== id));
    } catch (err) {
      toast.error("Wipe loop failure.");
    }
  };

  // ট্যাব লিস্ট বাটন জেনারেটর (DRY Principle)
  const tabItems = [
    { id: 'profile', label: 'Dashboard Analytics', icon: <IoPersonOutline size={16} /> },
    { id: 'add-prompt', label: 'Forge New Prompt', icon: <IoAddCircleOutline size={16} /> },
    { id: 'my-prompts', label: 'My Prompt Logs', icon: <IoBriefcaseOutline size={16} /> },
    { id: 'saved-prompts', label: 'Saved Core Banks', icon: <IoBookmarkOutline size={16} /> },
    { id: 'my-reviews', label: 'Matrix Reviews', icon: <IoStarOutline size={16} /> },
  ];

  // ⏳ যখন ফায়ারবেস অথেনটিকেশন চেক হচ্ছে, তখন ফুল স্ক্রিন ব্ল্যাকার বা স্পিনার রেন্ডার হবে
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#0a0d14] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest animate-pulse">Verifying Authentication Token...</p>
      </div>
    );
  }

  // 🛑 যদি ইউজার লগইন না থাকে, তবে ড্যাশবোর্ডের কিছুই রেন্ডার হবে না
  if (!user) {
    return null;
  }

  // ✅ ইউজার অথরাইজড হলেই কেবল নিচের মেইন ড্যাশবোর্ড স্ক্রিন ওপেন হবে
  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-200 pt-20 pb-12 px-4 sm:px-6 md:px-8 flex flex-col md:flex-row gap-6 max-w-7xl mx-auto relative">
      <ToastContainer theme="dark" />
      
      {/* 📱 মোবাইল রেসপনসিভ মেনু বার */}
      <div className="md:hidden w-full bg-[#0f1423]/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between z-30">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
          // Navigation Matrix
        </span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 p-2 rounded-lg"
        >
          {isMobileMenuOpen ? <IoCloseOutline size={18} /> : <IoMenuOutline size={18} />}
        </button>
      </div>

      {/* 🛠️ বাম পাশ: কন্ট্রোল প্যানেল সাইডবার */}
      <div className={`w-full md:w-64 space-y-1.5 bg-[#0f1423]/40 border border-slate-800 p-4 rounded-2xl h-fit transition-all duration-300 md:block
        ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}
      >
        <h2 className="hidden md:block text-xs font-mono uppercase tracking-wider text-slate-500 px-3 mb-4">// System Controller</h2>
        
        {tabItems.map(item => (
          <button 
            key={item.id}
            onClick={() => loadTabContent(item.id)} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'hover:bg-slate-800/50 text-slate-400'}`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      {/* 🖥️ ডান পাশ: ডাইনামিক কন্টেন্ট এরিয়া */}
      <div className="flex-1 bg-[#0f1423]/20 border border-slate-800/60 rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-md min-w-0 overflow-hidden">
        
        {loading ? (
          <div className="text-center py-16 font-mono text-xs text-slate-500 animate-pulse">[LOAD_SYNCING_DATA_BUFFERS...]</div>
        ) : (
          <>
            {/* TAB 1: PROFILE / ANALYTICS VIEW */}
            {activeTab === 'profile' && (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-b border-slate-800/60 pb-6 text-center sm:text-left">
                  <img src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'} alt="Avatar" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-indigo-500 p-0.5 object-cover" />
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white truncate">{user?.displayName || "Operator Matrix"}</h3>
                    <p className="text-xs font-mono text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md mt-1 uppercase tracking-wider">{userRole} Node</span>
                  </div>
                </div>

                {/* Requirement Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#07090e] p-4 sm:p-5 rounded-xl border border-slate-800/80">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Total Prompts</p>
                    <p className="text-xl sm:text-2xl font-black font-mono text-white mt-1">{summary.totalPrompts}</p>
                  </div>
                  <div className="bg-[#07090e] p-4 sm:p-5 rounded-xl border border-slate-800/80">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Total Copies</p>
                    <p className="text-xl sm:text-2xl font-black font-mono text-indigo-400 mt-1">{summary.totalCopies || 0}</p>
                  </div>
                  <div className="bg-[#07090e] p-4 sm:p-5 rounded-xl border border-slate-800/80">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Total Bookmarks</p>
                    <p className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">{summary.totalBookmarks || 0}</p>
                  </div>
                </div>

                {/* 📊 Recharts Charts Implementation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  <div className="bg-[#07090e] p-4 rounded-xl border border-slate-800 w-full overflow-hidden">
                    <h4 className="text-xs font-mono text-slate-400 mb-4">// TOTAL COPIES OVERVIEW</h4>
                    <div className="h-56 sm:h-64 w-full text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={summary.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                          <YAxis stroke="#64748b" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f1423', borderColor: '#334155', fontSize: '11px' }} />
                          <Bar dataKey="copies" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-[#07090e] p-4 rounded-xl border border-slate-800 w-full overflow-hidden">
                    <h4 className="text-xs font-mono text-slate-400 mb-4">// PROMPT MATRIX GROWTH</h4>
                    <div className="h-56 sm:h-64 w-full text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={summary.chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                          <YAxis stroke="#64748b" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f1423', borderColor: '#334155', fontSize: '11px' }} />
                          <Area type="monotone" dataKey="growth" stroke="#10b981" fillOpacity={0.15} fill="url(#colorGrowth)" />
                          <defs>
                            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ADD PROMPT FORM */}
            {activeTab === 'add-prompt' && (
              <form onSubmit={handleAddPrompt} className="space-y-4 max-w-3xl mx-auto">
                <h3 className="text-sm font-bold text-white font-mono">// FORGE NEW ALGORITHMIC CORE</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Prompt Title</label>
                    <input required type="text" className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">AI Tool Engine</label>
                    <select className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-slate-400 focus:outline-none focus:border-indigo-500" value={form.aiTool} onChange={e => setForm({...form, aiTool: e.target.value})}>
                      <option>ChatGPT</option><option>Midjourney</option><option>Claude</option><option>Gemini</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Description</label>
                  <textarea required rows={2} className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Prompt Raw Content</label>
                  <textarea required rows={4} className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Category</label>
                    <select className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-slate-400" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      <option>Web Development</option><option>Content Writing</option><option>Data Science</option><option>Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Difficulty Level</label>
                    <select className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-slate-400" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                      <option>Beginner</option><option>Intermediate</option><option>Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Visibility Matrix</label>
                    <select className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-slate-400" value={form.visibility} onChange={e => setForm({...form, visibility: e.target.value})}>
                      <option>Public</option><option>Private</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Tags</label>
                    <input placeholder="coding, react" type="text" className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Thumbnail Image</label>
                    <label className="w-full bg-[#07090e] border border-dashed border-slate-800 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-mono text-slate-500 cursor-pointer hover:border-indigo-500 transition-all">
                      <IoCloudUploadOutline size={16} className="text-slate-400" /> {form.thumbnail ? "Image Ready" : "Upload File"}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, false)} />
                    </label>
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-indigo-600 text-white font-mono font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider hover:bg-indigo-700 transition-all active:scale-[0.99]">Submit Script to Core</button>
              </form>
            )}

            {/* TAB 3: MY PROMPTS LIST TABLE */}
            {activeTab === 'my-prompts' && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-slate-400">// DEPLOYED ARCHIVE CORE</h3>
                <div className="w-full overflow-x-auto rounded-xl border border-slate-800/50">
                  <table className="w-full text-left text-xs font-mono min-w-[550px]">
                    <thead>
                      <tr className="border-b border-slate-800 bg-[#07090e] text-slate-500 uppercase text-[10px]">
                        <th className="py-3.5 px-4">Title</th>
                        <th className="py-3.5 px-3">Tool</th>
                        <th className="py-3.5 px-3">Copies</th>
                        <th className="py-3.5 px-3">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {myPrompts.length === 0 ? (
                        <tr><td colSpan="5" className="py-8 text-center text-slate-600">[ZERO PROMPTS DEPLOYED IN THIS NODE]</td></tr>
                      ) : myPrompts.map(p => (
                        <tr key={p._id} className="hover:bg-slate-900/20 transition-all">
                          <td className="py-3.5 px-4 font-bold text-white max-w-[160px] truncate">{p.title}</td>
                          <td className="py-3.5 px-3 text-indigo-400">{p.aiTool}</td>
                          <td className="py-3.5 px-3 text-slate-400">{p.copyCount || 0}</td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${p.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : p.status === 'rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {p.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right flex items-center justify-end gap-1.5">
                            <button onClick={() => openEditModal(p)} className="text-blue-400 hover:bg-blue-500/10 p-2 rounded-lg transition-all" title="Edit Prompt"><IoPencilOutline size={14} /></button>
                            <button onClick={() => handleDeletePrompt(p._id)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition-all" title="Delete Prompt"><IoTrashOutline size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: SAVED PROMPTS */}
            {activeTab === 'saved-prompts' && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-slate-400">// CRYPTO INDEX BOOKMARKS</h3>
                {savedPrompts.length === 0 ? (
                  <p className="text-center py-8 text-slate-600 font-mono text-xs">[NO SECURE BOOKMARKS CACHED]</p>
                ) : savedPrompts.map(p => (
                  <div key={p._id} className="p-4 bg-[#07090e] border border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
                      <p className="text-[10px] font-mono text-indigo-400 mt-1">{p.category} • {p.aiTool}</p>
                    </div>
                    <button onClick={() => router.push(`/prompt/${p._id}`)} className="w-full sm:w-auto bg-slate-800 hover:bg-indigo-600 text-slate-200 text-[10px] font-bold py-2.5 px-4 rounded-lg transition-all text-center whitespace-nowrap">Execute Core</button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: MY REVIEWS */}
            {activeTab === 'my-reviews' && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-slate-400">// SUBMITTED LOG REVIEWS</h3>
                {myReviews.length === 0 ? (
                  <p className="text-center py-8 text-slate-600 font-mono text-xs">[NO RATING LOG MODULES REPORTED]</p>
                ) : myReviews.map(r => (
                  <div key={r._id} className="p-4 bg-[#07090e]/60 border border-slate-800/80 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-amber-400 font-bold font-mono text-[11px]">★ {r.rating}/5 Rating</span>
                      <span className="text-[10px] text-slate-600 font-mono">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* 📋 UPDATE PROMPT MODAL WINDOW */}
      {isEditModalOpen && editingPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0f1423] border border-slate-800 w-full max-w-2xl rounded-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xs sm:text-sm font-bold font-mono text-white">// UPDATE PROMPT MODULE</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800/40 p-1 rounded-md"><IoCloseOutline size={18}/></button>
            </div>

            <form onSubmit={handleUpdatePrompt} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Prompt Title</label>
                  <input required type="text" className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" value={editingPrompt.title} onChange={e => setEditingPrompt({...editingPrompt, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">AI Tool</label>
                  <select className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-slate-400" value={editingPrompt.aiTool} onChange={e => setEditingPrompt({...editingPrompt, aiTool: e.target.value})}>
                    <option>ChatGPT</option><option>Midjourney</option><option>Claude</option><option>Gemini</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Description</label>
                <textarea required rows={2} className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-white" value={editingPrompt.description} onChange={e => setEditingPrompt({...editingPrompt, description: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Prompt Content</label>
                <textarea required rows={4} className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-white font-mono" value={editingPrompt.content} onChange={e => setEditingPrompt({...editingPrompt, content: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Category</label>
                  <select className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-slate-400" value={editingPrompt.category} onChange={e => setEditingPrompt({...editingPrompt, category: e.target.value})}>
                    <option>Web Development</option><option>Content Writing</option><option>Data Science</option><option>Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Difficulty</label>
                  <select className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-slate-400" value={editingPrompt.difficulty} onChange={e => setEditingPrompt({...editingPrompt, difficulty: e.target.value})}>
                    <option>Beginner</option><option>Intermediate</option><option>Pro</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Visibility</label>
                  <select className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-slate-400" value={editingPrompt.visibility} onChange={e => setEditingPrompt({...editingPrompt, visibility: e.target.value})}>
                    <option>Public</option><option>Private</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Tags</label>
                  <input type="text" className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-white" value={editingPrompt.tags} onChange={e => setEditingPrompt({...editingPrompt, tags: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Update Thumbnail</label>
                  <label className="w-full bg-[#07090e] border border-dashed border-slate-800 rounded-xl p-3 flex items-center justify-center gap-2 text-slate-500 cursor-pointer hover:border-emerald-500 transition-all">
                    <IoCloudUploadOutline size={16}/> Swap Node Image
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, true)} />
                  </label>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all">
                Commit & Push Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
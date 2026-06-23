'use client';

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  IoAddCircleOutline, IoBriefcaseOutline, IoBookmarkOutline, 
  IoStarOutline, IoPersonOutline, IoCloudUploadOutline, IoTrashOutline 
} from 'react-icons/io5';

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const router = useRouter();

  // Active Tab State
  const [activeTab, setActiveTab] = useState('profile');
  
  // Dynamic User Profile States
  const [userRole, setUserRole] = useState('User');
  const [userStatus, setUserStatus] = useState('Free'); // সাবস্ক্রিপশন স্ট্যাটাস ট্র্যাক করার জন্য
  const [summary, setSummary] = useState({ totalPrompts: 0 });
  
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

  const imgbb_api_key = "4906f3bdf533f07a4ccbba9c5cf05e04"; // ImgBB API Key

  useEffect(() => {
    if (user?.email) {
      const headers = { Authorization: `Bearer ${localStorage.getItem('access-token')}` };

      // ১. ইউজারের মেইন ডাটা, রোল ও সাবস্ক্রিপশন স্ট্যাটাস লোড করা
      axiosPublic.get(`/users/role/${user.email}`, { headers })
        .then(res => {
          setUserRole(res.data.role || 'User');
          setUserStatus(res.data.status || 'Free'); // ডাটাবেজ থেকে 'Free' অথবা 'Premium' সেট হবে
        })
        .catch(() => console.error("Error syncing role framework."));

      // ২. অ্যানালিটিক্স সামারি নেওয়া
      axiosPublic.get(`/user-summary/${user.email}`, { headers })
        .then(res => setSummary(res.data))
        .catch(() => console.error("Error compiling system logs."));
    }
  }, [user, axiosPublic]);

  // ট্যাব চেঞ্জ লজিক ও ডেটা ফেচিং
  const loadTabContent = async (tabName) => {
    setActiveTab(tabName);
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

  // ইমেজ আপলোড হ্যান্ডলার (ImgBB-তে ডিরেক্ট আপলোড)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbb_api_key}`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, thumbnail: data.data.url });
        toast.success("Image compiled successfully into matrix URL.");
      }
    } catch (err) {
      toast.error("Image framework upload failed.");
    }
  };

  // নতুন প্রম্পট সাবমিট ফর্ম সাবমিশন
  const handleAddPrompt = async (e) => {
    e.preventDefault();
    if (!form.thumbnail) return toast.error("Please deploy a thumbnail image node.");

    const promptPayload = {
      ...form,
      creatorName: user?.displayName || "Anonymous Forge Creator",
      creatorEmail: user?.email,
    };

    try {
      const res = await axiosPublic.post('/add-prompt', promptPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });

      if (res.data.limitReached) {
        toast.error(res.data.message);
      } else if (res.data.insertedId) {
        toast.success("Prompt core code uploaded. Awaiting Admin verification loop.");
        setForm({ title: '', description: '', content: '', category: 'Web Development', aiTool: 'ChatGPT', tags: '', difficulty: 'Beginner', visibility: 'Public', thumbnail: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal submission protocol aborted.");
    }
  };

  // প্রম্পট ডিলিট লজিক
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

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-200 py-24 px-4 md:px-8 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
      <ToastContainer theme="dark" />
      
      {/* 🛠️ বাম পাশ: কন্ট্রোল প্যানেল সাইডবার (Sidebar Tabs Navigation) */}
      <div className="w-full md:w-64 space-y-2 bg-[#0f1423]/40 border border-slate-800 p-4 rounded-2xl h-fit">
        <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 px-3 mb-4">// System Controller</h2>
        
        <button onClick={() => loadTabContent('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800/50 text-slate-400'}`}>
          <IoPersonOutline size={16} /> User Profile Core
        </button>
        <button onClick={() => loadTabContent('add-prompt')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono transition-all ${activeTab === 'add-prompt' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800/50 text-slate-400'}`}>
          <IoAddCircleOutline size={16} /> Forge New Prompt
        </button>
        <button onClick={() => loadTabContent('my-prompts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono transition-all ${activeTab === 'my-prompts' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800/50 text-slate-400'}`}>
          <IoBriefcaseOutline size={16} /> My Prompt Logs
        </button>
        <button onClick={() => loadTabContent('saved-prompts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono transition-all ${activeTab === 'saved-prompts' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800/50 text-slate-400'}`}>
          <IoBookmarkOutline size={16} /> Saved Core Banks
        </button>
        <button onClick={() => loadTabContent('my-reviews')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono transition-all ${activeTab === 'my-reviews' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800/50 text-slate-400'}`}>
          <IoStarOutline size={16} /> Matrix Reviews
        </button>
      </div>

      {/* 🖥️ ডান পাশ: ডাইনামিক কন্টেন্ট এরিয়া (Dynamic Dashboard Screens) */}
      <div className="flex-1 bg-[#0f1423]/20 border border-slate-800/60 rounded-2xl p-6 md:p-8 backdrop-blur-md">
        
        {/* TAB 1: PROFILE VIEW */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-800/60 pb-6">
              <img src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'} alt="Avatar" className="w-20 h-20 rounded-2xl border-2 border-indigo-500 p-0.5 object-cover" />
              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-xl font-bold text-white">{user?.displayName || "Operator Matrix"}</h3>
                <p className="text-xs font-mono text-slate-500">{user?.email}</p>
                <span className="inline-block text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md mt-1 uppercase tracking-wider">{userRole} Node</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#07090e] p-5 rounded-xl border border-slate-800/80">
                <p className="text-[10px] font-mono text-slate-500 uppercase">Total Logged Scripts</p>
                <p className="text-2xl font-black font-mono text-white mt-1">{summary.totalPrompts}</p>
              </div>
              
              <div className="bg-[#07090e] p-5 rounded-xl border border-slate-800/80 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase">Subscription Grid</p>
                  <p className={`text-xl font-bold font-mono mt-1 ${userStatus === 'Premium' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {userStatus === 'Premium' ? 'Premium Tier' : 'Standard Free'}
                  </p>
                </div>
                
                {/* ইউজার ফ্রি মোডে থাকলে কেবল তখনই আপগ্রেড বাটন দেখাবে */}
                {userStatus !== 'Premium' && (
                  <button 
                    onClick={() => router.push('/payment')} 
                    className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-black font-mono px-4 py-2.5 rounded-xl tracking-wider uppercase transition-all"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADD PROMPT FORM */}
        {activeTab === 'add-prompt' && (
          <form onSubmit={handleAddPrompt} className="space-y-5">
            <h3 className="text-lg font-bold text-white font-mono">// FORGE NEW ALGORITHMIC CORE</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Prompt Title</label>
                <input required type="text" className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">AI Tool Engine</label>
                <select className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-slate-400 focus:outline-none" value={form.aiTool} onChange={e => setForm({...form, aiTool: e.target.value})}>
                  <option>ChatGPT</option><option>Midjourney</option><option>Claude</option><option>Gemini</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Description</label>
              <textarea required rows={2} className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Prompt Raw Content</label>
              <textarea required rows={4} className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase">Category</label>
                <select className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-slate-400" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option>Web Development</option><option>Content Writing</option><option>Data Science</option><option>Marketing</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase">Difficulty</label>
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
                <label className="text-[10px] font-mono text-slate-400 uppercase">Tags (Comma Separated)</label>
                <input placeholder="coding, clean-code, react" type="text" className="w-full bg-[#07090e] border border-slate-800 rounded-xl p-3 text-xs text-white" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Thumbnail Registry</label>
                <label className="w-full bg-[#07090e] border border-dashed border-slate-800 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-mono text-slate-500 cursor-pointer hover:border-slate-600">
                  <IoCloudUploadOutline size={16}/> {form.thumbnail ? "Change Matrix Image" : "Upload File"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white font-mono font-bold text-xs py-3.5 px-6 rounded-xl shadow-lg uppercase tracking-wider hover:bg-indigo-700 transition-all">Submit Script to Core</button>
          </form>
        )}

        {/* TAB 3: MY PROMPTS LIST TABLE */}
        {activeTab === 'my-prompts' && (
          <div className="overflow-x-auto">
            <h3 className="text-sm font-mono text-slate-400 mb-4">// DEPLOYED ARCHIVE CORE</h3>
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                  <th className="py-3 px-2">Title</th><th className="py-3 px-2">Tool</th><th className="py-3 px-2">Status</th><th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myPrompts.map(p => (
                  <tr key={p._id} className="border-b border-slate-800/50 hover:bg-slate-900/20">
                    <td className="py-3 px-2 font-bold text-white max-w-[150px] truncate">{p.title}</td>
                    <td className="py-3 px-2 text-indigo-400">{p.aiTool}</td>
                    <td className="py-3 px-2"><span className={`px-2 py-0.5 rounded text-[10px] ${p.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{p.status}</span></td>
                    <td className="py-3 px-2 flex items-center gap-2">
                      <button onClick={() => handleDeletePrompt(p._id)} className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg"><IoTrashOutline size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: SAVED BOOKMARKS */}
        {activeTab === 'saved-prompts' && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-slate-400">// CRYPTO INDEX BOOKMARKS</h3>
            {savedPrompts.map(p => (
              <div key={p._id} className="p-4 bg-[#07090e] border border-slate-800 rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-white">{p.title}</h4>
                  <p className="text-[10px] font-mono text-indigo-400 mt-1">{p.category} • {p.aiTool}</p>
                </div>
                <button onClick={() => router.push(`/prompt/${p._id}`)} className="bg-slate-800 hover:bg-indigo-600 text-slate-200 text-[10px] font-bold py-2 px-4 rounded-lg transition-all">Execute Core</button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: MY SUBMITTED REVIEWS */}
        {activeTab === 'my-reviews' && (
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-slate-400">// SUBMITTED LOG REVIEWS</h3>
            {myReviews.map(r => (
              <div key={r._id} className="p-4 bg-[#07090e]/60 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-amber-400 font-bold font-mono text-xs">★ {r.rating}/5 Rating</span>
                  <span className="text-[10px] text-slate-600 font-mono">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-400 font-mono italic">"{r.comment}"</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
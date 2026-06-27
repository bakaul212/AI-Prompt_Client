'use client';

import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { FiCopy, FiArrowRight } from 'react-icons/fi';
import { LuShieldAlert, LuSparkles, LuUser } from 'react-icons/lu';
import 'react-toastify/dist/ReactToastify.css';

export default function DemoUserPage() {
  const router = useRouter();

  // ৩টি ভিন্ন ভিন্ন রোল ও ইউজার অবজেক্ট এর অ্যারে
  const demoUsers = [
    {
      role: "ADMIN USER",
      icon: <LuShieldAlert className="text-purple-400" size={20} />,
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      accentLine: "from-purple-500 to-indigo-600",
      desc: "Access to system analytics, user management, prompt moderation, payment histories, and system configurations.",
      email: "admin@promptforge.com",
      pass: "123456"
    },
    {
      role: "CREATOR USER",
      icon: <LuSparkles className="text-cyan-400" size={20} />,
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      accentLine: "from-cyan-500 to-teal-500",
      desc: "Access to creator analytics, adding new AI prompts, editing owned listings, and tracking prompt views.",
      email: "creator@promptforge.com",
      pass: "123456"
    },
    {
      role: "STANDARD USER",
      icon: <LuUser className="text-emerald-400" size={20} />,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      accentLine: "from-emerald-500 to-green-500",
      desc: "Access to search prompts, copy prompts to clipboard, save to collections, leave reviews, and purchase premium access.",
      email: "user@promptforge.com",
      pass: "123456"
    }
  ];

  // টেক্সট কপি করার ফাংশন
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to matrix clipboard!`, { autoClose: 1500 });
  };

  // ডিরেক্ট লগইন হ্যান্ডেলার (ক্রেডেন্সিয়াল পাস করানোর জন্য সেশন বা লোকালস্টোরেজ ব্যবহার করতে পারেন)
  const handleGoToLogin = (email) => {
    // লগইন ফিল্ডে ডেটা অটোমেটিক বসানোর সুবিধার জন্য আমরা লোকালস্টোরেজে টেম্পোরারি ফ্ল্যাগ রাখতে পারি
    localStorage.setItem('demo-login-email', email);
    localStorage.setItem('demo-login-pass', '123456');
    
    toast.info("Routing to Core Node Authentication terminal...");
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 py-24 px-4 font-sans relative overflow-hidden">
      <ToastContainer theme="dark" />
      <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* হেডার টেক্সট */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
            Explore From Different Perspectives
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-mono max-w-xl mx-auto leading-relaxed">
            [SYSTEM INSTRUCTION]: Copy credentials below and head over to the sign in page to compile terminal environments.
          </p>
        </div>

        {/* কার্ডস গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {demoUsers.map((user, idx) => (
            <div 
              key={idx} 
              className="bg-[#0b0f19]/60 border border-slate-900 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl group hover:border-slate-800 transition-all duration-300"
            >
              {/* টপ গ্রাডিয়েন্ট এফেক্ট লাইন */}
              <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${user.accentLine}`}></div>

              <div className="space-y-5">
                {/* আইকন বক্স */}
                <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-slate-800/40 flex items-center justify-center">
                  {user.icon}
                </div>

                {/* রোল ব্যাজ */}
                <div className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase border ${user.badgeColor}`}>
                  {user.role}
                </div>

                {/* ডেসক্রিপশন */}
                <p className="text-slate-400 text-[11px] leading-relaxed font-sans font-medium min-h-[55px]">
                  {user.desc}
                </p>

                {/* ইনপুট ফিল্ডস (ইমেইল এবং পাসওয়ার্ড কপি করার জন্য) */}
                <div className="space-y-2.5 pt-2">
                  {/* ইমেইল */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">Email</label>
                    <div className="flex items-center justify-between bg-[#07090e] border border-slate-800/80 rounded-xl px-3.5 py-2.5 group/field">
                      <span className="text-[11px] font-mono text-slate-300 truncate max-w-[180px]">{user.email}</span>
                      <button 
                        type="button"
                        onClick={() => handleCopy(user.email, 'Email')}
                        className="text-slate-500 hover:text-indigo-400 transition-colors p-1"
                        title="Copy Email"
                      >
                        <FiCopy size={13} />
                      </button>
                    </div>
                  </div>

                  {/* পাসওয়ার্ড */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-slate-500 font-mono">Password</label>
                    <div className="flex items-center justify-between bg-[#07090e] border border-slate-800/80 rounded-xl px-3.5 py-2.5">
                      <span className="text-[11px] font-mono text-slate-300">{user.pass}</span>
                      <button 
                        type="button"
                        onClick={() => handleCopy(user.pass, 'Password')}
                        className="text-slate-500 hover:text-indigo-400 transition-colors p-1"
                        title="Copy Password"
                      >
                        <FiCopy size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* লগইন বাটন */}
              <button
                onClick={() => handleGoToLogin(user.email)}
                className="w-full mt-6 bg-slate-900 hover:bg-indigo-600 hover:text-white border border-slate-800 hover:border-indigo-500 text-slate-300 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all group-hover:scale-[1.01]"
              >
                Go to Login <FiArrowRight size={14} />
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
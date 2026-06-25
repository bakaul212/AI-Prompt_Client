'use client';

import { useState, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '@/hooks/useAxiosSecure'; 
import { AuthContext } from '@/providers/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

import { 
  IoPeopleOutline, IoCodeSlashOutline, IoCardOutline, 
  IoWarningOutline, IoBarChartOutline, IoTrashOutline, 
  IoCheckmarkCircleOutline, IoCloseCircleOutline, 
  IoMenuOutline, IoChevronBackOutline, IoChevronForwardOutline
} from 'react-icons/io5';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext); 
  const axiosSecure = useAxiosSecure(); 
  const queryClient = useQueryClient();
  const router = useRouter(); 
  
  const [activeTab, setActiveTab] = useState('analytics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [feedbackModal, setFeedbackModal] = useState({ open: false, promptId: null });
  const [feedbackText, setFeedbackText] = useState('');

  // ==========================================
  // 🚨 ADMIN ACCESS GUARD (BYPASSED VIA EMAIL)
  // ==========================================
  useEffect(() => {
    if (authLoading) return; 

    if (!user || user?.email !== 'admin25678@gmail.com') {
      toast.error("ACCESS DENIED: Unauthorized clearance vector.");
      router.push('/'); 
    }
  }, [user, authLoading, router]);

  // ==========================================
  // DATA FETCHING (Bypassed Via Email)
  // ==========================================
  const { data: adminStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    enabled: !!user && user?.email === 'admin25678@gmail.com', 
    queryFn: async () => {
      const res = await axiosSecure.get('/admin/analytics');
      return res.data;
    }
  });

  const { data: usersData = { result: [], total: 0 } } = useQuery({
    queryKey: ['adminUsers', currentPage, activeTab],
    enabled: !!user && user?.email === 'admin25678@gmail.com' && activeTab === 'users',
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/users?page=${currentPage}&size=${itemsPerPage}`);
      return res.data;
    }
  });

  const { data: promptsData = { result: [], total: 0 } } = useQuery({
    queryKey: ['adminPrompts', currentPage, activeTab],
    enabled: !!user && user?.email === 'admin25678@gmail.com' && activeTab === 'prompts',
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/prompts?page=${currentPage}&size=${itemsPerPage}`);
      return res.data;
    }
  });

  const { data: paymentsData = { result: [], total: 0 } } = useQuery({
    queryKey: ['adminPayments', currentPage, activeTab],
    enabled: !!user && user?.email === 'admin25678@gmail.com' && activeTab === 'payments',
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/payments?page=${currentPage}&size=${itemsPerPage}`);
      return res.data;
    }
  });

  const { data: reportedData = { result: [], total: 0 } } = useQuery({
    queryKey: ['adminReported', currentPage, activeTab],
    enabled: !!user && user?.email === 'admin25678@gmail.com' && activeTab === 'reported',
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/reported-prompts?page=${currentPage}&size=${itemsPerPage}`);
      return res.data;
    }
  });

  // MUTATIONS
  const changeRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return axiosSecure.patch(`/admin/user-role/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success("Clearance updated.");
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/admin/user-delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.warn("User purged.");
    }
  });

  const promptActionMutation = useMutation({
    mutationFn: async ({ id, status, feedback }) => {
      return axiosSecure.patch(`/admin/prompt-status/${id}`, { status, feedback });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPrompts']);
      setFeedbackModal({ open: false, promptId: null });
      setFeedbackText('');
      toast.info("Prompt state synchronized.");
    }
  });

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setIsSidebarOpen(false); 
  };

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: <IoBarChartOutline size={18} /> },
    { id: 'users', label: 'All Users', icon: <IoPeopleOutline size={18} /> },
    { id: 'prompts', label: 'All Prompts', icon: <IoCodeSlashOutline size={18} /> },
    { id: 'payments', label: 'Payments Feed', icon: <IoCardOutline size={18} /> },
    { id: 'reported', label: 'Infractions', icon: <IoWarningOutline size={18} /> },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center text-xs text-slate-500 font-mono">
        [VALIDATING SYSTEM CLEARANCE CRYPTO KEY...]
      </div>
    );
  }

  // 🎯 এখানে ইমেইল কন্ডিশন ফিক্সড করা হলো
  if (!user || user?.email !== 'admin25678@gmail.com') {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex relative font-mono w-full">
      <ToastContainer theme="dark" />

      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 h-screen w-64 bg-[#0f1423] border-r border-slate-800/60 p-5 z-40
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0
        flex flex-col justify-between
      `}>
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-xs">⚡</div>
              <span className="font-black tracking-wider text-sm uppercase text-white">FORGE CORE</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <IoChevronBackOutline size={20} />
            </button>
          </div>

          <nav className="space-y-1.5 text-xs">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-900/50 hover:text-white'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 lg:py-12 w-full">
        <div className="flex items-center justify-between mb-6 lg:hidden bg-[#0f1423]/50 p-3 rounded-xl border border-slate-800/40">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-900 border border-slate-800/80 rounded-lg text-slate-300 active:scale-95 transition-transform">
            <IoMenuOutline size={20} />
          </button>
          <span className="text-xs text-indigo-400 font-bold">// System Control Matrix</span>
        </div>

        <div className="mb-8 border-b border-slate-800/80 pb-6">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight uppercase text-white flex items-center gap-2">
            <span className="h-2 w-2 bg-indigo-500 rounded-full animate-ping"></span> Mainframe Control Panel
          </h1>
          <p className="text-xs text-slate-500 mt-1">// Active Connection: {user?.email}</p>
        </div>

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Matrix Users', value: adminStats.totalUsers || 0, color: 'text-indigo-400' },
              { label: 'Total Saved Prompts', value: adminStats.totalPrompts || 0, color: 'text-emerald-400' },
              { label: 'Total Verified Reviews', value: adminStats.totalReviews || 0, color: 'text-amber-400' },
              { label: 'Total System Copies', value: adminStats.totalCopies || 0, color: 'text-purple-400' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#0f1423]/30 border border-slate-800/80 p-5 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{stat.label}</span>
                <h3 className={`text-xl sm:text-2xl font-black mt-2 ${stat.color}`}>{stat.value}</h3>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-[#07090e]">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead className="bg-[#0f1423]/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">User Metadata</th>
                    <th className="p-4">Clearance Role</th>
                    <th className="p-4 text-right">Purge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {(usersData.result || []).map(u => (
                    <tr key={u._id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <span className="text-white block font-bold font-sans">{u.name || 'Anonymous User'}</span>
                        <span className="text-slate-500 text-[10px] block">{u.email}</span>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role || 'user'}
                          onChange={(e) => changeRoleMutation.mutate({ id: u._id, role: e.target.value })}
                          className="bg-slate-900 text-indigo-400 border border-slate-800 rounded px-2 py-1 font-bold text-[11px] focus:outline-none"
                        >
                          <option value="user">USER</option>
                          <option value="creator">CREATOR</option>
                          <option value="admin">ADMIN</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteUserMutation.mutate(u._id)} className="text-slate-600 hover:text-rose-400 p-1">
                          <IoTrashOutline size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {usersData.total > itemsPerPage && renderPagination(usersData.total)}
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-[#07090e]">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead className="bg-[#0f1423]/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Prompt Title</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {(promptsData.result || []).map(p => (
                    <tr key={p._id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4">
                        <span className="text-white block font-bold font-sans">{p.title}</span>
                        <span className="text-slate-500 text-[10px] block">By: {p.creatorEmail}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${p.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : p.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {p.status || 'Pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-3">
                          <button onClick={() => promptActionMutation.mutate({ id: p._id, status: 'Approved' })} className="text-emerald-500 text-[10px] uppercase font-bold flex items-center gap-0.5">
                            <IoCheckmarkCircleOutline size={14} /> Approve
                          </button>
                          <button onClick={() => setFeedbackModal({ open: true, promptId: p._id })} className="text-amber-500 text-[10px] uppercase font-bold flex items-center gap-0.5">
                            <IoCloseCircleOutline size={14} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {promptsData.total > itemsPerPage && renderPagination(promptsData.total)}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-[#07090e]">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead className="bg-[#0f1423]/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Transaction Code</th>
                    <th className="p-4">Subscriber</th>
                    <th className="p-4">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {(paymentsData.result || []).map(pay => (
                    <tr key={pay._id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4 font-bold text-indigo-400">{pay.transactionId}</td>
                      <td className="p-4 text-slate-300">{pay.email}</td>
                      <td className="p-4 text-emerald-400 font-bold">${pay.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {paymentsData.total > itemsPerPage && renderPagination(paymentsData.total)}
          </div>
        )}

        {activeTab === 'reported' && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-[#07090e]">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead className="bg-[#0f1423]/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Flagged Asset</th>
                    <th className="p-4">Reason</th>
                    <th className="p-4 text-right">Resolutions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {(reportedData.result || []).map(rep => (
                    <tr key={rep._id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4 text-white font-bold">ID: {rep.promptId}</td>
                      <td className="p-4 text-rose-400 font-bold">{rep.reason}</td>
                      <td className="p-4 text-right">
                        <span className="text-slate-500 text-[10px] uppercase">// Manual Review Required</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {reportedData.total > itemsPerPage && renderPagination(reportedData.total)}
          </div>
        )}
      </main>

      {feedbackModal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1423] border border-slate-800 p-6 rounded-2xl w-full max-w-md text-xs">
            <h3 className="text-white uppercase font-bold mb-3">// Rejection Feedback</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="State the reason..."
              className="w-full bg-[#07090e] border border-slate-800 p-3 rounded-xl text-slate-300 focus:outline-none mb-4"
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setFeedbackModal({ open: false, promptId: null })} className="text-slate-500 uppercase font-bold">Abort</button>
              <button onClick={() => promptActionMutation.mutate({ id: feedbackModal.promptId, status: 'Rejected', feedback: feedbackText })} className="bg-rose-600 text-white px-4 py-2 rounded-lg font-bold uppercase">Log Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
      <div className="flex justify-between items-center bg-[#07090e] border border-slate-800/60 p-3 rounded-xl text-xs">
        <span className="text-slate-500">Page {currentPage} of {totalPages}</span>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
          >
            <IoChevronBackOutline size={14} />
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
          >
            <IoChevronForwardOutline size={14} />
          </button>
        </div>
      </div>
    );
  }
}
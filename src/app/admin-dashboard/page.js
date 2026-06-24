'use client';

import { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { AuthContext } from '@/providers/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// এখানে একদম সেফ এবং এক্সিসটিং আইকনগুলো ব্যবহার করা হয়েছে
import { 
  IoPeopleOutline, 
  IoCodeSlashOutline, 
  IoCardOutline, 
  IoWarningOutline, 
  IoBarChartOutline, 
  IoTrashOutline, 
  IoCheckmarkCircleOutline, 
  IoCloseCircleOutline, 
  IoMegaphoneOutline 
} from 'react-icons/io5';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('analytics');

  // রিজেকশন এবং ওয়ার্নিং মডাল স্টেট
  const [feedbackModal, setFeedbackModal] = useState({ open: false, promptId: null });
  const [feedbackText, setFeedbackText] = useState('');
  const [warnModal, setWarnModal] = useState({ open: false, creatorEmail: null, promptId: null });
  const [warnText, setWarnText] = useState('');

  // ==========================================
  // ১. ডাইনামিক ডাটা ফেচিং (TanStack Query)
  // ==========================================
  
  const { data: adminStats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await axiosPublic.get('/admin/analytics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
      return res.data;
    }
  });

  const { data: usersList = [], isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await axiosPublic.get('/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
      return res.data;
    }
  });

  const { data: promptsList = [], isLoading: promptsLoading } = useQuery({
    queryKey: ['adminPrompts'],
    queryFn: async () => {
      const res = await axiosPublic.get('/admin/prompts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
      return res.data;
    }
  });

  const { data: paymentsList = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['adminPayments'],
    queryFn: async () => {
      const res = await axiosPublic.get('/admin/payments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
      return res.data;
    }
  });

  const { data: reportedList = [], isLoading: reportedLoading } = useQuery({
    queryKey: ['adminReported'],
    queryFn: async () => {
      const res = await axiosPublic.get('/admin/reported-prompts', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
      return res.data;
    }
  });

  // ==========================================
  // ২. মিউটেশন ও অ্যাকশন হ্যান্ডলারসমূহ (Actions)
  // ==========================================

  const changeRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return axiosPublic.patch(`/admin/user-role/${id}`, { role }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success("User clearance level altered successfully.");
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      return axiosPublic.delete(`/admin/user-delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.warn("User account purged from core directory.");
    }
  });

  const promptActionMutation = useMutation({
    mutationFn: async ({ id, status, feedback }) => {
      return axiosPublic.patch(`/admin/prompt-status/${id}`, { status, feedback }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPrompts']);
      setFeedbackModal({ open: false, promptId: null });
      setFeedbackText('');
      toast.info("Prompt matrix state synchronized.");
    }
  });

  const deletePromptMutation = useMutation({
    mutationFn: async ({ id, reportId }) => {
      return axiosPublic.delete(`/admin/prompt-delete/${id}?reportId=${reportId || ''}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPrompts']);
      queryClient.invalidateQueries(['adminReported']);
      toast.error("Prompt asset wiped from repository.");
    }
  });

  const dismissReportMutation = useMutation({
    mutationFn: async (reportId) => {
      return axiosPublic.patch(`/admin/report-dismiss/${reportId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReported']);
      toast.success("Security flag dismissed. Not harmful.");
    }
  });

  const warnCreatorMutation = useMutation({
    mutationFn: async ({ email, message, reportId }) => {
      return axiosPublic.post(`/admin/warn-creator`, { email, message, reportId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReported']);
      setWarnModal({ open: false, creatorEmail: null, promptId: null });
      setWarnText('');
      toast.warn("Infraction warning transmitted to creator.");
    }
  });

  if (statsLoading || usersLoading || promptsLoading || paymentsLoading || reportedLoading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-xs text-slate-500 font-mono tracking-widest uppercase animate-pulse">Syncing Admin Command Mainframe...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 py-24 px-4 max-w-7xl mx-auto">
      <ToastContainer theme="dark" />

      <div className="border-b border-slate-800/80 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase text-white font-mono flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-indigo-500 rounded-full animate-ping"></span> Mainframe Command Center
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">// Welcome Back, Operator: {user?.email}</p>
        </div>

        <div className="flex flex-wrap gap-2 bg-[#0f1423]/50 p-1.5 rounded-xl border border-slate-800/60 font-mono text-[11px]">
          {[
            { id: 'analytics', label: 'Analytics', icon: <IoBarChartOutline size={14} /> },
            { id: 'users', label: 'All Users', icon: <IoPeopleOutline size={14} /> },
            { id: 'prompts', label: 'All Prompts', icon: <IoCodeSlashOutline size={14} /> },
            { id: 'payments', label: 'Payments Feed', icon: <IoCardOutline size={14} /> },
            { id: 'reported', label: 'Infractions', icon: <IoWarningOutline size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            {[
              { label: 'Total Matrix Users', value: adminStats.totalUsers || 0, color: 'text-indigo-400' },
              { label: 'Total Saved Prompts', value: adminStats.totalPrompts || 0, color: 'text-emerald-400' },
              { label: 'Total Verified Reviews', value: adminStats.totalReviews || 0, color: 'text-amber-400' },
              { label: 'Total System Copies', value: adminStats.totalCopies || 0, color: 'text-purple-400' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-[#0f1423]/30 border border-slate-800 p-5 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{stat.label}</span>
                <h3 className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.value}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-[#07090e]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0f1423]/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">User Metadata</th>
                <th className="p-4">Authorization Role</th>
                <th className="p-4 text-right">Purge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {usersList.map(u => (
                <tr key={u._id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4">
                    <span className="text-white block font-bold font-sans">{u.name || 'Anonymous User'}</span>
                    <span className="text-slate-500 text-[10px] block">{u.email}</span>
                  </td>
                  <td className="p-4">
                    <select
                      value={u.role || 'user'}
                      onChange={(e) => changeRoleMutation.mutate({ id: u._id, role: e.target.value })}
                      className="bg-slate-900 text-indigo-400 border border-slate-800 rounded px-2 py-1 font-bold text-[11px]"
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
      )}

      {activeTab === 'prompts' && (
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-[#07090e]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0f1423]/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Prompt Title</th>
                <th className="p-4">Operational Status</th>
                <th className="p-4 text-center">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {promptsList.map(p => (
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
                      <button onClick={() => deletePromptMutation.mutate({ id: p._id })} className="text-slate-600 hover:text-rose-400 p-1">
                        <IoTrashOutline size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-[#07090e]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0f1423]/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Transaction Code</th>
                <th className="p-4">Subscriber</th>
                <th className="p-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {paymentsList.map(pay => (
                <tr key={pay._id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-bold text-indigo-400">{pay.transactionId}</td>
                  <td className="p-4 text-slate-300">{pay.email}</td>
                  <td className="p-4 text-emerald-400 font-bold">${pay.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reported' && (
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl bg-[#07090e]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#0f1423]/60 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Flagged Asset</th>
                <th className="p-4">Reason</th>
                <th className="p-4 text-right">Resolutions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {reportedList.map(rep => (
                <tr key={rep._id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 text-white font-bold">ID: {rep.promptId}</td>
                  <td className="p-4 text-rose-400 font-bold">{rep.reason}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => dismissReportMutation.mutate(rep._id)} className="text-emerald-500 text-[10px] font-bold uppercase">Dismiss</button>
                      <button onClick={() => setWarnModal({ open: true, creatorEmail: rep.creatorEmail || 'creator@forge.com', promptId: rep._id })} className="text-amber-500 text-[10px] font-bold uppercase">Warn</button>
                      <button onClick={() => deletePromptMutation.mutate({ id: rep.promptId, reportId: rep._id })} className="text-rose-500 text-[10px] font-bold uppercase">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {feedbackModal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1423] border border-slate-800 p-6 rounded-2xl w-full max-w-md font-mono text-xs">
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

      {warnModal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1423] border border-slate-800 p-6 rounded-2xl w-full max-w-md font-mono text-xs">
            <h3 className="text-amber-400 uppercase font-bold mb-3">// Transmit Warning</h3>
            <textarea
              value={warnText}
              onChange={(e) => setWarnText(e.target.value)}
              placeholder="Draft warning message..."
              className="w-full bg-[#07090e] border border-slate-800 p-3 rounded-xl text-slate-300 focus:outline-none mb-4"
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setWarnModal({ open: false, creatorEmail: null, promptId: null })} className="text-slate-500 uppercase font-bold">Abort</button>
              <button onClick={() => warnCreatorMutation.mutate({ email: warnModal.creatorEmail, message: warnText, reportId: warnModal.promptId })} className="bg-amber-500 text-black px-4 py-2 rounded-lg font-black uppercase">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
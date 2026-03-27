import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  LayoutGrid, 
  Bell, 
  Settings, 
  LogOut,
  ChevronRight,
  Filter,
  MoreVertical
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';
import { UserProfile, Job } from '../types';
import { auth } from '../lib/firebase';

interface AdminDashboardProps {
  showToast: (msg: string) => void;
}

export default function AdminDashboard({ showToast }: AdminDashboardProps) {
  const { user, language, jobs, applications, setUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'revenue'>('overview');
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await userService.getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Mock data for stats since we don't have a global users list in the store yet
  const stats = [
    { label: 'Total Users', value: allUsers.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Jobs', value: jobs.length, icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Platform Revenue', value: '1,240 TND', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleVerifyUser = async (uid: string) => {
    try {
      await userService.updateUser(uid, { isVerified: true });
      showToast('User verified successfully!');
      // Refresh user list
      const users = await userService.getAllUsers();
      setAllUsers(users);
    } catch (error) {
      showToast('Failed to verify user');
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  const pendingUsers = allUsers.filter(u => !u.isVerified && u.role !== 'admin');

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-4 px-2 mb-4">
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="font-black text-gray-900 leading-none">Admin Panel</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Owner Access</p>
          </div>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutGrid },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'jobs', label: 'Job Moderation', icon: Briefcase },
            { id: 'revenue', label: 'Revenue & Fees', icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2">Platform Overview</h2>
                  <p className="text-gray-500 font-medium tracking-wide">Real-time health and growth metrics.</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500 hover:text-orange-600 transition-all">
                    <Bell size={24} />
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:border-orange-600 transition-all">
                    <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all`}>
                      <stat.icon size={32} />
                    </div>
                    <p className="text-4xl font-black text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-gray-900">Pending Verifications</h3>
                    <button className="text-orange-600 font-black text-sm flex items-center gap-2 hover:gap-3 transition-all">
                      View All <ChevronRight size={18} />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {pendingUsers.length > 0 ? (
                      pendingUsers.slice(0, 5).map((u) => (
                        <div key={u.uid} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-100 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400">
                              <Users size={24} />
                            </div>
                            <div>
                              <p className="font-black text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{u.role} • {u.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><XCircle size={20} /></button>
                            <button 
                              onClick={() => handleVerifyUser(u.uid)}
                              className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
                            >
                              <CheckCircle2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 font-bold text-center py-10">No pending verifications</p>
                    )}
                  </div>
                </section>

                <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-gray-900">Recent Activity</h3>
                    <button className="text-orange-600 font-black text-sm flex items-center gap-2 hover:gap-3 transition-all">
                      View Logs <ChevronRight size={18} />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {[
                      { text: 'New company registered: "Sousse Builders"', time: '2 mins ago', icon: CheckCircle2, color: 'text-green-600' },
                      { text: 'Job reported for misleading wage', time: '15 mins ago', icon: AlertCircle, color: 'text-red-600' },
                      { text: 'Payment of 450 TND processed', time: '1 hour ago', icon: DollarSign, color: 'text-blue-600' },
                    ].map((log, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className={`mt-1 ${log.color}`}><log.icon size={18} /></div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-tight">{log.text}</p>
                          <p className="text-xs text-gray-400 font-medium mt-1">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-4xl font-black text-gray-900">User Management</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-600 transition-all font-medium shadow-sm w-full md:w-64"
                    />
                  </div>
                  <button className="p-4 bg-white rounded-2xl border border-gray-100 text-gray-500 hover:text-orange-600 transition-all">
                    <Filter size={24} />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">User</th>
                      <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                      <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Joined</th>
                      <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 font-black">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-gray-900">{u.name}</p>
                              <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'worker' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${u.isVerified ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                            <span className="text-sm font-bold text-gray-700">{u.isVerified ? 'Verified' : 'Pending'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 text-gray-400 hover:text-gray-900 transition-all"><MoreVertical size={20} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'revenue' && (
            <motion.div 
              key="revenue" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[120px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                  <p className="text-orange-400 font-black uppercase tracking-widest text-sm mb-2">Total Platform Earnings</p>
                  <h2 className="text-7xl font-black mb-6">1,240.50 <span className="text-3xl">TND</span></h2>
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">Company Fees (5%)</p>
                      <p className="text-2xl font-black">840 TND</p>
                    </div>
                    <div className="w-px h-12 bg-gray-800"></div>
                    <div>
                      <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">Worker Fees (5 TND/job)</p>
                      <p className="text-2xl font-black">400 TND</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-black text-gray-900 mb-8">Fee Configuration</h3>
                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-black text-gray-900">Company Service Fee</p>
                        <span className="px-4 py-1 bg-orange-600 text-white font-black text-xs rounded-full">5%</span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">Charged on every successful job payment from the company side.</p>
                      <button className="w-full py-4 bg-white border-2 border-gray-200 text-gray-900 font-black rounded-2xl hover:border-orange-600 transition-all">Update Fee</button>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-black text-gray-900">Worker Platform Fee</p>
                        <span className="px-4 py-1 bg-orange-600 text-white font-black text-xs rounded-full">5 TND</span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">Fixed fee deducted from worker's daily wage for platform maintenance.</p>
                      <button className="w-full py-4 bg-white border-2 border-gray-200 text-gray-900 font-black rounded-2xl hover:border-orange-600 transition-all">Update Fee</button>
                    </div>
                  </div>
                </section>

                <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-black text-gray-900 mb-8">Recent Transactions</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                            <DollarSign size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">Fee from Job #{100 + i}</p>
                            <p className="text-xs text-gray-400 font-medium">Mar 2{i}, 2026</p>
                          </div>
                        </div>
                        <p className="font-black text-gray-900">+{(i * 2.5).toFixed(2)} TND</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

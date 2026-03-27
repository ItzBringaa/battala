import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase,
  Users,
  LayoutGrid, 
  Search, 
  FileText, 
  Wallet, 
  User, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  ChevronRight,
  TrendingUp,
  Award,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { Job, Application } from '../types';

interface WorkerDashboardProps {
  showToast: (msg: string) => void;
}

export default function WorkerDashboard({ showToast }: WorkerDashboardProps) {
  const { user, language, jobs, applications, reviews, payments } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'earnings' | 'profile' | 'plans'>('overview');
  const t = translations[language];

  const handleApply = async (jobId: string) => {
    if (!user) return;
    try {
      await applicationService.applyToJob({
        jobId,
        workerId: user.uid,
        workerName: user.name,
        status: 'pending'
      });
      showToast('Application submitted successfully!');
    } catch (error: any) {
      showToast(error.message || 'Failed to apply');
    }
  };

  const tabs = [
    { id: 'overview', label: t.overview, icon: LayoutGrid },
    { id: 'jobs', label: t.browseJobs, icon: Search },
    { id: 'applications', label: t.myApps, icon: FileText },
    { id: 'earnings', label: t.earnings, icon: Wallet },
    { id: 'profile', label: t.profile, icon: User },
    { id: 'plans', label: 'Plans', icon: Award },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 p-6 flex flex-col gap-8">
        <div className="hidden md:block">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{t.overview}</p>
          <nav className="space-y-2">
            {tabs.map((tab) => (
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
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto gap-2 pb-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-sm whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto hidden md:block">
          <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white mb-4">
              <Award size={20} />
            </div>
            <p className="font-black text-gray-900 mb-1">Pro Badge</p>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">Complete 10 more jobs to unlock premium perks!</p>
          </div>
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
                  <h2 className="text-4xl font-black text-gray-900 mb-2">{t.goodMorning}, {user?.name}!</h2>
                  <p className="text-gray-500 font-medium tracking-wide">You have 3 active applications today.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{t.earned}</p>
                      <p className="text-2xl font-black text-gray-900">{user?.balance || 0} <span className="text-sm">TND</span></p>
                    </div>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:border-orange-600 transition-all">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <FileText size={32} />
                  </div>
                  <p className="text-4xl font-black text-gray-900 mb-2">{applications.length}</p>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{t.applied}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:border-orange-600 transition-all">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="text-4xl font-black text-gray-900 mb-2">{applications.filter(a => a.status === 'accepted').length}</p>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{t.accepted}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:border-orange-600 transition-all">
                  <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <Star size={32} />
                  </div>
                  <p className="text-4xl font-black text-gray-900 mb-2">{user?.rating || 5.0}</p>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{t.rating}</p>
                </div>
              </div>

              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900">Recommended Jobs</h3>
                  <button onClick={() => setActiveTab('jobs')} className="text-orange-600 font-black text-sm flex items-center gap-2 hover:gap-3 transition-all">
                    View All <ChevronRight size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.slice(0, 4).map((job) => (
                    <JobCard key={job.id} job={job} onApply={() => handleApply(job.id)} />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'jobs' && (
            <motion.div 
              key="jobs" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 className="text-4xl font-black text-gray-900">{t.browseJobs}</h2>
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Search by title, location..." 
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-orange-600 transition-all font-medium shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} onApply={() => handleApply(job.id)} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'applications' && (
            <motion.div 
              key="applications" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-black text-gray-900">{t.myApps}</h2>
              <div className="space-y-4">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <ApplicationRow key={app.id} application={app} jobs={jobs} />
                  ))
                ) : (
                  <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText size={40} />
                    </div>
                    <p className="text-xl font-black text-gray-900 mb-2">No applications yet</p>
                    <p className="text-gray-500 font-medium mb-8">Start applying for jobs to see them here!</p>
                    <button 
                      onClick={() => setActiveTab('jobs')}
                      className="px-8 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all"
                    >
                      Find Jobs
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'earnings' && (
            <motion.div 
              key="earnings" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div>
                    <p className="text-orange-400 font-black uppercase tracking-widest text-sm mb-2">{t.totalBalance}</p>
                    <h2 className="text-6xl font-black mb-4">{user?.balance || 0} <span className="text-2xl">TND</span></h2>
                    <p className="text-gray-400 font-medium">Available for withdrawal via D17</p>
                  </div>
                  <button className="px-10 py-5 bg-orange-600 text-white font-black text-lg rounded-2xl hover:bg-orange-700 transition-all shadow-2xl shadow-orange-900/40 flex items-center justify-center gap-3">
                    <Wallet size={24} />
                    {t.withdraw}
                  </button>
                </div>
              </div>

              <section>
                <h3 className="text-2xl font-black text-gray-900 mb-6">Payment History</h3>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden">
                  {payments.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {payments.map((payment) => (
                        <div key={payment.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                              <DollarSign size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">Payment Received</p>
                              <p className="text-xs text-gray-500 font-medium">{new Date(payment.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-green-600">+{payment.amount} TND</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Completed</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-20 text-center">
                      <p className="text-gray-400 font-bold">No payment history yet</p>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'plans' && (
            <motion.div 
              key="plans" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-5xl font-black text-gray-900 mb-4">Choose Your Plan</h2>
                <p className="text-gray-500 font-medium text-lg">Boost your visibility and get hired faster with our premium plans.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className={`bg-white p-10 rounded-[3rem] border-2 transition-all flex flex-col ${user?.plan === 'free' ? 'border-orange-600 shadow-xl shadow-orange-100' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1">Basic</h3>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Free Forever</p>
                    </div>
                    {user?.plan === 'free' && <span className="px-4 py-1 bg-orange-600 text-white font-black text-[10px] rounded-full uppercase tracking-widest">Current</span>}
                  </div>
                  <div className="text-5xl font-black text-gray-900 mb-8">0 <span className="text-xl">TND</span></div>
                  <ul className="space-y-4 mb-10 flex-1">
                    <li className="flex items-center gap-3 text-gray-600 font-medium"><CheckCircle2 size={18} className="text-green-500" /> Standard visibility</li>
                    <li className="flex items-center gap-3 text-gray-600 font-medium"><CheckCircle2 size={18} className="text-green-500" /> Apply to any job</li>
                    <li className="flex items-center gap-3 text-gray-400 font-medium line-through"><AlertCircle size={18} /> Priority application</li>
                    <li className="flex items-center gap-3 text-gray-400 font-medium line-through"><AlertCircle size={18} /> Pro badge on profile</li>
                  </ul>
                  <button disabled={user?.plan === 'free'} className="w-full py-4 bg-gray-100 text-gray-400 font-black rounded-2xl cursor-not-allowed">
                    {user?.plan === 'free' ? 'Active' : 'Select Plan'}
                  </button>
                </div>

                {/* Pro Plan */}
                <div className={`bg-white p-10 rounded-[3rem] border-2 transition-all flex flex-col relative overflow-hidden ${user?.plan === 'pro' ? 'border-orange-600 shadow-xl shadow-orange-100' : 'border-gray-100'}`}>
                  <div className="absolute top-0 right-0 bg-orange-600 text-white px-6 py-2 font-black text-[10px] uppercase tracking-widest rounded-bl-2xl">Recommended</div>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1">Pro Worker</h3>
                      <p className="text-orange-600 font-bold uppercase tracking-widest text-xs">Best Value</p>
                    </div>
                    {user?.plan === 'pro' && <span className="px-4 py-1 bg-orange-600 text-white font-black text-[10px] rounded-full uppercase tracking-widest">Current</span>}
                  </div>
                  <div className="text-5xl font-black text-gray-900 mb-8">15 <span className="text-xl">TND/mo</span></div>
                  <ul className="space-y-4 mb-10 flex-1">
                    <li className="flex items-center gap-3 text-gray-900 font-bold"><CheckCircle2 size={18} className="text-orange-600" /> 2x Profile visibility</li>
                    <li className="flex items-center gap-3 text-gray-900 font-bold"><CheckCircle2 size={18} className="text-orange-600" /> Priority application status</li>
                    <li className="flex items-center gap-3 text-gray-900 font-bold"><CheckCircle2 size={18} className="text-orange-600" /> Exclusive Pro badge</li>
                    <li className="flex items-center gap-3 text-gray-900 font-bold"><CheckCircle2 size={18} className="text-orange-600" /> Lower platform fees</li>
                  </ul>
                  <button className="w-full py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200">
                    Upgrade Now
                  </button>
                </div>
              </div>

              <div className="bg-orange-50 p-10 rounded-[3rem] border border-orange-100 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white shrink-0 shadow-xl shadow-orange-200">
                  <DollarSign size={40} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-gray-900 mb-2">Fee Friendly Platform</h4>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    We believe in fair pay. Our platform fee is only <span className="font-black text-orange-600">5 TND</span> per job for basic users, and <span className="font-black text-orange-600">Free</span> for Pro members. No hidden costs.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div 
              key="profile" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-10"
            >
              <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
                <div className="relative">
                  <div className="w-40 h-40 bg-orange-100 rounded-[2.5rem] flex items-center justify-center text-orange-600 border-4 border-white shadow-xl">
                    <User size={64} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 border-4 border-white rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <CheckCircle2 size={24} />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h2 className="text-4xl font-black text-gray-900">{user?.name}</h2>
                    <span className="px-4 py-1 bg-orange-50 text-orange-600 font-black text-xs rounded-full uppercase tracking-widest">Verified Worker</span>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500 font-medium mb-8">
                    <div className="flex items-center gap-2"><MapPin size={18} className="text-orange-600" /> Tunis, Tunisia</div>
                    <div className="flex items-center gap-2"><Clock size={18} className="text-orange-600" /> Joined {new Date(user?.createdAt || '').toLocaleDateString()}</div>
                    <div className="flex items-center gap-2"><Star size={18} className="text-orange-600" /> {user?.rating} Rating</div>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-5 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm">Masonry</span>
                    <span className="px-5 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm">Plumbing</span>
                    <span className="px-5 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm">Electrical</span>
                  </div>
                </div>
                <button className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all">
                  Edit Profile
                </button>
              </div>

              <section>
                <h3 className="text-2xl font-black text-gray-900 mb-8">{t.reviews}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                              <User size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">Company User</p>
                              <p className="text-xs text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-orange-600">
                            <Star size={16} fill="currentColor" />
                            <span className="font-black">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed italic">"{review.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-white p-12 rounded-[2.5rem] text-center border border-gray-100">
                      <p className="text-gray-400 font-bold">No reviews yet</p>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function JobCard({ job, onApply }: { key?: string; job: Job; onApply: () => void }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-orange-600 transition-all group flex flex-col h-full">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all">
            <Briefcase size={28} />
          </div>
          <div>
            <h4 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">{job.title}</h4>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{job.category}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-orange-600">{job.wage} <span className="text-xs">TND</span></p>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Daily Pay</p>
        </div>
      </div>

      <div className="space-y-4 mb-8 flex-1">
        <div className="flex items-center gap-3 text-gray-600 font-medium">
          <MapPin size={18} className="text-orange-600" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600 font-medium">
          <Calendar size={18} className="text-orange-600" />
          <span>{job.duration} Days</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600 font-medium">
          <Users size={18} className="text-orange-600" />
          <span>{job.hired}/{job.needed} Workers</span>
        </div>
      </div>

      <button 
        onClick={onApply}
        className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200"
      >
        Apply Now
      </button>
    </div>
  );
}

function ApplicationRow({ application, jobs }: { key?: string; application: Application; jobs: Job[] }) {
  const job = jobs.find(j => j.id === application.jobId);
  const statusColors = {
    pending: 'bg-blue-50 text-blue-600 border-blue-100',
    accepted: 'bg-green-50 text-green-600 border-green-100',
    rejected: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-orange-600 transition-all">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
          <Briefcase size={24} />
        </div>
        <div>
          <h4 className="text-lg font-black text-gray-900">{job?.title || 'Unknown Job'}</h4>
          <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mt-1">
            <span className="flex items-center gap-1"><MapPin size={14} /> {job?.location}</span>
            <span className="flex items-center gap-1"><DollarSign size={14} /> {job?.wage} TND</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between md:justify-end gap-6">
        <div className="text-right hidden md:block">
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">Applied On</p>
          <p className="font-bold text-gray-900">{new Date(application.appliedAt).toLocaleDateString()}</p>
        </div>
        <div className={`px-5 py-2 rounded-xl font-black text-xs uppercase tracking-widest border ${statusColors[application.status]}`}>
          {application.status}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Phone, ArrowRight, ArrowLeft, Briefcase, Users, ShieldCheck, CheckCircle2, Globe, Zap } from 'lucide-react';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { userService } from '../services/userService';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';
import { Role, UserProfile } from '../types';
import ProgressBar from './ProgressBar';
import { cn } from '../lib/utils';

interface AuthProps {
  setView: (view: 'landing' | 'auth' | 'dashboard') => void;
  showToast: (msg: string) => void;
}

export default function Auth({ setView, showToast }: AuthProps) {
  const { language, setUser } = useAppStore();
  const t = translations[language];

  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Form/Google, 3: Complete Profile
  const [role, setRole] = useState<Role>('worker');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const totalSteps = isLogin ? 1 : 3;
  const currentStep = isLogin ? 1 : step;

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const profile = await userService.getUser(user.uid);
      if (profile) {
        setUser(profile);
        setView('dashboard');
        showToast('Welcome back!');
      } else {
        setName(user.displayName || '');
        setEmail(user.email || '');
        setStep(3);
      }
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);

    try {
      const isAdmin = (auth.currentUser.email === 'hamahama@gmail.com');
      const newProfile: UserProfile = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email || email,
        name: name || auth.currentUser.displayName || 'User',
        phone,
        role: isAdmin ? 'admin' : role,
        rating: 5.0,
        reviewCount: 0,
        balance: 0,
        plan: 'free',
        isVerified: isAdmin,
        createdAt: new Date().toISOString(),
      };

      await userService.createUser(newProfile);
      setUser(newProfile);
      setView('dashboard');
      showToast('Profile completed successfully!');
    } catch (error: any) {
      console.error(error);
      showToast(error.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full glass p-10 md:p-16 rounded-[4rem] shadow-3xl shadow-gray-200/50 relative"
      >
        {!isLogin && <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />}

        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-linear-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-200"
          >
            <ShieldCheck size={40} className="text-white" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            {isLogin ? t.welcomeBack : (step === 1 ? "Choose Your Role" : (step === 2 ? "Account Details" : "Final Step"))}
          </h2>
          <p className="text-gray-500 text-lg font-medium">
            {isLogin ? 'Enter your credentials to continue' : 'Join the construction revolution in Tunisia'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isLogin && step === 1 ? (
            <motion.div 
              key="role-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6">
                <motion.div 
                  whileHover={{ y: -5 }}
                  onClick={() => setRole('worker')}
                  className={cn(
                    "p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center gap-6 group",
                    role === 'worker' ? 'border-orange-600 bg-orange-50/50 shadow-xl shadow-orange-100' : 'border-gray-100 hover:border-gray-200 bg-white'
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                    role === 'worker' ? 'bg-orange-600 text-white rotate-6' : 'bg-gray-100 text-gray-400'
                  )}>
                    <Users size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 text-2xl mb-1">{t.imWorker}</h3>
                    <p className="text-gray-500 font-medium">Find daily jobs & get paid instantly</p>
                  </div>
                  {role === 'worker' && <CheckCircle2 className="text-orange-600" size={28} />}
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  onClick={() => setRole('company')}
                  className={cn(
                    "p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center gap-6 group",
                    role === 'company' ? 'border-orange-600 bg-orange-50/50 shadow-xl shadow-orange-100' : 'border-gray-100 hover:border-gray-200 bg-white'
                  )}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                    role === 'company' ? 'bg-orange-600 text-white -rotate-6' : 'bg-gray-100 text-gray-400'
                  )}>
                    <Briefcase size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 text-2xl mb-1">{t.imCompany}</h3>
                    <p className="text-gray-500 font-medium">Hire vetted workers for your sites</p>
                  </div>
                  {role === 'company' && <CheckCircle2 className="text-orange-600" size={28} />}
                </motion.div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                className="w-full py-6 btn-gradient text-white font-black text-xl rounded-3xl mt-8 flex items-center justify-center gap-3"
              >
                Continue to Account
                <ArrowRight size={24} />
              </motion.button>
            </motion.div>
          ) : step === 3 ? (
            <motion.form 
              key="complete-profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleCompleteProfile} 
              className="space-y-6"
            >
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={24} />
                <input 
                  type="text" 
                  placeholder={t.fullName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-3xl outline-none transition-all font-bold text-lg"
                />
              </div>

              <div className="relative group">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={24} />
                <input 
                  type="tel" 
                  placeholder="Phone Number (e.g. 22 123 456)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-3xl outline-none transition-all font-bold text-lg"
                />
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-6 btn-gradient text-white font-black text-xl rounded-3xl mt-8 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Finalizing...' : 'Complete Registration'}
                {!loading && <CheckCircle2 size={24} />}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div 
              key="auth-options"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-5 bg-white border-2 border-gray-100 text-gray-700 font-black text-lg rounded-3xl hover:border-orange-600 transition-all flex items-center justify-center gap-4 shadow-xl shadow-gray-200/50"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
              </motion.button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-6 bg-white text-gray-400 font-black uppercase tracking-widest text-xs">Or use email</span>
                </div>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  if (isLogin) {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const profile = await userService.getUser(userCredential.user.uid);
                    if (profile) {
                      setUser(profile);
                      setView('dashboard');
                      showToast('Welcome back!');
                    } else {
                      showToast('Profile not found. Please contact support.');
                    }
                  } else {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    await updateProfile(userCredential.user, { displayName: name });
                    setStep(3);
                  }
                } catch (error: any) {
                  showToast(error.message || 'Auth failed');
                } finally {
                  setLoading(false);
                }
              }} className="space-y-6">
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={24} />
                  <input 
                    type="email" 
                    placeholder={t.phoneOrEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-3xl outline-none transition-all font-bold text-lg"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={24} />
                  <input 
                    type="password" 
                    placeholder={t.password}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-3xl outline-none transition-all font-bold text-lg"
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 btn-gradient text-white font-black text-xl rounded-3xl mt-4 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : (isLogin ? t.login : t.signup)}
                  {!loading && <ArrowRight size={24} />}
                </motion.button>
              </form>

              {!isLogin && (
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 text-gray-400 font-black text-sm hover:text-gray-600 transition-colors uppercase tracking-widest"
                >
                  <ArrowLeft size={16} />
                  Change Role
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 pt-10 border-t-2 border-gray-100 text-center">
          <p className="text-gray-500 font-bold text-lg">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setStep(1); }}
              className="ml-2 text-orange-600 font-black hover:underline"
            >
              {isLogin ? t.signup : t.login}
            </button>
          </p>
          <button 
            onClick={() => setView('landing')}
            className="mt-8 text-gray-400 font-black text-sm hover:text-gray-600 transition-colors uppercase tracking-widest"
          >
            {t.backHome}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Users, CheckCircle, ArrowRight, Shield, Clock, MapPin, Star, Globe, Zap } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { translations } from '../lib/i18n';
import ThreeHero from './ThreeHero';
import { cn } from '../lib/utils';

interface LandingProps {
  setView: (view: 'landing' | 'auth' | 'dashboard') => void;
}

export default function Landing({ setView }: LandingProps) {
  const { language } = useAppStore();
  const t = translations[language];

  const stats = [
    { label: t.workers, value: '15k+', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: t.companies, value: '600+', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t.jobsFilled, value: '100k+', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const features = [
    { title: 'Secure D17 Payments', desc: 'Get paid instantly via Tunisia Post D17 system.', icon: Shield, gradient: 'from-orange-500 to-orange-600' },
    { title: 'Vetted Workers', desc: 'Every worker is verified and rated by companies.', icon: Users, gradient: 'from-blue-500 to-blue-600' },
    { title: 'Real-time Matching', desc: 'Find work or workers in minutes, not days.', icon: Clock, gradient: 'from-green-500 to-green-600' },
    { title: 'Location Based', desc: 'Find jobs exactly where you are in Tunisia.', icon: MapPin, gradient: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="bg-white selection:bg-orange-100 selection:text-orange-600">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden">
        <ThreeHero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 border border-orange-100/50">
                <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
                <span className="text-sm font-bold text-orange-700 uppercase tracking-widest">{t.tagline}</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
                {language === 'en' ? (
                  <>
                    <span className="text-gradient">{t.findWork}</span> <br />
                    <span className="text-gray-900">{t.hireInstantly}</span>
                  </>
                ) : (
                  <>
                    <span className="text-gradient">{t.findWork}</span> <br />
                    <span className="text-gray-900">{t.hireInstantly}</span>
                  </>
                )}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                {t.workerDesc}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('auth')}
                  className="w-full sm:w-auto px-12 py-6 btn-gradient text-white font-black text-xl rounded-3xl flex items-center justify-center gap-3 group"
                >
                  {t.imWorker}
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('auth')}
                  className="w-full sm:w-auto px-12 py-6 bg-white text-gray-900 font-black text-xl rounded-3xl border-2 border-gray-100 hover:border-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200/50"
                >
                  {t.imCompany}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-1/4 left-10 hidden xl:block">
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="glass p-4 rounded-3xl flex items-center gap-4 border-orange-100"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
              <Star fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">4.9/5 Rating</p>
              <p className="text-xs text-gray-500 font-bold">Trust by 10k+ users</p>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-1/4 right-10 hidden xl:block">
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="glass p-4 rounded-3xl flex items-center gap-4 border-blue-100"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Zap fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">Instant Match</p>
              <p className="text-xs text-gray-500 font-bold">Average 15 mins</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-10 rounded-[2.5rem] flex flex-col items-center text-center group card-hover"
              >
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500", stat.bg, stat.color)}>
                  <stat.icon size={40} />
                </div>
                <p className="text-5xl font-black text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-500 font-black uppercase tracking-widest text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Why Choose {t.appName}?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-xl font-medium">We're building the future of construction work in Tunisia, making it safer and more efficient for everyone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-dark p-10 rounded-[2.5rem] group hover:bg-white/10 transition-all duration-500"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-linear-to-br shadow-lg", feature.gradient)}>
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-orange-600 to-orange-700 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-3xl shadow-orange-600/20">
             <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/2" />
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-black rounded-full blur-[150px] opacity-20 -translate-x-1/2 translate-y-1/2" />
             
             <div className="relative z-10">
               <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">Ready to start building?</h2>
               <p className="text-white/80 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">Join thousands of workers and companies already using Battala to grow their business.</p>
               <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setView('auth')}
                className="px-16 py-7 bg-white text-orange-600 font-black text-2xl rounded-3xl hover:shadow-2xl transition-all"
               >
                 Get Started Now
               </motion.button>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                <Briefcase size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900">{t.appName}</span>
            </div>
            
            <div className="flex items-center gap-8 text-gray-500 font-black uppercase tracking-widest text-xs">
              <a href="#" className="hover:text-orange-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-orange-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-orange-600 transition-colors">Contact</a>
            </div>

            <p className="text-gray-400 font-bold">© 2026 {t.appName}. Made for Tunisia 🇹🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

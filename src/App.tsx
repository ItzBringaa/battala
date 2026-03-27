/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { userService } from './services/userService';
import { jobService } from './services/jobService';
import { applicationService } from './services/applicationService';
import { reviewService } from './services/reviewService';
import { paymentService } from './services/paymentService';
import { useAppStore } from './store/useAppStore';
import { translations } from './lib/i18n';

// Components
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Auth from './components/Auth';
import WorkerDashboard from './components/WorkerDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';

export default function App() {
  const { 
    user, 
    setUser, 
    role, 
    language, 
    setJobs, 
    setApplications, 
    setPayments,
    setReviews
  } = useAppStore();
  
  const [view, setView] = React.useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [toast, setToast] = React.useState<string | null>(null);

  const t = translations[language];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await userService.getUser(firebaseUser.uid);
        if (profile) {
          setUser(profile);
          setView('dashboard');
        } else {
          // User exists in Auth but not in Firestore (shouldn't happen with proper signup)
          setView('auth');
        }
      } else {
        setUser(null);
        setView('landing');
      }
    });

    return () => unsubscribeAuth();
  }, [setUser]);

  useEffect(() => {
    if (!user) return;

    // Real-time subscriptions
    const unsubJobs = jobService.subscribeToJobs(setJobs);
    
    let unsubApps;
    if (user.role === 'worker') {
      unsubApps = applicationService.subscribeToWorkerApplications(user.uid, setApplications);
    } else {
      unsubApps = jobService.subscribeToCompanyJobs(user.uid, (jobs) => {
        setJobs(jobs);
        // For each job, we might want to subscribe to its applications, 
        // but for simplicity in this demo, we'll fetch them in the component or use a broader query.
      });
    }

    const unsubReviews = reviewService.subscribeToUserReviews(user.uid, setReviews);
    
    let unsubPayments;
    if (user.role === 'worker') {
      unsubPayments = paymentService.subscribeToWorkerPayments(user.uid, setPayments);
    } else {
      unsubPayments = paymentService.subscribeToCompanyPayments(user.uid, setPayments);
    }

    return () => {
      unsubJobs();
      unsubApps?.();
      unsubReviews();
      unsubPayments();
    };
  }, [user, setJobs, setApplications, setReviews, setPayments]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className={`min-h-screen ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar setView={setView} showToast={showToast} />
      
      <main>
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Landing setView={setView} />
            </motion.div>
          )}
          {view === 'auth' && (
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Auth setView={setView} showToast={showToast} />
            </motion.div>
          )}
          {view === 'dashboard' && user && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {user.role === 'admin' ? (
                <AdminDashboard showToast={showToast} />
              ) : user.role === 'worker' ? (
                <WorkerDashboard showToast={showToast} />
              ) : (
                <CompanyDashboard showToast={showToast} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toast && <Toast message={toast} />}
      </AnimatePresence>
    </div>
  );
}

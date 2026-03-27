import { create } from 'zustand';
import { UserProfile, Role, Job, Application, Review, Payment, Notification } from '../types';

interface AppState {
  user: UserProfile | null;
  role: Role;
  jobs: Job[];
  applications: Application[];
  reviews: Review[];
  payments: Payment[];
  notifications: Notification[];
  language: 'en' | 'ar';
  
  setUser: (user: UserProfile | null) => void;
  setRole: (role: Role) => void;
  setJobs: (jobs: Job[]) => void;
  setApplications: (apps: Application[]) => void;
  setReviews: (reviews: Review[]) => void;
  setPayments: (payments: Payment[]) => void;
  setNotifications: (notifs: Notification[]) => void;
  toggleLanguage: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  role: 'worker',
  jobs: [],
  applications: [],
  reviews: [],
  payments: [],
  notifications: [],
  language: 'en',

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setJobs: (jobs) => set({ jobs }),
  setApplications: (applications) => set({ applications }),
  setReviews: (reviews) => set({ reviews }),
  setPayments: (payments) => set({ payments }),
  setNotifications: (notifications) => set({ notifications }),
  toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'ar' : 'en' })),
}));

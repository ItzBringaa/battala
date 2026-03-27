export type Role = 'worker' | 'company' | 'admin';
export type PlanType = 'free' | 'pro' | 'premium';

export interface UserProfile {
  uid: string;
  name: string;
  email?: string;
  role: Role;
  phone: string;
  companyName?: string;
  rating: number;
  reviewCount: number;
  balance: number;
  plan: PlanType;
  isVerified: boolean;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  category: string;
  wage: number;
  needed: number;
  hired: number;
  duration: number;
  location: string;
  desc: string;
  status: 'open' | 'full' | 'completed';
  postedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  appliedAt: string;
}

export interface Review {
  id: string;
  fromId: string;
  toId: string;
  jobId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  jobId: string;
  workerId: string;
  companyId: string;
  amount: number;
  workerFee: number;
  companyFee: number;
  netWorker: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  read: boolean;
}

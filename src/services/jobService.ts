import { collection, addDoc, updateDoc, doc, query, where, orderBy, onSnapshot, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job } from '../types';

export const jobService = {
  async createJob(job: Omit<Job, 'id' | 'postedAt'>) {
    const docRef = await addDoc(collection(db, 'jobs'), {
      ...job,
      postedAt: serverTimestamp(),
      hired: 0,
      status: 'open'
    });
    return docRef.id;
  },

  async updateJob(jobId: string, data: Partial<Job>) {
    const docRef = doc(db, 'jobs', jobId);
    await updateDoc(docRef, data);
  },

  async deleteJob(jobId: string) {
    const docRef = doc(db, 'jobs', jobId);
    await deleteDoc(docRef);
  },

  subscribeToJobs(callback: (jobs: Job[]) => void) {
    const q = query(
      collection(db, 'jobs'),
      where('status', 'in', ['open', 'full']),
      orderBy('postedAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      callback(jobs);
    });
  },

  subscribeToCompanyJobs(companyId: string, callback: (jobs: Job[]) => void) {
    const q = query(
      collection(db, 'jobs'),
      where('companyId', '==', companyId),
      orderBy('postedAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      callback(jobs);
    });
  }
};

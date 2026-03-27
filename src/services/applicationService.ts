import { collection, addDoc, updateDoc, doc, query, where, orderBy, onSnapshot, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Application } from '../types';

export const applicationService = {
  async applyToJob(application: Omit<Application, 'id' | 'appliedAt'>) {
    const docRef = await addDoc(collection(db, 'applications'), {
      ...application,
      appliedAt: serverTimestamp(),
      status: 'pending'
    });
    return docRef.id;
  },

  async updateApplicationStatus(appId: string, status: 'accepted' | 'rejected' | 'cancelled') {
    const docRef = doc(db, 'applications', appId);
    await updateDoc(docRef, { status });
  },

  subscribeToWorkerApplications(workerId: string, callback: (applications: Application[]) => void) {
    const q = query(
      collection(db, 'applications'),
      where('workerId', '==', workerId),
      orderBy('appliedAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
      callback(apps);
    });
  },

  subscribeToJobApplications(jobId: string, callback: (applications: Application[]) => void) {
    const q = query(
      collection(db, 'applications'),
      where('jobId', '==', jobId),
      orderBy('appliedAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
      callback(apps);
    });
  }
};

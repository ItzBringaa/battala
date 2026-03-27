import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Payment } from '../types';

export const paymentService = {
  async createPayment(payment: Omit<Payment, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'payments'), {
      ...payment,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  subscribeToWorkerPayments(workerId: string, callback: (payments: Payment[]) => void) {
    const q = query(
      collection(db, 'payments'),
      where('workerId', '==', workerId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
      callback(payments);
    });
  },

  subscribeToCompanyPayments(companyId: string, callback: (payments: Payment[]) => void) {
    const q = query(
      collection(db, 'payments'),
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
      callback(payments);
    });
  }
};

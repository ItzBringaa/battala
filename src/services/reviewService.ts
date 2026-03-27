import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Review } from '../types';

export const reviewService = {
  async createReview(review: Omit<Review, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...review,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  subscribeToUserReviews(userId: string, callback: (reviews: Review[]) => void) {
    const q = query(
      collection(db, 'reviews'),
      where('toId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      callback(reviews);
    });
  }
};

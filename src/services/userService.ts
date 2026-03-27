import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';

export const userService = {
  async getUser(uid: string) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  },

  async createUser(profile: UserProfile) {
    await setDoc(doc(db, 'users', profile.uid), profile);
  },

  async updateUser(uid: string, data: Partial<UserProfile>) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data);
  },

  async getAllUsers() {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
  },

  subscribeToUser(uid: string, callback: (user: UserProfile | null) => void) {
    return onSnapshot(doc(db, 'users', uid), (doc) => {
      if (doc.exists()) {
        callback(doc.data() as UserProfile);
      } else {
        callback(null);
      }
    });
  }
};

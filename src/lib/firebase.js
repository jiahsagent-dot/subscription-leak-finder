import { initializeApp } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signOut, onAuthStateChanged, updateProfile,
} from 'firebase/auth';
import {
  getFirestore, collection, doc, addDoc, setDoc, getDoc,
  getDocs, updateDoc, deleteDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, enableIndexedDbPersistence,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const gp      = new GoogleAuthProvider();
gp.setCustomParameters({ prompt: 'select_account' });

enableIndexedDbPersistence(db).catch(() => {});

// ─── Auth ──────────────────────────────────────────────────────────────────
export const loginEmail    = (e, p) => signInWithEmailAndPassword(auth, e, p);
export const loginGoogle   = ()     => signInWithPopup(auth, gp);
export const logout        = ()     => signOut(auth);
export const onAuthChange  = (cb)   => onAuthStateChanged(auth, cb);

export const registerEmail = async (email, password, name) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid: cred.user.uid, email, name, plan: 'free', createdAt: serverTimestamp(),
  });
  return cred;
};

// ─── Subscriptions ─────────────────────────────────────────────────────────
export const addSubscription = (userId, data) =>
  addDoc(collection(db, 'subscriptions'), {
    ...data, userId, createdAt: serverTimestamp(), lastUsedAt: serverTimestamp(),
  });

export const updateSubscription = (id, data) =>
  updateDoc(doc(db, 'subscriptions', id), { ...data, updatedAt: serverTimestamp() });

export const deleteSubscription = (id) => deleteDoc(doc(db, 'subscriptions', id));

export const logUsage = (id) =>
  updateDoc(doc(db, 'subscriptions', id), { lastUsedAt: serverTimestamp() });

export const getUserSubscriptions = (userId, cb) =>
  onSnapshot(
    query(collection(db, 'subscriptions'), where('userId', '==', userId), orderBy('createdAt', 'desc')),
    cb
  );

// ─── User plan ─────────────────────────────────────────────────────────────
export const getUserProfile = (uid) => getDoc(doc(db, 'users', uid));
export const upgradePlan    = (uid) =>
  updateDoc(doc(db, 'users', uid), { plan: 'premium', upgradedAt: serverTimestamp() });

export { serverTimestamp, doc, updateDoc };

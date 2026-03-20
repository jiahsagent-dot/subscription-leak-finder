/**
 * firebase.js
 * Exports real Firebase helpers when config is present.
 * Falls back to demo stubs (localStorage) when VITE_FIREBASE_API_KEY is missing.
 */

import { initializeApp }  from 'firebase/app';
import {
  getAuth, GoogleAuthProvider,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signOut, onAuthStateChanged, updateProfile,
} from 'firebase/auth';
import {
  getFirestore, collection, doc, addDoc, setDoc, getDoc,
  updateDoc, deleteDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, enableIndexedDbPersistence,
} from 'firebase/firestore';
import {
  DEMO_USER_OBJ, DEMO_PROFILE_OBJ,
  addDemoSub, updateDemoSub, deleteDemoSub, logDemoUsage,
  getDemoSubs, demoLogout,
} from './demoStorage';

// ─── Demo mode detection ──────────────────────────────────────────────────────
export const isDemoMode = !import.meta.env.VITE_FIREBASE_API_KEY;

// ─── Firebase init (only when config is present) ──────────────────────────────
let _auth = null;
let _db   = null;
let _gp   = null;

if (!isDemoMode) {
  try {
    const app = initializeApp({
      apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    });
    _auth = getAuth(app);
    _db   = getFirestore(app);
    _gp   = new GoogleAuthProvider();
    _gp.setCustomParameters({ prompt: 'select_account' });
    enableIndexedDbPersistence(_db).catch(() => {});
  } catch (e) {
    console.warn('[firebase] Init failed — running in demo mode:', e.message);
  }
}

export const auth = _auth;
export const db   = _db;

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginEmail = (e, p) =>
  isDemoMode
    ? Promise.resolve({ user: DEMO_USER_OBJ })
    : signInWithEmailAndPassword(_auth, e, p);

export const loginGoogle = () =>
  isDemoMode
    ? Promise.resolve({ user: DEMO_USER_OBJ })
    : signInWithPopup(_auth, _gp);

export const logout = () =>
  isDemoMode ? Promise.resolve() : signOut(_auth);

export const onAuthChange = (cb) => {
  if (isDemoMode) {
    // Immediately call with demo user, return no-op unsub
    setTimeout(() => cb(DEMO_USER_OBJ), 0);
    return () => {};
  }
  return onAuthStateChanged(_auth, cb);
};

export const registerEmail = async (email, password, name) => {
  if (isDemoMode) return { user: DEMO_USER_OBJ };
  const cred = await createUserWithEmailAndPassword(_auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(_db, 'users', cred.user.uid), {
    uid: cred.user.uid, email, name, plan: 'free', createdAt: serverTimestamp(),
  });
  return cred;
};

// ─── User profile ─────────────────────────────────────────────────────────────
export const getUserProfile = (uid) => {
  if (isDemoMode) return Promise.resolve({ exists: () => true, data: () => DEMO_PROFILE_OBJ });
  return getDoc(doc(_db, 'users', uid));
};

export const upgradePlan = (uid) => {
  if (isDemoMode) return Promise.resolve();
  return updateDoc(doc(_db, 'users', uid), { plan: 'premium', upgradedAt: serverTimestamp() });
};

// ─── Subscriptions ────────────────────────────────────────────────────────────
export const addSubscription = (userId, data) => {
  if (isDemoMode) { addDemoSub(data); return Promise.resolve(); }
  return addDoc(collection(_db, 'subscriptions'), {
    ...data, userId, createdAt: serverTimestamp(), lastUsedAt: serverTimestamp(),
  });
};

export const updateSubscription = (id, data) => {
  if (isDemoMode) { updateDemoSub(id, data); return Promise.resolve(); }
  return updateDoc(doc(_db, 'subscriptions', id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteSubscription = (id) => {
  if (isDemoMode) { deleteDemoSub(id); return Promise.resolve(); }
  return deleteDoc(doc(_db, 'subscriptions', id));
};

export const logUsage = (id) => {
  if (isDemoMode) { logDemoUsage(id); return Promise.resolve(); }
  return updateDoc(doc(_db, 'subscriptions', id), { lastUsedAt: serverTimestamp() });
};

export const getUserSubscriptions = (userId, cb) => {
  if (isDemoMode) {
    // Call immediately with current data, then re-call on storage events
    const notify = () => {
      const subs = getDemoSubs();
      cb({ docs: subs.map((s) => ({ id: s.id, data: () => s })) });
    };
    notify();
    window.addEventListener('demo-subs-updated', notify);
    return () => window.removeEventListener('demo-subs-updated', notify);
  }
  return onSnapshot(
    query(collection(_db, 'subscriptions'), where('userId', '==', userId), orderBy('createdAt', 'desc')),
    cb
  );
};

export { serverTimestamp, doc, updateDoc };

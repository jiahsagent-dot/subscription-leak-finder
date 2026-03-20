/**
 * demoStorage.js
 * localStorage-backed data layer for demo/offline mode.
 * Mirrors the Firebase helper API so hooks work identically in both modes.
 */

const DEMO_USER = {
  uid:         'demo-user',
  email:       'demo@subleak.app',
  displayName: 'Demo User',
};

const DEMO_PROFILE = { uid: 'demo-user', name: 'Demo User', email: 'demo@subleak.app', plan: 'premium' };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const read  = (key, def = []) => { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } };
const write = (key, val)      => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };
const uid   = ()              => `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ─── Subscriptions ────────────────────────────────────────────────────────────
export const getDemoSubs = ()       => read('demo_subs', []);
const saveDemoSubs       = (subs)   => write('demo_subs', subs);

export const addDemoSub = (data) => {
  const subs = getDemoSubs();
  const sub  = { ...data, id: uid(), userId: 'demo-user', createdAt: new Date().toISOString(), lastUsedAt: new Date().toISOString() };
  subs.unshift(sub);
  saveDemoSubs(subs);
  window.dispatchEvent(new Event('demo-subs-updated'));
  return sub;
};

export const updateDemoSub = (id, data) => {
  saveDemoSubs(getDemoSubs().map((s) => (s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s)));
  window.dispatchEvent(new Event('demo-subs-updated'));
};

export const deleteDemoSub = (id) => {
  saveDemoSubs(getDemoSubs().filter((s) => s.id !== id));
  window.dispatchEvent(new Event('demo-subs-updated'));
};

export const logDemoUsage = (id) => updateDemoSub(id, { lastUsedAt: new Date().toISOString() });

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const DEMO_USER_OBJ    = DEMO_USER;
export const DEMO_PROFILE_OBJ = DEMO_PROFILE;

export const demoLogin    = () => Promise.resolve({ user: DEMO_USER });
export const demoLogout   = () => Promise.resolve();
export const demoRegister = () => Promise.resolve({ user: DEMO_USER });

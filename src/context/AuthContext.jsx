import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, getUserProfile, isDemoMode } from '@/lib/firebase';
import { DEMO_USER_OBJ, DEMO_PROFILE_OBJ } from '@/lib/demoStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(isDemoMode ? DEMO_USER_OBJ : null);
  const [profile, setProfile] = useState(isDemoMode ? DEMO_PROFILE_OBJ : null);
  const [loading, setLoading] = useState(!isDemoMode); // demo mode needs no async load

  useEffect(() => {
    if (isDemoMode) return; // already set above

    return onAuthChange(async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        try {
          const snap = await getUserProfile(fbUser.uid);
          setProfile(snap.exists() ? snap.data() : { plan: 'free' });
        } catch { setProfile({ plan: 'free' }); }
      } else { setProfile(null); }
      setLoading(false);
    });
  }, []);

  // In demo mode, premium is always unlocked so users see all features
  const isPremium = isDemoMode || profile?.plan === 'premium';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isPremium, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

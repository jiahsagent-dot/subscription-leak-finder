import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, getUserProfile } from '@/lib/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const isPremium = profile?.plan === 'premium';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isPremium }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

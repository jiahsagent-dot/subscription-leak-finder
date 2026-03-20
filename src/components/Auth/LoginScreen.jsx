import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, TrendingDown } from 'lucide-react';
import { loginEmail, loginGoogle } from '@/lib/firebase';

const LoginScreen = () => {
  const nav = useNavigate();
  const [email,    setEmail]    = useState('');
  const [pass,     setPass]     = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleEmail = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await loginEmail(email, pass); nav('/', { replace: true }); }
    catch (err) { setError(friendly(err.code)); }
    finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(''); setLoading(true);
    try { await loginGoogle(); nav('/', { replace: true }); }
    catch (err) { if (err.code !== 'auth/popup-closed-by-user') setError(friendly(err.code)); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-brand-900 flex flex-col">
      <div className="flex flex-col items-center justify-center flex-1 px-6 pb-4 pt-14">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <TrendingDown size={26} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">SubLeak Finder</h1>
        </div>
        <p className="text-brand-300 text-sm text-center max-w-xs leading-relaxed">
          Find your $600. Stop paying for subscriptions you forgot about.
        </p>
      </div>

      <div className="bg-white rounded-t-3xl px-6 pt-8 pb-10 shadow-2xl">
        <h2 className="text-xl font-bold text-brand-900 mb-6">Sign in</h2>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">⚠️ {error}</div>
        )}

        <form onSubmit={handleEmail} className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type={showPass ? 'text' : 'password'} placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} required
              className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-brand-900 text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button onClick={handleGoogle} disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          No account? <Link to="/register" className="text-brand-700 font-semibold">Start for free</Link>
        </p>
      </div>
    </div>
  );
};

const friendly = (code) => {
  if (!code) return 'Something went wrong.';
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential'))
    return 'Incorrect email or password.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Try again later.';
  return 'Sign-in failed. Please try again.';
};

export default LoginScreen;

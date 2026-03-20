import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, TrendingDown } from 'lucide-react';
import { registerEmail, loginGoogle } from '@/lib/firebase';

const RegisterScreen = () => {
  const nav = useNavigate();
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (pass.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setError(''); setLoading(true);
    try { await registerEmail(email, pass, name); nav('/', { replace: true }); }
    catch (err) {
      setError(err.code === 'auth/email-already-in-use'
        ? 'This email is already registered. Try signing in.'
        : 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try { await loginGoogle(); nav('/', { replace: true }); }
    catch { setError('Google sign-in failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-brand-900 flex flex-col">
      <div className="flex flex-col items-center pt-12 pb-6 px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
            <TrendingDown size={20} className="text-green-400" />
          </div>
          <h1 className="text-xl font-bold text-white">SubLeak Finder</h1>
        </div>
        <p className="text-brand-300 text-sm text-center">Free to start. No credit card needed.</p>
      </div>

      <div className="bg-white rounded-t-3xl px-6 pt-7 pb-12 flex-1">
        <h2 className="text-xl font-bold text-brand-900 mb-5">Create your account</h2>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">⚠️ {error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          {[
            { icon: User, type: 'text',     value: name,  set: setName,  ph: 'Full name' },
            { icon: Mail, type: 'email',    value: email, set: setEmail, ph: 'Email address' },
            { icon: Lock, type: 'password', value: pass,  set: setPass,  ph: 'Password (min 8 chars)' },
          ].map(({ icon: Icon, type, value, set, ph }) => (
            <div key={ph} className="relative">
              <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={type} placeholder={ph} value={value} onChange={(e) => set(e.target.value)} required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-brand-900 text-white py-3.5 rounded-xl font-semibold text-sm disabled:opacity-60">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button onClick={handleGoogle} disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3.5 rounded-xl text-sm font-medium text-gray-700 disabled:opacity-60">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account? <Link to="/login" className="text-brand-700 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut, User, Zap, ChevronRight, FileText, Shield, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { logout, upgradePlan } from '@/lib/firebase';
import { formatAUD } from '@/utils/subscriptionUtils';
import { useSubscriptions } from '@/hooks/useSubscriptions';

const SettingsPage = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { user, profile, isPremium } = useAuth();
  const { subs, monthlyTotal } = useSubscriptions();

  const handleLogout = async () => {
    await logout();
    nav('/login', { replace: true });
  };

  // Simulate upgrade (real implementation would use Stripe)
  const handleUpgrade = async () => {
    if (confirm('Upgrade to Premium for $4.99/month?\n\n(This is a demo — no payment will be taken)')) {
      await upgradePlan(user.uid);
      alert('✅ Upgraded! Premium features are now unlocked.');
    }
  };

  const name  = profile?.name || user?.displayName || 'User';
  const email = user?.email || '';

  return (
    <div className="pb-4">
      <div className="bg-brand-900 px-4 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-brand-300 text-sm">Account & preferences</p>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-card p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center">
            <User size={24} className="text-brand-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-brand-900 truncate">{name}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPremium ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
            {isPremium ? '⭐ Premium' : 'Free'}
          </span>
        </div>

        {/* Plan */}
        <Section title="Plan">
          {isPremium ? (
            <div className="bg-gradient-to-br from-brand-900 to-brand-700 rounded-2xl p-5 text-white">
              <p className="font-bold text-lg mb-1">⭐ Premium Active</p>
              <p className="text-brand-200 text-sm">Unlimited subscriptions · Waste analysis · Cancellation guides · CSV import</p>
              <p className="text-brand-300 text-xs mt-2">Billed $4.99/month</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-brand-900 to-brand-700 rounded-2xl p-5 text-white">
              <p className="font-bold text-lg mb-1">Free Plan</p>
              <p className="text-brand-200 text-sm mb-1">{subs.length}/5 subscriptions used</p>
              <div className="h-1.5 bg-white/20 rounded-full mb-3">
                <div className="h-full bg-green-400 rounded-full" style={{ width: `${Math.min((subs.length / 5) * 100, 100)}%` }} />
              </div>
              <p className="text-brand-200 text-xs mb-4">Upgrade to track unlimited subscriptions and find all your leaks.</p>
              <button onClick={handleUpgrade}
                className="w-full bg-green-400 text-green-950 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                <Zap size={16} /> Upgrade — $4.99/month
              </button>
              <p className="text-brand-300 text-xs text-center mt-2">Or $34.99/year (save 42%)</p>
            </div>
          )}
        </Section>

        {/* Actions */}
        <Section title="Account">
          <div className="space-y-2">
            <ActionRow icon={FileText} label="Import from Bank CSV" desc="Detect subscriptions from statement"
              onClick={() => nav('/import')} />
            <ActionRow icon={Bell} label="Renewal Reminders" desc="3 days before each renewal"
              onClick={() => alert('Push notifications: configure in your browser settings.')} />
            <ActionRow icon={Shield} label="Privacy & Data"
              desc="Your data is stored securely in Firebase"
              onClick={() => {}} />
          </div>
        </Section>

        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 py-4 rounded-2xl font-semibold text-sm mt-2">
          <LogOut size={18} /> Sign Out
        </button>

        <p className="text-center text-xs text-gray-400 mt-2">Subscription Leak Finder v1.0.0</p>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{title}</p>
    {children}
  </div>
);

const ActionRow = ({ icon: Icon, label, desc, onClick }) => (
  <button onClick={onClick}
    className="w-full bg-white rounded-2xl shadow-card px-4 py-3.5 flex items-center gap-3 text-left hover:shadow-card-hover active:scale-[0.98] transition-all">
    <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
      <Icon size={17} className="text-brand-700" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-brand-900">{label}</p>
      {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
    </div>
    <ChevronRight size={16} className="text-gray-300" />
  </button>
);

export default SettingsPage;

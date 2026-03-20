import { useNavigate } from 'react-router-dom';
import { Lock, Zap } from 'lucide-react';

/**
 * Wrap premium-only content in this component.
 * Shows upgrade prompt when user is on free tier.
 */
const PremiumGate = ({ children, isPremium, feature = 'This feature' }) => {
  const nav = useNavigate();

  if (isPremium) return children;

  return (
    <div className="mx-4 my-6 bg-gradient-to-br from-brand-900 to-brand-700 rounded-2xl p-6 text-white text-center">
      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Lock size={24} />
      </div>
      <h3 className="font-bold text-lg mb-1">Premium Feature</h3>
      <p className="text-brand-200 text-sm mb-5 leading-relaxed">
        {feature} is available on the Premium plan. Unlock unlimited subscriptions, waste analysis, cancellation guides, and CSV import.
      </p>
      <button
        onClick={() => nav('/settings?upgrade=1')}
        className="bg-green-400 text-green-950 font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2 mx-auto active:scale-95 transition-transform"
      >
        <Zap size={16} />
        Upgrade — $4.99/month
      </button>
    </div>
  );
};

export default PremiumGate;

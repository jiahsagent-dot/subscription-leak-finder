import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingDown, BookOpen, Zap, CheckCircle } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { formatAUD } from '@/utils/subscriptionUtils';
import { CATEGORIES, toMonthly } from '@/data/commonSubscriptions';
import PremiumGate from '@/components/Layout/PremiumGate';

const WastePage = () => {
  const nav = useNavigate();
  const { isPremium } = useAuth();
  const { subs, loading, unusedSubs, wasteMonthly } = useSubscriptions();

  if (loading) return <div className="p-4 animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}</div>;

  return (
    <div className="pb-4">
      {/* Hero */}
      <div className={`px-4 pt-14 pb-6 ${unusedSubs.length > 0 ? 'bg-red-600' : 'bg-green-600'}`}>
        <h1 className="text-2xl font-bold text-white mb-1">Waste Calculator</h1>
        <p className="text-white/80 text-sm mb-5">Subscriptions you're paying for but not using.</p>

        <div className="bg-white/20 rounded-2xl p-4 text-center">
          {unusedSubs.length > 0 ? (
            <>
              <p className="text-white/80 text-sm mb-1">You're wasting</p>
              <p className="text-5xl font-bold text-white">{formatAUD(wasteMonthly)}</p>
              <p className="text-white/80 text-sm mt-1">per month · {formatAUD(wasteMonthly * 12)} per year</p>
              <p className="text-white/90 text-sm mt-3 font-medium">{unusedSubs.length} forgotten subscription{unusedSubs.length !== 1 ? 's' : ''}</p>
            </>
          ) : (
            <>
              <CheckCircle size={40} className="text-white mx-auto mb-2" />
              <p className="text-xl font-bold text-white">No waste detected</p>
              <p className="text-white/80 text-sm mt-1">All subscriptions used in last 60 days.</p>
            </>
          )}
        </div>
      </div>

      <PremiumGate isPremium={isPremium} feature="The Waste Calculator">
        <div className="px-4 mt-5 space-y-4">
          {unusedSubs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card p-6 text-center">
              <p className="text-gray-500 text-sm">
                Log your usage with "Used it" on each subscription to track activity.<br />
                Anything unused for 60+ days gets flagged here.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Forgotten Subscriptions</p>
              {unusedSubs.map((sub) => (
                <UnusedCard key={sub.id} sub={sub} onCancel={() => nav('/guides')} />
              ))}

              <div className="bg-brand-900 text-white rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingDown size={20} className="text-green-400" />
                  <div>
                    <p className="font-bold">Cancel these to save</p>
                    <p className="text-brand-200 text-sm">{formatAUD(wasteMonthly * 12)}/year goes back in your pocket</p>
                  </div>
                </div>
                <button onClick={() => nav('/guides')}
                  className="w-full bg-white text-brand-900 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                  <BookOpen size={16} /> View Cancellation Guides
                </button>
              </div>
            </>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

const UnusedCard = ({ sub, onCancel }) => {
  const monthly = toMonthly(sub.amount, sub.frequency);
  const lastUsed = sub.lastUsedAt
    ? (sub.lastUsedAt.toDate ? sub.lastUsedAt.toDate() : new Date(sub.lastUsedAt))
    : null;
  const days = lastUsed ? differenceInDays(new Date(), lastUsed) : null;
  const cat  = CATEGORIES.find((c) => c.value === sub.category);

  return (
    <div className="bg-white rounded-2xl shadow-card border-l-4 border-red-400 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{sub.logo || cat?.icon || '📦'}</span>
          <div>
            <p className="font-semibold text-brand-900 text-sm">{sub.name}</p>
            <p className="text-xs text-gray-400">{days ? `Unused for ${days} days` : 'Never logged usage'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-red-600 text-sm">{formatAUD(monthly)}/mo</p>
          <p className="text-xs text-gray-400">{formatAUD(monthly * 12)}/yr</p>
        </div>
      </div>
      <button onClick={onCancel}
        className="w-full text-sm font-semibold text-red-600 bg-red-50 border border-red-200 py-2.5 rounded-xl flex items-center justify-center gap-2">
        <BookOpen size={14} /> How to cancel
      </button>
    </div>
  );
};

export default WastePage;

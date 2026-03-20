import { useNavigate } from 'react-router-dom';
import { Plus, TrendingDown, Bell, AlertTriangle, ChevronRight, RefreshCw } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { formatAUD } from '@/utils/subscriptionUtils';
import { CATEGORIES } from '@/data/commonSubscriptions';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';

const DashboardPage = () => {
  const nav = useNavigate();
  const { user, profile } = useAuth();
  const { subs, loading, monthlyTotal, annualTotal, unusedSubs, wasteMonthly, renewals30, categoryTotals } = useSubscriptions();

  const name = profile?.name || user?.displayName?.split(' ')[0] || 'there';

  if (loading) return <Skeleton />;

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-brand-900 px-4 pt-14 pb-6">
        <p className="text-brand-300 text-sm">Hey {name} 👋</p>
        <h1 className="text-2xl font-bold text-white mt-0.5 mb-4">Your subscriptions</h1>

        {/* Hero metric */}
        <div className="bg-white/10 rounded-2xl p-4">
          <p className="text-brand-200 text-xs uppercase tracking-wide mb-1">Monthly spend</p>
          <p className="text-4xl font-bold text-white">{formatAUD(monthlyTotal)}</p>
          <p className="text-brand-300 text-sm mt-0.5">{formatAUD(annualTotal)} per year · {subs.length} subscription{subs.length !== 1 ? 's' : ''}</p>

          {wasteMonthly > 0 && (
            <div className="mt-3 bg-red-500/20 rounded-xl px-3 py-2 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-300 shrink-0" />
              <p className="text-red-200 text-sm font-medium">
                You're wasting <strong className="text-white">{formatAUD(wasteMonthly)}/mo</strong> on forgotten subs
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 space-y-5 mt-5">
        {/* Quick actions */}
        <div className="flex gap-3">
          <button
            onClick={() => nav('/subs/add')}
            className="flex-1 bg-brand-900 text-white py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-card active:scale-95 transition-transform"
          >
            <Plus size={18} /> Add Subscription
          </button>
          {unusedSubs.length > 0 && (
            <button
              onClick={() => nav('/waste')}
              className="flex-1 bg-red-50 text-red-600 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border border-red-200"
            >
              <TrendingDown size={18} /> See Waste
            </button>
          )}
        </div>

        {/* Upcoming renewals */}
        {renewals30.length > 0 && (
          <Section title="Upcoming Renewals" action={{ label: 'View all', onClick: () => nav('/subs') }}>
            <div className="space-y-2">
              {renewals30.slice(0, 3).map((sub) => {
                const days = differenceInDays(new Date(sub.renewalDate), new Date());
                return (
                  <div key={sub.id} className="bg-white rounded-xl shadow-card px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-brand-900">{sub.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {days <= 0 ? 'Renews today' : `in ${days} day${days !== 1 ? 's' : ''}`}
                        {' · '}{format(new Date(sub.renewalDate), 'dd MMM')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-brand-900">{formatAUD(sub.amount)}</p>
                      <p className="text-xs text-gray-400">{sub.frequency}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* Category breakdown */}
        {categoryTotals.length > 0 && (
          <Section title="Spend by Category">
            <div className="bg-white rounded-2xl shadow-card p-4">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryTotals} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {categoryTotals.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatAUD(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                {categoryTotals.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                    <span className="text-xs text-gray-600 truncate">{cat.name}</span>
                    <span className="text-xs font-semibold text-brand-900 ml-auto">{formatAUD(cat.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Empty state */}
        {subs.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <TrendingDown size={30} className="text-brand-400" />
            </div>
            <h3 className="font-bold text-brand-900 mb-1">No subscriptions yet</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-5">
              Add your subscriptions to find out how much you're really spending each month.
            </p>
            <button onClick={() => nav('/subs/add')}
              className="bg-brand-900 text-white px-6 py-3 rounded-xl font-semibold text-sm">
              + Add First Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, action, children }) => (
  <div>
    <div className="flex items-center justify-between mb-2.5">
      <h2 className="text-sm font-bold text-brand-900 uppercase tracking-wide">{title}</h2>
      {action && (
        <button onClick={action.onClick} className="text-xs text-brand-600 font-medium flex items-center gap-0.5">
          {action.label} <ChevronRight size={13} />
        </button>
      )}
    </div>
    {children}
  </div>
);

const Skeleton = () => (
  <div className="p-4 space-y-4 animate-pulse">
    <div className="bg-brand-900 rounded-2xl h-44" />
    <div className="h-12 bg-gray-200 rounded-2xl" />
    <div className="h-32 bg-gray-200 rounded-2xl" />
  </div>
);

export default DashboardPage;

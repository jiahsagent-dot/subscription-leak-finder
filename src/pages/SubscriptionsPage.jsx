import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, RefreshCw, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { deleteSubscription, logUsage } from '@/lib/firebase';
import { formatAUD, toMonthly, FREE_TIER_LIMIT } from '@/utils/subscriptionUtils';
import { CATEGORIES } from '@/data/commonSubscriptions';

const SubscriptionsPage = () => {
  const nav = useNavigate();
  const { isPremium } = useAuth();
  const { subs, loading } = useSubscriptions();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const atLimit = !isPremium && subs.length >= FREE_TIER_LIMIT;

  const filtered = subs
    .filter((s) => filter === 'all' || s.category === filter)
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id, name) => {
    if (!confirm(`Remove "${name}"?`)) return;
    await deleteSubscription(id);
  };

  const handleLogUse = async (id) => {
    await logUsage(id);
  };

  if (loading) return <div className="p-4 animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-gray-200 rounded-2xl" />)}</div>;

  return (
    <div className="px-4 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-brand-900">My Subscriptions</h1>
          <p className="text-xs text-gray-400 mt-0.5">{subs.length} tracked{!isPremium ? ` · ${FREE_TIER_LIMIT - subs.length} free slots left` : ''}</p>
        </div>
        <button
          onClick={() => atLimit ? nav('/settings?upgrade=1') : nav('/subs/add')}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-card ${atLimit ? 'bg-gray-200 text-gray-400' : 'bg-brand-900 text-white'}`}
        >
          {atLimit ? <Lock size={18} /> : <Plus size={20} />}
        </button>
      </div>

      {/* Free tier banner */}
      {atLimit && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-start gap-3">
          <Lock size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">Free tier limit reached</p>
            <p className="text-xs text-amber-600 mt-0.5">Upgrade to Premium to track unlimited subscriptions.</p>
          </div>
          <button onClick={() => nav('/settings?upgrade=1')} className="text-xs text-amber-700 font-bold underline shrink-0">Upgrade</button>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text" placeholder="Search subscriptions…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 no-scrollbar">
        {[{ value: 'all', label: 'All', icon: '📋' }, ...CATEGORIES].map((cat) => (
          <button key={cat.value} onClick={() => setFilter(cat.value)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              filter === cat.value ? 'bg-brand-900 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="font-medium text-gray-500">No subscriptions found</p>
          {!search && <button onClick={() => nav('/subs/add')} className="mt-3 text-brand-600 text-sm font-semibold">+ Add one</button>}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub) => (
            <SubscriptionCard key={sub.id} sub={sub} onDelete={() => handleDelete(sub.id, sub.name)} onLogUse={() => handleLogUse(sub.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

const SubscriptionCard = ({ sub, onDelete, onLogUse }) => {
  const monthly = toMonthly(sub.amount, sub.frequency);
  const cat     = CATEGORIES.find((c) => c.value === sub.category);
  const isUnused = (() => {
    if (!sub.lastUsedAt) return true;
    const d = sub.lastUsedAt.toDate ? sub.lastUsedAt.toDate() : new Date(sub.lastUsedAt);
    return (Date.now() - d) / 86400000 >= 60;
  })();

  return (
    <div className={`bg-white rounded-2xl shadow-card p-4 ${isUnused ? 'border-l-4 border-red-400' : ''}`}>
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{sub.logo || cat?.icon || '📦'}</span>
          <div>
            <p className="font-semibold text-brand-900 text-sm">{sub.name}</p>
            <p className="text-xs text-gray-400">{cat?.label || sub.category}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-brand-900 text-sm">{formatAUD(sub.amount)}</p>
          <p className="text-xs text-gray-400">{sub.frequency}</p>
        </div>
      </div>

      {isUnused && (
        <div className="bg-red-50 rounded-lg px-3 py-1.5 my-2">
          <p className="text-xs text-red-600 font-medium">⚠️ Flagged — unused for 60+ days</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-gray-400">
          {formatAUD(monthly)}/mo
          {sub.renewalDate && ` · Renews ${format(new Date(sub.renewalDate), 'dd MMM')}`}
        </p>
        <div className="flex items-center gap-2">
          <button onClick={onLogUse} className="text-xs text-brand-600 flex items-center gap-1 bg-brand-50 px-2.5 py-1 rounded-full">
            <RefreshCw size={11} /> Used it
          </button>
          <button onClick={onDelete} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;

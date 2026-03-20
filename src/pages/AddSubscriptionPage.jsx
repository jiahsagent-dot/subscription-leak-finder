import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Plus, Check } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db, addSubscription } from '@/lib/firebase';
import { COMMON_SUBS, CATEGORIES, FREQUENCIES } from '@/data/commonSubscriptions';
import { format, addMonths } from 'date-fns';

const TABS = ['Quick Add', 'Custom'];

const AddSubscriptionPage = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const [tab, setTab]         = useState('Quick Add');
  const [search, setSearch]   = useState('');
  const [selected, setSelected] = useState([]);
  const [saving, setSaving]   = useState(false);

  // Custom form state
  const [form, setForm] = useState({
    name: '', amount: '', frequency: 'monthly', category: 'entertainment',
    renewalDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'), logo: '📦',
  });

  const filteredSubs = COMMON_SUBS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (sub) => {
    setSelected((prev) =>
      prev.find((s) => s.name === sub.name)
        ? prev.filter((s) => s.name !== sub.name)
        : [...prev, sub]
    );
  };

  const isSelected = (name) => selected.some((s) => s.name === name);

  const handleQuickAdd = async () => {
    if (!selected.length) return;
    setSaving(true);
    try {
      await Promise.all(
        selected.map((sub) =>
          addSubscription(user.uid, {
            ...sub,
            renewalDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
          })
        )
      );
      nav('/subs', { replace: true });
    } finally { setSaving(false); }
  };

  const handleCustomAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    setSaving(true);
    try {
      await addSubscription(user.uid, { ...form, amount: parseFloat(form.amount) });
      nav('/subs', { replace: true });
    } finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-900 text-white px-4 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => nav(-1)} className="p-1.5 rounded-full hover:bg-white/10">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">Add Subscription</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
              tab === t ? 'border-brand-900 text-brand-900' : 'border-transparent text-gray-400'
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 py-4">
        {tab === 'Quick Add' ? (
          <>
            <p className="text-xs text-gray-500 mb-3">Select all the subscriptions you pay for:</p>
            <div className="relative mb-3">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search 50 common AU subscriptions…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>

            {/* Group by category */}
            {CATEGORIES.map((cat) => {
              const items = filteredSubs.filter((s) => s.category === cat.value);
              if (!items.length) return null;
              return (
                <div key={cat.value} className="mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{cat.icon} {cat.label}</p>
                  <div className="space-y-2">
                    {items.map((sub) => (
                      <button key={sub.name} onClick={() => toggle(sub)}
                        className={`w-full flex items-center justify-between bg-white rounded-xl shadow-card px-4 py-3 transition-all active:scale-[0.98] ${
                          isSelected(sub.name) ? 'border-2 border-brand-900' : 'border border-transparent'
                        }`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{sub.logo}</span>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-brand-900">{sub.name}</p>
                            <p className="text-xs text-gray-400">~A${sub.amount}/{sub.frequency}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected(sub.name) ? 'bg-brand-900 border-brand-900' : 'border-gray-300'
                        }`}>
                          {isSelected(sub.name) && <Check size={13} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {selected.length > 0 && (
              <div className="sticky bottom-20 pb-2">
                <button onClick={handleQuickAdd} disabled={saving}
                  className="w-full bg-brand-900 text-white py-4 rounded-2xl font-bold text-sm shadow-2xl disabled:opacity-60">
                  {saving ? 'Adding…' : `Add ${selected.length} Subscription${selected.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleCustomAdd} className="space-y-4">
            <Field label="Subscription Name *">
              <input type="text" placeholder="e.g. My Gym Membership" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required
                className="input-base" />
            </Field>

            <div className="flex gap-3">
              <Field label="Amount (AUD) *" className="flex-1">
                <input type="number" step="0.01" placeholder="0.00" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })} required
                  className="input-base" />
              </Field>
              <Field label="Frequency" className="flex-1">
                <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                  className="input-base appearance-none">
                  {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Category">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-base appearance-none">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
              </select>
            </Field>

            <Field label="Next Renewal Date">
              <input type="date" value={form.renewalDate}
                onChange={(e) => setForm({ ...form, renewalDate: e.target.value })}
                className="input-base" />
            </Field>

            <button type="submit" disabled={saving || !form.name || !form.amount}
              className="w-full bg-brand-900 text-white py-4 rounded-2xl font-bold text-sm mt-2 disabled:opacity-60">
              {saving ? 'Adding…' : 'Add Subscription'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, children, className = '' }) => (
  <div className={className}>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

export default AddSubscriptionPage;

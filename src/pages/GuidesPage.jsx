import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, ExternalLink, Clock, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CANCELLATION_GUIDES, DIFFICULTY_COLORS } from '@/data/cancellationGuides';
import PremiumGate from '@/components/Layout/PremiumGate';

const GuidesPage = () => {
  const { isPremium } = useAuth();
  const [search,   setSearch]   = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = CANCELLATION_GUIDES.filter((g) =>
    g.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-4">
      <div className="bg-brand-900 px-4 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Cancellation Guides</h1>
        <p className="text-brand-300 text-sm">Step-by-step instructions to cancel any subscription.</p>
      </div>

      <PremiumGate isPremium={isPremium} feature="Cancellation Guides">
        <div className="px-4 mt-5">
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search guides…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>

          <div className="space-y-3">
            {filtered.map((guide) => (
              <GuideCard
                key={guide.service}
                guide={guide}
                isOpen={expanded === guide.service}
                onToggle={() => setExpanded(expanded === guide.service ? null : guide.service)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="font-medium">No guides found for "{search}"</p>
            </div>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

const GuideCard = ({ guide, isOpen, onToggle }) => (
  <div className="bg-white rounded-2xl shadow-card overflow-hidden">
    <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-4 text-left">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{guide.logo}</span>
        <div>
          <p className="font-semibold text-brand-900 text-sm">{guide.service}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[guide.difficulty]}`}>
              {guide.difficulty}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={10} /> {guide.timeEstimate}
            </span>
          </div>
        </div>
      </div>
      {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
    </button>

    {isOpen && (
      <div className="border-t border-gray-100 px-4 pb-5 pt-4">
        <ol className="space-y-3 mb-4">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 bg-brand-900 text-white rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>

        {guide.warning && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3 mb-4">
            <p className="text-sm text-amber-800 leading-relaxed">{guide.warning}</p>
          </div>
        )}

        <a href={guide.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full border border-brand-200 text-brand-700 py-3 rounded-xl text-sm font-semibold">
          <ExternalLink size={15} /> Open {guide.service} Settings
        </a>
      </div>
    )}
  </div>
);

export default GuidesPage;

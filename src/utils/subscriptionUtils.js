import { toMonthly, toAnnual } from '@/data/commonSubscriptions';
import { differenceInDays, addMonths, addWeeks, addYears, isPast, isWithinInterval, addDays } from 'date-fns';

export const FREE_TIER_LIMIT = 5;
export const UNUSED_THRESHOLD_DAYS = 60;

/**
 * Calculate total monthly spend from a list of subscriptions
 */
export const calcMonthlyTotal = (subs) =>
  subs.reduce((sum, s) => sum + toMonthly(s.amount, s.frequency), 0);

/**
 * Calculate total annual spend
 */
export const calcAnnualTotal = (subs) =>
  subs.reduce((sum, s) => sum + toAnnual(s.amount, s.frequency), 0);

/**
 * Flag subscriptions unused for 60+ days
 */
export const flagUnused = (subs) =>
  subs.filter((s) => {
    if (!s.lastUsedAt) return true;
    const lastUsed = s.lastUsedAt.toDate ? s.lastUsedAt.toDate() : new Date(s.lastUsedAt);
    return differenceInDays(new Date(), lastUsed) >= UNUSED_THRESHOLD_DAYS;
  });

/**
 * Get subscriptions renewing in the next N days
 */
export const upcomingRenewals = (subs, days = 30) => {
  const now = new Date();
  const end = addDays(now, days);

  return subs
    .filter((s) => {
      if (!s.renewalDate) return false;
      const d = new Date(s.renewalDate);
      return isWithinInterval(d, { start: now, end });
    })
    .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));
};

/**
 * Calculate waste amount (unused subs)
 */
export const calcWasteMonthly = (subs) => {
  const unused = flagUnused(subs);
  return calcMonthlyTotal(unused);
};

export const calcWasteAnnual = (subs) => calcWasteMonthly(subs) * 12;

/**
 * Group subscriptions by category
 */
export const groupByCategory = (subs) => {
  const groups = {};
  subs.forEach((s) => {
    const cat = s.category || 'other';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });
  return groups;
};

/**
 * Get category totals for chart
 */
export const getCategoryTotals = (subs, categories) => {
  const groups = groupByCategory(subs);
  return categories.map((cat) => ({
    name:   cat.label,
    value:  Math.round(calcMonthlyTotal(groups[cat.value] || []) * 100) / 100,
    color:  cat.color,
    count:  (groups[cat.value] || []).length,
  })).filter((c) => c.value > 0);
};

/**
 * Get next renewal date based on frequency from today
 */
export const getNextRenewalDate = (lastRenewal, frequency) => {
  const date = lastRenewal ? new Date(lastRenewal) : new Date();
  switch (frequency) {
    case 'weekly':  return addWeeks(date, 1);
    case 'annual':  return addYears(date, 1);
    default:        return addMonths(date, 1);
  }
};

/**
 * Days until next renewal
 */
export const daysUntilRenewal = (renewalDate) => {
  if (!renewalDate) return null;
  return differenceInDays(new Date(renewalDate), new Date());
};

/**
 * Format currency (AUD)
 */
export const formatAUD = (amount) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(amount);

/**
 * Parse CSV bank statement rows to suggest subscriptions
 */
export const parseCSVRows = (rows, commonSubs) => {
  const suggestions = [];
  rows.forEach((row) => {
    const desc = (row.description || row.Description || row.DESCRIPTION || '').toLowerCase();
    if (!desc) return;
    commonSubs.forEach((sub) => {
      if (
        desc.includes(sub.name.toLowerCase().split(' ')[0]) ||
        (sub.url && desc.includes(sub.url.split('.')[0]))
      ) {
        const existing = suggestions.find((s) => s.name === sub.name);
        if (!existing) {
          suggestions.push({
            ...sub,
            detected:    true,
            rawDesc:     row.description || row.Description,
            detectedAmt: Math.abs(parseFloat(row.amount || row.Amount || row.AMOUNT || 0)),
          });
        }
      }
    });
  });
  return suggestions;
};

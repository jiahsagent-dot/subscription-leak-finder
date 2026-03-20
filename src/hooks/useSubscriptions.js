import { useEffect, useState } from 'react';
import { getUserSubscriptions } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  calcMonthlyTotal, calcAnnualTotal, flagUnused,
  upcomingRenewals, calcWasteMonthly, getCategoryTotals,
} from '@/utils/subscriptionUtils';
import { CATEGORIES } from '@/data/commonSubscriptions';

export const useSubscriptions = () => {
  const { user } = useAuth();
  const [subs,    setSubs]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setSubs([]); setLoading(false); return; }
    const unsub = getUserSubscriptions(user.uid, (snap) => {
      setSubs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [user?.uid]);

  const monthlyTotal   = calcMonthlyTotal(subs);
  const annualTotal    = calcAnnualTotal(subs);
  const unusedSubs     = flagUnused(subs);
  const wasteMonthly   = calcWasteMonthly(subs);
  const renewals30     = upcomingRenewals(subs, 30);
  const categoryTotals = getCategoryTotals(subs, CATEGORIES);

  return {
    subs, loading,
    monthlyTotal, annualTotal,
    unusedSubs, wasteMonthly,
    renewals30, categoryTotals,
  };
};

import {useEffect, useState} from 'react';
import {fetchLoyaltyRules, type LoyaltyRule} from '@/lib/api';

/** Loyalty (stamp card) rules for a business, keyed by category name. */
export function useLoyaltyRules(businessId: string | number | undefined) {
  const [rules, setRules] = useState<LoyaltyRule[]>([]);

  useEffect(() => {
    if (businessId === undefined) {
      setRules([]);
      return;
    }
    let cancelled = false;
    void fetchLoyaltyRules(businessId).then((next) => {
      if (!cancelled) setRules(next);
    });
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  return rules;
}

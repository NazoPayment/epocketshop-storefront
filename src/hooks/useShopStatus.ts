import {useEffect, useState} from 'react';
import {evaluateClientShopStatus, type ClientShopStatus} from '@/lib/hours';
import type {BusinessDetails} from '@/lib/types';

export function useShopStatus(business?: BusinessDetails | null): ClientShopStatus {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!business?.operating_hours?.enabled) return undefined;

    const tick = () => setNow(new Date());
    const interval = window.setInterval(tick, 30_000);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [business?.operating_hours?.enabled]);

  return evaluateClientShopStatus(business, now);
}

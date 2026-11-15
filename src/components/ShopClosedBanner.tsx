import {Banner} from '@astryxdesign/core/Banner';
import type {ClientShopStatus} from '@/lib/hours';

interface ShopClosedBannerProps {
  status: ClientShopStatus;
  overrideMessage?: string | null;
}

export function ShopClosedBanner({status, overrideMessage}: ShopClosedBannerProps) {
  if (status.isOpen && !overrideMessage) return null;
  const description =
    overrideMessage ||
    status.closedMessage ||
    'This store is currently outside working hours and not accepting orders right now.';
  return (
    <Banner
      status="warning"
      role="alert"
      title="Store is currently closed"
      description={description}
    />
  );
}

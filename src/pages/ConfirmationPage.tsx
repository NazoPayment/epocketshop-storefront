import {useEffect} from 'react';
import {useLocation} from 'wouter';
import {CircleCheckBig, MessageCircle, ShoppingBag} from 'lucide-react';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Icon} from '@astryxdesign/core/Icon';
import {VStack} from '@astryxdesign/core/VStack';
import {useCart} from '@/contexts/CartContext';
import {useStoreRoute} from '@/hooks/useStoreRoute';
import {storePath} from '@/lib/format';
import {PageContainer} from '@/components/layout';

export default function ConfirmationPage() {
  const [, navigate] = useLocation();
  const {clearCart} = useCart();
  const {businessDetails, storeName} = useStoreRoute();
  const displayName = businessDetails?.name || storeName;

  // The order has been handed to WhatsApp, so the cart is done with.
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <PageContainer>
      <VStack gap={6} paddingBlock={8}>
        <EmptyState
          icon={<Icon icon={CircleCheckBig} size="lg" color="success" />}
          headingLevel={1}
          title="Order sent"
          description={`Your order has been sent to ${displayName} via WhatsApp. Press the send button in WhatsApp to confirm it. The store will contact you shortly.`}
          actions={
            <Button
              label="Continue shopping"
              variant="primary"
              icon={<Icon icon={ShoppingBag} />}
              onClick={() => navigate(storePath(storeName))}
            />
          }
        />

        <Banner
          status="info"
          icon={<Icon icon={MessageCircle} />}
          title="Action required"
          description="WhatsApp should have opened with your order message. Press Send to complete your order."
        />
      </VStack>
    </PageContainer>
  );
}

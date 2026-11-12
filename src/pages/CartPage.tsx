import {useLocation} from 'wouter';
import {ShieldCheck, ShoppingBag, Trash2} from 'lucide-react';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Divider} from '@astryxdesign/core/Divider';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {StackItem} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {Thumbnail} from '@astryxdesign/core/Thumbnail';
import {VStack} from '@astryxdesign/core/VStack';
import {useCart} from '@/contexts/CartContext';
import {useStoreRoute} from '@/hooks/useStoreRoute';
import {currencySymbol, formatPrice, storePath} from '@/lib/format';
import {AppBar} from '@/components/AppBar';
import {PageContainer, TwoColumn} from '@/components/layout';
import {QuantityControl} from '@/components/QuantityControl';
import {OrderSummary} from '@/components/OrderSummary';

export default function CartPage() {
  const [, navigate] = useLocation();
  const {items, removeItem, updateQuantity, totalPrice, totalItems} = useCart();
  const {businessDetails, storeName} = useStoreRoute();
  const currency = currencySymbol(businessDetails?.currency);

  const goToStore = () => navigate(storePath(storeName));

  return (
    <>
      <AppBar
        title="Shopping cart"
        onBack={goToStore}
        endContent={
          totalItems > 0 ? (
            <Badge variant="neutral" label={`${totalItems} item${totalItems === 1 ? '' : 's'}`} />
          ) : undefined
        }
      />

      <PageContainer width="medium" gap={5}>
        {items.length === 0 ? (
          <EmptyState
            icon={<Icon icon={ShoppingBag} size="lg" />}
            title="Your cart is empty"
            description="Add some products to get started."
            actions={
              <Button
                label="Continue shopping"
                variant="primary"
                icon={<Icon icon={ShoppingBag} />}
                onClick={goToStore}
              />
            }
          />
        ) : (
          <TwoColumn
            main={
              <VStack gap={3}>
                {items.map((item, index) => (
                  <Card key={`${item.product.id}-${index}`} padding={4}>
                    <HStack gap={3} vAlign="start">
                      {item.product.image && (
                        <Thumbnail src={item.product.image} alt={item.product.name} />
                      )}
                      <StackItem size="fill">
                        <VStack gap={2}>
                          <HStack gap={2} vAlign="start" justify="between">
                            <StackItem size="fill">
                              <Heading level={2} maxLines={2}>
                                {item.product.name}
                              </Heading>
                            </StackItem>
                            <IconButton
                              label={`Remove ${item.product.name} from cart`}
                              tooltip="Remove"
                              variant="ghost"
                              size="sm"
                              icon={<Icon icon={Trash2} />}
                              onClick={() => removeItem(index)}
                            />
                          </HStack>

                          {item.selectedOption?.name && (
                            <Text type="supporting" size="sm">
                              Option: {item.selectedOption.name}
                            </Text>
                          )}
                          {item.selectedExtras.length > 0 && (
                            <Text type="supporting" size="sm">
                              Extras: {item.selectedExtras.map((e) => e.name).join(', ')}
                            </Text>
                          )}

                          <HStack gap={2} vAlign="center" justify="between">
                            <QuantityControl
                              value={item.quantity}
                              min={0}
                              itemName={item.product.name}
                              onChange={(next) => updateQuantity(index, next)}
                            />
                            <Text weight="bold" hasTabularNumbers>
                              {formatPrice(item.itemTotal, currency)}
                            </Text>
                          </HStack>
                        </VStack>
                      </StackItem>
                    </HStack>
                  </Card>
                ))}
                <HStack>
                  <Button label="Continue shopping" variant="ghost" onClick={goToStore} />
                </HStack>
              </VStack>
            }
            aside={
              <Card padding={4}>
                <VStack gap={4}>
                  <OrderSummary items={items} totalPrice={totalPrice} currency={currency} />
                  <Divider />
                  <Button
                    label="Checkout via WhatsApp"
                    variant="primary"
                    size="lg"
                    width="100%"
                    onClick={() => navigate(storePath(storeName, 'checkout'))}
                  />
                  <HStack gap={2} vAlign="center">
                    <Icon icon={ShieldCheck} size="sm" color="secondary" />
                    <Text type="supporting" size="sm">
                      Your order is sent securely via WhatsApp and confirmed by the store.
                    </Text>
                  </HStack>
                </VStack>
              </Card>
            }
          />
        )}
      </PageContainer>
    </>
  );
}

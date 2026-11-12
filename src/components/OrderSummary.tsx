import {Divider} from '@astryxdesign/core/Divider';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {StackItem} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {formatPrice} from '@/lib/format';
import type {CartItem} from '@/lib/types';

/** Line items and total, shared by the cart and checkout pages. */
export function OrderSummary({
  items,
  totalPrice,
  currency,
}: {
  items: CartItem[];
  /** In cents. */
  totalPrice: number;
  currency: string;
}) {
  return (
    <VStack gap={3}>
      <Heading level={2}>Order summary</Heading>
      <VStack gap={2}>
        {items.map((item, index) => (
          <HStack key={`${item.product.id}-${index}`} gap={3} justify="between">
            <StackItem size="fill">
              <Text type="supporting" size="sm" maxLines={2}>
                {item.quantity}x {item.product.name}
                {item.selectedOption?.name ? ` · ${item.selectedOption.name}` : ''}
              </Text>
            </StackItem>
            <Text type="supporting" size="sm" hasTabularNumbers>
              {formatPrice(item.itemTotal, currency)}
            </Text>
          </HStack>
        ))}
      </VStack>
      <Divider />
      <HStack justify="between">
        <Text weight="bold">Total</Text>
        <Text type="large" weight="bold" hasTabularNumbers>
          {formatPrice(totalPrice, currency)}
        </Text>
      </HStack>
    </VStack>
  );
}

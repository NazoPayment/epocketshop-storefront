// Product tile for the storefront grid: photo, name, price and a one-tap action.
// Products with options or extras open the detail dialog; the rest add straight to the cart.

import {useState} from 'react';
import {ShoppingCart, SlidersHorizontal} from 'lucide-react';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import {VStack} from '@astryxdesign/core/VStack';
import {useCart} from '@/contexts/CartContext';
import type {Product} from '@/lib/types';
import {ProductDialog} from './ProductDialog';
import {ProductImage} from './ProductImage';

export function ProductCard({
  product,
  currency,
  earnsReward = false,
}: {
  product: Product;
  currency: string;
  /** The product's category has a loyalty stamp card. */
  earnsReward?: boolean;
}) {
  const {addItem} = useCart();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const needsChoices = (product.options?.length ?? 0) > 0 || (product.extras?.length ?? 0) > 0;
  const defaultOption = product.options?.[0];
  const price = product.price / 100 + (defaultOption?.price ?? 0);

  const quickAdd = () => {
    addItem(product, 1, defaultOption, []);
    toast({body: `${product.name} added to cart`, uniqueID: `added-${product.id}`});
  };

  return (
    <Card padding={0}>
      <VStack>
        <ClickableCard
          label={`View ${product.name}`}
          variant="transparent"
          padding={0}
          onClick={() => setIsOpen(true)}
        >
          <VStack gap={2}>
            <ProductImage src={product.image} alt="" />
            <VStack gap={1} padding={3} paddingBlockStart={1}>
              {product.category && (
                <HStack gap={1} wrap="wrap">
                  <Badge variant="blue" label={product.category} />
                  {earnsReward && <Badge variant="success" label="Earns stamps" />}
                </HStack>
              )}
              <Text weight="semibold" maxLines={2}>
                {product.name}
              </Text>
              {product.description && (
                <Text type="supporting" size="sm" maxLines={1}>
                  {product.description}
                </Text>
              )}
              <Text type="large" weight="bold" hasTabularNumbers>
                {currency} {price.toFixed(2)}
              </Text>
            </VStack>
          </VStack>
        </ClickableCard>

        <VStack padding={3} paddingBlockStart={0}>
          {needsChoices ? (
            <Button
              label="Choose options"
              width="100%"
              icon={<Icon icon={SlidersHorizontal} />}
              onClick={() => setIsOpen(true)}
            />
          ) : (
            <Button
              label="Add to cart"
              variant="primary"
              width="100%"
              icon={<Icon icon={ShoppingCart} />}
              onClick={quickAdd}
            />
          )}
        </VStack>
      </VStack>

      {isOpen && (
        <ProductDialog
          product={product}
          currency={currency}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </Card>
  );
}

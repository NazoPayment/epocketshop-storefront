// Product detail: large photo, description, options / extras, quantity and add to cart.

import {useState} from 'react';
import {ShoppingCart} from 'lucide-react';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {CheckboxList, CheckboxListItem} from '@astryxdesign/core/CheckboxList';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {RadioList, RadioListItem} from '@astryxdesign/core/RadioList';
import {StackItem} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {useToast} from '@astryxdesign/core/Toast';
import {VStack} from '@astryxdesign/core/VStack';
import {useCart} from '@/contexts/CartContext';
import {formatRands} from '@/lib/format';
import type {Product, ProductExtra, ProductOption} from '@/lib/types';
import {ProductImage} from './ProductImage';
import {QuantityControl} from './QuantityControl';

export function ProductDialog({
  product,
  currency,
  isOpen,
  onOpenChange,
}: {
  product: Product;
  currency: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const {addItem} = useCart();
  const toast = useToast();

  const options = product.options ?? [];
  const extras = product.extras ?? [];

  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(options[0]);
  const [selectedExtras, setSelectedExtras] = useState<ProductExtra[]>([]);

  // Product price is in cents; option and extra prices are in rands.
  const unitPrice =
    product.price / 100 +
    (selectedOption?.price ?? 0) +
    selectedExtras.reduce((sum, extra) => sum + (extra.price ?? 0), 0);

  const handleAdd = () => {
    addItem(product, quantity, selectedOption, selectedExtras);
    toast({body: `${product.name} added to cart`, uniqueID: `added-${product.id}`});
    setQuantity(1);
    setSelectedExtras([]);
    onOpenChange(false);
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange} width={520} maxHeight="90dvh" padding={0}>
      <DialogHeader title={product.name} onOpenChange={onOpenChange} />
      <VStack gap={4} padding={4} isScrollable>
        <ProductImage src={product.image} alt={product.name} ratio={4 / 3} />

        <VStack gap={2}>
          <HStack gap={3} justify="between" vAlign="start">
            <Heading level={3}>{product.name}</Heading>
            <Text type="large" weight="bold" hasTabularNumbers>
              {currency} {unitPrice.toFixed(2)}
            </Text>
          </HStack>
          {product.category && (
            <HStack>
              <Badge variant="blue" label={product.category} />
            </HStack>
          )}
          {product.description && <Text type="supporting">{product.description}</Text>}
        </VStack>

        {options.length > 0 && (
          <RadioList
            label="Options"
            value={selectedOption?.name ?? ''}
            onChange={(name) => setSelectedOption(options.find((o) => o.name === name))}
          >
            {options.map((opt) => (
              <RadioListItem
                key={opt.name}
                value={opt.name ?? ''}
                label={opt.name}
                endContent={
                  opt.price ? <Text color="accent">+{formatRands(opt.price, currency)}</Text> : undefined
                }
              />
            ))}
          </RadioList>
        )}

        {extras.length > 0 && (
          <CheckboxList
            label="Extras"
            value={selectedExtras.map((e) => e.name)}
            onChange={(names) => setSelectedExtras(extras.filter((extra) => names.includes(extra.name)))}
          >
            {extras.map((extra) => (
              <CheckboxListItem
                key={extra.name}
                value={extra.name}
                label={extra.name}
                endContent={
                  extra.price ? <Text color="accent">+{formatRands(extra.price, currency)}</Text> : undefined
                }
              />
            ))}
          </CheckboxList>
        )}

        <HStack gap={3} vAlign="center">
          <QuantityControl value={quantity} onChange={setQuantity} itemName={product.name} />
          <StackItem size="fill">
            <Button
              label={`Add to cart · ${currency} ${(unitPrice * quantity).toFixed(2)}`}
              variant="primary"
              size="lg"
              width="100%"
              icon={<Icon icon={ShoppingCart} />}
              onClick={handleAdd}
            />
          </StackItem>
        </HStack>
      </VStack>
    </Dialog>
  );
}

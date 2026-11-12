import {Minus, Plus} from 'lucide-react';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Text} from '@astryxdesign/core/Text';

export function QuantityControl({
  value,
  onChange,
  itemName,
  min = 1,
}: {
  value: number;
  onChange: (next: number) => void;
  /** Used in the accessible names, e.g. "Decrease quantity of Burger". */
  itemName: string;
  /** The minus button is disabled once the value reaches this. Use 0 to let the minus button remove an item. */
  min?: number;
}) {
  return (
    <HStack gap={2} vAlign="center">
      <IconButton
        label={`Decrease quantity of ${itemName}`}
        tooltip="Decrease"
        size="sm"
        icon={<Icon icon={Minus} />}
        isDisabled={value <= min}
        onClick={() => onChange(value - 1)}
      />
      <Text weight="semibold" hasTabularNumbers justify="center">
        {value}
      </Text>
      <IconButton
        label={`Increase quantity of ${itemName}`}
        tooltip="Increase"
        size="sm"
        icon={<Icon icon={Plus} />}
        onClick={() => onChange(value + 1)}
      />
    </HStack>
  );
}

import {Button} from '@astryxdesign/core/Button';
import {Divider} from '@astryxdesign/core/Divider';
import {HStack} from '@astryxdesign/core/HStack';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {storePath} from '@/lib/format';

export function StoreFooter({storeName, displayName}: {storeName: string; displayName: string}) {
  return (
    <VStack gap={3} paddingBlockStart={4}>
      <Divider />
      <HStack gap={2} wrap="wrap" justify="between" vAlign="center">
        <Text type="supporting" size="sm">
          © {new Date().getFullYear()} {displayName}. Powered by ePocketShop.
        </Text>
        <HStack gap={1}>
          <Button label="About" variant="ghost" size="sm" href={storePath(storeName, 'about')} />
          <Button label="Contact" variant="ghost" size="sm" href={storePath(storeName, 'contact')} />
        </HStack>
      </HStack>
    </VStack>
  );
}

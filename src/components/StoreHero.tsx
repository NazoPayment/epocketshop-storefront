// Store introduction at the top of the store page: banner (when set), logo, name,
// description and the trust points shoppers look for.

import {ExternalLink, MessageCircle, Share2, ShieldCheck, Store, Zap} from 'lucide-react';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {StackItem} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {config} from '@/lib/config';
import type {BusinessDetails} from '@/lib/types';
import {InstallButton} from './InstallButton';
import {ProductImage} from './ProductImage';
import {VerifiedBadges} from './VerifiedBadges';

const TRUST_POINTS = [
  {icon: MessageCircle, text: 'Order on WhatsApp'},
  {icon: ShieldCheck, text: 'Confirmed by the store'},
  {icon: Zap, text: 'Fast and simple checkout'},
] as const;

export function StoreHero({
  businessDetails,
  storeName,
  bannerUrl,
  onShare,
}: {
  businessDetails: BusinessDetails;
  storeName: string;
  bannerUrl?: string;
  onShare: () => void;
}) {
  const displayName = businessDetails.name || storeName;
  const logo = businessDetails.business_logo || businessDetails.logo;

  return (
    <Card padding={0}>
      <VStack>
        {bannerUrl && <ProductImage src={bannerUrl} alt="" ratio={4} />}
        <VStack gap={4} padding={4}>
          <HStack gap={4} vAlign="center">
            {logo && <Avatar src={logo} name={displayName} size={72} shape="rounded" tooltip={false} />}
            <StackItem size="fill">
              <VStack gap={1}>
                <HStack gap={2} vAlign="center" wrap="wrap">
                  <Heading level={1}>{displayName}</Heading>
                  <VerifiedBadges tier={businessDetails.verified} />
                </HStack>
                {businessDetails.description && (
                  <Text type="supporting" maxLines={3}>
                    {businessDetails.description}
                  </Text>
                )}
              </VStack>
            </StackItem>
          </HStack>

          <HStack gap={2} wrap="wrap">
            <Button label="Share store" size="sm" icon={<Icon icon={Share2} />} onClick={onShare} />
            <Button
              label="Create your store"
              size="sm"
              icon={<Icon icon={Store} />}
              endContent={<Icon icon={ExternalLink} />}
              href={config.adminUrl}
              target="_blank"
              rel="noopener noreferrer"
            />
            <InstallButton storeName={displayName} />
          </HStack>

          <HStack gap={4} wrap="wrap">
            {TRUST_POINTS.map(({icon, text}) => (
              <HStack key={text} gap={1} vAlign="center">
                <Icon icon={icon} size="sm" color="secondary" />
                <Text type="supporting" size="sm">
                  {text}
                </Text>
              </HStack>
            ))}
          </HStack>
        </VStack>
      </VStack>
    </Card>
  );
}

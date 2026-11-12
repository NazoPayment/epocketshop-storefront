import {useLocation} from 'wouter';
import {Store} from 'lucide-react';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Center} from '@astryxdesign/core/Center';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {useStoreRoute} from '@/hooks/useStoreRoute';
import {storePath} from '@/lib/format';
import {AppBar} from '@/components/AppBar';
import {PageContainer} from '@/components/layout';
import {SocialLinks} from '@/components/SocialLinks';
import {VerifiedBadges} from '@/components/VerifiedBadges';

export default function AboutPage() {
  const [, navigate] = useLocation();
  const {businessDetails, storeName, loading} = useStoreRoute();

  const displayName = businessDetails?.name || storeName;
  const logo = businessDetails?.business_logo || businessDetails?.logo;

  return (
    <>
      <AppBar title="About us" onBack={() => navigate(storePath(storeName))} />

      <PageContainer>
        {loading ? (
          <VStack gap={3} hAlign="center" aria-busy="true" aria-label="Loading">
            <Skeleton width={96} height={96} radius="rounded" />
            <Skeleton width="50%" height={24} />
            <Skeleton width="80%" height={16} />
          </VStack>
        ) : (
          <VStack gap={6} paddingBlock={4}>
            <VStack gap={3} hAlign="center">
              {logo ? (
                <Avatar src={logo} name={displayName} size={96} shape="rounded" tooltip={false} />
              ) : (
                <Center width={96} height={96}>
                  <Icon icon={Store} size="lg" color="accent" />
                </Center>
              )}
              <HStack gap={2} vAlign="center" hAlign="center">
                <Heading level={2} justify="center">
                  {displayName}
                </Heading>
                <VerifiedBadges tier={businessDetails?.verified} />
              </HStack>
              {businessDetails?.description && (
                <Text type="supporting" justify="center" textWrap="pretty">
                  {businessDetails.description}
                </Text>
              )}
            </VStack>

            {businessDetails && <SocialLinks businessDetails={businessDetails} />}

            <Text type="supporting" justify="center">
              Powered by ePocketShop
            </Text>
          </VStack>
        )}
      </PageContainer>
    </>
  );
}

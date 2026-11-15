import {useLocation} from 'wouter';
import {Clock, Store} from 'lucide-react';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Badge} from '@astryxdesign/core/Badge';
import {Card} from '@astryxdesign/core/Card';
import {Center} from '@astryxdesign/core/Center';
import {Divider} from '@astryxdesign/core/Divider';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {useShopStatus} from '@/hooks/useShopStatus';
import {useStoreRoute} from '@/hooks/useStoreRoute';
import {formatWeeklySchedule} from '@/lib/hours';
import {storePath} from '@/lib/format';
import {AppBar} from '@/components/AppBar';
import {PageContainer} from '@/components/layout';
import {SocialLinks} from '@/components/SocialLinks';
import {VerifiedBadges} from '@/components/VerifiedBadges';

export default function AboutPage() {
  const [, navigate] = useLocation();
  const {businessDetails, storeName, loading} = useStoreRoute();
  const shopStatus = useShopStatus(businessDetails);
  const weeklyRows = formatWeeklySchedule(businessDetails?.operating_hours);

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
              <HStack gap={2} vAlign="center" hAlign="center" wrap="wrap">
                <Heading level={2} justify="center">
                  {displayName}
                </Heading>
                <VerifiedBadges tier={businessDetails?.verified} />
                {shopStatus.enabled && (
                  <Badge
                    variant={shopStatus.isOpen ? 'success' : 'warning'}
                    label={shopStatus.isOpen ? 'Open now' : 'Closed'}
                  />
                )}
              </HStack>
              {businessDetails?.description && (
                <Text type="supporting" justify="center" textWrap="pretty">
                  {businessDetails.description}
                </Text>
              )}
            </VStack>

            {weeklyRows.length > 0 && (
              <Card padding={4}>
                <VStack gap={3}>
                  <HStack gap={2} vAlign="center" hAlign="between" wrap="wrap">
                    <HStack gap={2} vAlign="center">
                      <Icon icon={Clock} size="sm" color="secondary" />
                      <Heading level={3}>Working hours</Heading>
                    </HStack>
                    <Text type="supporting" size="sm">
                      {shopStatus.timezone}
                    </Text>
                  </HStack>
                  <Divider />
                  <VStack gap={2}>
                    {weeklyRows.map((row) => {
                      const isToday = row.key === shopStatus.currentDay;
                      return (
                        <HStack key={row.key} hAlign="between" vAlign="center">
                          <Text weight={isToday ? 'semibold' : undefined}>
                            {row.dayName}
                            {isToday ? ' (Today)' : ''}
                          </Text>
                          <Text type={row.isClosed ? 'supporting' : undefined} weight={isToday ? 'semibold' : undefined}>
                            {row.label}
                          </Text>
                        </HStack>
                      );
                    })}
                  </VStack>
                </VStack>
              </Card>
            )}

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

import {useLocation} from 'wouter';
import {Mail, MessageCircle, Phone} from 'lucide-react';
import {Button} from '@astryxdesign/core/Button';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {config} from '@/lib/config';
import {storePath} from '@/lib/format';
import {generateChatUrl} from '@/lib/whatsapp';
import {useStoreRoute} from '@/hooks/useStoreRoute';
import {AppBar} from '@/components/AppBar';
import {PageContainer} from '@/components/layout';
import {SocialLinks} from '@/components/SocialLinks';

export default function ContactPage() {
  const [, navigate] = useLocation();
  const {businessDetails, storeName, loading} = useStoreRoute();

  const displayName = businessDetails?.name || storeName;
  const vendorNumber = businessDetails?.vendor_number || config.defaultWhatsAppNumber;
  const chatUrl = generateChatUrl(
    vendorNumber,
    `Hi ${displayName}, I have a question about your store.`,
  );

  return (
    <>
      <AppBar title="Contact us" onBack={() => navigate(storePath(storeName))} />

      <PageContainer>
        {loading ? (
          <VStack gap={3} aria-busy="true" aria-label="Loading">
            <Skeleton height={28} width="60%" />
            <Skeleton height={44} />
            <Skeleton height={44} />
          </VStack>
        ) : (
          <VStack gap={6} paddingBlock={4}>
            <VStack gap={1}>
              <Heading level={2}>
                Get in touch with {displayName}
              </Heading>
              <Text type="supporting">Have a question or need help? Reach out directly.</Text>
            </VStack>

            <VStack gap={3}>
              <Button
                label={`Chat on WhatsApp · ${vendorNumber}`}
                variant="primary"
                size="lg"
                width="100%"
                href={chatUrl}
                target="_blank"
                rel="noopener noreferrer"
                icon={<Icon icon={MessageCircle} />}
              />
              {businessDetails?.phone && (
                <Button
                  label={`Call us · ${businessDetails.phone}`}
                  size="lg"
                  width="100%"
                  href={`tel:${businessDetails.phone}`}
                  icon={<Icon icon={Phone} />}
                />
              )}
              {businessDetails?.email && (
                <Button
                  label={`Email us · ${businessDetails.email}`}
                  size="lg"
                  width="100%"
                  href={`mailto:${businessDetails.email}`}
                  icon={<Icon icon={Mail} />}
                />
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

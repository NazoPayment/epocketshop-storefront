// Landing page at "/": find a store, or learn how to open one.

import {useState} from 'react';
import {useLocation} from 'wouter';
import {ArrowRight, ExternalLink, Store} from 'lucide-react';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Divider} from '@astryxdesign/core/Divider';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {StackItem} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TopNav} from '@astryxdesign/core/TopNav';
import {VStack} from '@astryxdesign/core/VStack';
import {SELL_FEATURES, SELL_INTRO, SELL_STEPS} from '@/content/sell';
import {config} from '@/lib/config';
import {storePath} from '@/lib/format';
import {InstallButton} from '@/components/InstallButton';
import {PageContainer, StickyTop} from '@/components/layout';
import {ThemeToggle} from '@/components/ThemeToggle';

const HERO_IMAGE =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663529236096/kSGAaAHiopP3raQG3TQjNn/hero-banner-VVrqiyiDDn8kugE4Y3NhnX.webp';

export default function Home() {
  const [, navigate] = useLocation();
  const [storeName, setStoreName] = useState('');

  const visitStore = () => {
    const trimmed = storeName.trim();
    if (trimmed) navigate(storePath(trimmed));
  };

  return (
    <>
      <StickyTop>
        <TopNav
          label="ePocketShop"
          heading={
            <HStack gap={2} vAlign="center">
              <Icon icon={Store} color="accent" />
              <Text type="large" weight="bold">
                ePocketShop
              </Text>
            </HStack>
          }
          endContent={
            <HStack gap={1} vAlign="center">
              <InstallButton storeName="ePocketShop" />
              <ThemeToggle />
            </HStack>
          }
        />
      </StickyTop>

      <PageContainer width="medium" gap={8}>
        {/* Shoppers: find a store */}
        <VStack gap={6} paddingBlockStart={4} maxWidth={672}>
          <img
            src={HERO_IMAGE}
            alt=""
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
            style={{width: '100%', borderRadius: 'var(--radius-xl, 1rem)', objectFit: 'cover'}}
          />

          <VStack gap={2}>
            <Heading level={1} textWrap="balance">
              Your store, on WhatsApp
            </Heading>
            <Text type="supporting" textWrap="pretty">
              Browse products, add to cart, and order directly via WhatsApp. Fast, simple, and
              secure.
            </Text>
          </VStack>

          <Card padding={4}>
            <VStack gap={3}>
              <TextInput
                label="Visit a store"
                type="search"
                startIcon="search"
                placeholder="Enter store name..."
                value={storeName}
                onChange={setStoreName}
                onEnter={visitStore}
                enterKeyHint="go"
                autoCapitalize="off"
              />
              <Button
                label="Visit store"
                variant="primary"
                width="100%"
                endContent={<Icon icon={ArrowRight} />}
                isDisabled={!storeName.trim()}
                onClick={visitStore}
              />
            </VStack>
          </Card>
        </VStack>

        <Divider />

        {/* Sellers: open a store */}
        <VStack as="section" gap={6} aria-labelledby="sell-heading">
          <VStack gap={2} maxWidth={672}>
            <Heading level={2} id="sell-heading">
              {SELL_INTRO.title}
            </Heading>
            <Text type="supporting" textWrap="pretty">
              {SELL_INTRO.text}
            </Text>
          </VStack>

          <HStack gap={2} wrap="wrap">
            <Button
              label="Create your store"
              variant="primary"
              size="lg"
              href={config.adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              endContent={<Icon icon={ExternalLink} />}
            />
            <Button
              label="Learn more about ePocketShop"
              size="lg"
              href={config.infoUrl}
              target="_blank"
              rel="noopener noreferrer"
              endContent={<Icon icon={ExternalLink} />}
            />
          </HStack>

          <Grid columns={{minWidth: 240}} gap={4}>
            {SELL_STEPS.map((step, index) => (
              <Card key={step.title} padding={4}>
                <VStack gap={1}>
                  <Text type="supporting" size="sm" weight="semibold">
                    Step {index + 1}
                  </Text>
                  <Heading level={3}>{step.title}</Heading>
                  <Text type="supporting">{step.text}</Text>
                </VStack>
              </Card>
            ))}
          </Grid>

          <VStack gap={3}>
            <Heading level={3}>Everything you need to run your store</Heading>
            <Grid columns={{minWidth: 240}} gap={4}>
              {SELL_FEATURES.map((feature) => (
                <HStack key={feature.title} gap={3} vAlign="start">
                  <Icon icon={feature.icon} color="accent" />
                  <StackItem size="fill">
                    <VStack gap={0.5}>
                      <Text weight="semibold">{feature.title}</Text>
                      <Text type="supporting" size="sm">
                        {feature.text}
                      </Text>
                    </VStack>
                  </StackItem>
                </HStack>
              ))}
            </Grid>
          </VStack>
        </VStack>

        <HStack gap={3} wrap="wrap" justify="between" vAlign="center">
          <Text type="supporting" size="sm">
            Powered by ePocketShop
          </Text>
          <HStack gap={1}>
            <Button
              label="Seller sign in"
              variant="ghost"
              size="sm"
              href={config.adminUrl}
              target="_blank"
              rel="noopener noreferrer"
            />
            <Button
              label="About ePocketShop"
              variant="ghost"
              size="sm"
              href={config.infoUrl}
              target="_blank"
              rel="noopener noreferrer"
            />
          </HStack>
        </HStack>
      </PageContainer>
    </>
  );
}

// Loading, error and empty states for the store page.

import {SearchX, Store, TriangleAlert} from 'lucide-react';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Grid} from '@astryxdesign/core/Grid';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Skeleton} from '@astryxdesign/core/Skeleton';
import {VStack} from '@astryxdesign/core/VStack';
import {useLocation} from 'wouter';
import {PageContainer} from './layout';

export function StoreSkeleton() {
  return (
    <PageContainer width="wide" gap={5}>
      <VStack gap={5} aria-busy="true" aria-label="Loading store">
        <Skeleton height={140} />
        <Skeleton height={44} />
        <Grid columns={{minWidth: 150}} gap={4}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Card key={i} padding={0}>
              <VStack gap={2}>
                <Skeleton height={170} index={i} radius="none" />
                <VStack gap={2} padding={3}>
                  <Skeleton height={16} width="75%" index={i} />
                  <Skeleton height={14} width="45%" index={i} />
                  <Skeleton height={36} index={i} />
                </VStack>
              </VStack>
            </Card>
          ))}
        </Grid>
      </VStack>
    </PageContainer>
  );
}

export function StoreError({message, storeName}: {message: string; storeName: string}) {
  const [, navigate] = useLocation();
  return (
    <PageContainer>
      <EmptyState
        icon={<Icon icon={TriangleAlert} size="lg" color="error" />}
        title="Couldn't load this store"
        description={
          storeName ? `We had trouble loading "${storeName}". ${message}` : message
        }
        actions={
          <HStack gap={2}>
            <Button label="Try again" variant="primary" onClick={() => window.location.reload()} />
            <Button label="Back to home" onClick={() => navigate('/')} />
          </HStack>
        }
      />
    </PageContainer>
  );
}

export function StoreNotFound({storeName}: {storeName: string}) {
  const [, navigate] = useLocation();
  return (
    <PageContainer>
      <EmptyState
        icon={<Icon icon={Store} size="lg" />}
        title="Store not found"
        description={
          storeName
            ? `We couldn't find a store called "${storeName}". Check the name and try again.`
            : 'Check the store name and try again.'
        }
        actions={<Button label="Find a store" variant="primary" onClick={() => navigate('/')} />}
      />
    </PageContainer>
  );
}

export function NoProductsFound() {
  return (
    <EmptyState
      icon={<Icon icon={SearchX} size="lg" />}
      title="No products found"
      description="Try a different search or category."
      isCompact
    />
  );
}

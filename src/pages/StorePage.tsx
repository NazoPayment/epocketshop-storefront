// Store page: hero, search / sort / category filters and the product grid.

import {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocation} from 'wouter';
import {ShoppingCart} from 'lucide-react';
import {Button} from '@astryxdesign/core/Button';
import {Grid} from '@astryxdesign/core/Grid';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Selector} from '@astryxdesign/core/Selector';
import {StackItem} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {VStack} from '@astryxdesign/core/VStack';
import {useCart} from '@/contexts/CartContext';
import {useLoyaltyRules} from '@/hooks/useLoyaltyRules';
import {useStoreRoute} from '@/hooks/useStoreRoute';
import {currencySymbol, formatPrice, storePath} from '@/lib/format';
import type {Product} from '@/lib/types';
import {BottomBar, PageContainer} from '@/components/layout';
import {ProductDialog} from '@/components/ProductDialog';
import {RewardsCard} from '@/components/RewardsCard';
import {SearchDialog} from '@/components/SearchDialog';
import {ShareStoreDialog} from '@/components/ShareStoreDialog';
import {ProductCard} from '@/components/ProductCard';
import {StoreFooter} from '@/components/StoreFooter';
import {StoreHeader} from '@/components/StoreHeader';
import {StoreHero} from '@/components/StoreHero';
import {NoProductsFound, StoreError, StoreNotFound, StoreSkeleton} from '@/components/StoreStates';

const ALL = 'All';

const SORTS = [
  {value: 'featured', label: 'Filter'},
  {value: 'price-asc', label: 'Price: low to high'},
  {value: 'price-desc', label: 'Price: high to low'},
  {value: 'name', label: 'Name: A to Z'},
] as const;

type SortKey = (typeof SORTS)[number]['value'];

function sortProducts(products: Product[], sort: SortKey): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export default function StorePage() {
  const [, navigate] = useLocation();
  const {storeData, products, businessDetails, loading, error, storeName} = useStoreRoute();
  const {totalItems, totalPrice} = useCart();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [sort, setSort] = useState<SortKey>('featured');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [picked, setPicked] = useState<Product | null>(null);

  const loyaltyRules = useLoyaltyRules(products[0]?.business_id);
  const rewardCategories = useMemo(
    () => new Set(loyaltyRules.map((rule) => rule.category_name)),
    [loyaltyRules],
  );

  const openSearch = useCallback(() => setIsSearchOpen(true), []);

  // Ctrl/Cmd+K opens search, like the admin.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (storeName) document.title = `${storeName} | Online Store`;
  }, [storeName]);

  // Vendors can pause a product; paused products are not for sale.
  const available = useMemo(() => products.filter((p) => !p.is_paused), [products]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    for (const p of available) if (p.category) unique.add(p.category);
    return [ALL, ...unique];
  }, [available]);

  const visibleProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = available.filter((p) => {
      const matchesQuery =
        !needle ||
        p.name.toLowerCase().includes(needle) ||
        (p.description ?? '').toLowerCase().includes(needle);
      const matchesCategory = activeCategory === ALL || p.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
    return sortProducts(filtered, sort);
  }, [available, query, activeCategory, sort]);

  if (loading) return <StoreSkeleton />;
  if (error) return <StoreError message={error} storeName={storeName} />;
  if (!businessDetails) return <StoreNotFound storeName={storeName} />;

  const currency = currencySymbol(businessDetails.currency);
  const displayName = businessDetails.name || storeName;

  return (
    <>
      <StoreHeader
        businessDetails={businessDetails}
        storeName={storeName}
        onSearch={openSearch}
        onShare={() => setIsShareOpen(true)}
      />

      <PageContainer width="wide" hasBottomBar={totalItems > 0} gap={5}>
        <StoreHero
          businessDetails={businessDetails}
          storeName={storeName}
          bannerUrl={storeData?.epocket_shop_details?.banner_url || undefined}
          onShare={() => setIsShareOpen(true)}
        />

        <RewardsCard rules={loyaltyRules} />

        <VStack gap={3}>
          <HStack gap={3} wrap="wrap" vAlign="end">
            <StackItem size="fill">
              <TextInput
                label="Search products"
                isLabelHidden
                type="search"
                startIcon="search"
                placeholder={`Search ${displayName}`}
                value={query}
                onChange={setQuery}
                hasClear
                autoCapitalize="off"
              />
            </StackItem>
            <Selector
              label="Filter products"
              isLabelHidden
              variant="secondary"
              value={sort}
              onChange={(value) => setSort(value as SortKey)}
              options={SORTS.map(({value, label}) => ({value, label}))}
            />
          </HStack>

          {categories.length > 1 && (
            <HStack gap={2} wrap="wrap" aria-label="Categories">
              {categories.map((category) => (
                <Button
                  key={category}
                  label={category}
                  size="sm"
                  variant={activeCategory === category ? 'primary' : 'secondary'}
                  onClick={() => setActiveCategory(category)}
                />
              ))}
            </HStack>
          )}
        </VStack>

        <Text type="supporting" size="sm">
          {visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}
          {activeCategory !== ALL ? ` in ${activeCategory}` : ''}
        </Text>

        {visibleProducts.length === 0 ? (
          <NoProductsFound />
        ) : (
          <Grid columns={{minWidth: 150}} gap={4}>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                earnsReward={rewardCategories.has(product.category ?? '')}
              />
            ))}
          </Grid>
        )}

        <StoreFooter storeName={storeName} displayName={displayName} />
      </PageContainer>

      <SearchDialog
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        storeName={storeName}
        products={available}
        currency={currency}
        onSelectProduct={setPicked}
      />
      <ShareStoreDialog
        storeName={storeName}
        displayName={displayName}
        isOpen={isShareOpen}
        onOpenChange={setIsShareOpen}
      />
      {picked && (
        <ProductDialog
          product={picked}
          currency={currency}
          isOpen
          onOpenChange={(open) => !open && setPicked(null)}
        />
      )}

      {totalItems > 0 && (
        <BottomBar>
          <Button
            label={`View cart (${totalItems})`}
            variant="primary"
            size="lg"
            width="100%"
            icon={<Icon icon={ShoppingCart} />}
            onClick={() => navigate(storePath(storeName, 'cart'))}
          >
            {`View cart (${totalItems}) · ${formatPrice(totalPrice, currency)}`}
          </Button>
        </BottomBar>
      )}
    </>
  );
}

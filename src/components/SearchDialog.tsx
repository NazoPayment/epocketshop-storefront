// Ctrl/Cmd+K search across this store's products and its pages.

import {useEffect, useMemo, useState} from 'react';
import {useLocation} from 'wouter';
import {Dialog} from '@astryxdesign/core/Dialog';
import {HStack} from '@astryxdesign/core/HStack';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {StackItem} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import {VStack} from '@astryxdesign/core/VStack';
import {storePath} from '@/lib/format';
import type {Product} from '@/lib/types';

const MAX_RESULTS = 8;

interface Result {
  key: string;
  label: string;
  hint: string;
  haystack: string;
  run: () => void;
}

export function SearchDialog({
  isOpen,
  onOpenChange,
  storeName,
  products,
  currency,
  onSelectProduct,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  storeName: string;
  products: Product[];
  currency: string;
  onSelectProduct: (product: Product) => void;
}) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  const results = useMemo<Result[]>(() => {
    const go = (sub: string) => () => navigate(storePath(storeName, sub));
    const pages: Result[] = [
      {key: 'page-cart', label: 'Shopping cart', hint: 'Page', haystack: 'cart basket checkout', run: go('cart')},
      {key: 'page-about', label: 'About us', hint: 'Page', haystack: 'about store info', run: go('about')},
      {key: 'page-contact', label: 'Contact us', hint: 'Page', haystack: 'contact phone email whatsapp', run: go('contact')},
    ];
    const items: Result[] = products.map((p) => ({
      key: `product-${p.id}`,
      label: p.name,
      hint: `${currency} ${(p.price / 100).toFixed(2)}${p.category ? ` · ${p.category}` : ''}`,
      haystack: `${p.category ?? ''} ${p.description ?? ''}`,
      run: () => onSelectProduct(p),
    }));

    const needle = query.trim().toLowerCase();
    const all = needle ? [...items, ...pages] : [...pages, ...items];
    const matches = needle
      ? all.filter((r) => `${r.label} ${r.haystack}`.toLowerCase().includes(needle))
      : all;
    return matches.slice(0, MAX_RESULTS);
  }, [query, products, currency, storeName, navigate, onSelectProduct]);

  const choose = (result: Result) => {
    onOpenChange(false);
    result.run();
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange} width={560} maxHeight="80dvh" padding={0}>
      <VStack gap={3} padding={4}>
        <TextInput
          label="Search"
          isLabelHidden
          placeholder="Search products and pages…"
          startIcon="search"
          value={query}
          onChange={setQuery}
          onEnter={() => results[0] && choose(results[0])}
          hasAutoFocus
          autoComplete="off"
        />
        <VStack gap={1} isScrollable aria-label="Search results">
          {results.length === 0 ? (
            <Text type="supporting">No matches for "{query}".</Text>
          ) : (
            results.map((result) => (
              <ClickableCard
                key={result.key}
                label={`${result.label}, ${result.hint}`}
                variant="transparent"
                padding={2}
                onClick={() => choose(result)}
              >
                <HStack gap={3} justify="between" vAlign="center">
                  <StackItem size="fill">
                    <Text weight="semibold" maxLines={1}>
                      {result.label}
                    </Text>
                  </StackItem>
                  <Text type="supporting" size="sm" maxLines={1}>
                    {result.hint}
                  </Text>
                </HStack>
              </ClickableCard>
            ))
          )}
        </VStack>
        <Text type="supporting" size="sm">
          Press Enter to open the first result.
        </Text>
      </VStack>
    </Dialog>
  );
}

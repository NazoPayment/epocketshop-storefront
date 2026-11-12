// Page-level layout primitives built from Astryx stacks.
//
// Astryx has no storefront shell, so these compose it: a centered column,
// a sticky top bar and a fixed bottom action bar.

import type {CSSProperties, ReactNode} from 'react';
import {Divider} from '@astryxdesign/core/Divider';
import {HStack} from '@astryxdesign/core/HStack';
import {VStack} from '@astryxdesign/core/VStack';

const WIDTHS = {narrow: 672, medium: 1040, wide: 1240} as const;

export type PageWidth = keyof typeof WIDTHS;

const centered: CSSProperties = {marginInline: 'auto'};

/** Centered content column. `wide` suits the product grid, `medium` two-column flows. */
export function PageContainer({
  children,
  width = 'narrow',
  hasBottomBar = false,
  gap = 4,
}: {
  children: ReactNode;
  width?: PageWidth;
  /** Reserve room so content is not hidden behind a fixed BottomBar. */
  hasBottomBar?: boolean;
  gap?: 2 | 3 | 4 | 5 | 6 | 8;
}) {
  return (
    <VStack
      as="main"
      maxWidth={WIDTHS[width]}
      width="100%"
      gap={gap}
      paddingInline={4}
      paddingBlockStart={4}
      paddingBlockEnd={6}
      style={{...centered, ...(hasBottomBar ? {paddingBlockEnd: '7rem'} : null)}}
    >
      {children}
    </VStack>
  );
}

/** Sticky container for the top navigation. */
export function StickyTop({children}: {children: ReactNode}) {
  return (
    <VStack
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--color-background-surface)',
      }}
    >
      {children}
      <Divider />
    </VStack>
  );
}

/** Fixed bottom action bar (cart call to action). */
export function BottomBar({children, width = 'wide'}: {children: ReactNode; width?: PageWidth}) {
  return (
    <VStack
      style={{
        position: 'fixed',
        insetInline: 0,
        bottom: 0,
        zIndex: 20,
        background: 'var(--color-background-surface)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <Divider />
      <VStack maxWidth={WIDTHS[width]} width="100%" padding={3} style={centered}>
        {children}
      </VStack>
    </VStack>
  );
}

/**
 * Main column + summary column. The summary sits beside the main content on wide
 * screens and drops underneath on phones.
 */
export function TwoColumn({main, aside}: {main: ReactNode; aside: ReactNode}) {
  return (
    <HStack wrap="wrap" gap={6} vAlign="start">
      <VStack style={{flex: '1 1 420px', minWidth: 0}}>{main}</VStack>
      <VStack style={{flex: '1 1 320px', maxWidth: '26rem', position: 'sticky', top: '4.5rem'}}>
        {aside}
      </VStack>
    </HStack>
  );
}

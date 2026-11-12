// Top bar for store sub-pages: back button, page title and optional end content.

import type {ReactNode} from 'react';
import {ArrowLeft} from 'lucide-react';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {TopNav} from '@astryxdesign/core/TopNav';
import {StickyTop} from './layout';
import {ThemeToggle} from './ThemeToggle';

export function AppBar({
  title,
  onBack,
  endContent,
}: {
  title: string;
  onBack: () => void;
  endContent?: ReactNode;
}) {
  return (
    <StickyTop>
      <TopNav
        label={title}
        heading={
          <IconButton
            label="Back"
            tooltip="Back"
            variant="ghost"
            icon={<Icon icon={ArrowLeft} />}
            onClick={onBack}
          />
        }
        startContent={
          <Heading level={1} maxLines={1}>
            {title}
          </Heading>
        }
        endContent={
          <HStack gap={1} vAlign="center">
            {endContent}
            <ThemeToggle />
          </HStack>
        }
      />
    </StickyTop>
  );
}

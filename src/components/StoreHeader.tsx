// Header for the store page: logo + name on the left, info links and the cart button on the right.

import {Info, Phone, Search, Share2, ShoppingCart, Store} from 'lucide-react';
import {Avatar} from '@astryxdesign/core/Avatar';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {MoreMenu} from '@astryxdesign/core/MoreMenu';
import {TopNav} from '@astryxdesign/core/TopNav';
import {useLocation} from 'wouter';
import {useCart} from '@/contexts/CartContext';
import {storePath} from '@/lib/format';
import type {BusinessDetails} from '@/lib/types';
import {StickyTop} from './layout';
import {ThemeToggle} from './ThemeToggle';
import {VerifiedBadges} from './VerifiedBadges';

export function StoreHeader({
  businessDetails,
  storeName,
  onSearch,
  onShare,
}: {
  businessDetails: BusinessDetails;
  storeName: string;
  onSearch: () => void;
  onShare: () => void;
}) {
  const [, navigate] = useLocation();
  const {totalItems} = useCart();
  const displayName = businessDetails.name || storeName;
  const logo = businessDetails.business_logo || businessDetails.logo;

  return (
    <StickyTop>
      <TopNav
        label={`${displayName} navigation`}
        heading={
          <Button
            label={displayName}
            variant="ghost"
            href={storePath(storeName)}
            icon={
              logo ? (
                <Avatar src={logo} name={displayName} size="sm" tooltip={false} />
              ) : (
                <Icon icon={Store} />
              )
            }
          />
        }
        startContent={<VerifiedBadges tier={businessDetails.verified} />}
        endContent={
          <HStack gap={1} vAlign="center">
            <IconButton
              label="Search"
              tooltip="Search (Ctrl+K)"
              variant="ghost"
              icon={<Icon icon={Search} />}
              onClick={onSearch}
            />
            <ThemeToggle />
            <MoreMenu
              label="More"
              alignment="end"
              items={[
                {label: "About", icon: <Icon icon={Info} />, onClick: () => navigate(storePath(storeName, "about"))},
                {label: "Contact", icon: <Icon icon={Phone} />, onClick: () => navigate(storePath(storeName, "contact"))},
                {label: "Share store", icon: <Icon icon={Share2} />, onClick: onShare},
              ]}
            />
            <Button
              label={totalItems > 0 ? `Cart, ${totalItems} items` : 'Cart'}
              variant="primary"
              size="sm"
              icon={<Icon icon={ShoppingCart} />}
              endContent={
                totalItems > 0 ? (
                  <Badge variant="neutral" label={totalItems > 99 ? '99+' : String(totalItems)} />
                ) : undefined
              }
              onClick={() => navigate(storePath(storeName, 'cart'))}
            >
              Cart
            </Button>
          </HStack>
        }
      />
    </StickyTop>
  );
}

// Verification marks shown next to a store name.
//   merchant ("true" from older API responses): the owner's identity is verified
//   business: the owner and the CIPC-registered business are verified (adds a gold shield)

import {BadgeCheck, ShieldCheck} from 'lucide-react';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Tooltip} from '@astryxdesign/core/Tooltip';
import type {VerifiedTier} from '@/lib/types';

export function VerifiedBadges({tier}: {tier?: VerifiedTier}) {
  if (tier !== 'merchant' && tier !== 'business' && tier !== 'true') return null;

  return (
    <HStack gap={1} vAlign="center">
      <Tooltip content="The identity of the owner of this shop has been verified!" placement="below">
        <Icon icon={BadgeCheck} color="info" label="Verified merchant" />
      </Tooltip>
      {tier === 'business' && (
        <Tooltip
          content="CIPC-registered business: the owner and the business entity have both been verified!"
          placement="below"
        >
          <Icon icon={ShieldCheck} color="warning" label="Verified business" />
        </Tooltip>
      )}
    </HStack>
  );
}

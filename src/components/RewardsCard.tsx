// Loyalty stamp cards the store offers, one line per product category.

import {Gift} from 'lucide-react';
import {Card} from '@astryxdesign/core/Card';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import type {LoyaltyRule} from '@/lib/api';

export function RewardsCard({rules}: {rules: LoyaltyRule[]}) {
  if (rules.length === 0) return null;

  return (
    <Card padding={4}>
      <VStack gap={2}>
        <HStack gap={2} vAlign="center">
          <Icon icon={Gift} color="accent" />
          <Heading level={2}>Rewards</Heading>
        </HStack>
        <Text type="supporting" size="sm">
          Earn a stamp on every order in these categories.
        </Text>
        <VStack gap={1}>
          {rules.map((rule) => (
            <Text key={rule.category_name}>
              <Text weight="semibold">{rule.category_name}:</Text> collect {rule.stamps_required ?? 10}{' '}
              stamps{rule.reward_description ? ` to get ${rule.reward_description}` : ' to earn a reward'}
            </Text>
          ))}
        </VStack>
      </VStack>
    </Card>
  );
}

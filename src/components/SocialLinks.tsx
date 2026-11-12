import {ExternalLink} from 'lucide-react';
import {Button} from '@astryxdesign/core/Button';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading} from '@astryxdesign/core/Heading';
import {Icon} from '@astryxdesign/core/Icon';
import {VStack} from '@astryxdesign/core/VStack';
import type {BusinessDetails} from '@/lib/types';

const PLATFORMS = [
  ['Facebook', 'facebook'],
  ['Instagram', 'instagram'],
  ['Twitter', 'twitter'],
  ['TikTok', 'tiktok'],
  ['LinkedIn', 'linkedin'],
  ['YouTube', 'youtube'],
] as const;

/** Only http(s) links are rendered; the API data is not trusted to be a safe URL. */
function isSafeUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const {protocol} = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

export function SocialLinks({businessDetails}: {businessDetails: BusinessDetails}) {
  const social = businessDetails.social_media ?? {};
  const links = PLATFORMS.flatMap(([name, key]) => {
    const url = social[key] ?? businessDetails[key];
    return isSafeUrl(url) ? [{name, url}] : [];
  });

  if (links.length === 0) return null;

  return (
    <VStack gap={3}>
      <Heading level={2}>
        Follow us
      </Heading>
      <Grid columns={2} gap={3}>
        {links.map(({name, url}) => (
          <Button
            key={name}
            label={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            endContent={<Icon icon={ExternalLink} />}
          />
        ))}
      </Grid>
    </VStack>
  );
}

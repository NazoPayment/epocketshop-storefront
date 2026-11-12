import {ImageOff} from 'lucide-react';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Center} from '@astryxdesign/core/Center';
import {Icon} from '@astryxdesign/core/Icon';

/** Square product photo that fills its container, with a neutral placeholder. */
export function ProductImage({src, alt, ratio = 1}: {src?: string; alt: string; ratio?: number}) {
  return (
    <AspectRatio ratio={ratio} fit="cover">
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <Center
          height="100%"
          width="100%"
          style={{background: 'var(--color-background-muted)'}}
          aria-hidden="true"
        >
          <Icon icon={ImageOff} size="lg" color="secondary" />
        </Center>
      )}
    </AspectRatio>
  );
}

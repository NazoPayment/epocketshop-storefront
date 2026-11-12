// Adapter that lets Astryx links (Link, Button with `href`) navigate with wouter
// instead of triggering a full page load. External URLs stay plain anchors.

import {forwardRef, type AnchorHTMLAttributes} from 'react';
import {Link as WouterLink} from 'wouter';

type RouterLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {href?: string};

export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(function RouterLink(
  {href, ...rest},
  ref,
) {
  const isInternal = typeof href === 'string' && href.startsWith('/') && !href.startsWith('//');

  if (isInternal && rest.target !== '_blank') {
    return <WouterLink ref={ref} href={href} {...rest} />;
  }
  return <a ref={ref} href={href} {...rest} />;
});

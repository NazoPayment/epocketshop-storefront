import {useLocation} from 'wouter';
import {CircleHelp} from 'lucide-react';
import {Button} from '@astryxdesign/core/Button';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Icon} from '@astryxdesign/core/Icon';
import {PageContainer} from '@/components/layout';

export default function NotFound() {
  const [, navigate] = useLocation();
  return (
    <PageContainer>
      <EmptyState
        icon={<Icon icon={CircleHelp} size="lg" />}
        headingLevel={1}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        actions={<Button label="Go home" variant="primary" onClick={() => navigate('/')} />}
      />
    </PageContainer>
  );
}

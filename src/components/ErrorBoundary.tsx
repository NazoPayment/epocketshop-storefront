import {Component, type ErrorInfo, type ReactNode} from 'react';
import {TriangleAlert} from 'lucide-react';
import {Button} from '@astryxdesign/core/Button';
import {Center} from '@astryxdesign/core/Center';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Icon} from '@astryxdesign/core/Icon';

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{children: ReactNode}, State> {
  state: State = {hasError: false};

  static getDerivedStateFromError(): State {
    return {hasError: true};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Center minHeight="100vh" padding={4}>
        <EmptyState
          icon={<Icon icon={TriangleAlert} size="lg" color="error" />}
          title="Something went wrong"
          description="An unexpected error occurred. Reloading the page usually fixes it."
          headingLevel={1}
          actions={
            <Button label="Reload page" variant="primary" onClick={() => window.location.reload()} />
          }
        />
      </Center>
    );
  }
}

import {useEffect, useRef} from 'react';
import {Center} from '@astryxdesign/core/Center';
import {Spinner} from '@astryxdesign/core/Spinner';
import {VStack} from '@astryxdesign/core/VStack';

const SPLASH_DURATION_MS = 3500;

export function SplashScreen({
  splashLogo,
  onComplete,
}: {
  splashLogo?: string;
  onComplete: () => void;
}) {
  // Keep the latest callback without restarting the timer when it changes.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timer = setTimeout(() => onCompleteRef.current(), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Center
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'var(--color-background-surface)',
      }}
    >
      <VStack gap={6} hAlign="center">
        {splashLogo && (
          <img
            src={splashLogo}
            alt=""
            style={{width: '12rem', height: '12rem', objectFit: 'contain'}}
          />
        )}
        <Spinner size="lg" aria-label="Loading store" />
      </VStack>
    </Center>
  );
}

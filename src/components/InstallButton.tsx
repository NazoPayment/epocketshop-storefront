import {useState} from 'react';
import {Download} from 'lucide-react';
import {Button} from '@astryxdesign/core/Button';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {useInstallPrompt} from '@/hooks/useInstallPrompt';

/** iOS has no install prompt, but every iOS browser can add the app from its Share menu. */
function iosSteps(): string[] {
  const ua = window.navigator.userAgent;
  if (/CriOS/i.test(ua)) {
    return [
      'Tap the Share button in the address bar (the square with an arrow, top right).',
      'Scroll down and choose Add to Home Screen.',
      'Tap Add.',
    ];
  }
  if (/EdgiOS/i.test(ua)) {
    return ['Tap the Share button in the address bar.', 'Choose Add to Home Screen.', 'Tap Add.'];
  }
  if (/FxiOS/i.test(ua)) {
    return ['Tap the menu button (three lines).', 'Tap Share, then choose Add to Home Screen.', 'Tap Add.'];
  }
  return [
    'Tap the Share button at the bottom of the screen (the square with an arrow).',
    'Scroll down and choose Add to Home Screen.',
    'Tap Add.',
  ];
}

/**
 * "Install app" control. Android, Chrome and Edge get the native prompt; iPhone and iPad get the
 * Add to Home Screen steps. Hidden once installed or when installing isn't possible.
 */
export function InstallButton({storeName}: {storeName: string}) {
  const {canInstall, installed, isIos, install} = useInstallPrompt();
  const [showIosHelp, setShowIosHelp] = useState(false);

  if (installed || (!canInstall && !isIos)) return null;

  return (
    <>
      <Button
        label="Install app"
        size="sm"
        icon={<Icon icon={Download} />}
        onClick={canInstall ? () => void install() : () => setShowIosHelp(true)}
      />
      {showIosHelp && (
        <Dialog isOpen onOpenChange={(open) => !open && setShowIosHelp(false)} width={420}>
          <DialogHeader
            title={`Add ${storeName} to your Home Screen`}
            onOpenChange={(open) => !open && setShowIosHelp(false)}
          />
          <VStack gap={3} padding={4} as="ol">
            {iosSteps().map((step, index) => (
              <HStack key={step} as="li" gap={2} vAlign="start">
                <Text weight="semibold">{index + 1}.</Text>
                <Text>{step}</Text>
              </HStack>
            ))}
          </VStack>
          <VStack gap={3} padding={4}>
            <Text type="supporting">
              Don't see Add to Home Screen? Update iOS to 16.4 or later, or open this page in Safari.
            </Text>
            <HStack>
              <Button label="Got it" variant="primary" onClick={() => setShowIosHelp(false)} />
            </HStack>
          </VStack>
        </Dialog>
      )}
    </>
  );
}

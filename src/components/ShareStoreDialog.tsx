// Share the store: QR code (scan at a till or stall), native share sheet, copy link and
// quick links to the usual apps. Mirrors the QR card in epocketshop_admin.

import {useEffect, useState} from 'react';
import QRCode from 'qrcode';
import {Copy, Download, Share2} from 'lucide-react';
import {Button} from '@astryxdesign/core/Button';
import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/VStack';
import {storeUrl} from '@/lib/order';

export function ShareStoreDialog({
  storeName,
  displayName,
  isOpen,
  onOpenChange,
}: {
  storeName: string;
  displayName: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const link = storeUrl(storeName);
  const [qr, setQr] = useState('');
  const [failed, setFailed] = useState(false);
  const [note, setNote] = useState('');
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setFailed(false);
    QRCode.toDataURL(link, {width: 480, margin: 2, errorCorrectionLevel: 'M'})
      .then((dataUrl) => {
        if (!cancelled) setQr(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, link]);

  const message = `Visit ${displayName}: ${link}`;
  const enc = encodeURIComponent;
  const targets = [
    {label: 'WhatsApp', href: `https://wa.me/?text=${enc(message)}`},
    {label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(link)}`},
    {label: 'X', href: `https://twitter.com/intent/tweet?text=${enc(`Visit ${displayName}`)}&url=${enc(link)}`},
    {label: 'Telegram', href: `https://t.me/share/url?url=${enc(link)}&text=${enc(`Visit ${displayName}`)}`},
    {label: 'Email', href: `mailto:?subject=${enc(displayName)}&body=${enc(message)}`},
  ];

  async function shareImage() {
    setNote('');
    try {
      const blob = await (await fetch(qr)).blob();
      const file = new File([blob], `${displayName}-qr.png`, {type: blob.type || 'image/png'});
      const data = {files: [file], title: displayName, text: message};
      if (navigator.canShare?.(data)) await navigator.share(data);
      else await navigator.share({title: displayName, text: message, url: link});
    } catch (err) {
      if ((err as {name?: string})?.name !== 'AbortError') {
        setNote("Sharing isn't available here. Use one of the buttons below.");
      }
    }
  }

  function downloadQr() {
    const anchor = document.createElement("a");
    anchor.href = qr;
    anchor.download = `${displayName}-qr.png`;
    anchor.click();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setNote('Link copied.');
    } catch {
      setNote('Copy failed. Select the link and copy it manually.');
    }
  }

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange} width={480} maxHeight="90dvh" padding={0}>
      <DialogHeader title={`Share ${displayName}`} onOpenChange={onOpenChange} />
      <VStack gap={4} padding={4} isScrollable>
        <Text type="supporting">Scan the QR code to open this store, or share the link.</Text>

        {qr ? (
          <HStack gap={4} vAlign="center" wrap="wrap">
            <img
              src={qr}
              alt={`QR code for ${displayName}'s store`}
              style={{
                width: '12.5rem',
                height: '12.5rem',
                imageRendering: 'pixelated',
                background: '#fff',
                borderRadius: 'var(--radius-md, 0.5rem)',
                padding: '0.5rem',
                border: '1px solid var(--color-border)',
              }}
            />
            <VStack gap={2}>
              {canNativeShare && (
                <Button
                  label="Share QR"
                  variant="primary"
                  icon={<Icon icon={Share2} />}
                  onClick={() => void shareImage()}
                />
              )}
              <Button
                label="Download QR"
                icon={<Icon icon={Download} />}
                onClick={downloadQr}
              />
            </VStack>
          </HStack>
        ) : failed ? (
          <Text type="supporting">The QR code couldn't be created right now.</Text>
        ) : (
          <Text type="supporting">Creating QR code…</Text>
        )}

        <VStack gap={2}>
          <Text type="supporting" maxLines={1}>
            {link}
          </Text>
          <HStack gap={2} wrap="wrap">
            {targets.map((target) => (
              <Button
                key={target.label}
                label={target.label}
                size="sm"
                href={target.href}
                target="_blank"
                rel="noopener noreferrer"
              />
            ))}
            <Button
              label="Copy link"
              size="sm"
              variant="ghost"
              icon={<Icon icon={Copy} />}
              onClick={() => void copyLink()}
            />
          </HStack>
          {note && <Text type="supporting">{note}</Text>}
        </VStack>
      </VStack>
    </Dialog>
  );
}

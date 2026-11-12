import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from 'wouter';
import {MessageCircle, ShieldCheck} from 'lucide-react';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Divider} from '@astryxdesign/core/Divider';
import {Heading} from '@astryxdesign/core/Heading';
import {HStack} from '@astryxdesign/core/HStack';
import {Icon} from '@astryxdesign/core/Icon';
import {Text} from '@astryxdesign/core/Text';
import {TextArea} from '@astryxdesign/core/TextArea';
import {TextInput} from '@astryxdesign/core/TextInput';
import {VStack} from '@astryxdesign/core/VStack';
import {useCart} from '@/contexts/CartContext';
import {useStoreRoute} from '@/hooks/useStoreRoute';
import {fetchCustomer, submitOrder, updateCustomer} from '@/lib/api';
import {currencySymbol, storePath} from '@/lib/format';
import {buildOrderPayload, storeUrl} from '@/lib/order';
import {generateWhatsAppMessage, generateWhatsAppUrl} from '@/lib/whatsapp';
import type {CheckoutForm} from '@/lib/types';
import {AppBar} from '@/components/AppBar';
import {PageContainer, TwoColumn} from '@/components/layout';
import {OrderSummary} from '@/components/OrderSummary';

const MIN_PHONE_LENGTH = 9;
const LOOKUP_DEBOUNCE_MS = 800;

type FormErrors = Partial<Record<keyof CheckoutForm, string>>;

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const {items, totalPrice} = useCart();
  const {businessDetails, storeName} = useStoreRoute();
  const currency = currencySymbol(businessDetails?.currency);

  const [form, setForm] = useState<CheckoutForm>({phone: '', firstName: '', surname: '', note: ''});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [customerFound, setCustomerFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLookedUp = useRef('');

  const setField = <K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) => {
    setForm((prev) => ({...prev, [key]: value}));
    setErrors((prev) => (prev[key] ? {...prev, [key]: undefined} : prev));
  };

  // Nothing to check out: go back to the store.
  useEffect(() => {
    if (items.length === 0 && storeName) navigate(storePath(storeName), {replace: true});
  }, [items.length, storeName, navigate]);

  useEffect(
    () => () => {
      if (lookupTimer.current) clearTimeout(lookupTimer.current);
    },
    [],
  );

  const lookupCustomer = useCallback(async (phone: string) => {
    if (phone.length < MIN_PHONE_LENGTH || lastLookedUp.current === phone) return;
    lastLookedUp.current = phone;
    setIsLookingUp(true);
    const customer = await fetchCustomer(phone);
    // Ignore the answer if the user has since changed the number.
    if (lastLookedUp.current !== phone) return;
    setIsLookingUp(false);

    if (customer && (customer.name || customer.surname)) {
      setCustomerFound(true);
      setForm((prev) => ({
        ...prev,
        firstName: customer.name || prev.firstName,
        surname: customer.surname || prev.surname,
      }));
    }
  }, []);

  const handlePhoneChange = (value: string) => {
    setField('phone', value);
    setCustomerFound(false);
    setIsLookingUp(false);
    lastLookedUp.current = '';
    if (lookupTimer.current) clearTimeout(lookupTimer.current);
    if (value.length >= MIN_PHONE_LENGTH) {
      lookupTimer.current = setTimeout(() => void lookupCustomer(value), LOOKUP_DEBOUNCE_MS);
    }
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (!form.firstName.trim()) next.firstName = 'First name is required';
    if (!form.surname.trim()) next.surname = 'Surname is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCheckout = async () => {
    if (!validate()) return;
    if (!businessDetails) {
      setErrors({phone: 'Store data not loaded. Please try again.'});
      return;
    }

    setIsSubmitting(true);
    try {
      const orderId = Date.now();
      const payload = buildOrderPayload({orderId, storeName, businessDetails, items, totalPrice, form});

      // Neither backend call may block the order: WhatsApp is the source of truth.
      try {
        await updateCustomer(form.phone, form.firstName, form.surname);
      } catch (updateError) {
        console.warn('Customer update failed, continuing:', updateError);
      }
      try {
        await submitOrder(payload);
      } catch (apiError) {
        console.warn('Order API submission failed, continuing to WhatsApp:', apiError);
      }

      const message = generateWhatsAppMessage({
        cartItems: items,
        storeName: businessDetails.name || storeName,
        storeUrl: storeUrl(storeName),
        firstName: form.firstName,
        surname: form.surname,
        phone: form.phone,
        note: form.note,
        orderId,
      });
      const whatsAppUrl = generateWhatsAppUrl(message);

      if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
        // Mobile: hand over to the WhatsApp app in this tab.
        window.location.href = whatsAppUrl;
      } else {
        // Desktop: open WhatsApp Web in a new tab and show the confirmation here.
        window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
        navigate(storePath(storeName, 'confirmation'));
      }
    } catch (error) {
      console.error('Order submission error:', error);
      setErrors({phone: 'Failed to submit order. Please try again.'});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AppBar title="Checkout" onBack={() => navigate(storePath(storeName, 'cart'))} />

      <PageContainer width="medium" gap={5}>
        <TwoColumn
          main={
            <Card padding={4}>
              <VStack gap={4}>
                <Heading level={2}>Your details</Heading>

                <TextInput
                  label="Phone number"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+27 71 234 5678"
                  isRequired
                  value={form.phone}
                  onChange={handlePhoneChange}
                  isLoading={isLookingUp}
                  status={
                    errors.phone
                      ? {type: 'error', message: errors.phone}
                      : customerFound
                        ? {type: 'success', message: 'Customer found. Details filled in.'}
                        : undefined
                  }
                />
                <TextInput
                  label="First name"
                  autoComplete="given-name"
                  placeholder="Enter your first name"
                  isRequired
                  value={form.firstName}
                  onChange={(v) => setField('firstName', v)}
                  status={errors.firstName ? {type: 'error', message: errors.firstName} : undefined}
                />
                <TextInput
                  label="Surname"
                  autoComplete="family-name"
                  placeholder="Enter your surname"
                  isRequired
                  value={form.surname}
                  onChange={(v) => setField('surname', v)}
                  status={errors.surname ? {type: 'error', message: errors.surname} : undefined}
                />
                <TextArea
                  label="Order note"
                  isOptional
                  rows={3}
                  placeholder="Any special instructions or requests..."
                  value={form.note}
                  onChange={(v) => setField('note', v)}
                />
              </VStack>
            </Card>
          }
          aside={
            <Card padding={4}>
              <VStack gap={4}>
                <OrderSummary items={items} totalPrice={totalPrice} currency={currency} />
                <Divider />
                <Button
                  label="Place order on WhatsApp"
                  variant="primary"
                  size="lg"
                  width="100%"
                  icon={<Icon icon={MessageCircle} />}
                  isLoading={isSubmitting}
                  onClick={() => void handleCheckout()}
                />
                <HStack gap={2} vAlign="center">
                  <Icon icon={ShieldCheck} size="sm" color="secondary" />
                  <Text type="supporting" size="sm">
                    WhatsApp opens with your order ready to send. Press Send to confirm it with the
                    store.
                  </Text>
                </HStack>
              </VStack>
            </Card>
          }
        />
      </PageContainer>
    </>
  );
}

// WhatsApp order message + link generation.
//
// The message layout is parsed by the ePocketShop backend, so keep the wording
// (including "Custumer Note") and the invisible U+2060 characters in the item
// bullets exactly as they are.

import {config} from './config';
import {calculateItemTotal} from './format';
import type {CartItem} from './types';

const BULLET = '\u2022\u2060  \u2060';

export function generateWhatsAppMessage(args: {
  cartItems: CartItem[];
  storeName: string;
  storeUrl: string;
  firstName: string;
  surname: string;
  phone: string;
  note: string;
  orderId?: number;
}): string {
  const {cartItems, storeName, storeUrl, firstName, surname, phone, note} = args;
  const timestamp = args.orderId ?? Date.now();

  const itemLines = cartItems
    .map((item) => {
      const rands = calculateItemTotal(item) / 100;
      return `${BULLET}${item.quantity}x ${item.product.name}   R ${rands.toFixed(1)}`;
    })
    .join('\n');

  const totalRands =
    cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0) / 100;

  return `_${timestamp}_
*Order Summary --${storeName}*
Store Url -> ${storeUrl}

Items:
${itemLines}

Total: R ${totalRands.toFixed(1)}
-------------------------------
Customer details:
Name: ${firstName} ${surname}
Contacts: ${phone}
-------------------------------
Custumer Note
${note}
-------------------------------
Press 👉🏿👉🏿 send button.`;
}

/** Build the wa.me link. Orders always go to the platform's WhatsApp number. */
export function generateWhatsAppUrl(message: string): string {
  return `https://wa.me/${config.defaultWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}

/** Build a wa.me link to chat with a store about a general question. */
export function generateChatUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

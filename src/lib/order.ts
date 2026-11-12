// Builds the order payload sent to the ePocketShop order API.

import {config} from './config';
import type {InvoiceItem, OrderPayload} from './api';
import type {BusinessDetails, CartItem, CheckoutForm} from './types';

export function buildInvoiceItems(items: CartItem[]): InvoiceItem[] {
  return items.map((item) => {
    const extras = item.selectedExtras.map((e) => ({
      id: e.id,
      name: e.name,
      price: e.price ?? 0,
    }));

    const options = item.selectedOption
      ? [
          {
            id: item.selectedOption.id,
            option: item.selectedOption.name,
            price: item.selectedOption.price,
          },
        ]
      : [];

    // Unit price in RANDS: base price arrives in cents, options/extras already in rands.
    const unitPriceRands =
      item.product.price / 100 +
      item.selectedExtras.reduce((sum, e) => sum + (e.price ?? 0), 0) +
      (item.selectedOption?.price ?? 0);

    return {
      id: item.product.id,
      business_id: item.product.business_id,
      name: item.product.name,
      description: item.product.description || '',
      category: item.product.category || 'other',
      price: unitPriceRands,
      order_quantity: item.quantity,
      extras,
      options,
    };
  });
}

export function buildOrderPayload(args: {
  orderId: number;
  storeName: string;
  businessDetails: BusinessDetails;
  items: CartItem[];
  /** Cart total in cents. */
  totalPrice: number;
  form: CheckoutForm;
}): OrderPayload {
  const {orderId, storeName, businessDetails, items, totalPrice, form} = args;

  return {
    orderId,
    vendorsNumber: businessDetails.vendor_number || config.defaultWhatsAppNumber,
    shop_name: storeName,
    payment_method: 'cash',
    delivery_options: [],
    amount: totalPrice,
    url: storeUrl(storeName),
    invoice_items: buildInvoiceItems(items),
    customer: {
      name: form.firstName,
      surname: form.surname,
      phone_number: form.phone,
      note: form.note,
    },
  };
}

export function storeUrl(storeName: string): string {
  return `${config.storeBaseUrl}/${encodeURIComponent(storeName)}`;
}

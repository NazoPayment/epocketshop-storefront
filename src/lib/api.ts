// ePocketShop storefront: API layer

import {config} from './config';
import type {Customer, Product, StoreData} from './types';

async function postJson(url: string, body: unknown, headers: Record<string, string> = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', ...headers},
    body: JSON.stringify(body),
  });
}

export async function fetchStoreData(businessName: string): Promise<StoreData> {
  const response = await postJson(`${config.apiBaseUrl}/get_product`, {
    business_name: businessName,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch store data: ${response.status}`);
  }

  const data = await response.json();

  // Normalize business_details so it always has a `name`.
  const businessDetails = data.business_details || {};
  if (!businessDetails.name && businessDetails.business_name) {
    businessDetails.name = businessDetails.business_name;
  }

  // `verified` is a string tier ("false" | "merchant" | "business"); keep it raw.

  // Normalize options: the API sends `option`, the UI reads `name`.
  const products: Product[] = (data.products || []).map((p: Product) => ({
    ...p,
    options: (p.options || []).map((opt) => ({
      ...opt,
      name: opt.name || opt.option,
    })),
  }));

  return {
    products,
    business_details: businessDetails,
    epocket_shop_details: data.epocket_shop_details,
  };
}

export async function fetchCustomer(customerNumber: string): Promise<Customer | null> {
  try {
    const response = await postJson(`${config.apiBaseUrl}/get_customer`, {
      customer_number: customerNumber,
    });
    if (!response.ok) return null;

    const data = await response.json();
    // Treat an empty object or a record without any name field as "not found".
    if (!data || (!data.first_name && !data.surname && !data.name)) return null;
    return data as Customer;
  } catch {
    return null;
  }
}

export async function updateCustomer(
  customerNumber: string,
  name: string,
  surname: string,
): Promise<void> {
  const response = await postJson(`${config.apiBaseUrl}/update_customer`, {
    customer_number: customerNumber,
    name,
    surname,
  });

  if (!response.ok) {
    throw new Error(`Failed to update customer: ${response.status}`);
  }
}

export interface InvoiceItem {
  id: string | number;
  business_id?: string | number;
  name: string;
  description?: string | string[];
  category?: string;
  price: number;
  order_quantity: number;
  extras: Array<{id?: string | number; name: string; price: number}>;
  options: Array<{id?: string | number; option?: string; price?: number}>;
}

export interface OrderPayload {
  orderId: number;
  vendorsNumber: string;
  shop_name: string;
  payment_method: string;
  delivery_options: unknown[];
  amount: number;
  url: string;
  invoice_items: InvoiceItem[];
  customer: {
    name: string;
    surname: string;
    phone_number: string;
    note: string;
  };
}

function randomHex(length: number): string {
  const bytes = new Uint8Array(length / 2);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function submitOrder(payload: OrderPayload): Promise<void> {
  // W3C trace context so the order shows up in the backend's traces.
  const traceparent = `00-${randomHex(32)}-${randomHex(16)}-01`;

  const response = await postJson(`${config.orderApiUrl}/order`, payload, {traceparent});

  if (!response.ok) {
    throw new Error(`Failed to submit order: ${response.status}`);
  }
}

export interface LoyaltyRule {
  category_name: string;
  stamps_required?: number;
  reward_description?: string;
}

/** Stamp-card rules the vendor configured per product category (public, may be empty). */
export async function fetchLoyaltyRules(businessId: string | number): Promise<LoyaltyRule[]> {
  try {
    const response = await fetch(
      `${config.apiBaseUrl}/get_category_loyalty_rules/${encodeURIComponent(String(businessId))}`,
    );
    if (!response.ok) return [];
    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as LoyaltyRule[]).filter((r) => r?.category_name) : [];
  } catch {
    return [];
  }
}

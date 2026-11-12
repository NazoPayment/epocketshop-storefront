// Price helpers.
//
// Units matter here: product prices from the API are in CENTS, while option and
// extra prices are in RANDS. Line totals are always kept in cents.

import type {CartItem} from './types';

/** Format an amount in cents, e.g. 12500 -> "R 125.00". */
export function formatPrice(priceInCents: number, currency = 'R'): string {
  return `${currency} ${(priceInCents / 100).toFixed(2)}`;
}

/** Format an amount already in rands (options, extras). */
export function formatRands(priceInRands: number, currency = 'R'): string {
  return `${currency} ${priceInRands.toFixed(2)}`;
}

/** Line total in cents: base price + selected option + extras, times quantity. */
export function calculateItemTotal(
  item: Pick<CartItem, 'product' | 'quantity' | 'selectedOption' | 'selectedExtras'>,
): number {
  let total = item.product.price * item.quantity;

  if (item.selectedOption?.price) {
    total += item.selectedOption.price * 100 * item.quantity;
  }

  for (const extra of item.selectedExtras ?? []) {
    if (extra.price) total += extra.price * 100 * item.quantity;
  }

  return total;
}

const CURRENCY_SYMBOLS: Record<string, string> = {ZAR: 'R', R: 'R', USD: '$', EUR: '€', GBP: '£'};

/** The API sends ISO codes ("ZAR"); show the familiar symbol where there is one. */
export function currencySymbol(currency: string | undefined): string {
  if (!currency) return 'R';
  return CURRENCY_SYMBOLS[currency.toUpperCase()] ?? currency;
}

export function decodeStoreName(param: string | undefined): string {
  if (!param) return '';
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

export function storePath(storeName: string, sub = ''): string {
  return `/${encodeURIComponent(storeName)}${sub ? `/${sub}` : ''}`;
}

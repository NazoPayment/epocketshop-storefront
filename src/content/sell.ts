// Copy for the "Sell on ePocketShop" section of the home page.
// Edit the text here; the destination links live in src/lib/config.ts (adminUrl, infoUrl).

import {
  BarChart3,
  Bot,
  Gift,
  Package,
  QrCode,
  ReceiptText,
  Store,
  Truck,
  type LucideIcon,
} from 'lucide-react';

export const SELL_INTRO = {
  title: 'Want your own store?',
  text: 'ePocketShop gives every business a free online store that takes orders on WhatsApp. Create yours in minutes and manage everything from the ePocketShop admin.',
};

export const SELL_STEPS = [
  {title: 'Create your account', text: 'Sign up in the admin. Your online store is generated for you.'},
  {title: 'Add your products', text: 'Upload photos, descriptions, options and extras, and sort them into categories.'},
  {title: 'Share your link and sell', text: 'Send your store link or QR code. Orders arrive ready to confirm.'},
] as const;

export interface SellFeature {
  icon: LucideIcon;
  title: string;
  text: string;
}

export const SELL_FEATURES: readonly SellFeature[] = [
  {icon: Store, title: 'Free online store', text: 'A store like this one, generated from the products you add.'},
  {icon: Package, title: 'Orders and products', text: 'Receive, confirm and track orders, and manage stock and prices.'},
  {icon: ReceiptText, title: 'Invoices and payments', text: 'Paid and unpaid invoices, with online or cash payment options.'},
  {icon: Truck, title: 'Delivery', text: 'Offer delivery options, or use your own delivery system.'},
  {icon: Gift, title: 'Loyalty rewards', text: 'Stamp cards that reward repeat customers by category.'},
  {icon: BarChart3, title: 'Analytics', text: 'See sales, daily performance and your best-selling products.'},
  {icon: Bot, title: 'AI insights', text: 'An assistant that answers questions about your business.'},
  {icon: QrCode, title: 'Share anywhere', text: 'QR code and links for WhatsApp, social media and your till.'},
];

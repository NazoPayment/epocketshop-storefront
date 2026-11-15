// ePocketShop storefront: shared type definitions

export interface ProductOption {
  id?: string | number;
  option?: string;
  name?: string;
  price?: number;
}

export interface ProductExtra {
  id?: string | number;
  name: string;
  price?: number;
  add?: boolean;
}

export interface Product {
  id: string | number;
  business_id?: string | number;
  name: string;
  description?: string;
  /** Price in cents. Option and extra prices are in rands. */
  price: number;
  category?: string;
  image?: string;
  options?: ProductOption[];
  extras?: ProductExtra[];
  available_stock?: number;
  available?: boolean;
  is_paused?: boolean;
}

export type VerifiedTier = 'false' | 'true' | 'merchant' | 'business';

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  linkedin?: string;
  youtube?: string;
}

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface DayHours {
  closed: boolean;
  open: string;
  close: string;
}

export interface OperatingHours {
  enabled: boolean;
  days: Record<DayKey, DayHours>;
}

export interface ShopStatus {
  enabled: boolean;
  is_open: boolean;
  timezone: string;
  current_day: DayKey | string;
  current_local_time?: string;
  today_hours?: DayHours | null;
  next_open_at?: string | null;
  next_open_label?: string | null;
  closed_message?: string | null;
}

export interface BusinessDetails {
  name?: string;
  business_name?: string;
  currency: string;
  vendor_number?: string;
  logo?: string;
  business_logo?: string;
  splash_logo?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  accent_color?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  linkedin?: string;
  youtube?: string;
  verified?: VerifiedTier;
  social_media?: SocialMedia;
  operating_hours?: OperatingHours | null;
  timezone?: string;
  shop_status?: ShopStatus | null;
}

export interface StoreData {
  products: Product[];
  business_details: BusinessDetails;
  epocket_shop_details?: {
    whatsapp_number?: string;
    banner_url?: string;
    express_shop?: boolean;
  };
}

export interface Customer {
  first_name?: string;
  name?: string;
  surname?: string;
  phone?: string;
  phone_number?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: ProductOption;
  selectedExtras: ProductExtra[];
  /** Line total in cents. */
  itemTotal: number;
}

export interface CheckoutForm {
  phone: string;
  firstName: string;
  surname: string;
  note: string;
}

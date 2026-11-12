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

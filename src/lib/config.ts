// Runtime configuration, overridable through Vite env vars (see .env.example).

const LOCAL_API = 'http://localhost:5010';

const env = import.meta.env;

export const config = {
  apiBaseUrl:
    env.VITE_API_BASE_URL ??
    // Dev: same-origin proxy to the production read API (see vite.config.ts).
    (env.DEV ? '/__api/whatsapp' : 'https://api.prod.whatsapp-service.epocketshop.store'),
  // Dev never talks to the production order API, so test orders can't reach real vendors.
  orderApiUrl:
    env.VITE_ORDER_API_URL ??
    (env.DEV ? LOCAL_API : 'https://api.prod.epocketshop-service.epocketshop.store'),
  storeBaseUrl: env.VITE_STORE_BASE_URL ?? 'https://epocketshop.store',
  // Where a would-be seller goes to create a store, and where they can read more.
  // Change these two (or set VITE_ADMIN_URL / VITE_INFO_URL) when the sites move.
  adminUrl:
    env.VITE_ADMIN_URL ?? 'https://epocketshopadmin-1hadyzjgy-ptmahlangu.vercel.app/login',
  infoUrl: env.VITE_INFO_URL ?? 'https://epocketshop-web.vercel.app/',
  defaultWhatsAppNumber: env.VITE_DEFAULT_WHATSAPP_NUMBER ?? '+27739379358',
} as const;

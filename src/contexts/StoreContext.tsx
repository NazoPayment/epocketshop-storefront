// Store data (products + business details) for the store in the URL.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {fetchStoreData} from '@/lib/api';
import type {BusinessDetails, Product, StoreData} from '@/lib/types';

interface StoreContextValue {
  storeData: StoreData | null;
  loading: boolean;
  error: string | null;
  storeName: string;
  loadStore: (name: string) => Promise<void>;
  products: Product[];
  businessDetails: BusinessDetails | null;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({children}: {children: ReactNode}) {
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storeName, setStoreName] = useState('');
  // Only the most recent request may write state, so a slow response for a
  // previous store can never overwrite the one the user is looking at.
  const latestRequest = useRef(0);

  const loadStore = useCallback(async (name: string) => {
    if (!name) {
      setError('No store name provided.');
      return;
    }
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);
    setStoreName(name);
    try {
      const data = await fetchStoreData(name);
      if (requestId !== latestRequest.current) return;
      setStoreData(data);
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setError(err instanceof Error ? err.message : 'Failed to load store. Please try again.');
      setStoreData(null);
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      storeData,
      loading,
      error,
      storeName,
      loadStore,
      products: storeData?.products ?? [],
      businessDetails: storeData?.business_details ?? null,
    }),
    [storeData, loading, error, storeName, loadStore],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

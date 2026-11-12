import {useEffect} from 'react';
import {useParams} from 'wouter';
import {useStore} from '@/contexts/StoreContext';
import {decodeStoreName} from '@/lib/format';

/**
 * Resolve the `:store` URL segment and make sure that store's data is loaded,
 * so every store page works when opened directly (not only via the store page).
 */
export function useStoreRoute() {
  const params = useParams<{store: string}>();
  const store = useStore();
  const routeName = decodeStoreName(params.store);
  const {loadStore, storeName} = store;

  useEffect(() => {
    if (routeName && routeName !== storeName) {
      void loadStore(routeName);
    }
  }, [routeName, storeName, loadStore]);

  return {...store, routeName, storeName: routeName || storeName};
}

// Cart state. Intentionally NOT persisted: every session starts with an empty cart.

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {calculateItemTotal} from '@/lib/format';
import type {CartItem, Product, ProductExtra, ProductOption} from '@/lib/types';

interface CartContextValue {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity: number,
    selectedOption?: ProductOption,
    selectedExtras?: ProductExtra[],
  ) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  /** Cart total in cents. */
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({children}: {children: ReactNode}) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback<CartContextValue['addItem']>(
    (product, quantity, selectedOption, selectedExtras = []) => {
      const itemTotal = calculateItemTotal({product, quantity, selectedOption, selectedExtras});
      setItems((prev) => [...prev, {product, quantity, selectedOption, selectedExtras, itemTotal}]);
    },
    [],
  );

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((_, i) => i !== index);
      return prev.map((item, i) =>
        i === index ? {...item, quantity, itemTotal: calculateItemTotal({...item, quantity})} : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce((sum, item) => sum + item.itemTotal, 0),
    }),
    [items, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

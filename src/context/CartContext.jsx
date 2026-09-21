import { useCallback, useMemo, useState } from 'react';
import { CartContext } from './cartContext';
import Toast from '../components/ui/Toast';

const STORAGE_KEY = 'sajilo-cart';

function readCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);
  const [toast, setToast] = useState(null);

  function persist(nextItems) {
    setItems(nextItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
  }

  const addToCart = useCallback((product) => {
    const existing = items.find((item) => item.id === product.id);
    const nextItems = existing
      ? items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [{ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, quantity: 1 }, ...items];
    persist(nextItems);
    setToast(`${product.title} added to your cart.`);
  }, [items]);

  const updateQuantity = useCallback((id, quantity) => {
    const nextQuantity = Math.max(1, Number(quantity) || 1);
    persist(items.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item)));
  }, [items]);

  const removeFromCart = useCallback((id) => {
    persist(items.filter((item) => item.id !== id));
  }, [items]);

  const value = useMemo(() => ({
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
  }), [items, addToCart, updateQuantity, removeFromCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast ? <Toast message={toast} onDismiss={() => setToast(null)} /> : null}
    </CartContext.Provider>
  );
}

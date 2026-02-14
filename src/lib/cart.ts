export type CartItem = {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  quantity: number;
};

const STORAGE_KEY = "courseforgo_cart";

const isBrowser = () => typeof window !== "undefined";

export const getCartItems = (): CartItem[] => {
  if (!isBrowser()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const setCartItems = (items: CartItem[]) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const addToCart = (item: Omit<CartItem, "quantity">) => {
  const items = getCartItems();
  const existing = items.find((cartItem) => cartItem.id === item.id);
  if (existing) {
    existing.quantity += 1;
    setCartItems([...items]);
    return;
  }
  setCartItems([...items, { ...item, quantity: 1 }]);
};

export const removeFromCart = (id: string) => {
  const items = getCartItems().filter((item) => item.id !== id);
  setCartItems(items);
};

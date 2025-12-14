import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { BusinessCardData } from "@/components/BusinessCardForm";
import { useAuth } from './AuthContext';
import { apiFetch } from "@/services/api";
import { defaultBackSizes, defaultPositions, defaultPositionsBack, defaultSizes } from "@/components/CardPreviewWithDesign";


const CART_STORAGE_KEY = 'cart_sync_cache'; 

export interface DesignPositions {
  name: { x: number; y: number };
  title: { x: number; y: number };
  company: { x: number; y: number };
  logo: { x: number; y: number };
}

export interface DesignSizes {
  name: number;
  title: number;
  company: number;
  logo: number;
}

export interface BackDesignPositions {
  email: { x: number; y: number };
  phone: { x: number; y: number };
  website: { x: number; y: number };
  address: { x: number; y: number };
  qr: { x: number; y: number };
}

export interface BackDesignSizes {
  email: number;
  phone: number;
  website: number;
  address: number;
  qr: number;
}

export interface CardDesignData {
  positions?: DesignPositions;
  sizes?: DesignSizes;
  positionsBack?: BackDesignPositions;
  backSizes?: BackDesignSizes;
  font?: string;
  fontSize?: number;
  textColor?: string;
  accentColor?: string;
  isEditLayout?: boolean;
  qrColor?: string;
  qrLogoUrl?: string;
  qrData?: string;
}

export type CartItem = {
  quantity: any;
  productId: any;
  id: string;
  kind: "classic" | "server";
  data: BusinessCardData;
  selectedFont: string;
  fontSize: number;
  textColor: string;
  accentColor: string;
  price: number;
  serverMeta?: {
    name?: string;
    background_url?: string | null;
    back_background_url?: string | null;
    config?: any;
    qrColor?: string;
    qrLogoUrl?: string;
  };
  design?: CardDesignData;
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  thumbnailUrl?: string | null;
  frontData?: any;
  backData?: any;
  createdAt?: Date;
  updatedAt?: Date;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'id'> & { id?: string }) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  total: number;
  isLoading: boolean;
  forceReload: () => void;
  debugInfo: () => void;
  clearCache: () => void;
  syncCart: () => Promise<void>; // New sync function
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const fetchCartFromServer = async (): Promise<CartItem[]> => {
  try {
    const response = await apiFetch('/api/cart');
    // ✅ Check karein ki items array exist karta hai ya nahi
    if (response.data && Array.isArray(response.data.items)) {
      return response.data.items;
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch cart from server:', error);
    return [];
  }
};

const saveCartToServer = async (items: CartItem[]): Promise<boolean> => {
  try {
    await apiFetch('/api/cart', {
      method: 'PUT',
      body: JSON.stringify({ items })
    });
    return true;
  } catch (error) {
    console.error('Failed to save cart to server:', error);
    return false;
  }
};

// In addItemToServer function, check what you're sending:
const addItemToServer = async (item: CartItem) => {
  return apiFetch('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify({ item }),
  });
};

const removeItemFromServer = async (itemId: string): Promise<boolean> => {
  try {
    await apiFetch(`/api/cart/items/${itemId}`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    console.error('Failed to remove item from server:', error);
    return false;
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // ✅ 1. Load cart from MongoDB when user logs in
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const serverItems = await fetchCartFromServer();
          setItems(serverItems);
          console.log('✅ Cart loaded from MongoDB:', serverItems.length, 'items');
        } catch (error) {
          console.error('❌ Error loading cart from MongoDB:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Guest user - keep minimal localStorage cache
        try {
          const cached = localStorage.getItem(CART_STORAGE_KEY);
          if (cached) {
            const cachedItems = JSON.parse(cached);
            setItems(cachedItems);
            console.log('✅ Cart loaded from cache for guest');
          }
        } catch (error) {
          console.error('❌ Error loading cart from cache:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadCart();
  }, [user]);

  // ✅ 2. Add item to cart
   const add = async (itemData: any) => {
    
     const generatedId = itemData.id || `card_${Date.now()}`;

     const newItem = {
      id: generatedId,
      productId: itemData.productId || generatedId,
      kind: itemData.kind,
      quantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // User Data
      data: itemData.data,
      
      // Styles
      selectedFont: itemData.selectedFont,
      fontSize: itemData.fontSize,
      textColor: itemData.textColor,
      accentColor: itemData.accentColor,
      price: itemData.price,

      // ✅ Images (Ye ab save honge)
      frontImageUrl: itemData.frontImageUrl || "", 
      backImageUrl: itemData.backImageUrl || "",
      thumbnailUrl: itemData.thumbnailUrl || itemData.frontImageUrl || "",

      // Design Positions (Jo aapke dump me frontData/backData me dikh rahe hain)
      frontData: itemData.frontData || itemData.design, 
      backData: itemData.backData || {
         positionsBack: itemData.design?.positionsBack,
         backSizes: itemData.design?.backSizes
      },

       design: itemData.design,

      // Server Meta
      serverMeta: itemData.serverMeta,
    };

    const currentItems = Array.isArray(items) ? items : [];
    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    // ✅ Save to MongoDB if user is logged in
    if (user) {
      try {
        console.log("Saving to MongoDB with images...");
        await addItemToServer(newItem);
        console.log('✅ Item saved to MongoDB cart successfully');
      } catch (error) {
        console.error('❌ Failed to save to MongoDB:', error);
        // Fallback: Agar single item add fail ho, toh pura array save karo
        await saveCartToServer(updatedItems);
      }
    } else {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    }
  };


  // ✅ 3. Remove item from cart
  const remove = async (id: string) => {
    const updatedItems = items.filter((x) => x.id !== id);
    setItems(updatedItems);
    
    if (user) {
      try {
        await removeItemFromServer(id);
        console.log('✅ Item removed from MongoDB cart');
      } catch (error) {
        console.error('❌ Failed to remove from MongoDB:', error);
        // Fallback: Save updated array
        await saveCartToServer(updatedItems);
      }
    } else {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    }
  };

  // ✅ 4. Clear cart
  const clear = async () => {
    setItems([]);
    
    if (user) {
      try {
        await apiFetch('/api/cart', { method: 'DELETE' });
        console.log('✅ Cart cleared from MongoDB');
      } catch (error) {
        console.error('❌ Failed to clear MongoDB cart:', error);
      }
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  // ✅ 5. Manual sync function
  const syncCart = async () => {
    if (user) {
      try {
        await saveCartToServer(items);
        console.log('✅ Cart synced to MongoDB');
      } catch (error) {
        console.error('❌ Sync failed:', error);
      }
    }
  };

  // ✅ 6. Clear cache
  const clearCache = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    console.log('🧹 Cache cleared');
  };

  // ✅ 7. Debug function
  const debugInfo = () => {
    console.log('=== CART DEBUG INFO ===');
    console.log('User:', user ? 'Logged in' : 'Guest');
    console.log('Items in state:', items.length);
    console.log('Items:', items);
  };

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + (item?.price || 0), 0);
  }, [items]);

  const value = useMemo(() => ({
    items,
    add,
    remove,
    clear,
    total,
    isLoading,
    forceReload: () => fetchCartFromServer().then(setItems),
    debugInfo,
    clearCache,
    syncCart,
  }), [items, total, isLoading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
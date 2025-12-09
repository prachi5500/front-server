// import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
// import { BusinessCardData } from "@/components/BusinessCardForm";
// import { useAuth } from './AuthContext';
// import axios from 'axios';

// // ✅ LOCAL STORAGE KEYS
// const CART_STORAGE_KEY = 'bcard_cart_data';
// const GUEST_CART_KEY = 'bcard_guest_cart';

// // Design data types
// export interface DesignPositions {
//   name: { x: number; y: number };
//   title: { x: number; y: number };
//   company: { x: number; y: number };
//   logo: { x: number; y: number };
// }

// export interface DesignSizes {
//   name: number;
//   title: number;
//   company: number;
//   logo: number;
// }

// export interface BackDesignPositions {
//   email: { x: number; y: number };
//   phone: { x: number; y: number };
//   website: { x: number; y: number };
//   address: { x: number; y: number };
//   qr: { x: number; y: number };
// }

// export interface BackDesignSizes {
//   email: number;
//   phone: number;
//   website: number;
//   address: number;
//   qr: number;
// }

// export interface CardDesignData {
//   positions?: DesignPositions;
//   sizes?: DesignSizes;
//   positionsBack?: BackDesignPositions;
//   backSizes?: BackDesignSizes;
//   font?: string;
//   fontSize?: number;
//   textColor?: string;
//   accentColor?: string;
//   isEditLayout?: boolean;
//   qrColor?: string;
//   qrLogoUrl?: string;
//   qrData?: string;
// }

// export type CartItem = {
//   id: string;
//   kind: "classic" | "server";
//   data: BusinessCardData;
//   selectedFont: string;
//   fontSize: number;
//   textColor: string;
//   accentColor: string;
//   price: number;
//   serverMeta?: {
//     name?: string;
//     background_url?: string | null;
//     back_background_url?: string | null;
//     config?: any;
//     qrColor?: string;
//     qrLogoUrl?: string;
//   };
//   design?: CardDesignData;
//   frontImageUrl?: string | null;
//   backImageUrl?: string | null;
//   thumbnailUrl?: string | null;
//   frontData?: any | null;
//   backData?: any | null;
// };

// type CartContextValue = {
//   items: CartItem[];
//   add: (item: Omit<CartItem, 'id'> & { id?: string }) => Promise<void>;
//   remove: (id: string) => Promise<void>;
//   clear: () => Promise<void>;
//   total: number;
//   isLoading: boolean;
//   forceReload: () => void; // ✅ New function
//   debugInfo: () => void; // ✅ Debug function
//   clearLocalStorage: () => void; // Add this line
// };

// const CartContext = createContext<CartContextValue | undefined>(undefined);

// // Default positions and sizes
// export const defaultPositions = {
//   name: { x: 10, y: 30 },
//   title: { x: 10, y: 45 },
//   company: { x: 10, y: 55 },
//   logo: { x: 10, y: 10 }
// };

// export const defaultSizes = {
//   name: 28,
//   title: 20,
//   company: 18,
//   logo: 80
// };

// export const defaultPositionsBack = {
//   email: { x: 10, y: 15 },
//   phone: { x: 10, y: 30 },
//   website: { x: 10, y: 45 },
//   address: { x: 10, y: 60 },
//   qr: { x: 60, y: 20 }
// };

// export const defaultBackSizes = {
//   email: 16,
//   phone: 16,
//   website: 16,
//   address: 16,
//   qr: 120
// };

// // ✅ SIMPLE localStorage functions WITHOUT compression
// const saveToStorage = (key: string, data: CartItem[]): boolean => {
//   try {
//     // Remove base64 images - yeh sabse bada data hai
//     const itemsWithoutImages = data.map(item => ({
//       ...item,
//       frontImageUrl: undefined,
//       backImageUrl: undefined,
//       thumbnailUrl: undefined,
//     }));
    
//     localStorage.setItem(key, JSON.stringify(itemsWithoutImages));
//     return true;
//   } catch (error) {
//     console.error('Storage error:', error);
//     return false;
//   }
// };

// const loadFromStorage = (key: string): CartItem[] => {
//   try {
//     const data = localStorage.getItem(key);
//     if (!data) return [];
    
//     const parsed = JSON.parse(data);
//     return Array.isArray(parsed) ? parsed : [];
//   } catch (error) {
//     console.error('Load error:', error);
//     localStorage.removeItem(key);
//     return [];
//   }
// };

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { user } = useAuth();
//   const [version] = useState(Date.now()); // Force re-render

//   // ✅ 1. LOAD FROM localStorage ON MOUNT (IMMEDIATELY)
//   useEffect(() => {
//     console.log('🔄 CartProvider mounting...');
    
//     const loadInitialCart = () => {
//       try {
//         // Try multiple storage keys for backward compatibility
//         const storageKeys = [
//           CART_STORAGE_KEY,
//           'business_card_cart_v2',
//           'business_card_cart',
//           GUEST_CART_KEY
//         ];
        
//         let loadedItems: CartItem[] = [];
        
//         for (const key of storageKeys) {
//           const data = loadFromStorage(key);
//           if (data.length > 0) {
//             console.log(`✅ Found cart in ${key}: ${data.length} items`);
//             loadedItems = data;
//             break;
//           }
//         }
        
//         if (loadedItems.length > 0) {
//           setItems(loadedItems);
//           console.log('✅ Cart loaded from localStorage:', loadedItems.length, 'items');
//         } else {
//           console.log('ℹ️ No cart found in localStorage');
//         }
//       } catch (error) {
//         console.error('❌ Error loading cart:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadInitialCart();
//   }, []); // Empty dependency - runs ONLY once on mount

//   // ✅ 2. SAVE TO localStorage WHEN ITEMS CHANGE
//   useEffect(() => {
//     if (items.length === 0) return;
    
//     console.log('💾 Saving cart to localStorage:', items.length, 'items');
    
//     // Save to both keys for redundancy
//     saveToStorage(CART_STORAGE_KEY, items);
    
//     if (!user) {
//       saveToStorage(GUEST_CART_KEY, items);
//     }
    
//     // Also save to old key for backup
//     saveToStorage('business_card_cart', items);
    
//   }, [items, user]); // Runs when items or user changes

//   // ✅ 3. LOAD FROM API (only when user logs in)
//   useEffect(() => {
//     if (!user) return;
    
//     console.log('🌐 Loading cart from API for user...');
    
//     const loadFromAPI = async () => {
//       try {
//         const { data } = await axios.get('/api/cart', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         });
        
//         const apiItems = Array.isArray(data) ? data : [];
//         console.log('📦 API returned:', apiItems.length, 'items');
        
//         if (apiItems.length > 0) {
//           // Merge API items with localStorage items
//           const mergedItems = [...items, ...apiItems].filter((item, index, self) =>
//             index === self.findIndex((t) => t.id === item.id)
//           );
          
//           setItems(mergedItems);
//           saveToStorage(CART_STORAGE_KEY, mergedItems);
//         }
//       } catch (error) {
//         console.error('❌ API load failed:', error);
//         // Keep localStorage data
//       }
//     };

//     loadFromAPI();
//   }, [user]); // Only runs when user changes

//   const add = async (itemData: Omit<CartItem, 'id'> & { id?: string }) => {
//     const id = itemData.id || `card_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    
//     const newItem: CartItem = {
//       ...itemData as CartItem,
//       id,
//       design: itemData.design || {
//         positions: itemData.frontData?.positions || defaultPositions,
//         sizes: itemData.frontData?.sizes || defaultSizes,
//         positionsBack: itemData.backData?.positionsBack || defaultPositionsBack,
//         backSizes: itemData.backData?.backSizes || defaultBackSizes,
//         font: itemData.selectedFont || "Arial, sans-serif",
//         fontSize: itemData.fontSize || 16,
//         textColor: itemData.textColor || "#000000",
//         accentColor: itemData.accentColor || "#0ea5e9",
//         isEditLayout: false,
//         qrColor: itemData.serverMeta?.qrColor || "#000000",
//         qrLogoUrl: itemData.serverMeta?.qrLogoUrl,
//         qrData: itemData.design?.qrData || `BEGIN:VCARD\nVERSION:3.0\nFN:${itemData.data?.name || 'Name'}\nEND:VCARD`,
//       },
//     };

//     const updatedItems = [...items, newItem];
//     setItems(updatedItems);
    
//     // Save to localStorage immediately
//     saveToStorage(CART_STORAGE_KEY, updatedItems);
    
//     // Save to API if user is logged in
//     if (user) {
//       try {
//         await axios.put(
//           '/api/cart',
//           { items: updatedItems },
//           { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//         );
//       } catch (error) {
//         console.error('API save failed:', error);
//       }
//     }
    
//     console.log('➕ Item added to cart:', newItem.id);
//   };

//   const remove = async (id: string) => {
//     const updatedItems = items.filter((x) => x.id !== id);
//     setItems(updatedItems);
    
//     saveToStorage(CART_STORAGE_KEY, updatedItems);
    
//     if (user) {
//       try {
//         await axios.put(
//           '/api/cart',
//           { items: updatedItems },
//           { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//         );
//       } catch (error) {
//         console.error('API remove failed:', error);
//       }
//     }
//   };

//   const clear = async () => {
//     setItems([]);
    
//     // Clear all storage keys
//     localStorage.removeItem(CART_STORAGE_KEY);
//     localStorage.removeItem(GUEST_CART_KEY);
//     localStorage.removeItem('business_card_cart');
//     localStorage.removeItem('business_card_cart_v2');
    
//     if (user) {
//       try {
//         await axios.put(
//           '/api/cart',
//           { items: [] },
//           { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//         );
//       } catch (error) {
//         console.error('API clear failed:', error);
//       }
//     }
//   };

//   // ✅ Force reload from localStorage
//   const forceReload = () => {
//     console.log('🔄 Force reloading cart...');
//     const loaded = loadFromStorage(CART_STORAGE_KEY);
//     setItems(loaded);
//     console.log('Reloaded:', loaded.length, 'items');
//   };

//   // ✅ Debug function
//   const debugInfo = () => {
//     console.log('=== CART DEBUG INFO ===');
//     console.log('Items in state:', items.length);
//     console.log('Items:', items);
    
//     const keys = Object.keys(localStorage);
//     keys.forEach(key => {
//       if (key.includes('cart') || key.includes('Cart')) {
//         try {
//           const data = localStorage.getItem(key);
//           const parsed = data ? JSON.parse(data) : null;
//           console.log(`Key: ${key}`, parsed ? `Items: ${Array.isArray(parsed) ? parsed.length : 'N/A'}` : 'Empty');
//         } catch (e) {
//           console.log(`Key: ${key} - Error parsing`);
//         }
//       }
//     });
//   };

//   const total = useMemo(() => {
//     return items.reduce((sum, item) => sum + (item?.price || 0), 0);
//   }, [items]);

//   // Add this function before the value constant
// const clearLocalStorage = () => {
//   console.log('🧹 Clearing localStorage cart data...');
//   localStorage.removeItem(CART_STORAGE_KEY);
//   localStorage.removeItem(GUEST_CART_KEY);
//   localStorage.removeItem('business_card_cart');
//   localStorage.removeItem('business_card_cart_v2');
// };

//   const value = useMemo(() => ({
//     items,
//     add,
//     remove,
//     clear,
//     total,
//     isLoading,
//     forceReload,
//     debugInfo,
//     clearLocalStorage, // Add this line
//   }), [items, total, isLoading]);

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// }

// CartContext.tsx mein yeh changes karein

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { BusinessCardData } from "@/components/BusinessCardForm";
import { useAuth } from './AuthContext';
import { apiFetch } from "@/services/api";
import { defaultBackSizes, defaultPositions, defaultPositionsBack, defaultSizes } from "@/components/CardPreviewWithDesign";

// ✅ Remove localStorage keys completely
const CART_STORAGE_KEY = 'cart_sync_cache'; // Temporary cache only

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
  frontData?: any | null;
  backData?: any | null;
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

// ✅ MongoDB cart APIs
const fetchCartFromServer = async (): Promise<CartItem[]> => {
  try {
    const response = await apiFetch('/api/cart');
    return response.data || [];
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

// const addItemToServer = async (item: CartItem): Promise<boolean> => {
//   try {
//     await apiFetch('/api/cart/items', {
//       method: 'POST',
//       body: JSON.stringify({ item })
//     });
//     return true;
//   } catch (error) {
//     console.error('Failed to add item to server:', error);
//     return false;
//   }
// };

// In addItemToServer function, check what you're sending:
const addItemToServer = async (item: CartItem) => {
  // Log the payload size
  const payload = JSON.stringify(item);
  console.log('Payload size:', payload.length, 'bytes');
  
  if (payload.length > 100000) { // > 100KB
    console.warn('Payload is large:', payload.length, 'bytes');
    // Consider trimming unnecessary data
    const minimalItem = {
      productId: item.productId,
      quantity: item.quantity,
      // Only include essential fields
    };
    return apiFetch('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify(minimalItem),
    });
  }
  
  return apiFetch('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify(item),
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
  const add = async (itemData: Omit<CartItem, 'id'> & { id?: string }) => {
    const id = itemData.id || `card_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    
    const newItem: CartItem = {
      ...itemData as CartItem,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      design: itemData.design || {
        positions: itemData.frontData?.positions || defaultPositions,
        sizes: itemData.frontData?.sizes || defaultSizes,
        positionsBack: itemData.backData?.positionsBack || defaultPositionsBack,
        backSizes: itemData.backData?.backSizes || defaultBackSizes,
        font: itemData.selectedFont || "Arial, sans-serif",
        fontSize: itemData.fontSize || 16,
        textColor: itemData.textColor || "#000000",
        accentColor: itemData.accentColor || "#0ea5e9",
        isEditLayout: false,
        qrColor: itemData.serverMeta?.qrColor || "#000000",
        qrLogoUrl: itemData.serverMeta?.qrLogoUrl,
        qrData: itemData.design?.qrData || `BEGIN:VCARD\nVERSION:3.0\nFN:${itemData.data?.name || 'Name'}\nEND:VCARD`,
      },
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    // ✅ Save to MongoDB if user is logged in
    if (user) {
      try {
        await addItemToServer(newItem);
        console.log('✅ Item added to MongoDB cart');
      } catch (error) {
        console.error('❌ Failed to save to MongoDB:', error);
        // Fallback: Save to server's array
        await saveCartToServer(updatedItems);
      }
    } else {
      // Guest: Save to localStorage cache
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    }
    
    console.log('➕ Item added to cart:', newItem.id);
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
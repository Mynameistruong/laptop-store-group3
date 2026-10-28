import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getSellingPrice } from '../utils/format';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!user?.id) {
      setItems([]);
      return [];
    }

    setLoading(true);
    setError('');

    try {
      const data = await cartApi.getByUser(user.id);
      setItems(data);
      return data;
    } catch (err) {
      setError(err?.message || 'Không tải được giỏ hàng');
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    reload();
  }, [reload]);

  const addToCart = useCallback(
    async (laptop, qty = 1) => {
      if (!user) {
        return { redirect: true };
      }

      const current = items.find((item) => item.laptopId === laptop.id);
      const nextQty = (current?.quantity || 0) + qty;

      if (laptop.stock <= 0 || nextQty > laptop.stock) {
        showToast(`Chỉ còn ${laptop.stock} sản phẩm`, 'warning');
        return { success: false };
      }

      try {
        if (current) {
          await cartApi.updateQuantity(current.id, nextQty);
        } else {
          await cartApi.add({
            userId: user.id,
            laptopId: laptop.id,
            quantity: qty,
            laptopIdRef: laptop.id,
          });
        }
        await reload();
        return { success: true };
      } catch (err) {
        showToast(err?.message || 'Thêm vào giỏ thất bại', 'danger');
        return { success: false };
      }
    },
    [items, reload, showToast, user]
  );

  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      const item = items.find((entry) => entry.id === itemId);
      if (!item) return;

      const nextQty = Math.max(0, Number(quantity));
      if (nextQty === 0) {
        return removeItem(itemId);
      }

      const laptop = item.laptop;
      if (!laptop || nextQty > laptop.stock) {
        showToast(`Chỉ còn ${laptop?.stock ?? 0} sản phẩm`, 'warning');
        return { success: false };
      }

      try {
        await cartApi.updateQuantity(itemId, nextQty);
        await reload();
        return { success: true };
      } catch (err) {
        showToast(err?.message || 'Cập nhật giỏ hàng thất bại', 'danger');
        return { success: false };
      }
    },
    [items, reload, showToast]
  );

  const removeItem = useCallback(
    async (itemId) => {
      try {
        await cartApi.remove(itemId);
        await reload();
        return { success: true };
      } catch (err) {
        showToast(err?.message || 'Xóa sản phẩm thất bại', 'danger');
        return { success: false };
      }
    },
    [reload, showToast]
  );

  const clearLocal = useCallback(() => {
    setItems([]);
  }, []);

  const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalPrice = items.reduce((sum, item) => sum + Number(getSellingPrice(item.laptop) * (item.quantity || 0)), 0);

  const value = useMemo(
    () => ({
      items,
      loading,
      error,
      totalQuantity,
      totalPrice,
      addToCart,
      updateQuantity,
      removeItem,
      clearLocal,
      reload,
      setItems,
    }),
    [addToCart, clearLocal, error, items, loading, reload, removeItem, totalPrice, totalQuantity, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

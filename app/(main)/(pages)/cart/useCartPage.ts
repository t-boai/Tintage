"use client";

import * as React from "react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import {
  selectAllItems,
  clearSelectedItems,
  toggleSelectItem,
  updateItemQuantity,
  revertCartItem,
  setCartData,
} from "@/app/redux/slices/cartSlice";

/// services
import { cartService } from "@/app/services/cartService";

// interfaces
import { CartItem } from "@/app/interfaces/cart.interfaces";

// shad
import { toast } from "@/components/ui/toast";

export function useCartPage() {
  const dispatch = useAppDispatch();
  const { selectedIds } = useAppSelector((state) => state.cart);

  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [reloadTrigger, setReloadTrigger] = React.useState(0);

  const debounceTimers = React.useRef<Record<string, NodeJS.Timeout>>({});

  React.useEffect(() => {
    let isMounted = true;

    async function loadCartData() {
      if (reloadTrigger === 0) setIsLoading(true);

      try {
        const res = await cartService.getMyCart();
        if (!isMounted) return;

        const {
          availableItems = [],
          unavailableItems = [],
          totalItems = 0,
          totalAmount = 0,
        } = res?.data || {};

        const formattedAvailable: CartItem[] = availableItems.map(
          (item: CartItem) => ({
            ...item,
            isAvailable: true,
          }),
        );
        const formattedUnavailable: CartItem[] = unavailableItems.map(
          (item: CartItem) => ({
            ...item,
            isAvailable: false,
          }),
        );

        const allCartItems = [...formattedAvailable, ...formattedUnavailable];
        setItems(allCartItems);

        // Đồng bộ Redux Store toàn cục
        dispatch(
          setCartData({
            items: allCartItems,
            totalItems,
            totalAmount,
          }),
        );

        //  Tự động tick chọn tất cả các sản phẩm có thể mua (Chỉ chạy lần đầu)
        if (reloadTrigger === 0) {
          const validIds = formattedAvailable
            .filter((item) => item.product?.id)
            .map((item) => item.product!.id);
          dispatch(selectAllItems(validIds));
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Lỗi tải giỏ hàng:", error);
        toast.add({
          type: "error",
          description: "Không thể tải dữ liệu giỏ hàng <3",
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCartData();

    return () => {
      isMounted = false;
      Object.values(debounceTimers.current).forEach((timer) =>
        clearTimeout(timer),
      );
    };
  }, [dispatch, reloadTrigger]);

  //  hàm trigger fetch lại data
  const fetchCartData = React.useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  // Tính toán phát sinh
  const availableItems = React.useMemo(
    () => items.filter((item) => item.isAvailable && item.product),
    [items],
  );

  const unavailableItems = React.useMemo(
    () => items.filter((item) => !item.isAvailable && item.product),
    [items],
  );

  const isAllSelected =
    availableItems.length > 0 && selectedIds.length === availableItems.length;

  const selectedItems = React.useMemo(
    () =>
      items.filter(
        (item) => item.product && selectedIds.includes(item.product.id),
      ),
    [items, selectedIds],
  );

  const subtotal = React.useMemo(
    () =>
      selectedItems.reduce(
        (acc, curr) => acc + (curr.product?.price || 0) * curr.quantity,
        0,
      ),
    [selectedItems],
  );

  // handlers giao diện (tích chọn và giao diện)
  const handleToggleSelectAll = React.useCallback(() => {
    if (isAllSelected) {
      dispatch(clearSelectedItems());
    } else {
      dispatch(selectAllItems(availableItems.map((i) => i.product!.id)));
    }
  }, [isAllSelected, availableItems, dispatch]);

  const handleToggleSelectItem = React.useCallback(
    (productId: string) => {
      dispatch(toggleSelectItem(productId));
    },
    [dispatch],
  );

  const handleUpdateQuantity = React.useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity < 1) return;

      const targetItem = items.find((i) => i.product?.id === productId);
      if (!targetItem || !targetItem.product) return;

      const maxStock = targetItem.product.stock ?? 99;
      if (newQuantity > maxStock) {
        toast.add({
          type: "warning",
          description: `Rất tiếc, kho chỉ còn tối đa ${maxStock} sản phẩm <3`,
        });
        return;
      }

      const oldQuantity = targetItem.quantity;
      const price = targetItem.product.price;

      // Optimistic Update Redux & Local State
      dispatch(
        updateItemQuantity({
          id: productId,
          quantity: newQuantity,
          oldQuantity,
          price,
        }),
      );

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product?.id === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );

      // Debounce
      if (debounceTimers.current[productId]) {
        clearTimeout(debounceTimers.current[productId]);
      }

      debounceTimers.current[productId] = setTimeout(async () => {
        try {
          await cartService.updateQuantity(productId, newQuantity);
        } catch (error) {
          console.error("Lỗi cập nhật số lượng:", error);
          toast.add({
            type: "error",
            description: "Lỗi đồng bộ số lượng, đang khôi phục...",
          });
          fetchCartData();
        }
      }, 500);
    },
    [items, dispatch, fetchCartData],
  );

  // Handlers gọi api xóa (optimistic update + api)

  // Xóa 1 sản phẩm
  const handleRemoveItem = React.useCallback(
    async (productId: string) => {
      const itemToRemove = items.find((i) => i.product?.id === productId);
      if (!itemToRemove || !itemToRemove.product) return;

      // Cập nhật UI
      setItems((prev) => prev.filter((i) => i.product?.id !== productId));
      if (itemToRemove.isAvailable) {
        dispatch(
          revertCartItem({
            id: productId,
            quantity: itemToRemove.quantity,
            price: itemToRemove.product.price,
          }),
        );
      }
      if (selectedIds.includes(productId)) {
        dispatch(toggleSelectItem(productId));
      }

      // Chờ API
      try {
        await cartService.deleteItem(productId);
        toast.add({
          type: "success",
          description: "Đã xóa sản phẩm khỏi giỏ hàng <3",
        });
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        toast.add({
          type: "error",
          description: "Lỗi kết nối, vui lòng thử lại <3",
        });
        fetchCartData(); // Rollback
      }
    },
    [items, selectedIds, dispatch, fetchCartData],
  );

  // Xóa các mục đã tick chọn bằng (Bulk Delete)
  const handleRemoveSelectedItems = React.useCallback(async () => {
    const idsToDelete = [...selectedIds];
    if (idsToDelete.length === 0) return;

    const itemsToDelete = items.filter(
      (item) => item.product && idsToDelete.includes(item.product.id),
    );

    // Cập nhật UI
    setItems((prev) =>
      prev.filter(
        (item) => !item.product || !idsToDelete.includes(item.product.id),
      ),
    );
    dispatch(clearSelectedItems());

    itemsToDelete.forEach((item) => {
      if (item.product && item.isAvailable) {
        dispatch(
          revertCartItem({
            id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          }),
        );
      }
    });

    try {
      await cartService.deleteMultipleItems(idsToDelete);

      toast.add({
        type: "success",
        description: `Đã xóa ${idsToDelete.length} sản phẩm khỏi giỏ <3`,
      });
    } catch (error) {
      console.error("Lỗi xóa hàng loạt:", error);
      toast.add({
        type: "error",
        description: "Có lỗi xảy ra khi xóa, vui lòng thử lại <3",
      });
      fetchCartData(); // Rollback nếu server trả lỗi
    }
  }, [selectedIds, items, dispatch, fetchCartData]);

  // Xóa toàn bộ sản phẩm lỗi/hết hàng
  const handleClearUnavailableItems = React.useCallback(async () => {
    const unavailIds = unavailableItems.map((item) => item.product!.id);
    if (unavailIds.length === 0) return;

    // Cập nhật UI
    setItems((prev) => prev.filter((item) => item.isAvailable));

    // Chờ API
    try {
      await cartService.clearUnavailableItems();
      toast.add({
        type: "success",
        description: "Đã dọn dẹp các sản phẩm hết hàng <3",
      });
    } catch (error) {
      console.error("Lỗi dọn dẹp sản phẩm không khả dụng:", error);
      toast.add({
        type: "error",
        description: "Lỗi đồng bộ, vui lòng tải lại trang <3",
      });
      fetchCartData(); // Rollback
    }
  }, [unavailableItems, fetchCartData]);

  return {
    items,
    isLoading,
    availableItems,
    unavailableItems,
    selectedIds,
    isAllSelected,
    subtotal,
    handleToggleSelectAll,
    handleToggleSelectItem,
    handleUpdateQuantity,
    handleRemoveItem,
    handleRemoveSelectedItems,
    handleClearUnavailableItems,
    fetchCartData,
  };
}

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

  // Ref lưu timer debounce cập nhật số lượng theo productId
  const debounceTimers = React.useRef<Record<string, NodeJS.Timeout>>({});

  //  Hàm đồng bộ & tải dữ liệu giỏ hàng
  const fetchCartData = React.useCallback(async () => {
    try {
      const res = await cartService.getMyCart();
      const {
        availableItems = [],
        unavailableItems = [],
        totalItems = 0,
        totalAmount = 0,
      } = res?.data || {};

      // Định dạng và gán cờ isAvailable
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

      // Chỉ chọn các sản phẩm khả dụng
      const validIds = formattedAvailable
        .filter((item) => item.product?.id)
        .map((item) => item.product!.id);
      dispatch(selectAllItems(validIds));
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
      toast.add({
        type: "error",
        description: "Không thể tải dữ liệu giỏ hàng <3",
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  //  Fetch khi Mount Component (Tránh Cascading Render & Race Condition)
  React.useEffect(() => {
    let isMounted = true;

    async function loadInitialCart() {
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

        dispatch(
          setCartData({
            items: allCartItems,
            totalItems,
            totalAmount,
          }),
        );

        const validIds = formattedAvailable
          .filter((item) => item.product?.id)
          .map((item) => item.product!.id);
        dispatch(selectAllItems(validIds));
      } catch (error) {
        if (!isMounted) return;
        console.error("Lỗi tải giỏ hàng:", error);
        toast.add({
          type: "error",
          description: "Không thể tải dữ liệu giỏ hàng <3",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadInitialCart();

    return () => {
      isMounted = false;
      Object.values(debounceTimers.current).forEach((timer) =>
        clearTimeout(timer),
      );
    };
  }, [dispatch]);

  // Derived State (Tính toán phái sinh)
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

  //  Handlers Tick Chọn
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

  // Cập nhật số lượng (Kiểm tra tồn kho + Optimistic Update + Debounce API 500ms)
  const handleUpdateQuantity = React.useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity < 1) return;

      // Tìm item từ mảng items hiện tại
      const targetItem = items.find((i) => i.product?.id === productId);
      if (!targetItem || !targetItem.product) return;

      // Logic kiểm tra số lượng Max Stock
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

      //  Side Effect: Dispatch Redux để update Header lập tức
      dispatch(
        updateItemQuantity({
          id: productId,
          quantity: newQuantity,
          oldQuantity,
          price,
        }),
      );

      // Side Effect: Gọi API dạng Debounce
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
          fetchCartData(); // Rollback nếu lỗi server
        }
      }, 500);

      //   cập nhật UI Local State bằng 1 hàm
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.product?.id === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    },
    [items, dispatch, fetchCartData],
  );

  // Xóa 1 sản phẩm khỏi giỏ
  const handleRemoveItem = React.useCallback(
    async (productId: string) => {
      const itemToRemove = items.find((i) => i.product?.id === productId);
      if (!itemToRemove || !itemToRemove.product) return;

      // Optimistic Update UI & Redux
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

  //  Xóa các mục đã tick chọn (Bulk Delete)
  const handleRemoveSelectedItems = React.useCallback(async () => {
    const idsToDelete = [...selectedIds];
    if (idsToDelete.length === 0) return;

    const itemsToDelete = items.filter(
      (item) => item.product && idsToDelete.includes(item.product.id),
    );

    // Optimistic Update UI & Redux
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
      await Promise.all(idsToDelete.map((id) => cartService.deleteItem(id)));
      toast.add({
        type: "success",
        description: `Đã xóa ${idsToDelete.length} sản phẩm khỏi giỏ <3`,
      });
      fetchCartData();
    } catch (error) {
      console.error("Lỗi xóa hàng loạt:", error);
      toast.add({
        type: "error",
        description: "Có lỗi xảy ra khi xóa, vui lòng thử lại <3",
      });
      fetchCartData();
    }
  }, [selectedIds, items, dispatch, fetchCartData]);

  //  Xóa toàn bộ sản phẩm không khả dụng (Clean Unavailable Items)
  const handleClearUnavailableItems = React.useCallback(async () => {
    const unavailIds = unavailableItems.map((item) => item.product!.id);
    if (unavailIds.length === 0) return;

    // Optimistic Update UI
    setItems((prev) => prev.filter((item) => item.isAvailable));

    try {
      await cartService.clearUnavailableItems();
      toast.add({
        type: "success",
        description: "Đã dọn dẹp các sản phẩm hết hàng <3",
      });
      fetchCartData(); // Đồng bộ lại từ BE
    } catch (error) {
      console.error("Lỗi dọn dẹp sản phẩm không khả dụng:", error);
      toast.add({
        type: "error",
        description: "Lỗi đồng bộ, vui lòng tải lại trang <3",
      });
      fetchCartData();
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

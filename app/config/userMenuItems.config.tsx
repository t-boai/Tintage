import { PackageCheck, ShoppingBag, Star, Store, UserCog } from "lucide-react";

export const USER_MENU_ITEMS = [
  { id: "settings", label: "Tài khoản của tôi", icon: UserCog },
  { id: "orders", label: "Đơn mua của tôi", icon: ShoppingBag },
  { id: "selling", label: "Gian hàng (Đang bán)", icon: Store },
  { id: "sold", label: "Sản phẩm đã bán", icon: PackageCheck },
  { id: "reviews", label: "Đánh giá của tôi", icon: Star },
];

import CartContainer from "@/app/(main)/(pages)/cart/CartContainer";
import { constructMetadata } from "@/app/helper/metadata";

export const metadata = constructMetadata({
  title: "Giỏ hàng",
  description:
    "Xem và quản lý các sản phẩm trong giỏ hàng của bạn tại TINTAGE.",
  noIndex: true,
});

export default function CartPage() {
  return <CartContainer />;
}

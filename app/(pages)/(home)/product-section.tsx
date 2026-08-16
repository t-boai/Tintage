import ProductList from "@/app/(pages)/(home)/product-list";
import { ProductItem } from "@/app/interfaces/products.interfaces";
import { homeService } from "@/app/services/homeService";

interface ProductSectionProps {
  type: "featured" | "discover";
  emptyMessage?: string;
}

export default async function ProductSection({
  type,
  emptyMessage,
}: ProductSectionProps) {
  let products: ProductItem[] = [];

  try {
    const data =
      type === "featured"
        ? await homeService.getProductsFeatured()
        : await homeService.getDailyDiscover();

    if (Array.isArray(data)) products = data;
  } catch (error) {
    console.error(`Home ${type} Error: `, error);
  }
  return <ProductList products={products} emptyMessage={emptyMessage} />;
}

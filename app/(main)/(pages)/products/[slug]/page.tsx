import { notFound } from "next/navigation";
import { constructMetadata } from "@/app/helper/metadata";
import { productService } from "@/app/services/productService";
import ProductContainer from "./ProductContainer";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;

  const product = await productService.getDetailBySlug(resolvedParams.slug);

  if (!product) {
    return constructMetadata({ title: "Không tìm thấy sản phẩm" });
  }

  return constructMetadata({
    title: product.name,
    description: `Mua ${product.name} chính hãng tại TINTAGE.`,
    image: product.image,
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await productService.getDetailBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return <ProductContainer product={product} />;
}

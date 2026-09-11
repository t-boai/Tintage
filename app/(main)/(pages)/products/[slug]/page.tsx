import { notFound } from "next/navigation";

// helpers and services
import { constructMetadata } from "@/app/helper/metadata";
import { productService } from "@/app/services/productService";

// com
import ProductContainer from "@/app/(main)/(pages)/products/[slug]/ProductContainer";
import JsonLd from "@/app/components/seo/JsonLd";

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

  if (!product) notFound();

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: product.images || [product.image],
    description: product.description || `Mua ${product.name} tại Tintage`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || "Vintage",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      priceCurrency: "VND",
      price: product.price,
      itemCondition: "https://schema.org/UsedCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: product.seller?.fullName || "Tintage",
      },
    },
    ...(product.seller?.sellerRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.seller.sellerRating,
        reviewCount: product.salesCount || 1,
      },
    }),
  };

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductContainer product={product} />
    </>
  );
}

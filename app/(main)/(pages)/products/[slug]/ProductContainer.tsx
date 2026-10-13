import * as React from "react";
import dynamic from "next/dynamic";
import { Sparkles, StarOff } from "lucide-react";

// components
import BreadCrumbs, {
  BreadcrumbItem,
} from "@/app/(main)/(pages)/products/[slug]/BreadCrumbs";
import PurchaseProduct from "@/app/(main)/(pages)/products/[slug]/PurchaseProduct";
import InfoProduct from "@/app/(main)/(pages)/products/[slug]/InfoProduct";

// interfaces
import { ProductItem } from "@/app/interfaces/products.interfaces";
import ProductCardSkeleton from "@/app/components/skeleton/ProductCardSkeleton";

const MightLike = dynamic(
  () => import("@/app/components/mightLike/MightLike"),
  {
    ssr: true,
  },
);

interface ProductContainerProps {
  product: ProductItem;
}

export default function ProductContainer({ product }: ProductContainerProps) {
  const breadcrumbData: BreadcrumbItem[] = [{ label: "TRANG CHỦ", href: "/" }];
  const isSuspended = product.isActive === false;

  if (product.categories && product.categories.length > 0) {
    product.categories.forEach((cat) => {
      breadcrumbData.push({
        label: cat.name.toUpperCase(),
        href: `/collections/${cat.slug}`,
      });
    });
  }

  breadcrumbData.push({
    label: product.name.toUpperCase(),
    href: "#",
  });

  const lastCategoryId =
    product.categories && product.categories.length > 0
      ? product.categories[product.categories.length - 1].id
      : undefined;

  return (
    <div className="min-h-fit bg-[#FAFAFA] py-6 text-neutral-900">
      <div className="container mx-auto">
        <BreadCrumbs items={breadcrumbData} />

        {isSuspended && (
          <div className="mb-6 flex animate-pulse items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <StarOff size={20} />
            </div>
            <div>
              <h3 className="font-bold text-red-700">
                Sản phẩm tạm ngưng kinh doanh
              </h3>
              <p className="text-sm text-red-600/80">
                Người bán đã ẩn hoặc ngừng cung cấp sản phẩm này. Vui lòng tham
                khảo các sản phẩm khác bên dưới.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:sticky lg:top-24 lg:col-span-6">
            <InfoProduct product={product} />
          </div>

          <div className="lg:col-span-6">
            <div
              className={`relative ${isSuspended ? "pointer-events-none opacity-50 grayscale select-none" : ""}`}
            >
              {isSuspended && (
                <div className="absolute inset-0 z-10 rounded-3xl bg-white/20 backdrop-blur-[1px]" />
              )}
              <PurchaseProduct product={product} />
            </div>
          </div>
        </div>
      </div>

      <React.Suspense
        fallback={
          <div className="mt-16 border-t-4 border-neutral-100 pt-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-neutral-200">
                <Sparkles className="h-6 w-6 text-neutral-400" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-48 animate-pulse rounded-md bg-neutral-200" />
                <div className="h-3 w-64 animate-pulse rounded-md bg-neutral-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
              <ProductCardSkeleton count={5} />
            </div>
          </div>
        }
      >
        <MightLike currentProductId={product.id} categoryId={lastCategoryId} />
      </React.Suspense>
    </div>
  );
}

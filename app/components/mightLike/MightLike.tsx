import { HeartHandshake } from "lucide-react";

// services
import { productService } from "@/app/services/productService";

// components
import InfiniteMightLike from "@/app/components/mightLike/InfiniteMightLike";

// interface
import { ProductItem } from "@/app/interfaces/products.interfaces";

interface MightLikeProps {
  currentProductId: string;
  categoryId?: string;
  sellerId?: string;
  title?: string;
  subTitle?: string;
}

export default async function MightLike({
  currentProductId,
  categoryId,
  sellerId,
  title = "Có thể bạn sẽ thích",
  subTitle = "Gợi ý những deal đỉnh nhất dành cho bạn",
}: MightLikeProps) {
  let nextFetchMode: "CATEGORY" | "ALL" = "CATEGORY";
  let nextPage = 2;
  let hasNext = false;

  // Lấy sản phẩm cùng danh mục
  let res = await productService.getRecommendations(1, 10, {
    excludeId: currentProductId,
    categoryId: categoryId,
  });

  // nếu hong có sản phẩm cùng danh mục
  if (!res.data || res.data.length === 0) {
    // random từ đầu
    res = await productService.getRecommendations(1, 10, {
      excludeId: currentProductId,
    });
    nextFetchMode = "ALL";
    nextPage = 2;
    hasNext = res.pagination?.hasNextPage || false;
  } else {
    // Nếu danh mục có sản phẩm
    if (res.pagination?.hasNextPage) {
      nextFetchMode = "CATEGORY";
      nextPage = 2;
      hasNext = true; // Vẫn còn trang 2 của danh mục
    } else {
      // nếu danh mục có ít sản phẩm thì cuộn tiếp sẽ lấy random
      nextFetchMode = "ALL";
      nextPage = 1;
      hasNext = true;
    }
  }

  const initialProducts =
    res.data?.map((p: ProductItem) => ({
      ...p,
      image: p.image || "/placeholder-image.png",
    })) || [];

  if (initialProducts.length === 0) return null;

  return (
    <div className="mt-16 border-t border-neutral-200 pt-12">
      <div className="mb-8 flex items-center gap-3.5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500 shadow-sm">
          <HeartHandshake className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-[11px] font-semibold tracking-wider text-neutral-500">
            {subTitle}
          </p>
        </div>
      </div>

      <InfiniteMightLike
        initialProducts={initialProducts}
        initialFetchMode={nextFetchMode}
        initialNextPage={nextPage}
        initialHasNextPage={hasNext}
        categoryId={categoryId}
        excludeId={currentProductId}
        sellerId={sellerId}
      />
    </div>
  );
}

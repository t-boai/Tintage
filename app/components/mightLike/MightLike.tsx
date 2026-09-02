import { Astroid } from "lucide-react";

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
    <div className="mt-16 border-t-4 border-neutral-900 pt-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Astroid className="h-6 w-6 text-(--primaryCus)" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">
            {title}
          </h2>
          <p className="text-[11px] font-bold tracking-widest text-neutral-500">
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

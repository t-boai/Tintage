// services and helpers
import { constructMetadata } from "@/app/helper/metadata";
import { productService } from "@/app/services/productService";

// com
import SearchContainer from "@/app/(main)/(pages)/search/SearchContainer";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const keyword = resolvedParams.q || "";

  return constructMetadata({
    title: keyword
      ? `Kết quả tìm kiếm cho "${keyword}" | Tintage`
      : "Tất cả sản phẩm | Tintage",
    description: `Khám phá các sản phẩm hàng hiệu vintage authentic tại Tintage.`,
  });
}

export default async function SearchPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const keyword = resolvedParams.q || "";

  const res = await productService.searchProducts({
    keyword: keyword,
    category: resolvedParams.category,
    brands: resolvedParams.brands,
    colors: resolvedParams.colors,
    genders: resolvedParams.genders,
    sizes: resolvedParams.sizes,
    condition: resolvedParams.condition,
    minPrice: resolvedParams.minPrice,
    maxPrice: resolvedParams.maxPrice,
    sort: resolvedParams.sort,
    page: 1,
    limit: 16,
    getFilters: true,
  });

  const initialData = res.data || [];
  const filtersInfo = res.filtersInfo || null;
  const initialHasNextPage = res.pagination?.hasNextPage || false;
  const totalItems = res.pagination?.totalItems || 0;

  return (
    <SearchContainer
      initialQuery={keyword}
      initialData={initialData}
      filtersInfo={filtersInfo}
      initialHasNextPage={initialHasNextPage}
      totalItems={totalItems}
    />
  );
}

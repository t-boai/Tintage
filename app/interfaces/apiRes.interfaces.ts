export interface PaginationData {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface RecommendationParams {
  categoryId?: string;
  sellerId?: string;
  excludeId?: string;
}

export interface SearchProductsParams {
  page?: number;
  limit?: number;
  keyword?: string;
  category?: string;
  brands?: string;
  colors?: string;
  genders?: string;
  sizes?: string;
  condition?: string | number;
  minPrice?: string | number;
  maxPrice?: string | number;
  sort?: string;
  location?: string;
  getFilters?: boolean;
}

export interface FilterBrandItem {
  name: string;
  count: number;
}

export interface FilterCategoryItem {
  id: string;
  name: string;
  slug: string;
  count?: number;
  parentId?: string | null;
  children?: FilterCategoryItem[];
  disabled?: boolean;
}

export interface FiltersInfoData {
  brands: FilterBrandItem[];
  categories: FilterCategoryItem[];
}

export interface ApiRes<T> {
  code: string;
  message: string;
  data: T;
  pagination?: PaginationData;
  filtersInfo?: FiltersInfoData;
}

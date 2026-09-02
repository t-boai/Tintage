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

export interface ApiRes<T> {
  code: string;
  message: string;
  data: T;
  pagination?: PaginationData;
}

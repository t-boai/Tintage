interface SellerInfo {
  slug: string;
  fullName: string;
  avatar: string;
  isVerifiedSeller: boolean;
  sellerRole: string;
  sellerRating: number;
  reviewCount: number;
  totalProducts: number;
  joinedAt: string;
  joinedTime: string;
}

interface CategoryProduct {
  id: string;
  name: string;
  slug: string;
}

export interface ProductItem {
  id: string;
  brand: string;
  name: string;
  price: number;
  condition?: string;
  size?: string;
  isNew?: boolean;
  image: string;
  images?: string[];
  description: string;
  slug: string;
  salesCount: number;
  discount: number;
  originalPrice: number;
  location: string;
  stock: number;
  material: string;
  viewsCount: number;
  isLiked: boolean;
  likesCount: number;
  categories: CategoryProduct[];
  seller: SellerInfo;
  createdTime: string;
}

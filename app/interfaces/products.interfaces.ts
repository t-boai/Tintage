interface SellerInfo {
  id: string;
  fullName: string;
  avatar: string;
  isVerifiedSeller: boolean;
  sellerRole: string;
  sellerRating: number;
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
  slug: string;
  likesCount: number;
  salesCount: number;
  originalPrice: number;
  location: string;
  stock: number;
  seller: SellerInfo;
}

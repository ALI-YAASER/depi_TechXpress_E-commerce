export interface ProductImageDto {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductSpecDto {
  name: string;
  value: string;
}

export interface ProductListItemDto {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  discountPrice?: number | null;
  finalPrice: number;
  stockQuantity: number;
  inStock: boolean;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  primaryImageUrl?: string | null;
  soldCount: number;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  images?: ProductImageDto[];
}

export interface ProductDetailDto {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  sku: string;
  price: number;
  discountPrice?: number | null;
  finalPrice: number;
  stockQuantity: number;
  inStock: boolean;
  isActive: boolean;
  brandId: number;
  brandName: string;
  categoryId: number;
  categoryName: string;
  images: ProductImageDto[];
  specifications: ProductSpecDto[];
  createdAt: string;
  updatedAt?: string | null;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  soldCount?: number;
  primaryImageUrl?: string | null;
}

export interface CategoryDto {
  id: number;
  name: string;
  slug: string;
  parentCategoryId?: number | null;
  isActive: boolean;
  productCount: number;
  icon?: string;
  imageUrl?: string;
  description?: string;
}

export interface BrandDto {
  id: number;
  name: string;
  logoUrl?: string | null;
  isActive: boolean;
  productCount: number;
}

export interface ProductQuery {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  spec?: string[];
  sortBy?: 'price' | 'newest' | 'name' | 'popularity' | string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

import { api } from "../lib/axios";
import type {
  ProductListItemDto,
  ProductDetailDto,
  CategoryDto,
  BrandDto,
  ProductQuery,
  PagedResult
} from "../types/product";
import {
  MOCK_CATEGORIES,
  MOCK_BRANDS,
  filterMockProducts,
  getMockProductById,
  getMockProductBySlug
} from "./mockData";

export const productService = {
  async getProducts(query: ProductQuery = {}): Promise<PagedResult<ProductListItemDto>> {
    try {
      const res = await api.get<PagedResult<ProductListItemDto>>("/products", {
        params: query
      });
      if (res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
        return res.data;
      }
    } catch {
      // Backend offline or error -> fallback to mock data
    }
    const mock = filterMockProducts(query);
    return {
      items: mock.items,
      page: query.page || 1,
      pageSize: query.pageSize || 12,
      totalCount: mock.totalCount
    };
  },

  async getProductById(id: number): Promise<ProductDetailDto | null> {
    try {
      const res = await api.get<ProductDetailDto>(`/products/${id}`);
      if (res.data && res.data.id) {
        return res.data;
      }
    } catch {
      // fallback
    }
    return getMockProductById(id) || null;
  },

  async getProductBySlug(slug: string): Promise<ProductDetailDto | null> {
    try {
      const res = await api.get<ProductDetailDto>(`/products/slug/${encodeURIComponent(slug)}`);
      if (res.data && res.data.id) {
        return res.data;
      }
    } catch {
      // fallback
    }
    return getMockProductBySlug(slug) || null;
  },

  async getCategories(includeInactive = false): Promise<CategoryDto[]> {
    try {
      const res = await api.get<CategoryDto[]>("/categories", {
        params: { includeInactive }
      });
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // fallback
    }
    return MOCK_CATEGORIES;
  },

  async getBrands(includeInactive = false): Promise<BrandDto[]> {
    try {
      const res = await api.get<BrandDto[]>("/brands", {
        params: { includeInactive }
      });
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // fallback
    }
    return MOCK_BRANDS;
  }
};

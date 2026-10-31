import { api } from "../lib/axios";
import type {
  AddressDto,
  AddressRequest,
  OrderSummaryDto,
  OrderDetailDto
} from "../types/order";
import type { PagedResult } from "../types/product";

export interface CreateOrderPayload {
  addressId: number;
  paymentMethod: string;
}

export const orderService = {
  // Addresses
  async getAddresses(): Promise<AddressDto[]> {
    try {
      const res = await api.get<AddressDto[]>("/addresses");
      return res.data;
    } catch {
      return [];
    }
  },

  async createAddress(payload: AddressRequest): Promise<AddressDto> {
    const res = await api.post<AddressDto>("/addresses", payload);
    return res.data;
  },

  async updateAddress(id: number, payload: AddressRequest): Promise<AddressDto> {
    const res = await api.put<AddressDto>(`/addresses/${id}`, payload);
    return res.data;
  },

  async deleteAddress(id: number): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },

  // Orders
  async createOrder(payload: CreateOrderPayload): Promise<OrderDetailDto> {
    const res = await api.post<OrderDetailDto>("/orders", payload);
    return res.data;
  },

  async getMyOrders(params: { page?: number; pageSize?: number; status?: string } = {}): Promise<PagedResult<OrderSummaryDto>> {
    try {
      const res = await api.get<PagedResult<OrderSummaryDto>>("/orders/my", { params });
      return res.data;
    } catch {
      return { items: [], page: 1, pageSize: 10, totalCount: 0 };
    }
  },

  async getOrderById(id: number): Promise<OrderDetailDto | null> {
    try {
      const res = await api.get<OrderDetailDto>(`/orders/${id}`);
      return res.data;
    } catch {
      return null;
    }
  },

  async cancelOrder(id: number, note?: string): Promise<OrderDetailDto> {
    const res = await api.post<OrderDetailDto>(`/orders/${id}/cancel`, { note });
    return res.data;
  }
};

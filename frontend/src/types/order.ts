export interface AddressDto {
  id: number;
  recipientName: string;
  phoneNumber: string;
  city: string;
  street: string;
  buildingNumber?: string | null;
  additionalDetails?: string | null;
  isDefault: boolean;
  isLocked: boolean;
}

export interface AddressRequest {
  recipientName: string;
  phoneNumber: string;
  city: string;
  street: string;
  buildingNumber?: string;
  additionalDetails?: string;
  isDefault?: boolean;
}

export interface OrderItemDto {
  productId?: number | null;
  name: string;
  sku?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderStatusHistoryDto {
  oldStatus?: string | null;
  newStatus: string;
  changedAt: string;
  note?: string | null;
}

export interface OrderSummaryDto {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  customerName?: string | null;
  customerEmail?: string | null;
}

export interface OrderDetailDto {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string | null;
  address?: {
    recipientName: string;
    phoneNumber: string;
    city: string;
    street: string;
    buildingNumber?: string | null;
    additionalDetails?: string | null;
  } | null;
  items: OrderItemDto[];
  history: OrderStatusHistoryDto[];
  customerName?: string | null;
  customerEmail?: string | null;
}

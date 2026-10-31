export interface CartItem {
  id?: number;
  productId: number;
  name: string;
  slug?: string;
  sku?: string;
  imageUrl?: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  stockQuantity?: number;
  isAvailable?: boolean;
  selectedColor?: string;
}

export interface CartDto {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hasIssues: boolean;
}

export interface GovernorateShipping {
  id: string;
  name: string;
  nameAr: string;
  shipping: number;
  days: string;
}

export const EGYPT_GOVERNORATES: GovernorateShipping[] = [
  { id: "cairo", name: "Cairo", nameAr: "القاهرة", shipping: 50, days: "24-48 Hours" },
  { id: "giza", name: "Giza", nameAr: "الجيزة", shipping: 50, days: "24-48 Hours" },
  { id: "alex", name: "Alexandria", nameAr: "الإسكندرية", shipping: 65, days: "48 Hours" },
  { id: "delta", name: "Delta Governorates", nameAr: "الدلتا (المنصورة، طنطا، الزقازيق...)", shipping: 75, days: "48-72 Hours" },
  { id: "canal", name: "Canal Cities", nameAr: "مدن القناة (الإسماعيلية، بورسعيد، السويس)", shipping: 80, days: "48-72 Hours" },
  { id: "upper", name: "Upper Egypt", nameAr: "محافظات الصعيد (أسيوط، سوهاج، قنا...)", shipping: 90, days: "3-4 Days" },
  { id: "remote", name: "Red Sea & Border Cities", nameAr: "البحر الأحمر والمحافظات الحدودية", shipping: 110, days: "4-5 Days" }
];

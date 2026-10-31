import type { ProductDetailDto, ProductListItemDto, CategoryDto, BrandDto } from "../types/product";

export const MOCK_CATEGORIES: CategoryDto[] = [
  {
    id: 1,
    name: "Laptops & Computers",
    slug: "laptops-and-computers",
    isActive: true,
    productCount: 18,
    icon: "Laptop",
    description: "High-performance notebooks, ultrabooks, and workstations for pros and gamers.",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Smartphones & Tablets",
    slug: "smartphones-and-tablets",
    isActive: true,
    productCount: 24,
    icon: "Smartphone",
    description: "Flagship phones, foldable devices, and creative pro tablets.",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Audio & Headphones",
    slug: "audio-and-headphones",
    isActive: true,
    productCount: 14,
    icon: "Headphones",
    description: "Studio-grade wireless headphones, active noise cancellation, and earbuds.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Monitors & Displays",
    slug: "monitors-and-displays",
    isActive: true,
    productCount: 10,
    icon: "Monitor",
    description: "Ultra-wide curved OLEDs, 4K color-accurate creators' panels, and 240Hz screens.",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Gaming & Consoles",
    slug: "gaming-and-consoles",
    isActive: true,
    productCount: 16,
    icon: "Gamepad2",
    description: "Consoles, handhelds, mechanical switches, and high-DPI gaming gear.",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    name: "Accessories & Peripherals",
    slug: "accessories",
    isActive: true,
    productCount: 30,
    icon: "Mouse",
    description: "Ergonomic mice, mechanical keyboards, GaN chargers, and high-speed storage.",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80"
  }
];

export const MOCK_BRANDS: BrandDto[] = [
  { id: 1, name: "Apple", logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg", isActive: true, productCount: 12 },
  { id: 2, name: "Dell", logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/dell.svg", isActive: true, productCount: 8 },
  { id: 3, name: "Samsung", logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/samsung.svg", isActive: true, productCount: 14 },
  { id: 4, name: "ASUS ROG", logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/asus.svg", isActive: true, productCount: 9 },
  { id: 5, name: "Sony", logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/sony.svg", isActive: true, productCount: 7 },
  { id: 6, name: "Lenovo", logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/lenovo.svg", isActive: true, productCount: 8 },
  { id: 7, name: "Logitech", logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/logitech.svg", isActive: true, productCount: 11 },
  { id: 8, name: "Razer", logoUrl: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/razer.svg", isActive: true, productCount: 6 }
];

export const MOCK_PRODUCTS: ProductDetailDto[] = [
  {
    id: 1,
    name: "Dell XPS 15 9530 OLED (Core i9, 32GB RAM, 1TB SSD, RTX 4070)",
    slug: "dell-xps-15-oled-i9-rtx4070",
    sku: "DELL-XPS15-9530",
    description: "The pinnacle of executive power and creative mastery. Featuring a breath-taking 3.5K OLED InfinityEdge touch display, Intel Core i9-13900H 14-core processor, NVIDIA GeForce RTX 4070 studio-ready graphics, and CNC aluminum chassis with carbon fiber palm rest.",
    price: 92000,
    discountPrice: 84999,
    finalPrice: 84999,
    stockQuantity: 8,
    inStock: true,
    isActive: true,
    brandId: 2,
    brandName: "Dell",
    categoryId: 1,
    categoryName: "Laptops & Computers",
    createdAt: "2026-01-15T10:00:00Z",
    rating: 4.9,
    reviewsCount: 38,
    soldCount: 84,
    badge: "Flagship Creator",
    images: [
      { id: 101, imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1000&auto=format&fit=crop&q=80", isPrimary: true, sortOrder: 0 },
      { id: 102, imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1000&auto=format&fit=crop&q=80", isPrimary: false, sortOrder: 1 },
      { id: 103, imageUrl: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1000&auto=format&fit=crop&q=80", isPrimary: false, sortOrder: 2 }
    ],
    specifications: [
      { name: "Processor", value: "Intel Core i9-13900H (14 cores, 20 threads, up to 5.4 GHz)" },
      { name: "Memory (RAM)", value: "32 GB DDR5 4800MHz Dual-Channel" },
      { name: "Storage", value: "1 TB M.2 PCIe Gen4 NVMe SSD" },
      { name: "Graphics (GPU)", value: "NVIDIA GeForce RTX 4070 8GB GDDR6" },
      { name: "Display", value: "15.6\" 3.5K (3456 x 2160) OLED Touch, 400 nits, 100% DCI-P3" },
      { name: "Battery & Power", value: "86 Whr 6-Cell Battery with 130W USB-C GaN Charger" },
      { name: "Operating System", value: "Windows 11 Pro 64-bit Licensed" },
      { name: "Warranty", value: "2 Years Official Dell ProSupport Warranty" }
    ]
  },
  {
    id: 2,
    name: "Apple MacBook Pro 16\" M3 Max (36GB Unified Memory, 1TB SSD, Space Black)",
    slug: "apple-macbook-pro-16-m3-max",
    sku: "APL-MBP16-M3MAX",
    description: "Mind-blowing capability for extreme workflows. Powered by M3 Max with a 14-core CPU and 30-core GPU, Liquid Retina XDR display with 1600 nits peak brightness, hardware-accelerated ray tracing, and up to 22 hours of battery life.",
    price: 138000,
    discountPrice: 129500,
    finalPrice: 129500,
    stockQuantity: 5,
    inStock: true,
    isActive: true,
    brandId: 1,
    brandName: "Apple",
    categoryId: 1,
    categoryName: "Laptops & Computers",
    createdAt: "2026-02-10T12:00:00Z",
    rating: 5.0,
    reviewsCount: 52,
    soldCount: 110,
    badge: "Most Popular Pro",
    images: [
      { id: 201, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop&q=80", isPrimary: true, sortOrder: 0 },
      { id: 202, imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&auto=format&fit=crop&q=80", isPrimary: false, sortOrder: 1 },
      { id: 203, imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1000&auto=format&fit=crop&q=80", isPrimary: false, sortOrder: 2 }
    ],
    specifications: [
      { name: "Processor", value: "Apple M3 Max (14-Core CPU: 10 performance, 4 efficiency)" },
      { name: "Memory (RAM)", value: "36 GB Unified High-Bandwidth Memory (300GB/s)" },
      { name: "Storage", value: "1 TB Ultra-Fast PCIe SSD (7.4 GB/s read)" },
      { name: "Graphics (GPU)", value: "30-Core Integrated GPU with Hardware Ray Tracing" },
      { name: "Display", value: "16.2\" Liquid Retina XDR (3456 x 2234), 120Hz ProMotion" },
      { name: "Battery & Power", value: "100 Whr Li-Poly, up to 22h, 140W USB-C MagSafe 3" },
      { name: "Operating System", value: "macOS Sonoma (Complimentary upgrade ready)" },
      { name: "Warranty", value: "1 Year Official Apple Authorised Warranty" }
    ]
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 512GB, Titanium Gray)",
    slug: "samsung-galaxy-s24-ultra-512gb",
    sku: "SAM-S24U-512-GRY",
    description: "Welcome to the era of Galaxy AI. Encased in a refined titanium shield with flat 6.8\" Dynamic AMOLED 2X 2600-nit display, Snapdragon 8 Gen 3 for Galaxy, embedded S-Pen, and 200MP Quad Telephoto optical camera.",
    price: 64000,
    discountPrice: 57900,
    finalPrice: 57900,
    stockQuantity: 12,
    inStock: true,
    isActive: true,
    brandId: 3,
    brandName: "Samsung",
    categoryId: 2,
    categoryName: "Smartphones & Tablets",
    createdAt: "2026-03-01T09:00:00Z",
    rating: 4.8,
    reviewsCount: 74,
    soldCount: 220,
    badge: "AI Flagship",
    images: [
      { id: 301, imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1000&auto=format&fit=crop&q=80", isPrimary: true, sortOrder: 0 },
      { id: 302, imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1000&auto=format&fit=crop&q=80", isPrimary: false, sortOrder: 1 }
    ],
    specifications: [
      { name: "Processor", value: "Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm Octa-Core)" },
      { name: "Memory (RAM)", value: "12 GB LPDDR5X" },
      { name: "Storage", value: "512 GB UFS 4.0 High Speed" },
      { name: "Display", value: "6.8\" QHD+ Dynamic AMOLED 2X, 1-120Hz, 2600 nits, Gorilla Armor" },
      { name: "Main Camera", value: "200 MP Main + 50 MP (5x Opt) + 10 MP (3x Opt) + 12 MP Ultra-Wide" },
      { name: "Battery & Charging", value: "5000 mAh with 45W Fast Wired & 15W Wireless Charging" },
      { name: "Chassis & Protection", value: "Titanium Frame, IP68 Water/Dust Resistance, Built-in S-Pen" },
      { name: "Warranty", value: "1 Year Official Samsung Egypt Warranty" }
    ]
  },
  {
    id: 4,
    name: "Apple iPhone 16 Pro Max 256GB (Natural Titanium, A18 Pro)",
    slug: "apple-iphone-16-pro-max-256gb",
    sku: "APL-IPH16PM-256",
    description: "The pinnacle of smartphone engineering. Featuring grade 5 titanium with an expansive 6.9\" Super Retina XDR display, A18 Pro silicon, Camera Control dedicated button, 4K 120 fps Dolby Vision, and groundbreaking battery stamina.",
    price: 78000,
    discountPrice: 72900,
    finalPrice: 72900,
    stockQuantity: 9,
    inStock: true,
    isActive: true,
    brandId: 1,
    brandName: "Apple",
    categoryId: 2,
    categoryName: "Smartphones & Tablets",
    createdAt: "2026-03-15T08:00:00Z",
    rating: 4.9,
    reviewsCount: 95,
    soldCount: 310,
    badge: "Best Seller",
    images: [
      { id: 401, imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1000&auto=format&fit=crop&q=80", isPrimary: true, sortOrder: 0 },
      { id: 402, imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1000&auto=format&fit=crop&q=80", isPrimary: false, sortOrder: 1 }
    ],
    specifications: [
      { name: "Processor", value: "Apple A18 Pro (6-core CPU, 6-core GPU, 16-core Neural Engine)" },
      { name: "Memory (RAM)", value: "8 GB High-speed Unified RAM" },
      { name: "Storage", value: "256 GB NVMe" },
      { name: "Display", value: "6.9\" Super Retina XDR OLED, 120Hz ProMotion, 2000 nits peak" },
      { name: "Cameras", value: "48MP Fusion + 48MP Ultra-Wide + 12MP 5x Telephoto with 4K120 fps" },
      { name: "Body Material", value: "Grade 5 Titanium with Ceramic Shield front" },
      { name: "Connectivity", value: "USB-C with USB 3 speeds (up to 10Gb/s), Wi-Fi 7, 5G" },
      { name: "Warranty", value: "1 Year Official Apple Warranty" }
    ]
  },
  {
    id: 5,
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Midnight Black)",
    slug: "sony-wh-1000xm5-wireless-anc",
    sku: "SNY-WH1000XM5-BLK",
    description: "Industry-leading noise cancellation rewritten with two processors and 8 microphones. Specially designed 30mm carbon fiber driver unit delivers pristine, Hi-Res audio with crystal-clear hands-free calling and 30-hour battery life.",
    price: 19500,
    discountPrice: 16900,
    finalPrice: 16900,
    stockQuantity: 15,
    inStock: true,
    isActive: true,
    brandId: 5,
    brandName: "Sony",
    categoryId: 3,
    categoryName: "Audio & Headphones",
    createdAt: "2026-02-05T14:00:00Z",
    rating: 4.9,
    reviewsCount: 112,
    soldCount: 420,
    badge: "Top Rated Audio",
    images: [
      { id: 501, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80", isPrimary: true, sortOrder: 0 },
      { id: 502, imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&auto=format&fit=crop&q=80", isPrimary: false, sortOrder: 1 }
    ],
    specifications: [
      { name: "Acoustic Driver", value: "30mm Precision Engineered Carbon Fiber Composite" },
      { name: "Noise Cancellation", value: "Dual Processor V1 + HD QN1 with 8 Microphones Auto NC Optimizer" },
      { name: "Audio Codecs", value: "LDAC, AAC, SBC (Hi-Res Audio & Hi-Res Wireless Certified)" },
      { name: "Battery Life", value: "Up to 30 Hours with ANC on, 3-min quick charge gives 3 hours" },
      { name: "Microphones", value: "4 Beamforming Mics with AI Precise Voice Pickup Technology" },
      { name: "Connectivity", value: "Bluetooth 5.2, Multipoint Connection (2 devices simultaneously)" },
      { name: "Weight", value: "Ultra-lightweight 250 grams with Soft Fit Leather earcups" },
      { name: "Warranty", value: "1 Year Official Sony Distributor Warranty" }
    ]
  },
  {
    id: 6,
    name: "ASUS ROG Zephyrus G16 OLED (Core Ultra 9, 32GB RAM, 2TB SSD, RTX 4080)",
    slug: "asus-rog-zephyrus-g16-oled-rtx4080",
    sku: "ASUS-ROG-G16-4080",
    description: "Slim, sophisticated, and brutally fast. Boasts a 16\" 2.5K 240Hz ROG Nebula OLED display with 0.2ms response, Intel Core Ultra 9 185H with AI acceleration, NVIDIA GeForce RTX 4080 12GB laptop GPU, and slash lighting CNC aluminum body.",
    price: 115000,
    discountPrice: 104999,
    finalPrice: 104999,
    stockQuantity: 4,
    inStock: true,
    isActive: true,
    brandId: 4,
    brandName: "ASUS ROG",
    categoryId: 1,
    categoryName: "Laptops & Computers",
    createdAt: "2026-02-18T16:00:00Z",
    rating: 4.9,
    reviewsCount: 29,
    soldCount: 45,
    badge: "Ultimate Gaming",
    images: [
      { id: 601, imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1000&auto=format&fit=crop&q=80", isPrimary: true, sortOrder: 0 },
      { id: 602, imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80", isPrimary: false, sortOrder: 1 }
    ],
    specifications: [
      { name: "Processor", value: "Intel Core Ultra 9 185H (16 Cores, 22 Threads, up to 5.1 GHz)" },
      { name: "Memory (RAM)", value: "32 GB LPDDR5X 7467MHz Dual Channel" },
      { name: "Storage", value: "2 TB M.2 NVMe PCIe 4.0 Performance SSD" },
      { name: "Graphics (GPU)", value: "NVIDIA GeForce RTX 4080 12GB GDDR6 (115W + 25W Dynamic Boost)" },
      { name: "Display", value: "16\" 2.5K (2560x1600) ROG Nebula OLED, 240Hz, 0.2ms, G-Sync, 500 nits" },
      { name: "Cooling System", value: "ROG Intelligent Cooling 3-Fan Vapour Chamber & Liquid Metal" },
      { name: "Audio", value: "6-Speaker System with Dual Force-Cancelling Woofers, Dolby Atmos" },
      { name: "Warranty", value: "2 Years ASUS ROG Perfect Warranty" }
    ]
  },
  {
    id: 7,
    name: "Samsung Odyssey OLED G9 49\" Curved Gaming Monitor (240Hz, 0.03ms)",
    slug: "samsung-odyssey-oled-g9-49",
    sku: "SAM-ODY-G9-OLED",
    description: "Dive into immense visuals. The dual QHD 49\" 32:9 curved OLED screen brings gaming and multi-window productivity to unprecedented immersion with 0.03ms response time, 240Hz refresh rate, and Neo Quantum Processor Pro.",
    price: 68000,
    discountPrice: 61500,
    finalPrice: 61500,
    stockQuantity: 6,
    inStock: true,
    isActive: true,
    brandId: 3,
    brandName: "Samsung",
    categoryId: 4,
    categoryName: "Monitors & Displays",
    createdAt: "2026-01-28T11:00:00Z",
    rating: 4.8,
    reviewsCount: 31,
    soldCount: 58,
    badge: "Epic 49\" OLED",
    images: [
      { id: 701, imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1000&auto=format&fit=crop&q=80", isPrimary: true, sortOrder: 0 },
      { id: 702, imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80", isPrimary: false, sortOrder: 1 }
    ],
    specifications: [
      { name: "Screen Size & Curve", value: "49 Inch Curved 1800R Ultra-Wide (Dual QHD 32:9)" },
      { name: "Resolution", value: "5120 x 1440 Dual Quad HD" },
      { name: "Panel Technology", value: "Quantum Dot OLED with Neo Quantum Processor Pro" },
      { name: "Refresh Rate & Response", value: "240Hz Refresh Rate with blistering 0.03ms (GtG) response" },
      { name: "Sync Technology", value: "AMD FreeSync Premium Pro, VESA DisplayHDR True Black 400" },
      { name: "Connectivity", value: "HDMI 2.1, DisplayPort 1.4, Micro HDMI, USB 3.0 Hub" },
      { name: "Smart Features", value: "Samsung Gaming Hub, IoT SmartThings, Built-in Stereo Speakers" },
      { name: "Warranty", value: "3 Years Official Samsung Display Warranty (Burn-in protected)" }
    ]
  },
  {
    id: 8,
    name: "Logitech MX Master 3S Wireless Performance Mouse (Quiet Clicks, 8K DPI)",
    slug: "logitech-mx-master-3s-mouse",
    sku: "LOGI-MXM3S-GRY",
    description: "An icon remastered. Feel every moment of your workflow with even more precision and tactile tactility with Quiet Clicks, an 8,000 DPI track-on-glass sensor, and the MagSpeed electromagnetic scroll wheel.",
    price: 5200,
    discountPrice: 4450,
    finalPrice: 4450,
    stockQuantity: 28,
    inStock: true,
    isActive: true,
    brandId: 7,
    brandName: "Logitech",
    categoryId: 6,
    categoryName: "Accessories & Peripherals",
    createdAt: "2026-01-10T12:00:00Z",
    rating: 4.9,
    reviewsCount: 180,
    soldCount: 650,
    badge: "Best Seller Mouse",
    images: [
      { id: 801, imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1000&auto=format&fit=crop&q=80", isPrimary: true, sortOrder: 0 },
      { id: 802, imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1000&auto=format&fit=crop&q=80", isPrimary: false, sortOrder: 1 }
    ],
    specifications: [
      { name: "Sensor", value: "Darkfield High Precision 8,000 DPI (Tracks on glass min 4mm)" },
      { name: "Scroll Wheel", value: "MagSpeed Electromagnetic wheel with SmartShift (1,000 lines/sec)" },
      { name: "Buttons", value: "7 customizable buttons including gesture button & thumb wheel" },
      { name: "Quiet Clicks", value: "90% noise reduction with satisfying tactile feedback" },
      { name: "Battery", value: "Rechargeable Li-Po 500 mAh (up to 70 days on full charge)" },
      { name: "Multi-Device", value: "Easy-Switch for up to 3 computers with Logitech Flow" },
      { name: "Connectivity", value: "Bluetooth Low Energy & Logi Bolt USB Receiver" },
      { name: "Warranty", value: "2 Years Official Logitech Warranty" }
    ]
  }
];

export function getMockProductById(id: number): ProductDetailDto | undefined {
  return MOCK_PRODUCTS.find(p => p.id === id);
}

export function getMockProductBySlug(slug: string): ProductDetailDto | undefined {
  return MOCK_PRODUCTS.find(p => p.slug === slug);
}

export function filterMockProducts(params: {
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}): { items: ProductListItemDto[]; totalCount: number } {
  let list = [...MOCK_PRODUCTS];

  if (params.search?.trim()) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (params.categoryId) {
    list = list.filter(p => p.categoryId === Number(params.categoryId));
  }

  if (params.brandId) {
    list = list.filter(p => p.brandId === Number(params.brandId));
  }

  if (params.minPrice !== undefined) {
    list = list.filter(p => p.finalPrice >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    list = list.filter(p => p.finalPrice <= params.maxPrice!);
  }

  if (params.inStock) {
    list = list.filter(p => p.stockQuantity > 0);
  }

  if (params.sortBy === "price") {
    list.sort((a, b) => a.finalPrice - b.finalPrice);
  } else if (params.sortBy === "price-desc") {
    list.sort((a, b) => b.finalPrice - a.finalPrice);
  } else if (params.sortBy === "popularity") {
    list.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
  } else if (params.sortBy === "rating") {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    // newest
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const totalCount = list.length;
  const page = params.page || 1;
  const pageSize = params.pageSize || 12;
  const paged = list.slice((page - 1) * pageSize, page * pageSize);

  const items: ProductListItemDto[] = paged.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    price: p.price,
    discountPrice: p.discountPrice,
    finalPrice: p.finalPrice,
    stockQuantity: p.stockQuantity,
    inStock: p.inStock,
    brandId: p.brandId,
    brandName: p.brandName,
    categoryId: p.categoryId,
    categoryName: p.categoryName,
    primaryImageUrl: p.images.find(i => i.isPrimary)?.imageUrl || p.images[0]?.imageUrl || null,
    soldCount: p.soldCount ?? 0,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    badge: p.badge
  }));

  return { items, totalCount };
}

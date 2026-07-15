import { z } from "zod";

// ==========================================
// B2B Order Types and Schemas
// ==========================================
export const OrderSchema = z.object({
  id: z.string(),
  client: z.string(),
  route: z.string(),
  amount: z.number(),
  status: z.enum(["fulfilled", "loading", "queued", "pending"]),
  date: z.string(),
  itemsCount: z.number(),
  region: z.enum(["EU", "Middle East"]),
});

export type Order = z.infer<typeof OrderSchema>;

// ==========================================
// Q-Commerce Product Types and Schemas
// ==========================================
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  category: z.string(),
  rating: z.number(),
  stock: z.number(),
  deliveryTime: z.string(), // e.g. "12 mins"
});

export type Product = z.infer<typeof ProductSchema>;

// ==========================================
// Generation Helpers
// ==========================================
const CLIENTS_EU = [
  "Aldi Nord Germany",
  "Carrefour France",
  "Albert Heijn Netherlands",
  "Mercadona Spain",
  "Conad Italy",
  "Tesco UK",
  "Biedronka Poland",
  "Lidl Spain",
];

const CLIENTS_ME = [
  "Panda Retail Saudi Arabia",
  "Lulu Hypermarket UAE",
  "Carrefour Dubai",
  "Al Raya Saudi Arabia",
  "Spinneys Dubai",
  "Tamimi Markets KSA",
  "Choithrams UAE",
];

const ROUTES_EU = [
  "Rotterdam ➔ Berlin",
  "Milan ➔ Madrid",
  "Antwerp ➔ Munich",
  "Paris ➔ Brussels",
  "Hamburg ➔ Warsaw",
  "Vienna ➔ Budapest",
];

const ROUTES_ME = [
  "Dubai ➔ Riyadh",
  "Jeddah ➔ Dammam",
  "Abu Dhabi ➔ Muscat",
  "Dubai ➔ Doha",
  "Kuwait City ➔ Manama",
];

const FMCG_PRODUCTS: Omit<Product, "id">[] = [
  {
    name: "Swish Fresh Organic Milk 1L",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80",
    category: "Dairy & Eggs",
    rating: 4.8,
    stock: 45,
    deliveryTime: "12 mins",
  },
  {
    name: "Draviqo Premium Espresso Beans 500g",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=300&q=80",
    category: "Beverages",
    rating: 4.9,
    stock: 22,
    deliveryTime: "15 mins",
  },
  {
    name: "Al-Seed Farm Medjool Dates 1kg",
    price: 14.50,
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=300&q=80",
    category: "Pantry",
    rating: 4.95,
    stock: 15,
    deliveryTime: "18 mins",
  },
  {
    name: "Swish Glacier Water 6x500ml",
    price: 4.20,
    image: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&w=300&q=80",
    category: "Beverages",
    rating: 4.7,
    stock: 60,
    deliveryTime: "10 mins",
  },
  {
    name: "Premium Sourdough Loaf 400g",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
    category: "Bakery",
    rating: 4.6,
    stock: 12,
    deliveryTime: "14 mins",
  },
  {
    name: "Avocados Ready-to-Eat (Pack of 2)",
    price: 2.89,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300&q=80",
    category: "Fruits & Vegetables",
    rating: 4.5,
    stock: 25,
    deliveryTime: "11 mins",
  },
  {
    name: "Greek Yogurt Honey & Fig 500g",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80",
    category: "Dairy & Eggs",
    rating: 4.8,
    stock: 18,
    deliveryTime: "13 mins",
  },
  {
    name: "Extra Virgin Olive Oil 750ml",
    price: 18.90,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
    category: "Pantry",
    rating: 4.9,
    stock: 8,
    deliveryTime: "20 mins",
  },
  {
    name: "Organic Bananas (Bunch of 5)",
    price: 1.99,
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=300&q=80",
    category: "Fruits & Vegetables",
    rating: 4.7,
    stock: 40,
    deliveryTime: "9 mins",
  },
  {
    name: "Draviqo Selection Earl Grey Tea 50 bags",
    price: 6.50,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=300&q=80",
    category: "Beverages",
    rating: 4.8,
    stock: 30,
    deliveryTime: "12 mins",
  },
  {
    name: "Free Range Large Eggs (Pack of 10)",
    price: 3.29,
    image: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=300&q=80",
    category: "Dairy & Eggs",
    rating: 4.75,
    stock: 50,
    deliveryTime: "11 mins",
  },
  {
    name: "Swish Energy Blast 250ml Can",
    price: 2.50,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80",
    category: "Beverages",
    rating: 4.4,
    stock: 100,
    deliveryTime: "8 mins",
  },
  {
    name: "Gourmet Hummus Classic 200g",
    price: 2.20,
    image: "https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=300&q=80",
    category: "Pantry",
    rating: 4.6,
    stock: 35,
    deliveryTime: "14 mins",
  },
  {
    name: "Fresh Strawberries 250g",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=300&q=80",
    category: "Fruits & Vegetables",
    rating: 4.85,
    stock: 14,
    deliveryTime: "10 mins",
  },
  {
    name: "Artisan Sea Salt Potato Chips 150g",
    price: 2.80,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=300&q=80",
    category: "Snacks",
    rating: 4.5,
    stock: 45,
    deliveryTime: "12 mins",
  },
  {
    name: "Dark Chocolate Hazelnut Bar 100g",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&w=300&q=80",
    category: "Snacks",
    rating: 4.9,
    stock: 28,
    deliveryTime: "15 mins",
  },
];

// Generate 100 mock orders
const generateOrders = (): Order[] => {
  const list: Order[] = [];
  const startTimestamp = new Date("2026-07-01T00:00:00Z").getTime();
  const endTimestamp = new Date("2026-07-15T23:59:59Z").getTime();

  for (let i = 1; i <= 100; i++) {
    const isEU = Math.random() > 0.45;
    const region = isEU ? "EU" : ("Middle East" as const);
    const client = isEU
      ? CLIENTS_EU[Math.floor(Math.random() * CLIENTS_EU.length)]
      : CLIENTS_ME[Math.floor(Math.random() * CLIENTS_ME.length)];
    const route = isEU
      ? ROUTES_EU[Math.floor(Math.random() * ROUTES_EU.length)]
      : ROUTES_ME[Math.floor(Math.random() * ROUTES_ME.length)];

    const amount = Math.floor(Math.random() * 45000) + 5000;
    const statuses: Order["status"][] = ["fulfilled", "loading", "queued", "pending"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Generate random date in range
    const randTime = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    const date = new Date(randTime).toISOString().slice(0, 10);
    const itemsCount = Math.floor(Math.random() * 480) + 20;

    list.push({
      id: `DRV-${1000 + i}`,
      client,
      route,
      amount,
      status,
      date,
      itemsCount,
      region,
    });
  }

  // Sort by date descending
  return list.sort((a, b) => b.date.localeCompare(a.date));
};

export const mockB2BOrders = generateOrders();

export const mockQCommerceProducts: Product[] = FMCG_PRODUCTS.map((prod, idx) => ({
  id: `SW-PROD-${100 + idx}`,
  ...prod,
}));

export const mockData = {
  b2b: {
    orders: mockB2BOrders,
  },
  qcommerce: {
    products: mockQCommerceProducts,
  },
};

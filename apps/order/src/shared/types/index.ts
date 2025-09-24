export interface Store {
  id: string;
  name: string;
  tableNumber: number;
  currentOrders: number;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  image?: string;
  description?: string;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

export interface OrderState {
  store: Store | null;
  categories: Category[];
  menuItems: MenuItem[];
  cart: CartItem[];
  selectedCategory: string;
  totalAmount: number;
}
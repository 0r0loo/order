export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: string;
  available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
  items: MenuItem[];
}

export interface MenuData {
  categories: MenuCategory[];
}
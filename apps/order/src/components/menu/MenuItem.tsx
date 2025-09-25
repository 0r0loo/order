import type { MenuItem as MenuItemType } from '../../types/menu';
import { Link } from '@tanstack/react-router';

interface MenuItemProps {
  item: MenuItemType;
  quantity: number;
  onQuantityChange: (itemId: string, quantity: number) => void;
  storeId: string;
  tableId: string;
}

const getBackgroundColor = (category: string, icon: string) => {
  switch (category) {
    case 'beer':
      return 'bg-amber-100';
    case 'soju':
      return 'bg-blue-100';
    case 'food':
      // 음식별로 다른 색상 적용
      if (icon === '🥓') return 'bg-red-100';
      if (icon === '🥬') return 'bg-green-100';
      if (icon === '🧀') return 'bg-yellow-100';
      if (icon === '🦑') return 'bg-purple-100';
      if (icon === '🥜') return 'bg-orange-100';
      if (icon === '🍄') return 'bg-pink-100';
      if (icon === '🐟') return 'bg-indigo-100';
      if (icon === '🍲') return 'bg-teal-100';
      return 'bg-gray-100';
    default:
      return 'bg-gray-100';
  }
};

export function MenuItem({ item, quantity, onQuantityChange, storeId, tableId }: MenuItemProps) {
  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (quantity > 0) {
      onQuantityChange(item.id, quantity - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onQuantityChange(item.id, quantity + 1);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString() + '원';
  };

  return (
    <Link
      to={`/${storeId}/table/${tableId}/menu/${item.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div className={`w-16 h-16 ${getBackgroundColor(item.category, item.icon)} rounded-lg flex items-center justify-center`}>
          <span className="text-2xl">{item.icon}</span>
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.description}</p>
          <p className="text-lg font-semibold text-gray-900">{formatPrice(item.price)}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrease}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            disabled={quantity === 0}
          >
            <span className="text-gray-600">-</span>
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button
            onClick={handleIncrease}
            className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
          >
            <span>+</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
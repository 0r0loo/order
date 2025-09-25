import { forwardRef } from 'react';
import type { MenuCategory as MenuCategoryType } from '../../types/menu';
import { MenuItem } from './MenuItem';

interface MenuCategoryProps {
  category: MenuCategoryType;
  quantities: Record<string, number>;
  onQuantityChange: (itemId: string, quantity: number) => void;
  storeId: string;
  tableId: string;
}

export const MenuCategory = forwardRef<HTMLDivElement, MenuCategoryProps>(
  ({ category, quantities, onQuantityChange, storeId, tableId }, ref) => {
    return (
      <div ref={ref} id={`category-${category.id}`}>
        <h2 className="text-lg font-bold text-gray-900 mt-6">
          {category.emoji} {category.name}
        </h2>

        <div className="space-y-4 mt-4">
          {category.items.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              quantity={quantities[item.id] || 0}
              onQuantityChange={onQuantityChange}
              storeId={storeId}
              tableId={tableId}
            />
          ))}
        </div>
      </div>
    );
  }
);

MenuCategory.displayName = 'MenuCategory';
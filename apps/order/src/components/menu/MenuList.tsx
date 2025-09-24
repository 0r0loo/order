import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import type {MenuData} from '../../types/menu';
import { MenuCategory } from './MenuCategory';

interface MenuListProps {
  menuData: MenuData;
}

export interface MenuListRef {
  scrollToCategory: (categoryId: string) => void;
}

export const MenuList = forwardRef<MenuListRef, MenuListProps>(({ menuData }, ref) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    // 초기 상태 설정 (기존 하드코딩된 값들 반영)
    'cass-draft': 1,
    'chamisul': 2
  });

  // 각 카테고리별 ref 생성
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToCategory = (categoryId: string) => {
    const categoryElement = categoryRefs.current[categoryId];
    if (categoryElement) {
      // 헤더 높이(약 120px)를 고려한 오프셋
      const headerOffset = 120;
      const elementPosition = categoryElement.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useImperativeHandle(ref, () => ({
    scrollToCategory
  }));

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: quantity
    }));
  };

  const getTotalAmount = () => {
    let total = 0;
    menuData.categories.forEach(category => {
      category.items.forEach(item => {
        const quantity = quantities[item.id] || 0;
        total += item.price * quantity;
      });
    });
    return total;
  };

  const getTotalItemCount = () => {
    return Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
  };

  return (
    <div className="space-y-4">
      {menuData.categories.map((category) => (
        <MenuCategory
          key={category.id}
          ref={(el) => {
            categoryRefs.current[category.id] = el;
          }}
          category={category}
          quantities={quantities}
          onQuantityChange={handleQuantityChange}
        />
      ))}

      {/* 디버깅을 위한 정보 표시 */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          총 주문 수량: {getTotalItemCount()}개
        </p>
        <p className="text-sm text-gray-600">
          총 금액: {getTotalAmount().toLocaleString()}원
        </p>
      </div>
    </div>
  );
});

MenuList.displayName = 'MenuList';
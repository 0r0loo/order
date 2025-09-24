import { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import type {MenuData} from '../../types/menu';
import { MenuCategory } from './MenuCategory';

interface MenuListProps {
  menuData: MenuData;
  onActiveCategory?: (categoryId: string) => void;
}

export interface MenuListRef {
  scrollToCategory: (categoryId: string) => void;
}

export const MenuList = forwardRef<MenuListRef, MenuListProps>(({ menuData, onActiveCategory }, ref) => {
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

  // Intersection Observer를 사용한 스크롤 감지
  useEffect(() => {
    if (!onActiveCategory) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 현재 보이는 카테고리들 중 가장 많이 보이는 것을 찾기
        let mostVisible = { categoryId: '', ratio: 0 };

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > mostVisible.ratio) {
            const categoryElement = entry.target as HTMLDivElement;
            const categoryId = categoryElement.dataset.categoryId;
            if (categoryId) {
              mostVisible = {
                categoryId,
                ratio: entry.intersectionRatio
              };
            }
          }
        });

        // 가장 많이 보이는 카테고리가 있으면 활성 카테고리로 설정
        if (mostVisible.categoryId) {
          onActiveCategory(mostVisible.categoryId);
        }
      },
      {
        rootMargin: '-120px 0px -50% 0px', // 헤더 높이 고려 및 카테고리의 상단 부분이 보일 때 활성화
        threshold: [0, 0.1, 0.5, 1] // 다양한 교차 비율에서 감지
      }
    );

    // 모든 카테고리 요소 관찰 시작
    Object.entries(categoryRefs.current).forEach(([categoryId, element]) => {
      if (element) {
        element.dataset.categoryId = categoryId; // 데이터 속성 추가
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [onActiveCategory, menuData.categories]);

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
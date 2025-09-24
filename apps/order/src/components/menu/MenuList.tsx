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

  // 스크롤 기반 활성 카테고리 감지
  useEffect(() => {
    if (!onActiveCategory) return;

    const handleScroll = () => {
      const headerOffset = 150; // 헤더 + 여유 공간
      let activeCategory = '';

      // 모든 카테고리를 순회하면서 현재 스크롤 위치에서 가장 적합한 카테고리 찾기
      menuData.categories.forEach((category) => {
        const element = categoryRefs.current[category.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          // 카테고리가 헤더 아래에 있고, 화면 상단에서 가까운 경우
          if (rect.top <= headerOffset && rect.bottom > headerOffset) {
            activeCategory = category.id;
          }
        }
      });

      // 활성 카테고리가 없으면 첫 번째로 보이는 카테고리 사용
      if (!activeCategory) {
        menuData.categories.forEach((category) => {
          const element = categoryRefs.current[category.id];
          if (element && !activeCategory) {
            const rect = element.getBoundingClientRect();
            if (rect.bottom > headerOffset) {
              activeCategory = category.id;
            }
          }
        });
      }

      // 카테고리 변경 시에만 콜백 호출
      if (activeCategory) {
        onActiveCategory(activeCategory);
      }
    };

    // 스크롤 이벤트 리스너 등록 (throttle 적용)
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    // 초기 실행
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
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

      {/* CartSummary가 콘텐츠를 가리지 않도록 하단 여유 공간 추가 */}
      <div className="h-20"></div>
    </div>
  );
});

MenuList.displayName = 'MenuList';
import { useRef, useState } from 'react';
import { MobileLayout } from './app/layout/MobileLayout'
import { Header } from './widgets/header/Header'
import { CategoryTabs } from './widgets/category-tabs/CategoryTabs'
import { CartSummary } from './widgets/cart-summary/CartSummary'
import { MenuList, type MenuListRef } from './components/menu/MenuList'
import { menuData } from './data/menu'

function App() {
  const menuListRef = useRef<MenuListRef>(null);
  const [selectedCategory, setSelectedCategory] = useState('beer');

  // 메뉴 데이터의 카테고리를 기반으로 탭 카테고리 생성
  const categories = [
    { id: 'beer', name: '맥주' },
    { id: 'soju', name: '소주' },
    { id: 'food', name: '안주' },
  ];

  const handleCategoryChange = (categoryId: string) => {
    console.log('카테고리 변경:', categoryId);
    // 선택된 카테고리 state 업데이트
    setSelectedCategory(categoryId);
    // 해당 카테고리 섹션으로 스크롤
    menuListRef.current?.scrollToCategory(categoryId);
  };

  return (
    <MobileLayout>
      <Header
        storeName="맛있는 술집"
        tableNumber={5}
        currentOrders={3}
      />

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="mt-14">
        <div className="p-4">
          {/* 안내 메시지 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="space-y-1">
              <p className="text-blue-800 text-sm">📍 화장실은 1층 계단 옆에 있습니다. 비밀번호: 1234</p>
              <p className="text-blue-800 text-sm">🚬 흡연실은 건물 외부 좌측에 마련되어 있습니다</p>
            </div>
          </div>

          {/* 메뉴 목록 - 컴포넌트로 변경 */}
          <MenuList ref={menuListRef} menuData={menuData} />
        </div>
      </div>

      <CartSummary
        totalAmount={15000}
        itemCount={3}
        onCartClick={() => console.log('카트 클릭')}
      />
    </MobileLayout>
  )
}

export default App

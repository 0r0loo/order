import { createFileRoute, Link } from '@tanstack/react-router'
import { MobileLayout } from '../../../../../app/layout/MobileLayout'
import { menuData } from '../../../../../data/menu'
import { useState } from 'react'

export const Route = createFileRoute('/$storeId/table/$tableId/menu/$itemId')({
  component: MenuDetailPage,
})

function MenuDetailPage() {
  const { storeId, tableId, itemId } = Route.useParams()
  const [quantity, setQuantity] = useState(1)

  // 메뉴 아이템 찾기
  const menuItem = menuData.categories
    .flatMap(category => category.items)
    .find(item => item.id === itemId)

  if (!menuItem) {
    return (
      <MobileLayout>
        <div className="p-4">
          <h1 className="text-xl font-bold">메뉴를 찾을 수 없습니다</h1>
          <Link to={`/${storeId}/table/${tableId}`} className="text-blue-600">
            메뉴로 돌아가기
          </Link>
        </div>
      </MobileLayout>
    )
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change))
  }

  const handleAddToCart = () => {
    console.log(`장바구니에 추가: ${menuItem.name} x ${quantity}`)
    // TODO: 장바구니 상태 관리 로직 추가
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-white">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between p-4">
            <Link to={`/${storeId}/table/${tableId}`} className="text-gray-600">
              ← 뒤로
            </Link>
            <h1 className="text-lg font-semibold">메뉴 상세</h1>
            <div></div>
          </div>
        </div>

        {/* 메뉴 이미지 */}
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">이미지 준비중</span>
        </div>

        {/* 메뉴 정보 */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2">{menuItem.name}</h2>
          <p className="text-xl font-semibold text-blue-600 mb-4">
            {menuItem.price.toLocaleString()}원
          </p>

          {menuItem.description && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">설명</h3>
              <p className="text-gray-600 leading-relaxed">{menuItem.description}</p>
            </div>
          )}

          {/* 수량 선택 */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">수량</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-xl font-medium min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <Link
              to={`/${storeId}/table/${tableId}/cart`}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg text-center font-medium"
            >
              장바구니
            </Link>
            <button
              onClick={handleAddToCart}
              className="flex-2 bg-blue-600 text-white py-4 px-6 rounded-lg font-medium"
            >
              {(menuItem.price * quantity).toLocaleString()}원 담기
            </button>
          </div>
        </div>

        {/* 하단 여유 공간 */}
        <div className="h-24"></div>
      </div>
    </MobileLayout>
  )
}
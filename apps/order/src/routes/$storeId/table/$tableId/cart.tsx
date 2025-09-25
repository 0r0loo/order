import { createFileRoute, Link } from '@tanstack/react-router'
import { MobileLayout } from '../../../../app/layout/MobileLayout'
import { useState } from 'react'

export const Route = createFileRoute('/$storeId/table/$tableId/cart')({
  component: CartPage,
})

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

function CartPage() {
  const { storeId, tableId } = Route.useParams()

  // 임시 장바구니 데이터 (실제로는 상태 관리 라이브러리나 Context 사용)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 'cass-draft', name: '카스 생맥주', price: 4000, quantity: 2 },
    { id: 'chamisul', name: '참이슬', price: 3500, quantity: 1 },
    { id: 'chicken', name: '후라이드 치킨', price: 18000, quantity: 1 }
  ])

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(items => items.filter(item => item.id !== itemId))
    } else {
      setCartItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-white">
          {/* 헤더 */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="flex items-center justify-between p-4">
              <Link to={`/${storeId}/table/${tableId}`} className="text-gray-600">
                ← 뒤로
              </Link>
              <h1 className="text-lg font-semibold">장바구니</h1>
              <div></div>
            </div>
          </div>

          {/* 빈 장바구니 */}
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold mb-2">장바구니가 비어있습니다</h2>
            <p className="text-gray-600 mb-6">메뉴를 선택해 주세요</p>
            <Link
              to={`/${storeId}/table/${tableId}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              메뉴 보러가기
            </Link>
          </div>
        </div>
      </MobileLayout>
    )
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
            <h1 className="text-lg font-semibold">장바구니</h1>
            <div></div>
          </div>
        </div>

        {/* 장바구니 아이템 */}
        <div className="p-4 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{item.name}</h3>
                <button
                  onClick={() => updateQuantity(item.id, 0)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">{item.price.toLocaleString()}원</span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="min-w-[2rem] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right mt-2">
                <span className="font-semibold">
                  {(item.price * item.quantity).toLocaleString()}원
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 주문 요약 */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>총 {totalItems}개 상품</span>
              <span>{totalAmount.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span>배달료</span>
              <span>0원</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t">
              <span>총 결제금액</span>
              <span className="text-blue-600">{totalAmount.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <Link
            to={`/${storeId}/table/${tableId}/checkout`}
            className="w-full bg-blue-600 text-white py-4 rounded-lg text-center font-medium block"
          >
            {totalAmount.toLocaleString()}원 주문하기
          </Link>
        </div>

        {/* 하단 여유 공간 */}
        <div className="h-24"></div>
      </div>
    </MobileLayout>
  )
}
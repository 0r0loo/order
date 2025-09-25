import { createFileRoute, Link } from '@tanstack/react-router'
import { MobileLayout } from '../../../../app/layout/MobileLayout'
import { useState } from 'react'

export const Route = createFileRoute('/$storeId/table/$tableId/checkout')({
  component: CheckoutPage,
})

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

function CheckoutPage() {
  const { storeId, tableId } = Route.useParams()
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'account'>('card')
  const [isProcessing, setIsProcessing] = useState(false)

  // 임시 주문 데이터 (실제로는 장바구니에서 가져옴)
  const orderItems: OrderItem[] = [
    { id: 'cass-draft', name: '카스 생맥주', price: 4000, quantity: 2 },
    { id: 'chamisul', name: '참이슬', price: 3500, quantity: 1 },
    { id: 'chicken', name: '후라이드 치킨', price: 18000, quantity: 1 }
  ]

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0)

  const handlePayment = async () => {
    setIsProcessing(true)

    // 결제 처리 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 실제로는 결제 API 호출 및 주문 완료 페이지로 이동
    console.log(`결제 완료: ${paymentMethod}, ${totalAmount}원`)
    setIsProcessing(false)

    // TODO: 주문 완료 페이지로 이동 또는 성공 모달 표시
    alert('주문이 완료되었습니다!')
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-white">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between p-4">
            <Link to={`/${storeId}/table/${tableId}/cart`} className="text-gray-600">
              ← 뒤로
            </Link>
            <h1 className="text-lg font-semibold">결제</h1>
            <div></div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* 주문 정보 */}
          <section>
            <h2 className="text-lg font-semibold mb-3">주문 정보</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">테이블 번호</span>
                <span className="font-medium">{tableId}번</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">주문 상품</span>
                <span className="font-medium">{totalItems}개</span>
              </div>
            </div>
          </section>

          {/* 주문 상품 */}
          <section>
            <h2 className="text-lg font-semibold mb-3">주문 상품</h2>
            <div className="space-y-3">
              {orderItems.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-medium">
                    {(item.price * item.quantity).toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 결제 수단 */}
          <section>
            <h2 className="text-lg font-semibold mb-3">결제 수단</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💳</span>
                  <span>신용카드</span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="account"
                  checked={paymentMethod === 'account'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'account')}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏦</span>
                  <span>계좌이체</span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash')}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💵</span>
                  <span>현금결제</span>
                </div>
              </label>
            </div>
          </section>

          {/* 결제 금액 */}
          <section>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>상품 금액</span>
                  <span>{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>할인</span>
                  <span>-0원</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-blue-200">
                  <span>총 결제 금액</span>
                  <span className="text-blue-600">{totalAmount.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 하단 결제 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 rounded-lg text-white font-medium ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                결제 처리 중...
              </div>
            ) : (
              `${totalAmount.toLocaleString()}원 결제하기`
            )}
          </button>
        </div>

        {/* 하단 여유 공간 */}
        <div className="h-24"></div>
      </div>
    </MobileLayout>
  )
}
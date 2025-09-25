import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">맛있는 술집</h1>
        <p className="text-gray-600 mb-8">테이블별 메뉴 주문 시스템</p>

        {/* 테스트용 링크들 */}
        <div className="space-y-4">
          <Link
            to="/delicious-pub/table/5"
            className="block w-full max-w-sm mx-auto bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            5번 테이블 메뉴 보기
          </Link>

          <Link
            to="/delicious-pub/table/3"
            className="block w-full max-w-sm mx-auto bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
          >
            3번 테이블 메뉴 보기
          </Link>

          <Link
            to="/delicious-pub/table/1"
            className="block w-full max-w-sm mx-auto bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
          >
            1번 테이블 메뉴 보기
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>QR 코드를 스캔하여 테이블별 메뉴에 접근하세요</p>
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { Button } from '@repo/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-gray-900">Order Project</h1>

      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl mb-4">공통 UI 패키지 테스트</h2>
          <Button appName="order">
            Order Button
          </Button>
        </div>

        <div className="text-center">
          <h2 className="text-xl mb-4">Tailwind CSS 테스트</h2>
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            Tailwind 배경색 테스트
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl mb-4">카운터 테스트</h2>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Count: {count}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App

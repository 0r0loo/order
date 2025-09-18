# Order System Development Plan

## 프로젝트 개요

**목표**: 테이블 오더, 키오스크, 어드민 시스템을 포함한 통합 주문 관리 시스템 개발

**기술 스택**:
- Frontend: Next.js 15 + React 19 + TypeScript
- Backend: Supabase (Database + Auth + Real-time)
- Monorepo: Turborepo + Yarn Workspaces
- Styling: Tailwind CSS + 반응형 디자인

## 시스템 아키텍처

### 앱 구조 계획
```
apps/
├── table-order/     # 테이블 주문 앱 (고객용)
├── kiosk/          # 키오스크 앱 (매장 내 주문)
├── admin/          # 어드민 대시보드 (관리자용)
└── docs/           # 문서 (기존 유지)

packages/
├── ui/             # 공통 UI 컴포넌트 (Tailwind 기반)
├── supabase/       # Supabase 클라이언트 및 타입
├── shared/         # 공통 유틸리티 및 훅
├── tailwind-config/ # Tailwind 설정 및 디자인 토큰
├── eslint-config/  # ESLint 설정 (기존)
└── typescript-config/ # TypeScript 설정 (기존)
```

## 데이터베이스 스키마 (Supabase)

### 핵심 테이블
```sql
-- 매장 정보
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  address TEXT,
  phone VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 테이블 정보
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  table_number INTEGER NOT NULL,
  qr_code VARCHAR UNIQUE,
  status VARCHAR DEFAULT 'available', -- available, occupied, reserved
  created_at TIMESTAMP DEFAULT NOW()
);

-- 카테고리
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  name VARCHAR NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 메뉴 아이템
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  category_id UUID REFERENCES categories(id),
  name VARCHAR NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- 원 단위
  image_url VARCHAR,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 주문
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id),
  table_id UUID REFERENCES tables(id),
  order_number VARCHAR UNIQUE NOT NULL,
  status VARCHAR DEFAULT 'pending', -- pending, confirmed, preparing, ready, completed, cancelled
  total_amount INTEGER NOT NULL,
  payment_status VARCHAR DEFAULT 'pending', -- pending, paid, failed
  order_type VARCHAR DEFAULT 'table', -- table, kiosk
  customer_name VARCHAR,
  customer_phone VARCHAR,
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 주문 상품
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 관리자 계정 (Supabase Auth 활용)
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  store_id UUID REFERENCES stores(id),
  role VARCHAR DEFAULT 'staff', -- owner, manager, staff
  name VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS) 정책
```sql
-- 매장별 데이터 격리
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 관리자는 자신의 매장 데이터만 접근
CREATE POLICY admin_store_policy ON orders
  FOR ALL USING (
    store_id IN (
      SELECT store_id FROM admin_profiles
      WHERE id = auth.uid()
    )
  );
```

## 앱별 기능 명세

### 1. 테이블 오더 앱 (`apps/table-order`)
**Target**: 고객이 테이블에서 QR코드로 접속하여 주문

**핵심 기능**:
- QR 코드 스캔으로 테이블 식별
- 메뉴 카테고리별 브라우징
- 장바구니 기능
- 실시간 주문 상태 확인
- 추가 주문 가능

**UI/UX 고려사항**:
- 모바일 우선 반응형 디자인
- 직관적인 네비게이션
- 큰 터치 영역
- 이미지 중심 메뉴 표시

### 2. 키오스크 앱 (`apps/kiosk`)
**Target**: 매장 내 키오스크 단말기에서 고객이 직접 주문

**핵심 기능**:
- 터치 친화적 인터페이스
- 메뉴 선택 및 옵션 설정
- 결제 연동 (향후 확장)
- 주문 번호 발급
- 다국어 지원 (한/영)

**UI/UX 고려사항**:
- 대형 화면 최적화 (태블릿/키오스크)
- 시각적 메뉴 표시
- 간단한 주문 플로우
- 접근성 고려 (시각/청각 장애인)

### 3. 어드민 앱 (`apps/admin`)
**Target**: 매장 관리자 및 직원용 주문 관리 시스템

**핵심 기능**:
- 실시간 주문 대시보드
- 주문 상태 관리 (접수, 준비중, 완료)
- 메뉴 관리 (CRUD)
- 매장 설정 관리
- 매출 통계 및 리포트
- 테이블 상태 관리

**UI/UX 고려사항**:
- 데스크톱 우선 설계
- 효율적인 주문 처리 워크플로우
- 실시간 알림 시스템
- 직관적인 대시보드

## 공통 패키지 설계

### `packages/supabase`
```typescript
// Supabase 클라이언트 설정
export const supabase = createClient(url, key)

// 타입 정의 (Database Generated Types)
export type Database = {
  public: {
    Tables: {
      orders: { ... }
      menu_items: { ... }
      // ...
    }
  }
}

// API 함수들
export const ordersApi = {
  create: (order: CreateOrder) => Promise<Order>
  getByTable: (tableId: string) => Promise<Order[]>
  updateStatus: (id: string, status: OrderStatus) => Promise<void>
}
```

### `packages/shared`
```typescript
// 공통 훅
export const useOrders = (tableId?: string) => { ... }
export const useMenuItems = (storeId: string) => { ... }
export const useRealtimeOrders = () => { ... }

// 유틸리티
export const formatPrice = (price: number) => string
export const generateOrderNumber = () => string
export const validateOrder = (order: Order) => boolean
```

### `packages/ui`
```typescript
// Tailwind 기반 공통 컴포넌트
export const MenuCard = ({ item, onAdd }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
    <img src={item.image} className="w-full h-32 object-cover rounded-md mb-3" />
    <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
    <p className="text-2xl font-bold text-blue-600 mb-3">{formatPrice(item.price)}</p>
    <button
      onClick={() => onAdd(item)}
      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
    >
      장바구니 담기
    </button>
  </div>
)

export const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800'
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  )
}
```

### `packages/tailwind-config`
```javascript
// tailwind.config.js - 공통 Tailwind 설정
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

## 개발 로드맵

### Phase 1: 기반 구조 구축 (2주)
1. **Week 1**:
   - Supabase 프로젝트 설정 및 스키마 생성
   - 모노레포 구조 확장 (새 앱 추가)
   - `packages/supabase` 패키지 개발
   - 기본 타입 정의 및 API 함수

2. **Week 2**:
   - `packages/shared` 공통 훅 및 유틸리티
   - `packages/ui` 기본 컴포넌트 라이브러리 (Tailwind)
   - `packages/tailwind-config` 공통 디자인 시스템
   - 인증 시스템 구축
   - 기본 레이아웃 및 네비게이션

### Phase 2: 어드민 시스템 (3주)
3. **Week 3-4**:
   - 어드민 앱 기본 구조
   - 메뉴 관리 시스템 (CRUD)
   - 매장 설정 관리
   - 카테고리 관리

4. **Week 5**:
   - 주문 대시보드 구축
   - 실시간 주문 모니터링
   - 주문 상태 관리 기능
   - 기본 통계 화면

### Phase 3: 테이블 오더 시스템 (3주)
5. **Week 6-7**:
   - 테이블 오더 앱 기본 구조
   - QR 코드 시스템 구축
   - 메뉴 브라우징 UI
   - 장바구니 기능

6. **Week 8**:
   - 주문 생성 및 관리
   - 실시간 주문 상태 확인
   - 추가 주문 기능
   - 모바일 최적화

### Phase 4: 키오스크 시스템 (2주)
7. **Week 9**:
   - 키오스크 앱 기본 구조
   - 대형 화면 최적화 UI
   - 터치 친화적 인터페이스

8. **Week 10**:
   - 주문 플로우 완성
   - 다국어 지원
   - 접근성 개선
   - 성능 최적화

### Phase 5: 통합 및 배포 (1주)
9. **Week 11**:
   - 전체 시스템 통합 테스트
   - 성능 최적화
   - 보안 검토
   - 배포 환경 구축

## 기술적 고려사항

### 실시간 기능
```typescript
// Supabase Realtime 활용
const subscription = supabase
  .channel('orders')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'orders' },
    (payload) => {
      // 새 주문 알림
    }
  )
  .subscribe()
```

### 상태 관리
- React Query/TanStack Query로 서버 상태 관리
- Zustand로 클라이언트 상태 관리
- Supabase Realtime으로 실시간 동기화

### 성능 최적화
- Next.js 15의 Turbopack 활용
- 이미지 최적화 (next/image)
- 코드 스플리팅 및 지연 로딩
- Supabase Edge Functions 활용 고려

### 보안
- Row Level Security (RLS) 정책 구현
- JWT 토큰 기반 인증
- API 요청 검증
- XSS/CSRF 방지

## 배포 전략

### 개발 환경
```bash
# 모든 앱 동시 개발 실행
yarn dev

# 특정 앱만 실행
yarn turbo dev --filter=admin
yarn turbo dev --filter=table-order
yarn turbo dev --filter=kiosk
```

### 프로덕션 배포
- Vercel을 통한 자동 배포
- 환경별 Supabase 프로젝트 분리
- 도메인별 앱 분리 배포 고려
  - `admin.store.com`
  - `order.store.com`
  - `kiosk.store.com`

## 다음 단계

1. **즉시 시작**: Supabase 프로젝트 생성 및 스키마 설정
2. **모노레포 확장**: 새로운 앱 폴더 생성
3. **공통 패키지 개발**: supabase, shared 패키지 구축
4. **어드민 시스템부터** 단계적 개발 시작

이 계획을 바탕으로 체계적이고 확장 가능한 주문 관리 시스템을 구축할 수 있습니다.
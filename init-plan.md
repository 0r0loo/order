# Order System Planning Document

## 프로젝트 개요

**목표**: 테이블 오더, 키오스크, 어드민 시스템을 포함한 통합 주문 관리 시스템 개발

**비즈니스 모델**: 매장 내 무인 주문 시스템으로 인력 절약 및 고객 편의성 향상

## 서비스 구조

### 3개 서비스 앱

```
📱 table-order     # 테이블 주문 앱 (고객용 - 모바일)
🖥️ kiosk          # 키오스크 앱 (매장 내 무인 주문)
👨‍💼 admin          # 어드민 대시보드 (관리자용 - 데스크톱)
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

## 비즈니스 요구사항

### 핵심 목표

- **인력 절약**: 주문 접수 직원 없이도 매장 운영 가능
- **고객 만족**: 대기시간 단축, 개인화된 주문 경험
- **매출 증대**: 추가 주문 유도, 메뉴 추천 시스템
- **운영 효율**: 실시간 주문 관리, 재고 연동

### 타겟 고객

- **매장 사장님**: 인건비 절약, 매출 증대 관심
- **고객**: 빠른 주문, 개인 맞춤 서비스 원함
- **직원**: 효율적인 주문 관리 도구 필요

## 개발 일정 (총 11주)

### Phase 1: 기반 시스템 (2주)

- 데이터베이스 스키마 설계 및 구축
- 인증/권한 시스템
- 기본 UI/UX 디자인 시스템

### Phase 2: 어드민 시스템 (3주)

- 매장 관리 기능
- 메뉴 관리 시스템
- 주문 대시보드 및 통계

### Phase 3: 테이블 오더 (3주)

- QR 코드 기반 테이블 인식
- 모바일 최적화 주문 UI
- 실시간 주문 상태 확인

### Phase 4: 키오스크 시스템 (2주)

- 터치 친화적 대형 화면 UI
- 매장 내 무인 주문 시스템
- 다국어 지원

### Phase 5: 통합 및 런칭 (1주)

- 전체 시스템 연동 테스트
- 성능 최적화 및 보안 점검
- 실제 매장 파일럿 테스트

## 성공 지표 (KPI)

### 매장 운영 효율성

- **주문 처리 시간**: 기존 대비 50% 단축
- **인력 절약**: 주문 접수 직원 1명 절약 효과
- **주문 정확도**: 99% 이상 (수기 주문 대비 오류 감소)

### 고객 만족도

- **대기 시간**: 평균 3분 이내 주문 완료
- **사용성**: 직관적 UI로 첫 사용자도 5분 이내 주문 가능
- **접근성**: 모든 연령대 사용 가능한 인터페이스

### 비즈니스 성과

- **추가 주문율**: 테이블 오더 시 20% 증가 목표
- **회전율**: 테이블 회전율 15% 개선
- **매출 증대**: 월 매출 10% 이상 증가

## 향후 확장 계획

### 1단계 확장 (6개월 후)

- **결제 연동**: 카드/모바일 결제 시스템
- **포인트 시스템**: 고객 리워드 프로그램
- **리뷰 시스템**: 메뉴 평점 및 후기

### 2단계 확장 (1년 후)

- **다매장 관리**: 프랜차이즈 지원 시스템
- **재고 관리**: 실시간 재고 연동
- **마케팅 도구**: 쿠폰, 프로모션 관리

### 3단계 확장 (2년 후)

- **AI 추천**: 개인화 메뉴 추천 시스템
- **음성 주문**: 키오스크 음성 인식 기능
- **배달 연동**: 배달앱과의 통합 관리

이 기획을 통해 매장 운영의 디지털 전환을 이루고, 지속 가능한 비즈니스 모델을 구축할 수 있습니다.

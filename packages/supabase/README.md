# @repo/supabase

Supabase 클라이언트 및 비즈니스 로직을 포함한 공통 패키지

## 사용법

### 1. 클라이언트 및 서비스 초기화

```typescript
// apps/admin/src/lib/supabase.ts
import { createSupabaseClient } from "@repo/supabase/client";
import { createServices } from "@repo/supabase/services";

const supabaseClient = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const services = createServices(supabaseClient);
export const supabase = supabaseClient;
```

### 2. 서비스 사용

```typescript
// 컴포넌트나 API 라우트에서
import { services } from "@/lib/supabase";

async function handleLogin(email: string, password: string) {
  const { data, error } = await services.auth.signIn({ email, password });

  if (error) {
    console.error("로그인 실패:", error);
    return;
  }

  console.log("로그인 성공:", data);
}
```

### 3. 타입 사용

```typescript
import type { ServiceResponse, AuthUser } from "@repo/supabase/types";

const user: AuthUser = {
  id: "123",
  email: "user@example.com",
};
```

## 패키지 구조

```
src/
├── client.ts           # Supabase 클라이언트 생성
├── types.ts            # 공통 타입 정의
└── services/
    ├── base.ts         # 기본 서비스 클래스
    ├── auth.ts         # 인증 서비스
    └── index.ts        # 서비스 팩토리
```

## 새 서비스 추가하기

```typescript
// src/services/orders.ts
import { BaseService } from "./base";

export class OrdersService extends BaseService {
  async getOrders() {
    return this.executeQuery(async () => {
      // DB 쿼리 로직
    });
  }
}

// src/services/index.ts에 추가
export class SupabaseServices {
  public auth: AuthService;
  public orders: OrdersService; // 새 서비스 추가

  constructor(client: SupabaseClient) {
    this.auth = new AuthService(client);
    this.orders = new OrdersService(client); // 초기화
  }
}
```

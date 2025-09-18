import type { SupabaseClient } from "../client.js";
import { AuthService } from "./auth.js";

// 서비스 팩토리 클래스
export class SupabaseServices {
  public auth: AuthService;
  // 추후 추가될 서비스들
  // public orders: OrdersService
  // public menu: MenuService

  constructor(client: SupabaseClient) {
    this.auth = new AuthService(client);
  }
}

// 서비스 생성 함수
export function createServices(client: SupabaseClient): SupabaseServices {
  return new SupabaseServices(client);
}

// 개별 서비스들 export
export { AuthService } from "./auth.js";
export { BaseService } from "./base.js";

// 타입들 export
export type * from "../types.js";

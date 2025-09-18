import type { PostgrestError, AuthError } from "@supabase/supabase-js";
import type { SupabaseClient } from "../client.js";
import type { ServiceResponse, SupabaseResponse } from "../types.js";

// 기본 서비스 클래스
export abstract class BaseService {
  protected client: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.client = client;
  }

  // 에러 핸들링 유틸리티 - Supabase 에러 타입 지원
  protected handleResponse<T>(data: T | null, error: PostgrestError | AuthError | null | Error): ServiceResponse<T> {
    if (error) {
      console.error("Service Error:", error);
      return {
        data: null,
        error: error.message || "An error occurred",
      };
    }

    return {
      data,
      error: null,
    };
  }

  // 공통 쿼리 유틸리티들 - 강화된 타입 지원
  protected async executeQuery<T>(
    queryFn: () => Promise<SupabaseResponse<T>>,
  ): Promise<ServiceResponse<T>> {
    try {
      const { data, error } = await queryFn();
      return this.handleResponse(data, error);
    } catch (err) {
      return this.handleResponse<T>(null, err as Error);
    }
  }

  // Auth 전용 쿼리 유틸리티
  protected async executeAuthQuery<T>(
    queryFn: () => Promise<{ data: T; error: AuthError | null }>,
  ): Promise<ServiceResponse<T>> {
    try {
      const { data, error } = await queryFn();
      return this.handleResponse(data, error);
    } catch (err) {
      return this.handleResponse<T>(null, err as Error);
    }
  }
}

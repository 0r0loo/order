import type { PostgrestError, AuthError } from "@supabase/supabase-js";
import type { SupabaseClient } from "./client.js";

// 공통 응답 타입 - Supabase 에러 타입 활용
export interface ServiceResponse<T = any> {
  data: T | null;
  error: string | null;
}

// Supabase 에러를 ServiceResponse로 변환하는 유틸리티 타입
export type SupabaseResponse<T> = {
  data: T | null;
  error: PostgrestError | AuthError | null;
};

// 서비스 클래스에서 사용할 기본 인터페이스
export interface SupabaseService {
  client: SupabaseClient;
}

// 기본 엔티티 타입 (예시)
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// Auth 관련 타입들 (예시)
export interface AuthUser {
  id: string;
  email?: string;
  created_at: string;
}

// Database 타입들은 스키마 확정 후 추가 예정
export type Database = {
  // 향후 스키마 타입 정의
};

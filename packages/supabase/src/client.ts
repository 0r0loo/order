import { createClient, SupabaseClient as BaseSupabaseClient } from "@supabase/supabase-js";

// Supabase 클라이언트 생성 함수
// 사용하는 앱에서 환경변수를 전달받도록 변경
export function createSupabaseClient(url: string, key: string) {
  if (!url || !key) {
    throw new Error("Missing Supabase URL or key");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

// 공식 Supabase 타입을 재export
export type SupabaseClient = BaseSupabaseClient;

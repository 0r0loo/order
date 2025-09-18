import type { User, Session, AuthChangeEvent, AuthTokenResponsePassword, AuthResponse } from "@supabase/supabase-js";
import { BaseService } from "./base.js";
import type { ServiceResponse } from "../types.js";

// 인증 관련 타입들 - Supabase 공식 타입 활용
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  options?: {
    data?: Record<string, any>;
  };
}

// 인증 서비스 클래스
export class AuthService extends BaseService {
  // 회원가입
  async signUp(credentials: SignUpCredentials): Promise<ServiceResponse<AuthResponse["data"]>> {
    return this.executeAuthQuery(async () => {
      const { data, error } = await this.client.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: credentials.options,
      });

      return { data, error };
    });
  }

  // 로그인
  async signIn(credentials: LoginCredentials): Promise<ServiceResponse<AuthTokenResponsePassword["data"]>> {
    return this.executeAuthQuery(async () => {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      return { data, error };
    });
  }

  // 로그아웃
  async signOut(): Promise<ServiceResponse<void>> {
    return this.executeAuthQuery(async () => {
      const { error } = await this.client.auth.signOut();
      return { data: null, error };
    });
  }

  // 현재 사용자 정보
  async getCurrentUser(): Promise<ServiceResponse<User | null>> {
    return this.executeAuthQuery(async () => {
      const { data: { user }, error } = await this.client.auth.getUser();
      return { data: user, error };
    });
  }

  // 현재 세션 정보
  async getSession(): Promise<ServiceResponse<Session | null>> {
    return this.executeAuthQuery(async () => {
      const { data: { session }, error } = await this.client.auth.getSession();
      return { data: session, error };
    });
  }

  // 비밀번호 재설정 요청
  async resetPassword(email: string): Promise<ServiceResponse<void>> {
    return this.executeAuthQuery(async () => {
      const { error } = await this.client.auth.resetPasswordForEmail(email);
      return { data: null, error };
    });
  }

  // 인증 상태 변경 구독 - 타입 안전성 개선
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange(callback);
  }
}

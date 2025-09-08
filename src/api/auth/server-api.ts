/**
 * 실제 서버 기반 인증 API 함수들
 * @description 목 데이터 대신 실제 백엔드 서버와 통신하는 인증 관리 함수들
 *
 * 주요 기능:
 * - 학생 3-factor 인증 (이름, 생년월일, 전화번호)
 * - 선생님 username/password 인증
 * - 로그아웃 처리
 * - 인증 상태 확인
 *
 * 인증 방식:
 * - JWT 토큰 대신 httpOnly 쿠키 사용
 * - 학생: name + birthdate + phone 조합
 * - 선생님: username + password 조합
 * - CSRF 보호 적용
 */

import { baseApiClient, authApiClient } from "@/api/client";
import { extractApiData } from "@/api/common/types";
import type { ApiResponse } from "@/api/common/types";
import type {
  TeacherAuthResult,
  LogoutResult,
} from "@/api/common/server-types";

/**
 * 학생 로그인 요청 타입
 * @description api-docs.json에서 StudentAuthRequest 스키마가 누락되어 있어
 * 실제 프론트엔드 코드나 백엔드팀 확인 후 정확한 구조로 업데이트 필요
 */
export type StudentLoginRequest = {
  /** 학생 이름 */
  name: string;
  /** 생년월일 (YYYY-MM-DD 형식) */
  birthdate: string;
  /** 전화번호 (010-XXXX-XXXX 형식) */
  phone: string;
};

/**
 * 선생님 로그인 요청 타입
 */
export type TeacherLoginRequest = {
  /** 선생님 사용자명 */
  username: string;
  /** 비밀번호 */
  password: string;
};

/**
 * 선생님 로그인 함수
 * @description 선생님의 username/password로 인증하는 함수
 *
 * 인증 방식:
 * - 전통적인 username + password 인증
 * - 성공 시 httpOnly 쿠키에 세션 저장
 * - 관리자 권한 확인 포함
 *
 * @param credentials 선생님 인증 정보
 * @param options 요청 옵션
 * @returns 선생님 로그인 결과
 */
export async function loginTeacher(
  credentials: TeacherLoginRequest,
  options?: { signal?: AbortSignal },
): Promise<TeacherAuthResult> {
  try {
    const response = await baseApiClient.request<
      ApiResponse<TeacherAuthResult>
    >({
      method: "POST",
      url: "/auth/teacher/login",
      data: credentials,
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error("[Auth API] 선생님 로그인 실패:", error);
    throw error;
  }
}

/**
 * 로그아웃 함수
 * @description 현재 사용자를 로그아웃 처리하는 함수
 *
 * 로그아웃 처리:
 * - httpOnly 쿠키 삭제
 * - 서버 세션 무효화
 * - 클라이언트 상태 초기화
 *
 * @param options 요청 옵션
 * @returns 로그아웃 결과
 */
export async function logout(options?: {
  signal?: AbortSignal;
}): Promise<LogoutResult> {
  try {
    const response = await authApiClient.request<ApiResponse<LogoutResult>>({
      method: "POST",
      url: "/auth/logout",
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error("[Auth API] 로그아웃 실패:", error);
    throw error;
  }
}

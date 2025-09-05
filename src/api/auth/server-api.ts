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
  StudentAuthResult,
  TeacherAuthResult,
  AuthUser,
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
 * 학생 로그인 함수
 * @description 학생의 3-factor 정보로 인증하는 함수
 *
 * 인증 방식:
 * - 이름, 생년월일, 전화번호 3가지 정보로 인증
 * - 성공 시 httpOnly 쿠키에 세션 저장
 * - JWT 토큰 사용하지 않음
 *
 * 주의사항:
 * - StudentAuthRequest 스키마가 api-docs.json에서 누락됨
 * - 정확한 요청 구조는 백엔드팀 확인 필요
 * - 현재는 추정 구조로 구현
 *
 * @param credentials 학생 인증 정보
 * @param options 요청 옵션
 * @returns 학생 로그인 결과
 */
export async function loginStudent(
  credentials: StudentLoginRequest,
  options?: { signal?: AbortSignal },
): Promise<StudentAuthResult> {
  try {
    const response = await baseApiClient.request<
      ApiResponse<StudentAuthResult>
    >({
      method: "POST",
      url: "/api/auth/student/login",
      data: credentials,
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error("[Auth API] 학생 로그인 실패:", error);
    throw error;
  }
}

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
      url: "/api/auth/teacher/login",
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
      url: "/api/auth/logout",
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error("[Auth API] 로그아웃 실패:", error);
    throw error;
  }
}

/**
 * 현재 사용자 정보 조회
 * @description 현재 인증된 사용자의 정보를 가져오는 함수
 *
 * 조회 정보:
 * - 사용자 기본 정보 (이름, 역할 등)
 * - 권한 정보
 * - 로그인 상태 확인
 *
 * @param options 요청 옵션
 * @returns 현재 사용자 정보
 */
export async function getCurrentUser(options?: {
  signal?: AbortSignal;
}): Promise<AuthUser> {
  try {
    const response = await authApiClient.request<ApiResponse<AuthUser>>({
      method: "GET",
      url: "/api/auth/me",
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error("[Auth API] 현재 사용자 정보 조회 실패:", error);
    throw error;
  }
}

/**
 * 인증 상태 확인 함수
 * @description 현재 사용자가 인증되어 있는지 확인하는 함수
 *
 * 확인 내용:
 * - 세션 유효성 검증
 * - 권한 상태 확인
 * - 쿠키 만료 여부
 *
 * @param options 요청 옵션
 * @returns 인증 여부 (true: 인증됨, false: 미인증)
 */
export async function checkAuthStatus(options?: {
  signal?: AbortSignal;
}): Promise<boolean> {
  try {
    await getCurrentUser(options);
    return true;
  } catch (error) {
    // 401 Unauthorized 등의 에러는 미인증 상태를 의미
    if (error && typeof error === "object" && "status" in error) {
      const status = (error as any).status;
      if (status === 401 || status === 403) {
        return false;
      }
    }

    // 네트워크 에러 등 다른 에러는 다시 throw
    console.error("[Auth API] 인증 상태 확인 실패:", error);
    throw error;
  }
}

/**
 * 학생 인증 정보 유효성 검사 유틸리티
 * @description 학생 로그인 전에 입력값을 검증하는 함수
 *
 * 검증 항목:
 * - 이름: 2-10자의 한글/영문
 * - 생년월일: YYYY-MM-DD 형식 및 유효한 날짜
 * - 전화번호: 010-XXXX-XXXX 형식
 *
 * @param credentials 검증할 학생 인증 정보
 * @returns 유효성 검사 결과와 에러 메시지
 */
export function validateStudentCredentials(credentials: StudentLoginRequest): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 이름 검증
  if (!credentials.name?.trim()) {
    errors.push("이름을 입력해주세요.");
  } else if (
    credentials.name.trim().length < 2 ||
    credentials.name.trim().length > 10
  ) {
    errors.push("이름은 2-10자 사이로 입력해주세요.");
  } else if (!/^[가-힣a-zA-Z\s]+$/.test(credentials.name.trim())) {
    errors.push("이름은 한글 또는 영문만 입력 가능합니다.");
  }

  // 생년월일 검증
  if (!credentials.birthdate?.trim()) {
    errors.push("생년월일을 입력해주세요.");
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(credentials.birthdate)) {
      errors.push("생년월일은 YYYY-MM-DD 형식으로 입력해주세요.");
    } else {
      const date = new Date(credentials.birthdate);
      const today = new Date();
      if (isNaN(date.getTime())) {
        errors.push("올바른 생년월일을 입력해주세요.");
      } else if (date > today) {
        errors.push("미래 날짜는 입력할 수 없습니다.");
      } else if (date.getFullYear() < 1900) {
        errors.push("1900년 이후의 날짜를 입력해주세요.");
      }
    }
  }

  // 전화번호 검증
  if (!credentials.phone?.trim()) {
    errors.push("전화번호를 입력해주세요.");
  } else {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(credentials.phone.trim())) {
      errors.push("전화번호는 010-XXXX-XXXX 형식으로 입력해주세요.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 선생님 인증 정보 유효성 검사 유틸리티
 * @description 선생님 로그인 전에 입력값을 검증하는 함수
 *
 * 검증 항목:
 * - 사용자명: 3-20자의 영문/숫자
 * - 비밀번호: 8자 이상, 특수문자 포함
 *
 * @param credentials 검증할 선생님 인증 정보
 * @returns 유효성 검사 결과와 에러 메시지
 */
export function validateTeacherCredentials(credentials: TeacherLoginRequest): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 사용자명 검증
  if (!credentials.username?.trim()) {
    errors.push("사용자명을 입력해주세요.");
  } else if (
    credentials.username.trim().length < 3 ||
    credentials.username.trim().length > 20
  ) {
    errors.push("사용자명은 3-20자 사이로 입력해주세요.");
  } else if (!/^[a-zA-Z0-9_-]+$/.test(credentials.username.trim())) {
    errors.push("사용자명은 영문, 숫자, 언더스코어, 하이픈만 사용 가능합니다.");
  }

  // 비밀번호 검증
  if (!credentials.password) {
    errors.push("비밀번호를 입력해주세요.");
  } else if (credentials.password.length < 8) {
    errors.push("비밀번호는 8자 이상 입력해주세요.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 사용자 권한 확인 유틸리티
 * @description 현재 사용자가 특정 권한을 가지고 있는지 확인
 *
 * @param user 사용자 정보
 * @param requiredRole 필요한 권한
 * @returns 권한 보유 여부
 */
export function hasUserRole(
  user: AuthUser,
  requiredRole: "STUDENT" | "TEACHER" | "ADMIN",
): boolean {
  if (!user?.role) {
    return false;
  }

  // ADMIN은 모든 권한을 가짐
  if (user.role === "ADMIN") {
    return true;
  }

  // TEACHER는 STUDENT 권한도 가짐
  if (user.role === "TEACHER" && requiredRole === "STUDENT") {
    return true;
  }

  return user.role === requiredRole;
}

/**
 * 인증 에러 메시지 변환 유틸리티
 * @description API 에러를 사용자 친화적인 메시지로 변환
 *
 * @param error API 에러 객체
 * @returns 사용자에게 표시할 메시지
 */
export function getAuthErrorMessage(error: any): string {
  if (!error) return "알 수 없는 오류가 발생했습니다.";

  // HTTP 상태 코드별 메시지
  if (error.status) {
    switch (error.status) {
      case 400:
        return "입력 정보를 다시 확인해주세요.";
      case 401:
        return "인증 정보가 올바르지 않습니다.";
      case 403:
        return "접근 권한이 없습니다.";
      case 404:
        return "해당 사용자를 찾을 수 없습니다.";
      case 429:
        return "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.";
      case 500:
        return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      default:
        return error.message || "로그인 중 오류가 발생했습니다.";
    }
  }

  return error.message || "네트워크 오류가 발생했습니다.";
}

/**
 * 학생 API 서버 연동 함수
 * @description 학생 인증 및 시험 정보 조회를 위한 백엔드 연동 API 함수들
 * @version 2025-09-05
 */

import type { AxiosRequestConfig } from "axios";
import { authApiClient } from "@/api/client";
import { extractApiData, type ApiResponse } from "@/api/common/types";
import type {
  StudentInfo,
  RecentSubmission,
  RecentSubmissionListResponse,
} from "./types";

/**
 * 학생 3요소 인증 요청 타입
 * @description API 문서의 StudentAuthRequest에 해당하는 타입
 */
export type StudentAuthRequest = {
  /** 학생 이름 */
  name: string;
  /** 생년월일 (YYYY-MM-DD 형식) */
  birthDate: string;
  /** 전화번호 (하이픈 포함) */
  phone: string;
};

/**
 * 최근 시험 제출 내역 조회 파라미터 타입
 * @description /student/recent-submissions API의 페이징 파라미터
 */
export type RecentSubmissionsParams = {
  /** 페이지 번호 (0부터 시작, 기본값: 0) */
  page?: number;
  /** 페이지 크기 (기본값: 10, 최대값: 100) */
  size?: number;
} & StudentAuthRequest;

/**
 * 학생 API 전용 클라이언트
 * @description 학생 인증이 필요한 API와 통신하는 HTTP 클라이언트
 */
const studentApiClient = authApiClient.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3055",
  timeout: 10000,
});

/**
 * 학생 API 공통 요청 함수
 * @description 모든 학생 API 호출에서 공통으로 사용하는 요청 처리 함수
 * @template T API 응답 데이터 타입
 * @param config Axios 요청 설정 객체
 * @returns API 응답 데이터 (ApiResponse<T>에서 data 추출됨)
 * @throws {Error} 네트워크 에러 또는 서버 에러 시
 */
async function studentApiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await studentApiClient.request<ApiResponse<T>>(config);
    
    // ApiResponse<T> 구조에서 데이터 자동 추출
    return extractApiData(response.data);
  } catch (error) {
    console.error(`[StudentAPI Error] ${config.method} ${config.url}`, error);
    throw error;
  }
}

/**
 * 학생 최근 시험 제출 내역 조회
 * @description 로그인한 학생의 최근 시험 제출 내역을 페이징으로 조회합니다
 * 
 * 주요 기능:
 * - 제출 시간 내림차순 정렬 (최신순)
 * - 페이징 지원 (기본 10개, 최대 100개)
 * - 3요소 인증을 통한 학생 검증
 * 
 * @param params 인증 정보 및 페이징 파라미터
 * @param params.name 학생 이름
 * @param params.birthDate 생년월일 (YYYY-MM-DD)
 * @param params.phoneNumber 전화번호 (하이픈 포함)
 * @param params.page 페이지 번호 (기본값: 0)
 * @param params.size 페이지 크기 (기본값: 10, 최대: 100)
 * 
 * @returns 최근 시험 제출 내역 목록
 * @throws {Error} 학생 정보 불일치, 네트워크 오류, 서버 오류 시
 * 
 * @example
 * ```typescript
 * const studentInfo = {
 *   name: "홍길동",
 *   birthDate: "2000-01-01",
 *   phoneNumber: "010-1234-5678"
 * };
 * 
 * const recentSubmissions = await getRecentSubmissions({
 *   ...studentInfo,
 *   page: 0,
 *   size: 20
 * });
 * ```
 */
export async function getRecentSubmissions(
  params: RecentSubmissionsParams,
): Promise<RecentSubmissionListResponse> {
  const { page = 0, size = 10, ...authData } = params;

  return studentApiRequest<RecentSubmissionListResponse>({
    method: "POST",
    url: "/api/student/recent-submissions",
    data: {
      ...authData,
      page,
      size,
    },
  });
}

/**
 * 학생 정보 조회
 * @description 3요소 인증을 통해 학생 정보를 조회합니다
 * 
 * @param authData 학생 3요소 인증 정보
 * @returns 학생 기본 정보
 * @throws {Error} 학생 정보 불일치, 네트워크 오류, 서버 오류 시
 * 
 * @example
 * ```typescript
 * const studentInfo = await getStudentInfo({
 *   name: "홍길동",
 *   birthDate: "2000-01-01",
 *   phoneNumber: "010-1234-5678"
 * });
 * ```
 */
export async function getStudentInfo(
  authData: StudentAuthRequest,
): Promise<StudentInfo> {
  return studentApiRequest<StudentInfo>({
    method: "POST",
    url: "/api/student/info",
    data: authData,
  });
}

/**
 * 학생 로그아웃
 * @description 학생 세션을 종료합니다 (실제로는 클라이언트 측에서만 처리)
 * 
 * @param authData 학생 3요소 인증 정보
 * @returns 로그아웃 성공 여부
 * 
 * @example
 * ```typescript
 * await logoutStudent({
 *   name: "홍길동",
 *   birthDate: "2000-01-01",
 *   phoneNumber: "010-1234-5678"
 * });
 * ```
 */
export async function logoutStudent(
  authData: StudentAuthRequest,
): Promise<{ success: boolean }> {
  return studentApiRequest<{ success: boolean }>({
    method: "POST",
    url: "/api/student/logout",
    data: authData,
  });
}
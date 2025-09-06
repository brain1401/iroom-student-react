/**
 * 학생 API React Query 옵션들
 * @description 학생 관련 API 쿼리 설정과 캐시 키 관리
 */

import { upsertStudent, getRecentSubmissions, getStudentInfo } from "./api";
import type {
  StudentAuthRequest,
  RecentSubmissionsParams,
  UpsertStudentResponse,
  RecentSubmissionListResponse,
  StudentInfoDto,
} from "./types";

/**
 * 학생 쿼리 키 관리 객체
 * @description React Query/TanStack Query에서 사용하는 캐시 키들을 체계적으로 관리
 */
export const studentKeys = {
  /** 모든 학생 관련 쿼리의 기본 키 */
  all: ["student"] as const,

  /** 학생 프로필 관련 쿼리들의 기본 키 */
  profiles: () => [...studentKeys.all, "profile"] as const,
  /** 특정 학생의 프로필 쿼리 키 */
  profile: (authRequest: StudentAuthRequest) =>
    [
      ...studentKeys.profiles(),
      {
        name: authRequest.name,
        birthDate: authRequest.birthDate,
        phone: authRequest.phone,
      },
    ] as const,

  /** 최근 제출 내역 관련 쿼리들의 기본 키 */
  recentSubmissions: () => [...studentKeys.all, "recent-submissions"] as const,
  /** 특정 조건의 최근 제출 내역 쿼리 키 */
  recentSubmissionsList: (params: RecentSubmissionsParams) =>
    [
      ...studentKeys.recentSubmissions(),
      {
        name: params.name,
        birthDate: params.birthDate,
        phone: params.phone,
        page: params.page || 0,
        size: params.size || 10,
      },
    ] as const,

  /** 학생 정보 관련 쿼리들의 기본 키 */
  infos: () => [...studentKeys.all, "info"] as const,
  /** 특정 학생의 정보 쿼리 키 */
  info: (authRequest: StudentAuthRequest) =>
    [
      ...studentKeys.infos(),
      {
        name: authRequest.name,
        birthDate: authRequest.birthDate,
        phone: authRequest.phone,
      },
    ] as const,
};

/**
 * 학생 프로필 upsert 쿼리 옵션
 * @description /auth/upsert-student API를 호출하는 쿼리 설정
 * 
 * @param authRequest 학생 3요소 인증 정보
 * @returns TanStack Query 옵션 객체
 */
export const studentProfileUpsertQueryOptions = (authRequest: StudentAuthRequest) => ({
  queryKey: studentKeys.profile(authRequest),
  queryFn: async (): Promise<UpsertStudentResponse> => {
    console.log(`[StudentProfile] upsert 요청:`, authRequest.name);
    return await upsertStudent(authRequest);
  },
  staleTime: 10 * 60 * 1000, // 10분간 fresh (학생 정보는 자주 변경되지 않음)
  gcTime: 30 * 60 * 1000,    // 30분간 캐시 유지
  retry: 2,                   // 네트워크 에러 시 2회까지 재시도
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
});

/**
 * 학생 최근 제출 내역 쿼리 옵션
 * @description /api/student/recent-submissions API를 호출하는 쿼리 설정
 * 
 * @param params 인증 정보 및 페이징 파라미터
 * @returns TanStack Query 옵션 객체
 */
export const studentRecentSubmissionsQueryOptions = (params: RecentSubmissionsParams) => ({
  queryKey: studentKeys.recentSubmissionsList(params),
  queryFn: async (): Promise<RecentSubmissionListResponse> => {
    console.log(`[StudentSubmissions] 최근 제출 내역 요청:`, params.name, `(page: ${params.page || 0})`);
    return await getRecentSubmissions(params);
  },
  staleTime: 2 * 60 * 1000,  // 2분간 fresh (최근 시험 데이터는 자주 변경될 수 있음)
  gcTime: 10 * 60 * 1000,    // 10분간 캐시 유지
  retry: 1,                   // 1회만 재시도 (빠른 피드백을 위해)
  retryDelay: 1000,          // 1초 후 재시도
});

/**
 * 학생 정보 조회 쿼리 옵션
 * @description /api/student/info API를 호출하는 쿼리 설정
 * 
 * @param authRequest 학생 3요소 인증 정보
 * @returns TanStack Query 옵션 객체
 */
export const studentInfoQueryOptions = (authRequest: StudentAuthRequest) => ({
  queryKey: studentKeys.info(authRequest),
  queryFn: async (): Promise<StudentInfoDto> => {
    console.log(`[StudentInfo] 학생 정보 요청:`, authRequest.name);
    return await getStudentInfo(authRequest);
  },
  staleTime: 5 * 60 * 1000,  // 5분간 fresh
  gcTime: 15 * 60 * 1000,    // 15분간 캐시 유지
  retry: 2,                   // 2회까지 재시도
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
});

/**
 * 조건부 학생 프로필 쿼리 옵션
 * @description 로그인 상태에 따라 활성화/비활성화되는 쿼리 설정
 * 
 * @param authRequest 학생 인증 정보 (null이면 비활성화)
 * @returns TanStack Query 옵션 객체
 */
export const conditionalStudentProfileQueryOptions = (authRequest: StudentAuthRequest | null) => {
  if (!authRequest) {
    return {
      queryKey: [...studentKeys.profiles(), "disabled"],
      queryFn: () => Promise.resolve({} as UpsertStudentResponse),
      enabled: false,
    };
  }

  return {
    ...studentProfileUpsertQueryOptions(authRequest),
    enabled: true,
  };
};

/**
 * 조건부 최근 제출 내역 쿼리 옵션
 * @description 로그인 상태에 따라 활성화/비활성화되는 쿼리 설정
 * 
 * @param params 쿼리 파라미터 (null이면 비활성화)
 * @returns TanStack Query 옵션 객체
 */
export const conditionalRecentSubmissionsQueryOptions = (params: RecentSubmissionsParams | null) => {
  if (!params) {
    return {
      queryKey: [...studentKeys.recentSubmissions(), "disabled"],
      queryFn: () => Promise.resolve({ recentSubmissions: [], totalCount: 0 }),
      enabled: false,
    };
  }

  return {
    ...studentRecentSubmissionsQueryOptions(params),
    enabled: true,
  };
};
/**
 * 학생 API TanStack Query 옵션
 * @description 학생 관련 API의 React Query 설정과 쿼리 키 관리
 * @version 2025-09-05
 */

import type { QueryOptions } from "@tanstack/react-query";
import { getRecentSubmissions, getStudentInfo, type RecentSubmissionsParams, type StudentAuthRequest } from "./server-api";
import type { RecentSubmissionListResponse, StudentInfo } from "./types";

/**
 * 학생 API 쿼리 키 팩토리
 * @description 일관된 쿼리 키 생성을 위한 헬퍼 함수들
 * 
 * 키 구조:
 * - ["student"] - 학생 관련 모든 쿼리의 루트
 * - ["student", "recent-submissions"] - 최근 제출 내역 관련 쿼리들
 * - ["student", "recent-submissions", authData, page, size] - 특정 조건의 최근 제출 내역
 * - ["student", "info"] - 학생 정보 관련 쿼리들
 * - ["student", "info", authData] - 특정 학생의 정보
 */
export const studentKeys = {
  /** 학생 관련 모든 쿼리 키의 루트 */
  all: ["student"] as const,

  /** 최근 제출 내역 관련 쿼리들 */
  recentSubmissions: () => [...studentKeys.all, "recent-submissions"] as const,
  recentSubmissionsList: (params: RecentSubmissionsParams) =>
    [...studentKeys.recentSubmissions(), params] as const,

  /** 학생 정보 관련 쿼리들 */
  studentInfo: () => [...studentKeys.all, "info"] as const,
  studentInfoDetail: (authData: StudentAuthRequest) =>
    [...studentKeys.studentInfo(), authData] as const,
} as const;

/**
 * 학생 최근 시험 제출 내역 쿼리 옵션
 * @description 최근 제출 내역 API 호출을 위한 TanStack Query 설정
 * 
 * 캐시 전략:
 * - staleTime: 2분간 fresh 상태 유지 (최근 데이터이므로 자주 갱신)
 * - gcTime: 5분간 캐시 유지 (메모리 효율성)
 * - retry: 2회 재시도 (인증 실패 시 과도한 재시도 방지)
 * 
 * @param params 인증 정보 및 페이징 파라미터
 * @returns React Query 옵션 객체
 */
export const recentSubmissionsQueryOptions = (params: RecentSubmissionsParams) => ({
  queryKey: studentKeys.recentSubmissionsList(params),
  queryFn: () => getRecentSubmissions(params),
  staleTime: 2 * 60 * 1000, // 2분간 fresh 상태 유지
  gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  retry: 2, // 인증 실패 시 과도한 재시도 방지
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  // 인증 정보가 없으면 쿼리 비활성화
  enabled: Boolean(params.name && params.birthDate && params.phoneNumber),
}) satisfies QueryOptions<RecentSubmissionListResponse>;

/**
 * 학생 정보 쿼리 옵션
 * @description 학생 정보 API 호출을 위한 TanStack Query 설정
 * 
 * 캐시 전략:
 * - staleTime: 10분간 fresh 상태 유지 (학생 정보는 자주 변경되지 않음)
 * - gcTime: 30분간 캐시 유지 (세션 동안 재사용)
 * - retry: 1회만 재시도 (인증 실패는 즉시 알려야 함)
 * 
 * @param authData 학생 3요소 인증 정보
 * @returns React Query 옵션 객체
 */
export const studentInfoQueryOptions = (authData: StudentAuthRequest) => ({
  queryKey: studentKeys.studentInfoDetail(authData),
  queryFn: () => getStudentInfo(authData),
  staleTime: 10 * 60 * 1000, // 10분간 fresh 상태 유지
  gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
  retry: 1, // 인증 실패는 즉시 알려야 함
  retryDelay: 2000,
  // 인증 정보가 모두 있을 때만 쿼리 활성화
  enabled: Boolean(authData.name && authData.birthDate && authData.phoneNumber),
}) satisfies QueryOptions<StudentInfo>;

/**
 * 학생 쿼리 무효화 헬퍼
 * @description 학생 관련 캐시를 무효화하는 유틸리티 함수들
 */
export const studentQueryInvalidation = {
  /** 모든 학생 관련 쿼리 무효화 */
  invalidateAll: () => studentKeys.all,

  /** 최근 제출 내역 관련 쿼리들만 무효화 */
  invalidateRecentSubmissions: () => studentKeys.recentSubmissions(),

  /** 학생 정보 관련 쿼리들만 무효화 */
  invalidateStudentInfo: () => studentKeys.studentInfo(),

  /** 특정 학생의 최근 제출 내역만 무효화 */
  invalidateStudentRecentSubmissions: (authData: StudentAuthRequest) =>
    studentKeys.recentSubmissions().concat([authData]),
} as const;
/**
 * 학생 관련 상태 관리 atom
 * @description 학생 최근 시험 제출 내역 및 관련 상태를 관리하는 Jotai atoms
 * @version 2025-09-05
 */

import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { loggedInStudentAtom } from "./auth";
import { recentSubmissionsQueryOptions, type RecentSubmissionsParams } from "@/api/student";
import type { RecentSubmissionListResponse } from "@/api/student/types";

/**
 * 학생 최근 시험 제출 내역 페이징 설정 atom
 * @description 최근 시험 제출 내역 조회 시 사용할 페이징 설정
 */
export const studentRecentSubmissionsPageAtom = atom<number>(0);

/**
 * 학생 최근 시험 제출 내역 페이지 크기 atom
 * @description 한 페이지당 표시할 시험 개수 (기본값: 10, 최대: 100)
 */
export const studentRecentSubmissionsSizeAtom = atom<number>(10);

/**
 * 학생 인증 요청 파라미터 생성 atom (derived)
 * @description 로그인된 학생 정보를 기반으로 API 요청 파라미터 생성
 * 
 * 반환값:
 * - 로그인되지 않은 경우: null
 * - 로그인된 경우: StudentAuthRequest 형태의 인증 정보
 */
export const studentAuthRequestAtom = atom((get) => {
  const loggedInStudent = get(loggedInStudentAtom);
  
  if (!loggedInStudent) {
    return null;
  }

  return {
    name: loggedInStudent.name,
    birthDate: loggedInStudent.birthDate,
    phoneNumber: loggedInStudent.phoneNumber,
  };
});

/**
 * 학생 최근 시험 제출 내역 쿼리 파라미터 atom (derived)
 * @description 최근 시험 조회에 필요한 모든 파라미터를 조합한 atom
 * 
 * 반환값:
 * - 로그인되지 않은 경우: null
 * - 로그인된 경우: RecentSubmissionsParams (인증 정보 + 페이징)
 */
export const studentRecentSubmissionsParamsAtom = atom((get) => {
  const authRequest = get(studentAuthRequestAtom);
  const page = get(studentRecentSubmissionsPageAtom);
  const size = get(studentRecentSubmissionsSizeAtom);

  if (!authRequest) {
    return null;
  }

  return {
    ...authRequest,
    page,
    size,
  } as RecentSubmissionsParams;
});

/**
 * 학생 최근 시험 제출 내역 쿼리 atom
 * @description 로그인된 학생의 최근 시험 제출 내역을 조회하는 atomWithQuery
 * 
 * 주요 기능:
 * - 로그인 상태에 따른 자동 활성화/비활성화
 * - 3요소 인증 기반 데이터 조회
 * - 페이징 지원 및 캐시 관리
 * - 에러 처리 및 로딩 상태 관리
 * 
 * 캐시 전략:
 * - 2분간 fresh 상태 유지
 * - 5분간 백그라운드 캐시 유지
 * - 인증 실패 시 2회까지 재시도
 */
export const studentRecentSubmissionsQueryAtom = atomWithQuery((get) => {
  const params = get(studentRecentSubmissionsParamsAtom);

  // 로그인되지 않은 경우 비활성화된 쿼리 반환
  if (!params) {
    return {
      queryKey: ["student", "recent-submissions", "disabled"],
      queryFn: undefined as any,
      enabled: false,
    };
  }

  // 활성화된 쿼리 옵션 반환
  return recentSubmissionsQueryOptions(params);
});

/**
 * 학생 최근 시험 제출 내역 processed atom (derived)
 * @description 쿼리 결과를 가공하여 UI에서 사용하기 쉽게 변환한 atom
 * 
 * 반환 구조:
 * - recentSubmissions: RecentSubmission[] - 최근 시험 목록
 * - totalCount: number - 전체 시험 개수
 * - isPending: boolean - 로딩 상태
 * - isError: boolean - 에러 상태
 * - error: Error | null - 에러 정보
 * - isEmpty: boolean - 데이터가 비어있는지 여부
 * - isLoggedIn: boolean - 로그인 상태
 */
export const studentRecentSubmissionsDataAtom = atom((get) => {
  const queryResult = get(studentRecentSubmissionsQueryAtom);
  const authRequest = get(studentAuthRequestAtom);

  // 로그인되지 않은 경우
  if (!authRequest) {
    return {
      recentSubmissions: [],
      totalCount: 0,
      isPending: false,
      isError: false,
      error: null,
      isEmpty: true,
      isLoggedIn: false,
    };
  }

  // 쿼리 결과 처리
  const { data, isPending, isError, error } = queryResult;

  return {
    recentSubmissions: data?.recentSubmissions || [],
    totalCount: data?.totalCount || 0,
    isPending,
    isError,
    error,
    isEmpty: !data?.recentSubmissions?.length,
    isLoggedIn: true,
  };
});

/**
 * 학생 최근 시험 페이지 네비게이션 액션 atom
 * @description 페이징 관련 액션들을 제공하는 write-only atom
 * 
 * 제공 액션:
 * - nextPage: 다음 페이지로 이동
 * - prevPage: 이전 페이지로 이동
 * - setPage: 특정 페이지로 이동
 * - setSize: 페이지 크기 변경
 * - reset: 첫 페이지로 리셋
 */
export const studentRecentSubmissionsActionsAtom = atom(
  null,
  (get, set) => ({
    nextPage: () => {
      const currentPage = get(studentRecentSubmissionsPageAtom);
      set(studentRecentSubmissionsPageAtom, currentPage + 1);
    },

    prevPage: () => {
      const currentPage = get(studentRecentSubmissionsPageAtom);
      if (currentPage > 0) {
        set(studentRecentSubmissionsPageAtom, currentPage - 1);
      }
    },

    setPage: (page: number) => {
      if (page >= 0) {
        set(studentRecentSubmissionsPageAtom, page);
      }
    },

    setSize: (size: number) => {
      // 페이지 크기 변경 시 첫 페이지로 리셋
      if (size >= 1 && size <= 100) {
        set(studentRecentSubmissionsSizeAtom, size);
        set(studentRecentSubmissionsPageAtom, 0);
      }
    },

    reset: () => {
      set(studentRecentSubmissionsPageAtom, 0);
      set(studentRecentSubmissionsSizeAtom, 10);
    },
  }),
);

/**
 * 학생 최근 시험 통계 atom (derived)
 * @description 최근 시험 데이터를 기반으로 한 간단한 통계 정보
 * 
 * 통계 내용:
 * - 총 시험 수
 * - 시험 유형별 개수
 * - 최근 제출일
 * - 평균 문제 수
 */
export const studentRecentSubmissionsStatsAtom = atom((get) => {
  const { recentSubmissions } = get(studentRecentSubmissionsDataAtom);

  if (!recentSubmissions.length) {
    return {
      totalExams: 0,
      examTypeStats: {},
      lastSubmittedAt: null,
      averageQuestions: 0,
    };
  }

  // 시험 유형별 통계
  const examTypeStats = recentSubmissions.reduce(
    (acc, submission) => {
      acc[submission.examType] = (acc[submission.examType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // 평균 문제 수 계산
  const totalQuestions = recentSubmissions.reduce(
    (sum, submission) => sum + submission.totalQuestions,
    0,
  );
  const averageQuestions = Math.round(totalQuestions / recentSubmissions.length);

  // 가장 최근 제출일 (이미 최신순 정렬되어 있음)
  const lastSubmittedAt = recentSubmissions[0]?.submittedAt || null;

  return {
    totalExams: recentSubmissions.length,
    examTypeStats,
    lastSubmittedAt,
    averageQuestions,
  };
});
/**
 * 학생 API React Query 옵션들
 * @description 학생 관련 API 쿼리 설정과 캐시 키 관리
 */

import { upsertStudent, getRecentSubmissions, getStudentInfo, getExamDetail, getExamQuestions, getExamHistory } from "./api";
import type {
  StudentAuthRequest,
  RecentSubmissionsParams,
  UpsertStudentResponse,
  RecentSubmissionListResponse,
  StudentInfoDto,
  ExamDetailParams,
  ExamDetailResult,
  ExamQuestionsData,
  ExamHistoryParams,
  ExamHistoryResponse,
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

  /** 시험 상세 결과 관련 쿼리들의 기본 키 */
  examDetails: () => [...studentKeys.all, "exam-detail"] as const,
  /** 특정 시험의 상세 결과 쿼리 키 */
  examDetail: (params: ExamDetailParams) =>
    [
      ...studentKeys.examDetails(),
      {
        examId: params.examId,
        name: params.name,
        birthDate: params.birthDate,
        phone: params.phone,
      },
    ] as const,

  /** 시험 문제 조회 관련 쿼리들의 기본 키 */
  examQuestions: () => [...studentKeys.all, "exam-questions"] as const,
  /** 특정 시험의 문제 조회 쿼리 키 */
  examQuestion: (examId: string) =>
    [...studentKeys.examQuestions(), examId] as const,
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

/**
 * 시험 상세 결과 쿼리 옵션
 * @description /api/student/exam-detail/{examId} API를 호출하는 쿼리 설정
 * 
 * 주요 기능:
 * - 객관식/주관식 문제 수 확인 (objectiveCount, subjectiveCount) 
 * - 문제별 배점 정보 제공
 * - 탭 활성화/비활성화 로직에 사용
 * - 시험 결과 상세 분석
 * 
 * @param params 시험 ID와 학생 3요소 인증 정보
 * @returns TanStack Query 옵션 객체
 */
export const examDetailQueryOptions = (params: ExamDetailParams) => ({
  queryKey: studentKeys.examDetail(params),
  queryFn: async (): Promise<ExamDetailResult> => {
    console.log(`[ExamDetail] 시험 상세 결과 요청: ${params.examId} (${params.name})`);
    return await getExamDetail(params);
  },
  staleTime: 10 * 60 * 1000, // 10분간 fresh (시험 결과는 변경되지 않음)
  gcTime: 60 * 60 * 1000,    // 1시간 캐시 유지 (시험 결과는 오래 보관)
  retry: 2,                   // 2회까지 재시도
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 8000),
});

/**
 * 조건부 시험 상세 결과 쿼리 옵션
 * @description examId와 학생 인증 정보가 모두 있을 때만 활성화되는 쿼리 설정
 * 
 * @param params 시험 파라미터 (null이면 비활성화)
 * @returns TanStack Query 옵션 객체
 */
export const conditionalExamDetailQueryOptions = (params: ExamDetailParams | null) => {
  if (!params || !params.examId || !params.name || !params.birthDate || !params.phone) {
    return {
      queryKey: [...studentKeys.examDetails(), "disabled"],
      queryFn: () => Promise.resolve({} as ExamDetailResult),
      enabled: false,
    };
  }

  return {
    ...examDetailQueryOptions(params),
    enabled: true,
  };
};
/**
 * 시험 문제 조회 쿼리 옵션 (신규 API)
 * @description GET /exams/{examId}/questions API를 호출하는 쿼리 설정
 * 
 * 주요 기능:
 * - 인증 불필요 (baseApiClient 사용)
 * - 시험 기본 정보 (시험명, 학년)
 * - 문제 통계 (총 문제 수, 객관식/주관식 개수, 총 배점)
 * - 문제별 상세 정보 (순서, 유형, 내용, 배점, 선택지, 이미지)
 * - 탭 활성화/비활성화 로직에 사용할 데이터 제공
 * 
 * @param examId 시험 고유 식별자 (UUID)
 * @returns TanStack Query 옵션 객체
 */
export const examQuestionsQueryOptions = (examId: string) => ({
  queryKey: studentKeys.examQuestion(examId),
  queryFn: async (): Promise<ExamQuestionsData> => {
    console.log(`[ExamQuestions] 시험 문제 조회 요청: ${examId}`);
    return await getExamQuestions(examId);
  },
  staleTime: 30 * 60 * 1000, // 30분간 fresh (문제 정보는 거의 변경되지 않음)
  gcTime: 2 * 60 * 60 * 1000, // 2시간 캐시 유지 (문제 데이터는 오래 보관 가능)
  retry: 3,                    // 3회까지 재시도 (안정성 중요)
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
});

/**
 * 조건부 시험 문제 조회 쿼리 옵션
 * @description examId가 있을 때만 활성화되는 쿼리 설정
 * 
 * @param examId 시험 ID (null이면 비활성화)
 * @returns TanStack Query 옵션 객체
 */
export const conditionalExamQuestionsQueryOptions = (examId: string | null) => {
  if (!examId || examId.trim() === "") {
    return {
      queryKey: [...studentKeys.examQuestions(), "disabled"],
      queryFn: () => Promise.resolve({} as ExamQuestionsData),
      enabled: false,
    };
  }

  return {
    ...examQuestionsQueryOptions(examId),
    enabled: true,
  };
};
/**
 * 시험 이력 조회 쿼리 옵션
 * @description /api/student/exam-history API를 호출하는 쿼리 설정
 * 
 * @param params 인증 정보 및 페이징 파라미터
 * @returns TanStack Query 옵션 객체
 */
export const examHistoryQueryOptions = (params: ExamHistoryParams) => ({
  queryKey: ["student", "exam-history", params],
  queryFn: async (): Promise<ExamHistoryResponse> => {
    console.log(`[ExamHistory] 시험 이력 조회 요청: ${params.name} (page: ${params.page || 0})`);
    return await getExamHistory(params);
  },
  staleTime: 5 * 60 * 1000,  // 5분간 fresh
  gcTime: 15 * 60 * 1000,    // 15분간 캐시 유지
  retry: 2,                   // 2회까지 재시도
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 5000),
});

/**
 * 조건부 시험 이력 쿼리 옵션
 * @description 로그인 상태에 따라 활성화/비활성화되는 쿼리 설정
 * 
 * @param params 쿼리 파라미터 (null이면 비활성화)
 * @returns TanStack Query 옵션 객체
 */
export const conditionalExamHistoryQueryOptions = (params: ExamHistoryParams | null) => {
  if (!params) {
    return {
      queryKey: ["student", "exam-history", "disabled"],
      queryFn: () => Promise.resolve({} as ExamHistoryResponse),
      enabled: false,
    };
  }

  return {
    ...examHistoryQueryOptions(params),
    enabled: true,
  };
};

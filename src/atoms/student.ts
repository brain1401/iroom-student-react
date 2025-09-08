/**
 * 학생 관련 상태 관리 atom
 * @description 학생 최근 시험 제출 내역 및 관련 상태를 관리하는 Jotai atoms
 * @version 2025-09-05
 */

import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { atomWithStorage } from "jotai/utils";
import { loggedInStudentAtom } from "./auth";
import { getRecentSubmissions, getExamQuestions } from "@/api/student";
import type { RecentSubmissionsParams, ExamQuestionsData } from "@/api/student";
import type {
  RecentSubmissionListResponse,
  RecentSubmission,
} from "@/api/student/types";

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
    phone: loggedInStudent.phoneNumber, // phoneNumber → phone 매핑
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

  return {
    queryKey: ["student", "recent-submissions", params?.name || "disabled"],
    queryFn: async () => {
      if (!params) {
        return { recentSubmissions: [], totalCount: 0 };
      }
      console.log(`[StudentSubmissions] 최근 제출 내역 요청:`, params.name);
      return await getRecentSubmissions(params);
    },
    enabled: !!params,
    staleTime: 2 * 60 * 1000, // 2분간 fresh
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: 1,
  };
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

  // 데이터 안전성 체크
  if (isPending || isError || !data) {
    return {
      recentSubmissions: [],
      totalCount: 0,
      isPending,
      isError,
      error,
      isEmpty: true,
      isLoggedIn: true,
    };
  }

  // RecentSubmissionListResponse 타입 체크 (content와 totalElements 필드 존재 여부)
  const hasPageStructure = 'content' in data && 'totalElements' in data;
  
  if (hasPageStructure) {
    // 새로운 페이지네이션 구조
    const typedData = data;
    return {
      recentSubmissions: typedData.content || [],
      totalCount: typedData.totalElements || 0,
      isPending,
      isError,
      error,
      isEmpty: !typedData.content?.length,
      isLoggedIn: true,
    };
  } else {
    // 이전 구조 (호환성을 위해 유지) - 실제로는 사용되지 않아야 함
    const oldData = data as { recentSubmissions: RecentSubmission[]; totalCount: number };
    return {
      recentSubmissions: oldData.recentSubmissions || [],
      totalCount: oldData.totalCount || 0,
      isPending,
      isError,
      error,
      isEmpty: !oldData.recentSubmissions?.length,
      isLoggedIn: true,
    };
  }
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
export const studentRecentSubmissionsActionsAtom = atom(null, (get, set) => ({
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
}));

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
      lastSubmittedAt: null,
      averageQuestions: 0,
    };
  }

  // 평균 문제 수 계산
  const totalQuestions = recentSubmissions.reduce(
    (sum: number, submission: RecentSubmission) =>
      sum + submission.totalQuestions,
    0,
  );
  const averageQuestions = Math.round(
    totalQuestions / recentSubmissions.length,
  );

  // 가장 최근 제출일 (이미 최신순 정렬되어 있음)
  const lastSubmittedAt = recentSubmissions[0]?.submittedAt || null;

  return {
    totalExams: recentSubmissions.length,
    lastSubmittedAt,
    averageQuestions,
  };
});

// ===== 시험 상세 정보 관련 atoms =====

/**
 * 현재 조회 중인 시험 ID atom
 * @description 시험 스캔 페이지에서 현재 보고 있는 시험의 ID를 저장
 */
export const currentExamIdAtom = atom<string>("");

/**
 * 시험 문제 조회 examId atom (derived) - 신규 API용
 * @description 현재 시험 ID가 있을 때만 조회 가능한 atom (인증 불필요)
 *
 * 반환값:
 * - examId가 없는 경우: null
 * - examId가 있는 경우: examId 문자열
 */
export const examQuestionsParamsAtom = atom((get) => {
  const examId = get(currentExamIdAtom);

  // examId가 없으면 null 반환
  if (!examId || examId.trim() === "") {
    return null;
  }

  return examId;
});

/**
 * 시험 문제 조회 쿼리 atom (신규 API)
 * @description 현재 시험의 문제 정보를 조회하는 atomWithQuery
 *
 * 주요 기능:
 * - examId가 있을 때만 활성화 (인증 불필요)
 * - 객관식/주관식 문제 수 (multipleChoiceCount, subjectiveCount) 제공
 * - 문제별 상세 정보 (순서, 유형, 내용, 배점 등) 제공
 * - 탭 활성화/비활성화 로직에 사용할 데이터 제공
 *
 * 캐시 전략:
 * - 30분간 fresh 상태 유지 (문제 정보는 거의 변경되지 않음)
 * - 2시간 캐시 유지
 * - 네트워크 에러 시 3회까지 재시도
 */
export const examQuestionsQueryAtom = atomWithQuery((get) => {
  const examId = get(examQuestionsParamsAtom);

  return {
    queryKey: ["student", "exam-questions", examId || "disabled"],
    queryFn: async () => {
      if (!examId) {
        return {} as ExamQuestionsData;
      }
      console.log(`[ExamQuestions] 시험 문제 조회 요청: ${examId}`);
      return await getExamQuestions(examId);
    },
    enabled: !!examId && examId.trim() !== "",
    staleTime: 30 * 60 * 1000, // 30분간 fresh
    gcTime: 2 * 60 * 60 * 1000, // 2시간 캐시 유지
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 10000),
  };
});

/**
 * 시험 문제 정보 processed atom (derived) - 신규 API용
 * @description 쿼리 결과를 가공하여 UI에서 사용하기 쉽게 변환한 atom
 *
 * 반환 구조:
 * - examDetail: ExamQuestionsData - 시험 문제 정보
 * - objectiveCount: number - 객관식 문제 수 (기존 호환성)
 * - subjectiveCount: number - 주관식 문제 수
 * - totalQuestions: number - 전체 문제 수
 * - hasObjective: boolean - 객관식 문제 존재 여부
 * - hasSubjective: boolean - 주관식 문제 존재 여부
 * - isPending: boolean - 로딩 상태
 * - isError: boolean - 에러 상태
 * - error: Error | null - 에러 정보
 * - isAvailable: boolean - 데이터 사용 가능 여부
 */
export const examDetailDataAtom = atom((get) => {
  const queryResult = get(examQuestionsQueryAtom);
  const examId = get(examQuestionsParamsAtom);

  // examId가 없는 경우
  if (!examId) {
    return {
      examDetail: {} as ExamQuestionsData,
      objectiveCount: 0,
      subjectiveCount: 0,
      totalQuestions: 0,
      hasObjective: false,
      hasSubjective: false,
      isPending: false,
      isError: false,
      error: null,
      isAvailable: false,
    };
  }

  // 쿼리 결과 처리
  const { data, isPending, isError, error } = queryResult;

  // 로딩 중이거나 에러인 경우
  if (isPending || isError || !data || !data.examName) {
    return {
      examDetail: {} as ExamQuestionsData,
      objectiveCount: 0,
      subjectiveCount: 0,
      totalQuestions: 0,
      hasObjective: false,
      hasSubjective: false,
      isPending,
      isError,
      error,
      isAvailable: false,
    };
  }

  // 새 API 응답 구조에 맞게 필드 매핑
  const objectiveCount = data.multipleChoiceCount || 0;
  const subjectiveCount = data.subjectiveCount || 0;

  return {
    examDetail: data,
    objectiveCount, // 기존 호환성을 위해 multipleChoiceCount를 objectiveCount로 매핑
    subjectiveCount, // 동일한 필드명
    totalQuestions: data.totalQuestions || 0,
    hasObjective: objectiveCount > 0,
    hasSubjective: subjectiveCount > 0,
    isPending,
    isError,
    error,
    isAvailable: true,
  };
});

/**
 * 시험 탭 상태 atom (derived)
 * @description 시험 문제 유형에 따른 탭 활성화/비활성화 상태를 제공하는 atom
 *
 * 반환 구조:
 * - shouldShowObjectiveTab: boolean - 객관식 탭 표시 여부
 * - shouldShowSubjectiveTab: boolean - 주관식 탭 표시 여부
 * - defaultActiveTab: "objective" | "subjective" | null - 기본 활성 탭
 * - availableTabs: ("objective" | "subjective")[] - 사용 가능한 탭 목록
 * - tabCounts: { objective: number, subjective: number } - 각 탭별 문제 수
 */
export const examTabStateAtom = atom((get) => {
  const {
    hasObjective,
    hasSubjective,
    objectiveCount,
    subjectiveCount,
    isAvailable,
  } = get(examDetailDataAtom);

  // 데이터가 아직 없는 경우 - 기본값을 null로 설정
  if (!isAvailable) {
    return {
      shouldShowObjectiveTab: false, // 로딩 중에는 탭 숨김
      shouldShowSubjectiveTab: false, // 로딩 중에는 탭 숨김
      defaultActiveTab: null, // 로딩 중에는 기본 탭 없음
      availableTabs: [],
      tabCounts: { objective: 0, subjective: 0 },
    };
  }

  // 사용 가능한 탭 목록 생성
  const availableTabs: ("objective" | "subjective")[] = [];
  if (hasObjective) availableTabs.push("objective");
  if (hasSubjective) availableTabs.push("subjective");

  // 기본 활성 탭 결정 - 주관식만 있는 경우 주관식 우선
  let defaultActiveTab: "objective" | "subjective" | null = null;
  if (hasObjective && hasSubjective) {
    defaultActiveTab = "objective"; // 둘 다 있으면 객관식 우선
  } else if (hasSubjective) {
    defaultActiveTab = "subjective"; // 주관식만 있으면 주관식 (순서 변경)
  } else if (hasObjective) {
    defaultActiveTab = "objective"; // 객관식만 있으면 객관식
  }

  console.log(`[ExamTabState] 탭 상태 계산:`, {
    hasObjective,
    hasSubjective,
    defaultActiveTab,
    availableTabs,
    objectiveCount,
    subjectiveCount,
  });

  return {
    shouldShowObjectiveTab: hasObjective,
    shouldShowSubjectiveTab: hasSubjective,
    defaultActiveTab,
    availableTabs,
    tabCounts: {
      objective: objectiveCount,
      subjective: subjectiveCount,
    },
  };
});

/**
 * 객관식 답안 전역 저장 atom
 * @description questionId를 키로, 선택값(문자열)을 값으로 저장
 */
export const objectiveAnswersAtom = atomWithStorage<Record<string, string>>(
  "objective-answers",
  {},
);

/**
 * 시험 액션 atom
 * @description 시험 관련 액션들을 제공하는 write-only atom
 *
 * 제공 액션:
 * - setExamId: 현재 시험 ID 설정
 * - clearExam: 시험 정보 초기화
 * - refreshExam: 시험 정보 새로고침 (쿼리 무효화)
 */
export const examActionsAtom = atom(null, (get, set) => ({
  setExamId: (examId: string) => {
    set(currentExamIdAtom, examId);
  },

  clearExam: () => {
    set(currentExamIdAtom, "");
  },

  refreshExam: () => {
    // 현재 examId가 있다면 쿼리를 다시 실행하도록 쿼리 키를 무효화
    // 실제 무효화는 QueryClient에서 수행해야 하지만, 여기서는 재설정으로 처리
    const currentExamId = get(currentExamIdAtom);
    if (currentExamId) {
      set(currentExamIdAtom, "");
      // 다음 틱에서 다시 설정하여 쿼리 재실행 유도
      setTimeout(() => set(currentExamIdAtom, currentExamId), 0);
    }
  },
}));

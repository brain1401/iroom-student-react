import { queryOptions } from "@tanstack/react-query";
import { extractApiData } from "@/api/common/types";
import { getAllExams, getExamById, getExamIds } from "./server-api";
import type { ExamItem } from "@/api/common/server-types";

/**
 * 모의고사 쿼리 키 관리 객체
 * @description React Query에서 사용하는 캐시 키들을 체계적으로 관리
 */
export const examKeys = {
  /** 모든 모의고사 관련 쿼리의 기본 키 */
  all: ["exam"] as const,
  /** 모의고사 목록 쿼리들의 기본 키 */
  lists: () => [...examKeys.all, "list"] as const,
  /** 모든 모의고사 목록 쿼리 키 */
  allMockExams: () => [...examKeys.lists(), "all"] as const,
  /** 모의고사 ID 목록 쿼리 키 */
  mockExamIds: () => [...examKeys.lists(), "ids"] as const,
  /** 모의고사 상세 정보 쿼리들의 기본 키 */
  details: () => [...examKeys.all, "detail"] as const,
  /** 특정 모의고사의 상세 정보 쿼리 키 */
  detail: (examId: string) => [...examKeys.details(), examId] as const,
} as const;

/**
 * 모든 모의고사 목록 조회를 위한 React Query 옵션 생성 함수
 * @description 등록된 모든 모의고사 목록을 가져오는 쿼리 옵션
 *
 * 주요 특징:
 * - 10분간 데이터를 신선하다고 간주 (모의고사 목록은 자주 변하지 않음)
 * - 30분간 캐시에 보관
 * - 네트워크 에러 시 3번까지 재시도
 *
 * @example
 * ```typescript
 * // useQuery 훅과 함께 사용
 * const { data: exams, isLoading, error } = useQuery(allMockExamsQueryOptions());
 *
 * // Jotai atomWithQuery와 함께 사용
 * const examListAtom = atomWithQuery(() => allMockExamsQueryOptions());
 * ```
 *
 * @returns React Query에서 사용할 쿼리 옵션 객체
 */
export const allMockExamsQueryOptions = () => {
  return queryOptions({
    queryKey: examKeys.allMockExams(),
    queryFn: async ({ signal: _signal }): Promise<ExamItem[]> => {
      const response = await getAllExams({}, { signal: _signal });
      return response.data.content;
    },
    staleTime: 10 * 60 * 1000, // 10분간 데이터를 신선하다고 간주
    gcTime: 30 * 60 * 1000, // 30분간 캐시에 보관
    retry: 3, // 네트워크 에러 시 3번까지 재시도
  });
};

/**
 * 특정 모의고사 상세 정보 조회를 위한 React Query 옵션 생성 함수
 * @description 특정 ID의 모의고사 상세 정보를 가져오는 쿼리 옵션
 *
 * 주요 특징:
 * - 15분간 데이터를 신선하다고 간주 (상세 정보는 더 오래 유지)
 * - 45분간 캐시에 보관
 * - 유효한 examId가 제공될 때만 쿼리 실행
 *
 * @example
 * ```typescript
 * // useQuery 훅과 함께 사용
 * const { data: exam, isLoading, error } = useQuery(
 *   mockExamDetailQueryOptions("exam-2025-math-final")
 * );
 *
 * // Jotai atomWithQuery와 함께 사용 (동적 examId)
 * const examDetailAtom = atomWithQuery((get) => {
 *   const examId = get(selectedExamIdAtom);
 *   return mockExamDetailQueryOptions(examId);
 * });
 * ```
 *
 * @param examId 조회할 모의고사의 ID
 * @returns React Query에서 사용할 쿼리 옵션 객체
 */
export const mockExamDetailQueryOptions = (examId: string) => {
  // 빈 값이나 placeholder인 경우 쿼리 비활성화
  const isValidExamId = Boolean(
    examId && examId !== "placeholder" && examId !== "" && examId.trim() !== "",
  );

  return queryOptions({
    queryKey: examKeys.detail(examId),
    queryFn: async ({ signal: _signal }): Promise<ExamItem> => {
      // 유효하지 않은 examId인 경우 에러 발생
      if (!isValidExamId) {
        throw new Error("모의고사 ID가 제공되지 않았습니다.");
      }
      const response = await getExamById(examId, { signal: _signal });
      return response.data;
    },
    staleTime: 15 * 60 * 1000, // 15분간 데이터를 신선하다고 간주
    gcTime: 45 * 60 * 1000, // 45분간 캐시에 보관 (상세 정보는 더 오래 보관)
    retry: (failureCount, error) => {
      // "찾을 수 없습니다" 에러는 재시도하지 않음
      if (
        error instanceof Error &&
        error.message.includes("찾을 수 없습니다")
      ) {
        return false;
      }
      // 다른 에러는 최대 2번까지 재시도
      return failureCount < 2;
    },
    enabled: isValidExamId, // 유효한 examId가 있을 때만 쿼리 실행
  });
};

/**
 * 모의고사 ID 목록 조회를 위한 React Query 옵션 생성 함수
 * @description 모든 모의고사의 ID만 간단히 가져오는 쿼리 옵션
 *
 * 주요 특징:
 * - 5분간 데이터를 신선하다고 간주 (ID 목록은 빠르게 업데이트)
 * - 20분간 캐시에 보관
 * - 네트워크 에러 시 2번까지 재시도
 *
 * @example
 * ```typescript
 * // useQuery 훅과 함께 사용
 * const { data: examIds, isLoading } = useQuery(mockExamIdsQueryOptions());
 *
 * // 모의고사 선택 드롭다운 등에 활용
 * {examIds?.map(id => <option key={id} value={id}>{id}</option>)}
 * ```
 *
 * @returns React Query에서 사용할 쿼리 옵션 객체
 */
export const mockExamIdsQueryOptions = () => {
  return queryOptions({
    queryKey: examKeys.mockExamIds(),
    queryFn: async ({ signal: _signal }): Promise<string[]> => {
      const response = await getExamIds({ signal: _signal });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선하다고 간주
    gcTime: 20 * 60 * 1000, // 20분간 캐시에 보관
    retry: 2, // 네트워크 에러 시 2번까지 재시도
  });
};

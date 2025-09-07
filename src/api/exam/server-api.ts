/**
 * 실제 서버 기반 시험 관리 API
 * @description curl 테스트 결과를 바탕으로 한 실제 백엔드 연동 API 함수들
 * @version 2025-09-05
 */

import type { AxiosRequestConfig } from "axios";
import { baseApiClient } from "@/api/client";
import type {
  ExamListApiResponse,
  ExamDetailApiResponse,
  ExamListData,
  ExamDetail,
  ExamItem,
  ExamIdsApiResponse,
} from "@/api/common/server-types";

/**
 * 시험 관리 API 전용 클라이언트
 * @description 실제 백엔드 서버와 통신하는 HTTP 클라이언트
 */
const examApiClient = baseApiClient.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3055",
  timeout: 15000, // 시험 데이터는 크므로 타임아웃을 길게 설정
});

/**
 * 시험 API 공통 요청 함수
 * @description 모든 시험 API 호출에서 공통으로 사용하는 요청 처리 함수
 * @template T API 응답 데이터 타입
 * @param config Axios 요청 설정 객체
 * @returns API 응답 데이터 (ApiResponse<T> 형식)
 * @throws {Error} 네트워크 에러 또는 서버 에러 시
 */
async function examApiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await examApiClient.request<T>(config);
    return response.data;
  } catch (error) {
    console.error(`[ExamAPI Error] ${config.method} ${config.url}`, error);
    throw error;
  }
}

/**
 * 시험 목록 조회 파라미터 타입
 * @description GET /api/exams에서 사용하는 쿼리 파라미터들
 */
export type ExamListParams = {
  /** 페이지 번호 (0부터 시작) */
  page?: number;
  /** 페이지 크기 (기본값: 10) */
  size?: number;
  /** 정렬 기준 (예: "createdAt,desc") */
  sort?: string;
  /** 학년 필터 (1, 2, 3) */
  grade?: number;
  /** 검색어 (시험 이름으로 검색) */
  search?: string;
};

/**
 * 모든 시험 목록 조회 (페이지네이션)
 * @description GET /api/exams - 실제 서버에서 시험 목록을 페이지네이션으로 조회
 *
 * 실제 응답 데이터:
 * - 총 31개의 시험 데이터 확인됨
 * - 1-3학년 모든 학기 시험 포함
 * - Spring Boot Pageable 형식으로 페이지네이션 지원
 * - 각 시험마다 examSheetInfo 포함 여부 다름 (상세 조회 시에만 포함)
 *
 * @param params 조회 파라미터 (페이지, 크기, 정렬, 필터 등)
 * @param options 추가 옵션
 * @param options.signal 요청 취소를 위한 AbortSignal
 * @returns 페이지네이션된 시험 목록
 * @throws {Error} 네트워크 에러 또는 서버 에러 시
 *
 * @example
 * ```typescript
 * // 기본 목록 조회
 * const examList = await getAllExams();
 * console.log(`총 ${examList.data.totalElements}개의 시험`);
 *
 * // 학년별 필터링
 * const grade1Exams = await getAllExams({ grade: 1, size: 20 });
 *
 * // 검색어로 필터링
 * const searchResults = await getAllExams({ search: "중간고사" });
 * ```
 */
export async function getAllExams(
  params: ExamListParams = {},
  options?: { signal?: AbortSignal },
): Promise<ExamListApiResponse> {
  const searchParams = new URLSearchParams();

  // 페이지네이션 파라미터
  if (params.page !== undefined)
    searchParams.append("page", params.page.toString());
  if (params.size !== undefined)
    searchParams.append("size", params.size.toString());
  if (params.sort) searchParams.append("sort", params.sort);

  // 필터 파라미터
  if (params.grade !== undefined)
    searchParams.append("grade", params.grade.toString());
  if (params.search) searchParams.append("search", params.search);

  const queryString = searchParams.toString();
  const url = `/api/exams${queryString ? `?${queryString}` : ""}`;

  return examApiRequest<ExamListApiResponse>({
    method: "GET",
    url,
    signal: options?.signal,
  });
}

/**
 * 특정 시험 상세 조회
 * @description GET /api/exams/{examId} - 실제 서버에서 시험 상세 정보 조회
 *
 * 실제 응답 데이터:
 * - examSheetInfo가 상세 정보로 확장됨 (필수 포함)
 * - totalQuestions, totalPoints 등 문제지 통계 정보 포함
 * - 시험 기본 정보 + 연관된 문제지 정보 통합 제공
 *
 * @param examId 조회할 시험 고유 ID (UUID 형식)
 * @param options 추가 옵션
 * @param options.signal 요청 취소를 위한 AbortSignal
 * @returns 시험 상세 정보 (문제지 정보 포함)
 * @throws {Error} 존재하지 않는 ID이거나 네트워크 에러 시
 *
 * @example
 * ```typescript
 * try {
 *   const examDetail = await getExamById("01990dea-12fe-75c5-9edd-e4ed42386748");
 *   console.log(`${examDetail.data.examName}: ${examDetail.data.examSheetInfo?.totalQuestions}문제`);
 *   console.log(`총 배점: ${examDetail.data.examSheetInfo?.totalPoints}점`);
 * } catch (error) {
 *   console.error("시험 조회 실패:", error.message);
 * }
 * ```
 */
export async function getExamById(
  examId: string,
  options?: { signal?: AbortSignal },
): Promise<ExamDetailApiResponse> {
  if (!examId || typeof examId !== "string") {
    throw new Error("유효한 시험 ID를 제공해야 합니다");
  }

  return examApiRequest<ExamDetailApiResponse>({
    method: "GET",
    url: `/api/exams/${examId}`,
    signal: options?.signal,
  });
}

/**
 * 학년별 시험 목록 조회 (편의 함수)
 * @description 특정 학년의 시험만 필터링해서 조회
 *
 * @param grade 조회할 학년 (1, 2, 3)
 * @param params 추가 조회 파라미터
 * @param options 추가 옵션
 * @returns 해당 학년의 시험 목록
 *
 * @example
 * ```typescript
 * // 1학년 시험 목록 조회
 * const grade1Exams = await getExamsByGrade(1);
 *
 * // 2학년 중간고사만 검색
 * const grade2Midterms = await getExamsByGrade(2, { search: "중간고사" });
 * ```
 */
export async function getExamsByGrade(
  grade: number,
  params: Omit<ExamListParams, "grade"> = {},
  options?: { signal?: AbortSignal },
): Promise<ExamListApiResponse> {
  if (!Number.isInteger(grade) || grade < 1 || grade > 3) {
    throw new Error("학년은 1, 2, 3 중 하나여야 합니다");
  }

  return getAllExams({ ...params, grade }, options);
}

/**
 * 시험 검색 (편의 함수)
 * @description 시험 이름으로 검색
 *
 * @param searchKeyword 검색할 키워드
 * @param params 추가 조회 파라미터
 * @param options 추가 옵션
 * @returns 검색 결과 시험 목록
 *
 * @example
 * ```typescript
 * // "중간고사" 키워드로 검색
 * const midtermExams = await searchExams("중간고사");
 *
 * // "기말고사" + 1학년으로 필터링
 * const grade1Finals = await searchExams("기말고사", { grade: 1 });
 * ```
 */
export async function searchExams(
  searchKeyword: string,
  params: Omit<ExamListParams, "search"> = {},
  options?: { signal?: AbortSignal },
): Promise<ExamListApiResponse> {
  if (!searchKeyword || typeof searchKeyword !== "string") {
    throw new Error("검색 키워드를 제공해야 합니다");
  }

  return getAllExams({ ...params, search: searchKeyword }, options);
}

/**
 * 최근 시험 목록 조회 (편의 함수)
 * @description 생성일 기준 내림차순으로 정렬된 최신 시험 목록
 *
 * @param limit 조회할 개수 (기본값: 10)
 * @param options 추가 옵션
 * @returns 최근 생성된 시험 목록
 *
 * @example
 * ```typescript
 * // 최근 5개 시험 조회
 * const recentExams = await getRecentExams(5);
 *
 * // 최근 20개 시험 조회
 * const moreRecentExams = await getRecentExams(20);
 * ```
 */
export async function getRecentExams(
  limit: number = 10,
  options?: { signal?: AbortSignal },
): Promise<ExamListApiResponse> {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("제한 개수는 1 이상의 정수여야 합니다");
  }

  return getAllExams(
    {
      page: 0,
      size: limit,
      sort: "createdAt,desc", // 생성일 기준 내림차순 정렬
    },
    options,
  );
}

/**
 * 시험 기본 통계 조회 (편의 함수)
 * @description 시험 목록에서 기본 통계 정보 추출
 *
 * @param params 조회 파라미터 (통계를 낼 시험 범위)
 * @param options 추가 옵션
 * @returns 시험 통계 정보
 *
 * @example
 * ```typescript
 * // 전체 시험 통계
 * const allStats = await getExamStats();
 * console.log(`전체 시험 수: ${allStats.totalCount}`);
 *
 * // 1학년 시험 통계
 * const grade1Stats = await getExamStats({ grade: 1 });
 * console.log(`1학년 시험 수: ${grade1Stats.totalCount}`);
 * ```
 */
export async function getExamStats(
  params: ExamListParams = {},
  options?: { signal?: AbortSignal },
) {
  // 첫 페이지만 조회해서 전체 통계 정보 추출
  const response = await getAllExams({ ...params, page: 0, size: 1 }, options);

  const stats = {
    totalCount: response.data.totalElements,
    totalPages: response.data.totalPages,
    hasExams: response.data.totalElements > 0,
    isEmpty: response.data.empty,
  };

  return stats;
}

/**
 * 시험 ID 유효성 검증 유틸리티
 * @description UUID 형식의 시험 ID가 유효한지 확인
 *
 * @param examId 검증할 시험 ID
 * @returns 유효성 검증 결과
 */
export function isValidExamId(examId: string): boolean {
  if (!examId || typeof examId !== "string") {
    return false;
  }

  // UUID v4 형식 검증 (예: 01990dea-12fe-75c5-9edd-e4ed42386748)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(examId);
}

/**
 * 시험 데이터 정규화 유틸리티
 * @description 서버에서 받은 시험 데이터를 프론트엔드에서 사용하기 좋게 정규화
 *
 * @param examItem 서버에서 받은 시험 데이터
 * @returns 정규화된 시험 데이터
 */
export function normalizeExamData(examItem: ExamItem) {
  return {
    ...examItem,
    // 날짜를 Date 객체로 변환하지 않고 string 그대로 유지 (ISO 8601)
    createdAt: examItem.createdAt,
    // 학년별 색상 코드 추가
    gradeColor:
      examItem.grade === 1 ? "blue" : examItem.grade === 2 ? "green" : "purple",
    // 시험 타입 추론 (이름에서 추출)
    examType: examItem.examName.includes("중간고사")
      ? "midterm"
      : examItem.examName.includes("기말고사")
        ? "final"
        : "other",
    // QR 코드 사용 가능 여부
    hasQrCode: examItem.qrCodeUrl !== null,
    // 문제지 연결 여부
    hasExamSheet: examItem.examSheetInfo !== null,
  };
}

/**
 * 시험 목록 데이터 정규화 유틸리티
 * @description 페이지네이션된 시험 목록 데이터를 정규화
 *
 * @param examListData 서버에서 받은 시험 목록 데이터
 * @returns 정규화된 시험 목록 데이터
 */
export function normalizeExamListData(examListData: ExamListData) {
  return {
    ...examListData,
    content: examListData.content.map(normalizeExamData),
    // 학년별 분포 통계 추가
    gradeDistribution: examListData.content.reduce(
      (acc, exam) => {
        acc[exam.grade] = (acc[exam.grade] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    ),
    // 시험 타입별 분포 통계 추가
    typeDistribution: examListData.content.reduce(
      (acc, exam) => {
        const type = exam.examName.includes("중간고사")
          ? "midterm"
          : exam.examName.includes("기말고사")
            ? "final"
            : "other";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };
}

/**
 * 모든 시험 ID 목록을 조회하는 함수
 * @description 시험 목록에서 ID만 추출하여 반환
 *
 * 주요 기능:
 * - 모든 활성화된 시험의 ID 목록 조회
 * - 페이징 없이 전체 결과 반환
 * - ID 배열 형태로 간단한 응답 제공
 *
 * @param options 추가 옵션
 * @param options.signal 요청 취소를 위한 AbortSignal
 * @returns 시험 ID 목록이 담긴 API 응답
 * @throws {Error} 네트워크 에러 또는 서버 에러 시
 *
 * @example
 * ```typescript
 * // 모든 시험 ID 조회
 * const examIds = await getExamIds();
 * console.log(`총 ${examIds.data.length}개의 시험 ID`);
 *
 * // AbortController와 함께 사용
 * const controller = new AbortController();
 * const examIds = await getExamIds({ signal: controller.signal });
 * ```
 */
export async function getExamIds(options?: {
  signal?: AbortSignal;
}): Promise<ExamIdsApiResponse> {
  try {
    // 모든 시험을 조회하되, 페이지 크기를 크게 설정하여 전체 조회
    const allExams = await getAllExams({ page: 0, size: 1000 }, options);

    // 시험 ID만 추출
    const examIds = allExams.data.content.map((exam: ExamItem) => exam.id);

    return {
      result: "SUCCESS",
      message: "시험 ID 목록 조회 성공",
      data: examIds,
    };
  } catch (error) {
    console.error("[getExamIds] 시험 ID 목록 조회 실패:", error);

    return {
      result: "ERROR",
      message: "시험 ID 목록 조회에 실패했습니다",
      data: [],
    };
  }
}

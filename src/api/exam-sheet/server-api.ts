/**
 * 실제 서버 기반 문제지 관리 API
 * @description curl 테스트 결과를 바탕으로 한 실제 백엔드 연동 API 함수들
 * @version 2025-09-05
 */

import type { AxiosRequestConfig } from "axios";
import { baseApiClient } from "@/api/client";
import type {
  ExamSheetListApiResponse,
  ExamSheetDetailApiResponse,
  ExamSheetListData,
  ExamSheet,
  UnitSummary,
  CategoryDistribution,
  SubcategoryDistribution,
  UnitDetail,
  ApiResponse,
  QuestionData,
  StudentAnswerSubmitRequest,
  StudentAnswerDraftRequest,
} from "@/api/common/server-types";

/**
 * 문제지 관리 API 전용 클라이언트
 * @description 실제 백엔드 서버와 통신하는 HTTP 클라이언트
 */
const examSheetApiClient = baseApiClient.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || "http://100.82.50.108:3055",
  timeout: 20000, // 문제지 데이터는 매우 상세하므로 타임아웃을 더 길게 설정
});

/**
 * 문제지 API 공통 요청 함수
 * @description 모든 문제지 API 호출에서 공통으로 사용하는 요청 처리 함수
 * @template T API 응답 데이터 타입
 * @param config Axios 요청 설정 객체
 * @returns API 응답 데이터 (ApiResponse<T> 형식)
 * @throws {Error} 네트워크 에러 또는 서버 에러 시
 */
async function examSheetApiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await examSheetApiClient.request<T>(config);
    return response.data;
  } catch (error) {
    console.error(`[ExamSheetAPI Error] ${config.method} ${config.url}`, error);
    throw error;
  }
}

/**
 * 문제지 목록 조회 파라미터 타입
 * @description GET /api/exam-sheets에서 사용하는 쿼리 파라미터들
 */
export type ExamSheetListParams = {
  /** 페이지 번호 (0부터 시작) */
  page?: number;
  /** 페이지 크기 (기본값: 10) */
  size?: number;
  /** 정렬 기준 (예: "createdAt,desc", "totalPoints,asc") */
  sort?: string;
  /** 학년 필터 (1, 2, 3) */
  grade?: number;
  /** 검색어 (시험 이름으로 검색) */
  search?: string;
  /** 최소 문제 수 필터 */
  minQuestions?: number;
  /** 최대 문제 수 필터 */
  maxQuestions?: number;
  /** 최소 배점 필터 */
  minPoints?: number;
  /** 최대 배점 필터 */
  maxPoints?: number;
};

/**
 * 모든 문제지 목록 조회 (페이지네이션)
 * @description GET /api/exam-sheets - 실제 서버에서 문제지 목록을 페이지네이션으로 조회
 *
 * 실제 응답 데이터:
 * - 매우 상세한 문제지 정보 제공 (단원별 분석 포함)
 * - unitSummary에 카테고리별, 서브카테고리별, 단원별 상세 분석
 * - totalQuestions, multipleChoiceCount, subjectiveCount 등 통계
 * - averagePointsPerQuestion 계산된 값 포함
 *
 * @param params 조회 파라미터 (페이지, 크기, 정렬, 필터 등)
 * @param options 추가 옵션
 * @param options.signal 요청 취소를 위한 AbortSignal
 * @returns 페이지네이션된 문제지 목록
 * @throws {Error} 네트워크 에러 또는 서버 에러 시
 *
 * @example
 * ```typescript
 * // 기본 목록 조회
 * const examSheets = await getAllExamSheets();
 * console.log(`총 ${examSheets.data.totalElements}개의 문제지`);
 *
 * // 학년별 + 문제 수 필터링
 * const grade3Sheets = await getAllExamSheets({
 *   grade: 3,
 *   minQuestions: 20,
 *   maxQuestions: 30
 * });
 *
 * // 고배점 문제지 검색
 * const highScoreSheets = await getAllExamSheets({ minPoints: 100 });
 * ```
 */
export async function getAllExamSheets(
  params: ExamSheetListParams = {},
  options?: { signal?: AbortSignal },
): Promise<ExamSheetListApiResponse> {
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
  if (params.minQuestions !== undefined)
    searchParams.append("minQuestions", params.minQuestions.toString());
  if (params.maxQuestions !== undefined)
    searchParams.append("maxQuestions", params.maxQuestions.toString());
  if (params.minPoints !== undefined)
    searchParams.append("minPoints", params.minPoints.toString());
  if (params.maxPoints !== undefined)
    searchParams.append("maxPoints", params.maxPoints.toString());

  const queryString = searchParams.toString();
  const url = `/api/exam-sheets${queryString ? `?${queryString}` : ""}`;

  return examSheetApiRequest<ExamSheetListApiResponse>({
    method: "GET",
    url,
    signal: options?.signal,
  });
}

/**
 * 특정 문제지 상세 조회
 * @description GET /api/exam-sheets/{examSheetId} - 실제 서버에서 문제지 상세 정보 조회
 *
 * @param examSheetId 조회할 문제지 고유 ID (UUID 형식)
 * @param options 추가 옵션
 * @param options.signal 요청 취소를 위한 AbortSignal
 * @returns 문제지 상세 정보 (단원 분석 포함)
 * @throws {Error} 존재하지 않는 ID이거나 네트워크 에러 시
 *
 * @example
 * ```typescript
 * try {
 *   const examSheet = await getExamSheetById("01990de9-efc5-7e0e-a307-539b198c166e");
 *   console.log(`${examSheet.data.examName}: ${examSheet.data.totalQuestions}문제`);
 *   console.log(`단원 수: ${examSheet.data.unitSummary.totalUnits}개`);
 *   console.log("카테고리 분포:", examSheet.data.unitSummary.categoryDistribution);
 * } catch (error) {
 *   console.error("문제지 조회 실패:", error.message);
 * }
 * ```
 */
export async function getExamSheetById(
  examSheetId: string,
  options?: { signal?: AbortSignal },
): Promise<ExamSheetDetailApiResponse> {
  if (!examSheetId || typeof examSheetId !== "string") {
    throw new Error("유효한 문제지 ID를 제공해야 합니다");
  }

  return examSheetApiRequest<ExamSheetDetailApiResponse>({
    method: "GET",
    url: `/api/exam-sheets/${examSheetId}`,
    signal: options?.signal,
  });
}

/**
 * 학년별 문제지 목록 조회 (편의 함수)
 * @description 특정 학년의 문제지만 필터링해서 조회
 *
 * @param grade 조회할 학년 (1, 2, 3)
 * @param params 추가 조회 파라미터
 * @param options 추가 옵션
 * @returns 해당 학년의 문제지 목록
 *
 * @example
 * ```typescript
 * // 3학년 문제지 목록 조회
 * const grade3Sheets = await getExamSheetsByGrade(3);
 *
 * // 2학년 고배점 문제지만 조회
 * const grade2HighScore = await getExamSheetsByGrade(2, { minPoints: 100 });
 * ```
 */
export async function getExamSheetsByGrade(
  grade: number,
  params: Omit<ExamSheetListParams, "grade"> = {},
  options?: { signal?: AbortSignal },
): Promise<ExamSheetListApiResponse> {
  if (!Number.isInteger(grade) || grade < 1 || grade > 3) {
    throw new Error("학년은 1, 2, 3 중 하나여야 합니다");
  }

  return getAllExamSheets({ ...params, grade }, options);
}

/**
 * 최근 생성된 문제지 목록 조회 (편의 함수)
 * @description GET /api/exam-sheets/recent - 최근에 생성된 문제지 목록 조회
 *
 * @param limit 조회할 개수 (기본값: 10)
 * @param options 추가 옵션
 * @returns 최근 생성된 문제지 목록
 *
 * @example
 * ```typescript
 * // 최근 5개 문제지 조회
 * const recentSheets = await getRecentExamSheets(5);
 *
 * // 최근 20개 문제지 조회 (별도 API 엔드포인트 활용)
 * const moreRecentSheets = await getRecentExamSheets(20);
 * ```
 */
export async function getRecentExamSheets(
  limit: number = 10,
  options?: { signal?: AbortSignal },
): Promise<ExamSheetListApiResponse> {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("제한 개수는 1 이상의 정수여야 합니다");
  }

  // 별도 API 엔드포인트가 있다면 활용
  return examSheetApiRequest<ExamSheetListApiResponse>({
    method: "GET",
    url: `/api/exam-sheets/recent?limit=${limit}`,
    signal: options?.signal,
  });
}

/**
 * 문제지 통계 조회 (편의 함수)
 * @description GET /api/exam-sheets/statistics/by-grade - 학년별 문제지 통계
 *
 * @param options 추가 옵션
 * @returns 학년별 문제지 통계
 *
 * @example
 * ```typescript
 * const stats = await getExamSheetStatsByGrade();
 * console.log("학년별 문제지 통계:", stats);
 * ```
 */
export async function getExamSheetStatsByGrade(options?: {
  signal?: AbortSignal;
}) {
  return examSheetApiRequest({
    method: "GET",
    url: "/api/exam-sheets/statistics/by-grade",
    signal: options?.signal,
  });
}

/**
 * 문제지 사용량 조회
 * @description GET /api/exam-sheets/{examSheetId}/usage - 특정 문제지의 사용 통계
 *
 * @param examSheetId 문제지 ID
 * @param options 추가 옵션
 * @returns 문제지 사용량 통계
 *
 * @example
 * ```typescript
 * const usage = await getExamSheetUsage("01990de9-efc5-7e0e-a307-539b198c166e");
 * console.log("사용량 통계:", usage);
 * ```
 */
export async function getExamSheetUsage(
  examSheetId: string,
  options?: { signal?: AbortSignal },
) {
  if (!examSheetId || typeof examSheetId !== "string") {
    throw new Error("유효한 문제지 ID를 제공해야 합니다");
  }

  return examSheetApiRequest({
    method: "GET",
    url: `/api/exam-sheets/${examSheetId}/usage`,
    signal: options?.signal,
  });
}

/**
 * 단원별 분석 유틸리티 함수들
 * @description 문제지의 unitSummary 데이터를 분석하는 유틸리티들
 */

/**
 * 카테고리별 문제 분포 분석
 * @description 대분류별로 문제가 어떻게 분포되어 있는지 분석
 *
 * @param unitSummary 문제지의 단원 요약 정보
 * @returns 카테고리별 분석 결과
 */
export function analyzeCategoryDistribution(unitSummary: UnitSummary) {
  const total = unitSummary.categoryDistribution.reduce(
    (sum, cat) => sum + cat.questionCount,
    0,
  );

  return {
    total,
    categories: unitSummary.categoryDistribution.map((cat) => ({
      ...cat,
      percentage: total > 0 ? Math.round((cat.questionCount / total) * 100) : 0,
    })),
    // 가장 많은 문제가 있는 카테고리
    dominant: unitSummary.categoryDistribution.reduce((max, cat) =>
      cat.questionCount > max.questionCount ? cat : max,
    ),
    // 균등한 분포인지 확인 (카테고리별 차이가 30% 이내)
    isBalanced:
      unitSummary.categoryDistribution.length > 1 &&
      Math.max(
        ...unitSummary.categoryDistribution.map((c) => c.questionCount),
      ) -
        Math.min(
          ...unitSummary.categoryDistribution.map((c) => c.questionCount),
        ) <=
        total * 0.3,
  };
}

/**
 * 난이도 분석 (문제 수와 배점 기반)
 * @description 문제지의 난이도를 여러 지표로 분석
 *
 * @param examSheet 문제지 정보
 * @returns 난이도 분석 결과
 */
export function analyzeDifficulty(examSheet: ExamSheet) {
  const avgPointsPerQuestion = examSheet.averagePointsPerQuestion;
  const subjectiveRatio = examSheet.subjectiveCount / examSheet.totalQuestions;
  const multipleChoiceRatio =
    examSheet.multipleChoiceCount / examSheet.totalQuestions;

  // 난이도 점수 계산 (0-100)
  let difficultyScore = 0;

  // 평균 배점이 높을수록 어려움
  difficultyScore += Math.min(avgPointsPerQuestion * 10, 40);

  // 주관식 비율이 높을수록 어려움
  difficultyScore += subjectiveRatio * 30;

  // 총 문제 수가 많을수록 어려움
  difficultyScore += Math.min(examSheet.totalQuestions / 2, 30);

  // 단원 다양성이 높을수록 어려움
  const unitCount = examSheet.unitSummary.totalUnits;
  difficultyScore += Math.min(unitCount * 2, 20);

  // 난이도 등급 결정
  let level: "초급" | "중급" | "고급" | "최고급";
  if (difficultyScore < 25) level = "초급";
  else if (difficultyScore < 50) level = "중급";
  else if (difficultyScore < 75) level = "고급";
  else level = "최고급";

  return {
    score: Math.round(difficultyScore),
    level,
    factors: {
      avgPointsPerQuestion: {
        value: avgPointsPerQuestion,
        impact:
          avgPointsPerQuestion > 5
            ? "높음"
            : avgPointsPerQuestion > 3
              ? "중간"
              : "낮음",
      },
      subjectiveRatio: {
        value: Math.round(subjectiveRatio * 100),
        impact:
          subjectiveRatio > 0.7
            ? "높음"
            : subjectiveRatio > 0.4
              ? "중간"
              : "낮음",
      },
      unitDiversity: {
        value: unitCount,
        impact: unitCount > 12 ? "높음" : unitCount > 8 ? "중간" : "낮음",
      },
      totalQuestions: {
        value: examSheet.totalQuestions,
        impact:
          examSheet.totalQuestions > 25
            ? "높음"
            : examSheet.totalQuestions > 15
              ? "중간"
              : "낮음",
      },
    },
  };
}

/**
 * 단원 커버리지 분석
 * @description 문제지가 얼마나 다양한 단원을 커버하는지 분석
 *
 * @param unitSummary 문제지의 단원 요약 정보
 * @returns 커버리지 분석 결과
 */
export function analyzeUnitCoverage(unitSummary: UnitSummary) {
  const totalUnits = unitSummary.totalUnits;
  const categoryCount = unitSummary.categoryDistribution.length;
  const subcategoryCount = unitSummary.subcategoryDistribution.length;

  // 균등성 분석
  const questionCounts = unitSummary.unitDetails.map((u) => u.questionCount);
  const maxQuestions = Math.max(...questionCounts);
  const minQuestions = Math.min(...questionCounts);
  const avgQuestions =
    questionCounts.reduce((sum, count) => sum + count, 0) /
    questionCounts.length;

  return {
    coverage: {
      totalUnits,
      categories: categoryCount,
      subcategories: subcategoryCount,
    },
    distribution: {
      max: maxQuestions,
      min: minQuestions,
      avg: Math.round(avgQuestions * 100) / 100,
      variance: Math.round((maxQuestions - minQuestions) * 100) / 100,
      // 균등성 점수 (0-100, 높을수록 균등)
      evenness: Math.round(
        (1 - (maxQuestions - minQuestions) / (maxQuestions + minQuestions)) *
          100,
      ),
    },
    // 커버리지 등급
    coverageLevel:
      totalUnits > 12
        ? "광범위"
        : totalUnits > 8
          ? "보통"
          : totalUnits > 4
            ? "제한적"
            : "좁음",
  };
}

/**
 * 문제지 유사도 비교 유틸리티
 * @description 두 문제지 간의 유사도를 분석
 *
 * @param sheet1 첫 번째 문제지
 * @param sheet2 두 번째 문제지
 * @returns 유사도 분석 결과 (0-100)
 */
export function compareExamSheets(sheet1: ExamSheet, sheet2: ExamSheet) {
  let similarity = 0;
  let factors = 0;

  // 학년 비교 (40점)
  if (sheet1.grade === sheet2.grade) {
    similarity += 40;
  }
  factors++;

  // 문제 수 비교 (20점)
  const questionDiff = Math.abs(sheet1.totalQuestions - sheet2.totalQuestions);
  const maxQuestions = Math.max(sheet1.totalQuestions, sheet2.totalQuestions);
  similarity += Math.max(0, 20 - (questionDiff / maxQuestions) * 20);
  factors++;

  // 배점 비교 (20점)
  const pointsDiff = Math.abs(sheet1.totalPoints - sheet2.totalPoints);
  const maxPoints = Math.max(sheet1.totalPoints, sheet2.totalPoints);
  similarity += Math.max(0, 20 - (pointsDiff / maxPoints) * 20);
  factors++;

  // 단원 커버리지 비교 (20점)
  const unit1Categories = new Set(
    sheet1.unitSummary.categoryDistribution.map((c) => c.categoryName),
  );
  const unit2Categories = new Set(
    sheet2.unitSummary.categoryDistribution.map((c) => c.categoryName),
  );
  const intersection = new Set(
    [...unit1Categories].filter((x) => unit2Categories.has(x)),
  );
  const union = new Set([...unit1Categories, ...unit2Categories]);
  const categoryOverlap = intersection.size / union.size;
  similarity += categoryOverlap * 20;
  factors++;

  return Math.round(similarity);
}

/**
 * 문제지 ID 유효성 검증 유틸리티
 * @description UUID 형식의 문제지 ID가 유효한지 확인
 */
export function isValidExamSheetId(examSheetId: string): boolean {
  if (!examSheetId || typeof examSheetId !== "string") {
    return false;
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(examSheetId);
}

/**
 * 문제 목록 조회 함수
 * @description 특정 시험지의 모든 문제를 조회
 * @param examSheetId 시험지 ID
 * @param options 추가 옵션
 * @returns 문제 데이터 배열
 */
export async function getQuestionsByExamSheetId(
  examSheetId: string,
  options?: { signal?: AbortSignal },
): Promise<ApiResponse<QuestionData[]>> {
  if (!isValidExamSheetId(examSheetId)) {
    throw new Error("유효하지 않은 시험지 ID입니다");
  }

  // 실제 서버 API가 구현될 때까지 임시 구현
  // TODO: 실제 서버 엔드포인트 구현 후 교체
  return {
    result: "SUCCESS",
    message: "문제 목록 조회 성공",
    data: [], // 빈 배열 반환 (실제 구현 시 서버에서 데이터 받아옴)
  };
}

/**
 * 학생 답안 최종 제출 함수
 * @description 학생이 작성한 답안을 서버에 최종 제출
 * @param request 답안 제출 요청 데이터
 * @param options 추가 옵션
 * @returns 제출 결과
 */
export async function submitStudentAnswer(
  request: StudentAnswerSubmitRequest,
  options?: { signal?: AbortSignal },
): Promise<ApiResponse<boolean>> {
  if (
    !request.examSheetId ||
    !request.answers ||
    request.answers.length === 0
  ) {
    throw new Error("유효하지 않은 제출 데이터입니다");
  }

  // 실제 서버 API가 구현될 때까지 임시 구현
  // TODO: 실제 서버 엔드포인트 구현 후 교체
  console.log("답안 제출 요청:", request);

  return {
    result: "SUCCESS",
    message: "답안 제출이 완료되었습니다",
    data: true,
  };
}

/**
 * 학생 답안 임시저장 함수
 * @description 학생이 작성 중인 답안을 서버에 임시저장
 * @param request 답안 임시저장 요청 데이터
 * @param options 추가 옵션
 * @returns 저장 결과
 */
export async function saveStudentAnswerDraft(
  request: StudentAnswerDraftRequest,
  options?: { signal?: AbortSignal },
): Promise<ApiResponse<boolean>> {
  if (!request.examSheetId || !request.questionId) {
    throw new Error("유효하지 않은 저장 데이터입니다");
  }

  // 실제 서버 API가 구현될 때까지 임시 구현
  // TODO: 실제 서버 엔드포인트 구현 후 교체
  console.log("답안 임시저장 요청:", request);

  return {
    result: "SUCCESS",
    message: "답안이 임시저장되었습니다",
    data: true,
  };
}

import type { AxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/api/common/types";
import { baseApiClient } from "@/api/client";
import type {
  MockExam,
  MockExamListApiResponse,
  MockExamApiResponse,
  MockExamIdsApiResponse,
} from "./types";

/**
 * 백엔드 서버의 기본 URL을 환경 변수에서 가져오기
 * @description Vite 환경에서 VITE_ 접두사가 있는 환경 변수만 클라이언트에서 접근 가능
 */
const BACKEND_API_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3055";

/**
 * 모의고사 전용 API 클라이언트
 * @description 기본 API 클라이언트를 확장하여 모의고사 API 전용으로 설정
 */
const examApiClient = baseApiClient.create({
  baseURL: BACKEND_API_URL,
  timeout: 10000, // 모의고사 데이터는 크므로 타임아웃을 길게 설정
});

/**
 * 모의고사 API 공통 요청 함수
 * @description 모든 모의고사 API 호출에서 공통으로 사용하는 요청 처리 함수
 * @template T API 응답 데이터 타입
 * @param config Axios 요청 설정 객체
 * @returns API 응답 데이터 (ApiResponse 형식에서 data 추출)
 */
async function examApiRequest<T>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  // 백엔드가 준비될 때까지 Mock 데이터 시뮬레이션
  if (import.meta.env.VITE_USE_MOCK_API !== "false") {
    return simulateApiCall(config);
  }

  // 실제 백엔드 요청
  const response = await examApiClient.request<ApiResponse<T>>(config);
  return response.data;
}

/**
 * 랜덤 지연시간 생성 유틸리티
 * @description 실제 서버 통신과 유사한 지연시간을 시뮬레이션
 * @param min 최소 지연시간(ms)
 * @param max 최대 지연시간(ms)
 * @returns 랜덤 지연시간(ms)
 */
function getRandomDelay(min: number = 300, max: number = 1500): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Promise 기반 지연 유틸리티
 * @description setTimeout을 Promise로 감싼 sleep 함수
 * @param ms 지연할 시간(밀리초)
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock 데이터를 백엔드 ApiResponse 형식으로 래핑하는 헬퍼 함수
 * @description 실제 백엔드 응답과 동일한 구조로 Mock 데이터를 래핑
 * @template T 응답 데이터 타입
 * @param data Mock 데이터
 * @returns 백엔드 ApiResponse 형식의 응답
 */
function createMockApiResponse<T>(data: T): ApiResponse<T> {
  return {
    result: "SUCCESS",
    message: "요청이 성공적으로 처리되었습니다",
    data,
  };
}

/**
 * 랜덤 에러 시뮬레이션
 * @description 실제 네트워크 환경처럼 가끔 에러 발생
 * @param errorRate 에러 발생 확률 (0-1 사이, 기본값 0.05 = 5%)
 */
function maybeThrowError(errorRate: number = 0.05): void {
  if (Math.random() < errorRate) {
    const errors = [
      "네트워크 연결 오류",
      "서버 응답 지연",
      "데이터 로딩 실패",
      "인증 만료",
    ];
    const randomError = errors[Math.floor(Math.random() * errors.length)];
    throw new Error(`Mock API Error: ${randomError}`);
  }
}

/**
 * Mock 문제 생성 유틸리티
 * @description 현실적인 모의고사 문제를 생성
 * @param examId 문제가 속한 모의고사 ID
 * @param problemNumber 문제 번호
 * @param subject 과목 ("math" | "english" | "science" | "korean")
 * @returns Problem 객체
 */
function createMockProblem(
  examId: string,
  problemNumber: number,
  subject: string,
): MockExam["problems"][0] {
  const now = new Date().toISOString();
  const baseId = `${examId}-problem-${problemNumber.toString().padStart(2, "0")}`;

  const problemTemplates = {
    math: {
      title: `수학 ${problemNumber}번`,
      description: `다음 방정식을 풀어 x의 값을 구하시오.\n\n2x + 5 = ${
        3 + problemNumber * 2
      }\n\n① ${problemNumber} ② ${problemNumber + 1} ③ ${problemNumber + 2} ④ ${
        problemNumber + 3
      }`,
      answer: (problemNumber + 1).toString(),
    },
    english: {
      title: `영어 ${problemNumber}번`,
      description: `다음 빈칸에 들어갈 가장 적절한 것은?\n\nI _____ to the library every day.\n\n① go ② goes ③ going ④ went`,
      answer: "go",
    },
    science: {
      title: `과학 ${problemNumber}번`,
      description: `물의 끓는점은 섭씨 몇 도인가?\n\n① 0°C ② 50°C ③ 100°C ④ 150°C`,
      answer: "100°C",
    },
    korean: {
      title: `국어 ${problemNumber}번`,
      description: `다음 문장에서 맞춤법이 올바른 것은?\n\n① 안녕하세요 ② 안녕하세여 ③ 안녕하새요 ④ 안녕하셰요`,
      answer: "안녕하세요",
    },
  };

  const template =
    problemTemplates[subject as keyof typeof problemTemplates] ||
    problemTemplates.math;

  return {
    id: baseId,
    title: template.title,
    description: template.description,
    answer: template.answer,
    createdAt: now,
    updatedAt: now,
    examId,
  };
}

/**
 * Mock 모의고사 데이터 생성
 * @description 다양한 과목과 난이도의 모의고사 생성
 */
const MOCK_EXAMS: MockExam[] = [
  {
    id: "exam-2025-math-final",
    title: "2025학년도 수학 기말고사 모의고사",
    description: "수학 I, II 전범위 종합 평가",
    problems: Array.from({ length: 20 }, (_, i) =>
      createMockProblem("exam-2025-math-final", i + 1, "math"),
    ),
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-01-20T14:30:00Z",
  },
  {
    id: "exam-2025-english-midterm",
    title: "2025학년도 영어 중간고사 모의고사",
    description: "영어 독해, 문법, 어휘 종합 평가",
    problems: Array.from({ length: 25 }, (_, i) =>
      createMockProblem("exam-2025-english-midterm", i + 1, "english"),
    ),
    createdAt: "2025-01-10T10:00:00Z",
    updatedAt: "2025-01-18T16:45:00Z",
  },
  {
    id: "exam-2025-science-practice",
    title: "2025학년도 과학 실력평가 모의고사",
    description: "물리, 화학, 생물, 지구과학 통합 평가",
    problems: Array.from({ length: 30 }, (_, i) =>
      createMockProblem("exam-2025-science-practice", i + 1, "science"),
    ),
    createdAt: "2025-01-12T11:00:00Z",
    updatedAt: "2025-01-22T09:15:00Z",
  },
  {
    id: "exam-2025-korean-comprehensive",
    title: "2025학년도 국어 종합평가 모의고사",
    description: "문학, 비문학, 언어와 매체, 화법과 작문 통합",
    problems: Array.from({ length: 18 }, (_, i) =>
      createMockProblem("exam-2025-korean-comprehensive", i + 1, "korean"),
    ),
    createdAt: "2025-01-08T08:30:00Z",
    updatedAt: "2025-01-25T13:20:00Z",
  },
  {
    id: "exam-2025-mock-test-1",
    title: "2025학년도 1차 전국연합학력평가 모의고사",
    description: "전 과목 통합 모의평가 (국어, 수학, 영어)",
    problems: Array.from({ length: 35 }, (_, i) => {
      const subject = i < 12 ? "korean" : i < 24 ? "math" : "english";
      return createMockProblem("exam-2025-mock-test-1", i + 1, subject);
    }),
    createdAt: "2025-01-05T07:00:00Z",
    updatedAt: "2025-01-30T18:00:00Z",
  },
  {
    id: "exam-2025-suneung-practice-1",
    title: "2025학년도 대학수학능력시험 대비 1차 모의고사",
    description: "수능 출제 패턴 기반 실전 모의고사",
    problems: Array.from({ length: 45 }, (_, i) => {
      const subject = i < 15 ? "korean" : i < 30 ? "math" : "english";
      return createMockProblem("exam-2025-suneung-practice-1", i + 1, subject);
    }),
    createdAt: "2025-01-03T06:00:00Z",
    updatedAt: "2025-01-28T20:30:00Z",
  },
  {
    id: "exam-2025-quick-test",
    title: "2025학년도 빠른 실력 점검 모의고사",
    description: "짧은 시간 내 실력 확인용 간단 모의고사",
    problems: Array.from({ length: 10 }, (_, i) =>
      createMockProblem("exam-2025-quick-test", i + 1, "math"),
    ),
    createdAt: "2025-01-20T12:00:00Z",
    updatedAt: "2025-01-26T15:00:00Z",
  },
  {
    id: "exam-2025-intensive-math",
    title: "2025학년도 수학 집중 훈련 모의고사",
    description: "수학 고난도 문제 집중 연습",
    problems: Array.from({ length: 15 }, (_, i) =>
      createMockProblem("exam-2025-intensive-math", i + 1, "math"),
    ),
    createdAt: "2025-01-14T14:00:00Z",
    updatedAt: "2025-01-24T11:45:00Z",
  },
];

/**
 * Promise 기반 Mock API 호출 시뮬레이터
 * @description 실제 서버 통신과 유사한 동작을 Promise로 시뮬레이션
 * @template T 반환할 데이터 타입
 * @param data 반환할 Mock 데이터
 * @param options Mock 옵션 (지연시간, 에러율 등)
 * @returns Promise로 감싼 Mock 데이터
 */
/**
 * Promise 기반 Mock API 호출 시뮬레이터 (실제 API 요청 형식 기반)
 * @description 실제 HTTP 요청 설정에 따라 적절한 Mock 데이터를 반환
 * @param config Axios 요청 설정 (URL, method 등)
 * @returns Promise로 감싼 Mock 데이터 (ApiResponse 형식)
 */
async function simulateApiCall<T>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  const { url, method = "GET" } = config;

  // 기본 지연시간과 에러율 설정
  const delay = getRandomDelay(400, 1200);
  const errorRate = 0.03;

  // 에러 시뮬레이션 (3% 확률)
  maybeThrowError(errorRate);

  // 네트워크 지연 시뮬레이션
  await sleep(delay);

  // URL에 따라 적절한 Mock 데이터 반환
  if (url === "/api/exams" && method === "GET") {
    return createMockApiResponse(MOCK_EXAMS as T);
  } else if (url?.startsWith("/api/exams/") && method === "GET") {
    // /api/exams/{examId} 형태
    const examId = url.split("/api/exams/")[1];
    const exam = MOCK_EXAMS.find((e) => e.id === examId);

    if (!exam) {
      throw new Error(
        `Mock API Error: 모의고사를 찾을 수 없습니다. ID: ${examId}`,
      );
    }

    return createMockApiResponse(exam as T);
  } else if (url === "/api/exams/ids" && method === "GET") {
    const examIds = MOCK_EXAMS.map((exam) => exam.id);
    return createMockApiResponse(examIds as T);
  }

  // 지원하지 않는 엔드포인트
  throw new Error(
    `Mock API Error: 지원하지 않는 엔드포인트입니다. ${method} ${url}`,
  );
}

/**
 * 모든 모의고사 목록 조회 (Mock 구현)
 * @description 실제 서버 대신 Promise 기반 Mock 데이터 반환
 * @returns 모의고사 목록 배열
 * @throws {Error} Mock 네트워크 에러 시뮬레이션
 *
 * 주요 특징:
 * - 400-1200ms 랜덤 지연시간으로 실제 서버 응답 시뮬레이션
 * - 3% 확률로 네트워크 에러 발생
 * - 8개의 다양한 모의고사 데이터 제공 (수학, 영어, 과학, 국어)
 *
 * @example
 * ```typescript
 * try {
 *   const exams = await getAllMockExams();
 *   console.log(`총 ${exams.length}개의 모의고사`);
 * } catch (error) {
 *   console.error('모의고사 목록 조회 실패:', error.message);
 * }
 * ```
 */
/**
 * 모든 모의고사 목록 조회
 * @description baseApiClient를 사용한 실제 HTTP 요청으로 모의고사 목록 조회
 * @returns 모의고사 목록 배열
 * @throws {Error} 네트워크 에러 또는 서버 에러 시
 *
 * 주요 특징:
 * - baseApiClient 패턴 사용으로 다른 API와 일관된 구조
 * - 환경 변수를 통한 백엔드 URL 설정
 * - AbortSignal 지원으로 요청 취소 가능
 * - 실제 백엔드 연동 준비 완료
 *
 * @example
 * ```typescript
 * try {
 *   const response = await getAllMockExams();
 *   console.log(`총 ${response.data.length}개의 모의고사`);
 * } catch (error) {
 *   console.error('모의고사 목록 조회 실패:', error.message);
 * }
 * ```
 */
export async function getAllMockExams(options?: {
  signal?: AbortSignal;
}): Promise<MockExamListApiResponse> {
  return examApiRequest<MockExam[]>({
    method: "GET",
    url: "/api/exams",
    signal: options?.signal,
  });
}

/**
 * 특정 모의고사 상세 조회 (Mock 구현)
 * @description 실제 서버 대신 Promise 기반 Mock 데이터 반환
 * @param examId 조회할 모의고사 ID
 * @returns 모의고사 상세 정보
 * @throws {Error} 존재하지 않는 ID이거나 Mock 네트워크 에러 시
 *
 * 주요 특징:
 * - ID 기반으로 해당 모의고사 검색
 * - 존재하지 않는 ID는 404 에러 시뮬레이션
 * - 300-800ms 지연시간으로 빠른 상세 조회 시뮬레이션
 * - 각 모의고사마다 다른 수의 문제 포함 (10-45문제)
 *
 * @example
 * ```typescript
 * try {
 *   const exam = await getMockExamById('exam-2025-math-final');
 *   console.log(`${exam.title}: ${exam.problems.length}문제`);
 * } catch (error) {
 *   console.error('모의고사 조회 실패:', error.message);
 * }
 * ```
 */
/**
 * 특정 모의고사 상세 조회
 * @description baseApiClient를 사용한 실제 HTTP 요청으로 모의고사 상세 정보 조회
 * @param examId 조회할 모의고사 ID
 * @param options 추가 옵션
 * @param options.signal 요청 취소를 위한 AbortSignal
 * @returns 모의고사 상세 정보
 * @throws {Error} 존재하지 않는 ID이거나 네트워크 에러 시
 *
 * 주요 특징:
 * - baseApiClient 패턴 사용으로 다른 API와 일관된 구조
 * - RESTful URL 패턴 (/api/exams/{examId})
 * - 요청 취소 지원 (AbortSignal)
 * - 404 에러 처리 포함
 *
 * @example
 * ```typescript
 * try {
 *   const exam = await getMockExamById('exam-2025-math-final');
 *   console.log(`${exam.data.title}: ${exam.data.problems.length}문제`);
 * } catch (error) {
 *   console.error('모의고사 조회 실패:', error.message);
 * }
 * ```
 */
export async function getMockExamById(
  examId: string,
  options?: { signal?: AbortSignal },
): Promise<MockExamApiResponse> {
  return examApiRequest<MockExam>({
    method: "GET",
    url: `/api/exams/${examId}`,
    signal: options?.signal,
  });
}

/**
 * 모의고사 ID 목록만 조회 (Mock 구현)
 * @description 실제 서버 대신 Promise 기반 Mock 데이터 반환
 * @returns 모의고사 ID 문자열 배열
 * @throws {Error} Mock 네트워크 에러 시뮬레이션
 *
 * 주요 특징:
 * - 전체 모의고사에서 ID만 추출하여 반환
 * - 200-600ms 빠른 응답시간 (단순한 ID 목록이므로)
 * - 1% 낮은 에러율 (단순한 조회이므로)
 *
 * @example
 * ```typescript
 * try {
 *   const examIds = await getMockExamIds();
 *   console.log('사용 가능한 모의고사 ID:', examIds);
 * } catch (error) {
 *   console.error('모의고사 ID 목록 조회 실패:', error.message);
 * }
 * ```
 */
/**
 * 모의고사 ID 목록만 조회
 * @description baseApiClient를 사용한 실제 HTTP 요청으로 모의고사 ID 목록 조회
 * @param options 추가 옵션
 * @param options.signal 요청 취소를 위한 AbortSignal
 * @returns 모의고사 ID 문자열 배열
 * @throws {Error} 네트워크 에러 시
 *
 * 주요 특징:
 * - baseApiClient 패턴 사용으로 다른 API와 일관된 구조
 * - 빠른 응답시간 (ID만 조회하므로)
 * - 요청 취소 지원 (AbortSignal)
 *
 * @example
 * ```typescript
 * try {
 *   const response = await getMockExamIds();
 *   console.log('사용 가능한 모의고사 ID:', response.data);
 * } catch (error) {
 *   console.error('모의고사 ID 목록 조회 실패:', error.message);
 * }
 * ```
 */
export async function getMockExamIds(options?: {
  signal?: AbortSignal;
}): Promise<MockExamIdsApiResponse> {
  return examApiRequest<string[]>({
    method: "GET",
    url: "/api/exams/ids",
    signal: options?.signal,
  });
}

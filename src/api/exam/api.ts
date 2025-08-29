import type { AxiosRequestConfig } from "axios";
import { authApiClient } from "@/api/client";
import type { 
  MockExam, 
  MockExamListApiResponse,
  MockExamApiResponse,
  MockExamIdsApiResponse,
} from "./types";
import type { ApiResponse } from "@/api/common/types";
import { extractApiData } from "@/api/common/types";

/**
 * 백엔드 서버의 기본 URL을 환경 변수에서 가져오기
 * @description Vite 환경에서 VITE_ 접두사가 있는 환경 변수만 클라이언트에서 접근 가능
 */
const BACKEND_API_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://localhost:3055";

/**
 * 모의고사 전용 API 클라이언트
 * @description 인증이 필요한 API이므로 authApiClient 사용
 */
const examApiClient = authApiClient.create({
  baseURL: BACKEND_API_URL,
  timeout: 15000, // 모의고사 데이터는 크므로 타임아웃을 길게 설정
});

/**
 * 모의고사 API 공통 요청 함수
 * @description 모든 모의고사 API 호출에서 공통으로 사용하는 요청 처리 함수
 * @template T API 응답 데이터 타입
 * @param config Axios 요청 설정 객체
 * @returns API 응답 데이터 (ApiResponse 래퍼에서 data 필드만 추출)
 */
async function examApiRequest<T>(
  config: AxiosRequestConfig,
): Promise<T> {
  const response = await examApiClient.request<ApiResponse<T>>(config);
  
  // ApiResponse<T> 형태의 응답에서 data 필드만 추출
  return extractApiData(response.data);
}

/**
 * 모든 모의고사 목록 조회
 * @description 백엔드 API: GET /api/exam/list
 * @returns 모의고사 목록 배열
 * @throws {Error} API 요청 실패 또는 인증 오류 시
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
export async function getAllMockExams(): Promise<MockExam[]> {
  return examApiRequest<MockExam[]>({
    method: "GET",
    url: "/api/exam/list",
  });
}

/**
 * 특정 모의고사 상세 조회
 * @description 백엔드 API: GET /api/exam/:examId
 * @param examId 조회할 모의고사 ID
 * @returns 모의고사 상세 정보
 * @throws {Error} API 요청 실패, 인증 오류, 또는 모의고사를 찾을 수 없는 경우
 * 
 * @example
 * ```typescript
 * try {
 *   const exam = await getMockExamById('exam-2024-math-01');
 *   console.log(`${exam.title}: ${exam.problems.length}문제`);
 * } catch (error) {
 *   console.error('모의고사 조회 실패:', error.message);
 * }
 * ```
 */
export async function getMockExamById(examId: string): Promise<MockExam> {
  return examApiRequest<MockExam>({
    method: "GET",
    url: `/api/exam/${encodeURIComponent(examId)}`,
  });
}

/**
 * 모의고사 ID 목록만 조회
 * @description 백엔드 API: GET /api/exam/ids
 * @returns 모의고사 ID 문자열 배열
 * @throws {Error} API 요청 실패 또는 인증 오류 시
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
export async function getMockExamIds(): Promise<string[]> {
  return examApiRequest<string[]>({
    method: "GET",
    url: "/api/exam/ids",
  });
}

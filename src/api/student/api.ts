/**
 * 학생 API 함수들
 * @description 학생 관련 백엔드 API와 통신하는 함수들
 */

import { authApiClient, baseApiClient } from "@/api/client";
import { extractApiData } from "@/api/common/types";
import type { ApiResponse } from "@/api/common/types";
import type {
  StudentAuthRequest,
  StudentInfoDto,
  UpsertStudentResponse,
  RecentSubmissionsParams,
  RecentSubmissionListResponse,
  ExamDetailParams,
  ExamDetailResult,
  ExamQuestionsData,
  ExamHistoryParams,
  ExamHistoryResponse,
} from "./types";

/**
 * 학생 정보 등록 또는 조회 (upsert)
 * @description 3요소 인증을 통해 학생 정보를 등록하거나 조회합니다
 *
 * 동작 방식:
 * - 데이터베이스에 일치하는 학생이 없으면: 새로 등록 후 학생 정보 반환
 * - 데이터베이스에 일치하는 학생이 있으면: 기존 학생 정보 반환
 *
 * @param authData 학생 3요소 인증 정보 (이름, 전화번호, 생년월일)
 * @returns 학생의 완전한 정보 (ID, 개인정보, 생성/수정 시간 포함)
 */
export async function upsertStudent(
  authData: StudentAuthRequest,
): Promise<UpsertStudentResponse> {
  const response = await authApiClient.post<ApiResponse<UpsertStudentResponse>>(
    "/auth/upsert-student",
    authData,
  );

  return extractApiData(response.data);
}

/**
 * 학생 최근 시험 제출 내역 조회
 * @description 로그인한 학생의 최근 시험 제출 내역을 페이징으로 조회합니다
 *
 * @param params 인증 정보 및 페이징 파라미터
 * @returns 최근 시험 제출 내역 목록
 */
export async function getRecentSubmissions(
  params: RecentSubmissionsParams,
): Promise<RecentSubmissionListResponse> {
  const { page = 0, size = 10, ...authData } = params;

  const response = await authApiClient.post<
    ApiResponse<RecentSubmissionListResponse>
  >("/student/recent-submissions", {
    ...authData,
    page,
    size,
  });

  // extractApiData가 data 필드를 반환하므로 그대로 사용
  return extractApiData(response.data);
}

/**
 * 학생 시험 이력 조회
 * @description 학생이 응시한 모든 시험 이력을 페이징으로 조회합니다
 *
 * @param params 인증 정보 및 페이징 파라미터
 * @returns 시험 이력 목록
 */
export async function getExamHistory(
  params: ExamHistoryParams,
): Promise<ExamHistoryResponse> {
  const { page = 0, size = 10, ...authData } = params;

  const response = await authApiClient.post<ApiResponse<ExamHistoryResponse>>(
    `/student/exam-history?page=${page}&size=${size}`,
    authData,
  );

  return extractApiData(response.data);
}

/**
 * 학생 정보 조회
 * @description 3요소 인증을 통해 학생 정보를 조회합니다
 *
 * @param authData 학생 3요소 인증 정보
 * @returns 학생 기본 정보
 */
export async function getStudentInfo(
  authData: StudentAuthRequest,
): Promise<StudentInfoDto> {
  const response = await authApiClient.post<ApiResponse<StudentInfoDto>>(
    "/student/info",
    authData,
  );

  return extractApiData(response.data);
}

/**
 * 시험 상세 결과 조회
 * @description 특정 시험의 상세 결과를 조회합니다 (객관식/주관식 문제 수, 배점, 답안 등)
 *
 * 주요 기능:
 * - 객관식/주관식 문제 수 확인 (objectiveCount, subjectiveCount)
 * - 문제별 배점 정보 제공
 * - 학생 답안과 정답 비교
 * - 단원별 문제 분류 정보
 *
 * @param params 시험 ID와 학생 3요소 인증 정보
 * @returns 시험 상세 결과 정보
 * @throws {ApiError} 시험을 찾을 수 없거나 인증 실패 시
 */
export async function getExamDetail(
  params: ExamDetailParams,
): Promise<ExamDetailResult> {
  const { examId, ...authData } = params;

  const response = await authApiClient.post<ApiResponse<ExamDetailResult>>(
    `/student/exam-detail/${examId}`,
    authData,
  );

  return extractApiData(response.data);
}

/**
 * 시험 문제 조회 (신규 API)
 * @description 특정 시험의 모든 문제 정보를 조회합니다 (인증 불필요)
 *
 * 주요 기능:
 * - 시험 기본 정보 (시험명, 학년)
 * - 문제 통계 (총 문제 수, 객관식/주관식 개수, 총 배점)
 * - 문제별 상세 정보 (순서, 유형, 내용, 배점, 선택지, 이미지)
 * - 문제 유형별 비율 정보
 *
 * API 특징:
 * - 인증 불필요 (baseApiClient 사용)
 * - 학생 시험 제출 페이지용
 * - 문제 순서(seqNo) 오름차순 정렬
 *
 * @param examId 시험 고유 식별자 (UUID)
 * @param options 요청 옵션
 * @returns 시험의 모든 문제 정보
 * @throws {ApiError} 시험을 찾을 수 없거나 서버 오류 시
 */
export async function getExamQuestions(
  examId: string,
  options?: { signal?: AbortSignal },
): Promise<ExamQuestionsData> {
  const response = await baseApiClient.request<ApiResponse<ExamQuestionsData>>({
    method: "GET",
    url: `/exams/${examId}/questions`,
    signal: options?.signal,
  });

  return extractApiData(response.data);
}

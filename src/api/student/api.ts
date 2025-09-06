/**
 * 학생 API 함수들
 * @description 학생 관련 백엔드 API와 통신하는 함수들
 */

import { authApiClient } from "@/api/client";
import { extractApiData  } from "@/api/common/types";
import type {ApiResponse} from "@/api/common/types";
import type { 
  StudentAuthRequest, 
  StudentInfoDto,
  UpsertStudentResponse,
  RecentSubmissionsParams,
  RecentSubmissionListResponse,
  StudentInfo 
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
    authData
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

  const response = await authApiClient.post<ApiResponse<RecentSubmissionListResponse>>(
    "/api/student/recent-submissions",
    {
      ...authData,
      page,
      size,
    }
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
    "/api/student/info",
    authData
  );

  return extractApiData(response.data);
}
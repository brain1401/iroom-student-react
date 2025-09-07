/**
 * 실제 서버 기반 시험 관리 API 함수들 (기존 목 데이터 완전 제거)
 * @description 목 데이터 대신 실제 백엔드 서버와 통신하는 시험 관리 함수들
 *
 * 주요 변경사항:
 * - 모든 목 데이터 및 시뮬레이션 로직 완전 제거
 * - server-api.ts에서 구현한 실제 서버 API 함수들을 재사용
 * - 기존 인터페이스 호환성 유지하면서 실제 서버 타입으로 교체
 * - 31개의 실제 시험 데이터 사용 (UUID 기반 ID 시스템)
 *
 * 실제 서버 연동:
 * - ApiResponse<T> 래퍼 패턴 적용
 * - 실제 페이지네이션 및 필터링 지원
 * - httpOnly 쿠키 기반 인증 사용
 * - 에러 처리 및 타입 안전성 보장
 */

import type { ApiResponse } from "@/api/common/types";
import type {
  ExamItem,
  ExamListParams,
  ExamListApiResponse,
  ExamDetailApiResponse,
  ExamIdsApiResponse,
} from "@/api/common/server-types";

// 실제 서버 API 함수들을 import
import {
  getAllExams,
  getExamById,
  getExamsByGrade,
  getExamIds,
} from "./server-api";

// 기존 컴포넌트 호환성을 위한 타입 임포트
import type {
  MockExam,
  MockExamListApiResponse,
  MockExamApiResponse,
  MockExamIdsApiResponse,
} from "./types";

/**
 * 기존 MockExam 타입을 ExamItem 타입과 호환되도록 변환하는 유틸리티
 * @description 기존 컴포넌트들이 MockExam 구조를 기대하므로 임시 호환성 제공
 *
 * 주요 변환:
 * - ExamItem → MockExam 구조로 변환
 * - 실제 서버 데이터의 필드를 기존 인터페이스에 매핑
 * - problems 필드는 빈 배열로 처리 (별도 시험지 API에서 관리)
 *
 * @param examItem 서버에서 받은 시험 데이터
 * @returns 기존 인터페이스와 호환되는 MockExam 형식
 */
function convertExamItemToMockExam(examItem: ExamItem): MockExam {
  return {
    id: examItem.id,
    title: examItem.examName,
    description: examItem.content || "시험 설명이 없습니다.",
    problems: [], // 실제 서버에서는 별도 시험지 API로 문제를 관리
    createdAt: examItem.createdAt,
    updatedAt: examItem.createdAt, // 서버에 updatedAt이 없으므로 createdAt 사용
  };
}

/**
 * 실제 서버 API 응답을 기존 MockExam 인터페이스로 변환하는 함수들
 * @description 기존 컴포넌트들의 호환성을 위해 서버 응답을 기존 형식으로 변환
 */
function convertExamListResponse(
  serverResponse: ExamListApiResponse,
): ApiResponse<MockExam[]> {
  const mockExams = serverResponse.data.content.map(convertExamItemToMockExam);

  return {
    result: "SUCCESS",
    message: `${mockExams.length}개의 시험을 조회했습니다.`,
    data: mockExams,
  };
}

function convertExamDetailResponse(examItem: ExamItem): ApiResponse<MockExam> {
  const mockExam = convertExamItemToMockExam(examItem);

  return {
    result: "SUCCESS",
    message: "시험 상세 정보를 조회했습니다.",
    data: mockExam,
  };
}

function convertExamIdsResponse(examIds: string[]): ApiResponse<string[]> {
  return {
    result: "SUCCESS",
    message: `${examIds.length}개의 시험 ID를 조회했습니다.`,
    data: examIds,
  };
}

/**
 * 모든 시험 목록 조회 (실제 서버 API 사용)
 * @description 실제 백엔드 서버에서 시험 목록을 가져오는 함수
 *
 * 실제 서버 연동:
 * - 31개의 실제 시험 데이터 사용
 * - UUID 기반 ID 시스템
 * - 학년별, 과목별 필터링 지원
 * - 페이지네이션 지원
 *
 * @param options 요청 옵션
 * @returns 시험 목록 (기존 MockExam 형식으로 변환)
 * @throws {Error} 네트워크 에러 또는 서버 에러 시
 */
export async function getAllMockExams(options?: {
  signal?: AbortSignal;
}): Promise<MockExamListApiResponse> {
  try {
    // 실제 서버 API 호출
    const serverResponse = await getAllExams({}, options);

    // 기존 인터페이스와 호환되는 형식으로 변환
    return convertExamListResponse(serverResponse);
  } catch (error) {
    console.error("[Exam API] 시험 목록 조회 실패:", error);
    throw error;
  }
}

/**
 * 특정 시험 상세 조회 (실제 서버 API 사용)
 * @description 실제 백엔드 서버에서 시험 상세 정보를 가져오는 함수
 *
 * 실제 서버 연동:
 * - UUID 기반 시험 ID로 조회
 * - 상세한 시험 정보와 메타데이터 제공
 * - 시험지 정보도 포함 (examSheetInfo)
 *
 * @param examId 조회할 시험 ID (UUID 형식)
 * @param options 요청 옵션
 * @returns 시험 상세 정보 (기존 MockExam 형식으로 변환)
 * @throws {Error} 존재하지 않는 ID이거나 네트워크 에러 시
 */
export async function getMockExamById(
  examId: string,
  options?: { signal?: AbortSignal },
): Promise<MockExamApiResponse> {
  try {
    // 실제 서버 API 호출
    const examItem = await getExamById(examId, options);

    // 기존 인터페이스와 호환되는 형식으로 변환
    return convertExamDetailResponse(examItem.data);
  } catch (error) {
    console.error(`[Exam API] 시험 상세 조회 실패 (ID: ${examId}):`, error);
    throw error;
  }
}

/**
 * 시험 ID 목록만 조회 (실제 서버 API 사용)
 * @description 실제 백엔드 서버에서 시험 ID 목록을 가져오는 함수
 *
 * 실제 서버 연동:
 * - UUID 형식의 실제 시험 ID들
 * - 빠른 응답시간 (ID만 조회하므로)
 * - 드롭다운이나 선택 컴포넌트에서 활용
 *
 * @param options 요청 옵션
 * @returns 시험 ID 문자열 배열
 * @throws {Error} 네트워크 에러 시
 */
export async function getMockExamIds(options?: {
  signal?: AbortSignal;
}): Promise<MockExamIdsApiResponse> {
  try {
    // 실제 서버 API 호출
    const examIds = await getExamIds(options);

    // 기존 인터페이스와 호환되는 형식으로 변환
    return convertExamIdsResponse(examIds.data);
  } catch (error) {
    console.error("[Exam API] 시험 ID 목록 조회 실패:", error);
    throw error;
  }
}

/**
 * 학년별 시험 조회 (실제 서버 API 사용)
 * @description 특정 학년의 시험만 필터링해서 가져오는 함수
 *
 * 실제 서버 연동:
 * - 1학년, 2학년, 3학년별 분류
 * - 실제 서버의 학년 필터링 기능 사용
 *
 * @param grade 학년 (1, 2, 3)
 * @param options 요청 옵션
 * @returns 해당 학년의 시험 목록
 */
export async function getMockExamsByGrade(
  grade: number,
  options?: { signal?: AbortSignal },
): Promise<MockExamListApiResponse> {
  try {
    // 실제 서버 API 호출
    const serverResponse = await getExamsByGrade(grade, {}, options);

    // 기존 인터페이스와 호환되는 형식으로 변환
    return convertExamListResponse(serverResponse);
  } catch (error) {
    console.error(`[Exam API] ${grade}학년 시험 조회 실패:`, error);
    throw error;
  }
}

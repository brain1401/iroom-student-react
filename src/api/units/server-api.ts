/**
 * 실제 서버 기반 단원 관리 API 함수들
 * @description 목 데이터 대신 실제 백엔드 서버와 통신하는 단원 관리 함수들
 *
 * 주요 기능:
 * - 전체 단원 트리 구조 조회
 * - 학년별 단원 필터링
 * - 단원 계층 구조 분석
 * - 단원 커버리지 분석
 *
 * 서버 응답 구조:
 * - 5개 주요 카테고리 (수학, 국어, 영어, 사회, 과학)
 * - 계층적 단원-소단원 구조
 * - grade별 분류 시스템
 */

import { authApiClient } from "@/api/client";
import type { ApiResponse } from "@/api/common/types";
import { extractApiData } from "@/api/common/types";
import type {
  UnitTreeNode,
  UnitTreeApiResponse,
  UnitCoverageAnalysis,
  UnitStatistics,
  UnitSearchParams,
  UnitListApiResponse,
} from "@/api/common/server-types";

/**
 * 전체 단원 트리 구조 조회
 * @description 모든 과목의 계층적 단원 구조를 가져오는 함수
 *
 * 응답 구조:
 * - 5개 주요 과목 카테고리
 * - 각 과목별 학년 분류
 * - 단원-소단원 계층 구조
 * - 총 단원 수: 수백 개의 세부 단원
 *
 * @param options 요청 옵션
 * @returns 전체 단원 트리 구조
 */
export async function getAllUnits(options?: {
  /** 요청 취소를 위한 AbortSignal */
  signal?: AbortSignal;
  /** 문제 포함 조회 여부 */
  includeQuestions?: boolean;
}): Promise<UnitTreeNode[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (options?.includeQuestions) {
      queryParams.append("includeQuestions", "true");
    }
    
    const url = queryParams.toString() 
      ? `/api/units?${queryParams.toString()}`
      : "/api/units";

    const response = await authApiClient.request<ApiResponse<UnitTreeNode[]>>({
      method: "GET",
      url,
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error("[Units API] 전체 단원 트리 조회 실패:", error);
    throw error;
  }
}

/**
 * 학년별 단원 필터링 조회
 * @description 특정 학년의 단원만 필터링해서 가져오는 함수
 *
 * 주요 기능:
 * - 학년별 단원 분류 (1학년, 2학년, 3학년)
 * - 과목별 그룹핑 유지
 * - 계층 구조 보존
 *
 * @param grade 학년 (1, 2, 3)
 * @param options 요청 옵션
 * @returns 해당 학년의 단원 트리 구조
 */
export async function getUnitsByGrade(
  grade: number,
  options?: { 
    /** 요청 취소를 위한 AbortSignal */
    signal?: AbortSignal;
    /** 문제 포함 조회 여부 */
    includeQuestions?: boolean;
  },
): Promise<UnitTreeNode[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (options?.includeQuestions) {
      queryParams.append("includeQuestions", "true");
    }
    
    const url = queryParams.toString() 
      ? `/api/units/grade/${grade}?${queryParams.toString()}`
      : `/api/units/grade/${grade}`;

    const response = await authApiClient.request<ApiResponse<UnitTreeNode[]>>({
      method: "GET",
      url,
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error(`[Units API] ${grade}학년 단원 조회 실패:`, error);
    throw error;
  }
}

/**
 * 단원 검색 함수
 * @description 단원명으로 검색하여 관련 단원들을 찾는 함수
 *
 * 검색 기능:
 * - 단원명 부분 일치 검색
 * - 과목별 필터링 가능
 * - 학년별 필터링 가능
 * - 계층 구조 컨텍스트 포함
 *
 * @param params 검색 파라미터
 * @param options 요청 옵션
 * @returns 검색된 단원 목록
 */
export async function searchUnits(
  params: UnitSearchParams,
  options?: { signal?: AbortSignal },
): Promise<UnitListApiResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params.keyword) queryParams.append("keyword", params.keyword);
    if (params.subject) queryParams.append("subject", params.subject);
    if (params.grade) queryParams.append("grade", params.grade.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.offset) queryParams.append("offset", params.offset.toString());

    const url = queryParams.toString()
      ? `/api/units/search?${queryParams.toString()}`
      : "/api/units/search";

    const response = await authApiClient.request<
      ApiResponse<UnitListApiResponse>
    >({
      method: "GET",
      url,
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error("[Units API] 단원 검색 실패:", error);
    throw error;
  }
}

/**
 * 특정 시험지의 단원 커버리지 분석
 * @description 시험지가 다루는 단원들의 분포와 커버리지를 분석하는 함수
 *
 * 분석 내용:
 * - 다룬 단원 목록과 비율
 * - 과목별 단원 분포
 * - 학년별 단원 분포
 * - 누락된 중요 단원 식별
 *
 * @param examSheetId 시험지 ID
 * @param options 요청 옵션
 * @returns 단원 커버리지 분석 결과
 */
export async function analyzeUnitCoverage(
  examSheetId: string,
  options?: { signal?: AbortSignal },
): Promise<UnitCoverageAnalysis> {
  try {
    const response = await authApiClient.request<
      ApiResponse<UnitCoverageAnalysis>
    >({
      method: "GET",
      url: `/api/exam-sheets/${examSheetId}/unit-coverage`,
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error(
      `[Units API] 단원 커버리지 분석 실패 (시험지: ${examSheetId}):`,
      error,
    );
    throw error;
  }
}

/**
 * 단원별 통계 정보 조회
 * @description 각 단원의 출제 빈도, 난이도 등의 통계 정보를 가져오는 함수
 *
 * 통계 정보:
 * - 단원별 출제 빈도
 * - 평균 난이도
 * - 학생 정답률
 * - 최근 출제 동향
 *
 * @param unitId 단원 ID (선택적)
 * @param options 요청 옵션
 * @returns 단원별 통계 정보
 */
export async function getUnitStatistics(
  unitId?: string,
  options?: { signal?: AbortSignal },
): Promise<UnitStatistics> {
  try {
    const url = unitId
      ? `/api/units/${unitId}/statistics`
      : "/api/units/statistics";

    const response = await authApiClient.request<ApiResponse<UnitStatistics>>({
      method: "GET",
      url,
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error(
      `[Units API] 단원 통계 조회 실패 ${unitId ? `(단원: ${unitId})` : "(전체)"}:`,
      error,
    );
    throw error;
  }
}

/**
 * 단원 트리에서 특정 단원 찾기 유틸리티 함수
 * @description 계층적 단원 구조에서 특정 ID의 단원을 찾는 헬퍼 함수
 *
 * @param units 단원 트리 배열
 * @param targetId 찾을 단원 ID
 * @returns 찾은 단원 노드 또는 null
 */
export function findUnitInTree(
  units: UnitTreeNode[],
  targetId: string,
): UnitTreeNode | null {
  for (const unit of units) {
    if (unit.id === targetId) {
      return unit;
    }

    if (unit.children && unit.children.length > 0) {
      const found = findUnitInTree(unit.children, targetId);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * 단원 트리를 평면 배열로 변환하는 유틸리티 함수
 * @description 계층적 구조의 단원 트리를 검색이나 처리하기 쉬운 평면 배열로 변환
 *
 * @param units 단원 트리 배열
 * @returns 평면화된 단원 배열 (계층 정보는 depth로 보존)
 */
export function flattenUnitTree(
  units: UnitTreeNode[],
): Array<UnitTreeNode & { depth: number }> {
  const flattened: Array<UnitTreeNode & { depth: number }> = [];

  function traverse(nodes: UnitTreeNode[], currentDepth: number) {
    for (const node of nodes) {
      flattened.push({ ...node, depth: currentDepth });

      if (node.children && node.children.length > 0) {
        traverse(node.children, currentDepth + 1);
      }
    }
  }

  traverse(units, 0);
  return flattened;
}

/**
 * 특정 과목의 단원만 필터링하는 유틸리티 함수
 * @description 전체 단원 트리에서 특정 과목의 단원만 추출
 *
 * @param units 전체 단원 트리
 * @param subject 과목명 (수학, 국어, 영어, 사회, 과학)
 * @returns 해당 과목의 단원 트리
 */
export function filterUnitsBySubject(
  units: UnitTreeNode[],
  subject: string,
): UnitTreeNode[] {
  return units
    .filter((unit) => unit.name === subject)
    .map((unit) => ({
      ...unit,
      children: unit.children
        ? filterUnitsBySubject(unit.children, subject)
        : [],
    }));
}

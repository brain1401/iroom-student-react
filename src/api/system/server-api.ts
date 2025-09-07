/**
 * 실제 서버 기반 시스템 API 함수들
 * @description 목 데이터 대신 실제 백엔드 서버와 통신하는 시스템 관리 함수들
 *
 * 주요 기능:
 * - 헬스체크 및 서버 상태 조회
 * - 시스템 통계 및 메트릭
 * - 서버 설정 정보 조회
 * - API 버전 정보
 *
 * 실제 응답 구조:
 * - status: "UP" | "DOWN"
 * - timestamp: ISO 8601 형식
 * - 상세 헬스체크 정보 포함
 */

import { baseApiClient } from "@/api/client";
import type { ApiResponse } from "@/api/common/types";
import { extractApiData } from "@/api/common/types";
import type {
  HealthCheckData,
  HealthCheckApiResponse,
  HelloApiResponse,
  EchoApiResponse,
  SystemStatistics,
  SystemInfo,
  ApiVersionInfo,
} from "@/api/common/server-types";

/**
 * 서버 헬스체크 조회
 * @description 서버의 전반적인 상태를 확인하는 함수
 *
 * 실제 응답 구조:
 * - status: "UP" (서버 정상 동작)
 * - timestamp: 현재 시각 (ISO 8601)
 * - database: 데이터베이스 연결 상태
 * - redis: Redis 캐시 상태
 * - s3: AWS S3 연결 상태
 *
 * @param options 요청 옵션
 * @returns 헬스체크 결과
 */
export async function getHealthCheck(options?: {
  signal?: AbortSignal;
}): Promise<HealthCheckData> {
  try {
    // 헬스체크는 인증이 필요하지 않으므로 baseApiClient 사용
    const response = await baseApiClient.request<HealthCheckData>({
      method: "GET",
      url: "/api/system/health",
      signal: options?.signal,
    });

    // 헬스체크는 ApiResponse 래퍼를 사용하지 않고 직접 응답
    return response.data;
  } catch (error) {
    console.error("[System API] 헬스체크 조회 실패:", error);
    throw error;
  }
}

/**
 * 시스템 통계 정보 조회
 * @description 시스템의 전반적인 사용량 통계를 가져오는 함수
 *
 * 통계 정보:
 * - 전체 시험 수
 * - 전체 시험지 수
 * - 활성 사용자 수
 * - 시스템 리소스 사용량
 * - 최근 활동 통계
 *
 * @param type 통계 타입 (optional)
 * @param options 요청 옵션
 * @returns 시스템 통계 정보
 */
export async function getSystemStatistics(
  type?: string,
  options?: { signal?: AbortSignal },
): Promise<SystemStatistics> {
  try {
    const url = type
      ? `/api/system/statistics?type=${encodeURIComponent(type)}`
      : "/api/system/statistics";

    const response = await baseApiClient.request<ApiResponse<SystemStatistics>>(
      {
        method: "GET",
        url,
        signal: options?.signal,
      },
    );

    return extractApiData(response.data);
  } catch (error) {
    console.error(
      `[System API] 시스템 통계 조회 실패 ${type ? `(타입: ${type})` : ""}:`,
      error,
    );
    throw error;
  }
}

/**
 * 시스템 정보 조회
 * @description 서버의 기본 설정 및 환경 정보를 가져오는 함수
 *
 * 시스템 정보:
 * - 서버 버전
 * - 빌드 정보
 * - 환경 설정 (프로덕션/개발)
 * - 지원하는 기능 목록
 * - 시스템 제한사항
 *
 * @param options 요청 옵션
 * @returns 시스템 정보
 */
export async function getSystemInfo(options?: {
  signal?: AbortSignal;
}): Promise<SystemInfo> {
  try {
    const response = await baseApiClient.request<ApiResponse<SystemInfo>>({
      method: "GET",
      url: "/api/system/info",
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error("[System API] 시스템 정보 조회 실패:", error);
    throw error;
  }
}

/**
 * API 버전 정보 조회
 * @description 현재 API의 버전 및 호환성 정보를 가져오는 함수
 *
 * 버전 정보:
 * - 현재 API 버전
 * - 지원하는 클라이언트 버전
 * - deprecated 기능 목록
 * - 업데이트 필요 여부
 *
 * @param options 요청 옵션
 * @returns API 버전 정보
 */
export async function getApiVersion(options?: {
  signal?: AbortSignal;
}): Promise<ApiVersionInfo> {
  try {
    const response = await baseApiClient.request<ApiResponse<ApiVersionInfo>>({
      method: "GET",
      url: "/api/system/version",
      signal: options?.signal,
    });

    return extractApiData(response.data);
  } catch (error) {
    console.error("[System API] API 버전 정보 조회 실패:", error);
    throw error;
  }
}

/**
 * 시스템 상태 전체 요약 조회
 * @description 헬스체크, 통계, 시스템 정보를 한 번에 가져오는 종합 함수
 *
 * 종합 정보:
 * - 헬스체크 결과
 * - 주요 시스템 통계
 * - 기본 시스템 정보
 * - 현재 서버 부하 상태
 *
 * @param options 요청 옵션
 * @returns 시스템 상태 전체 요약
 */
export async function getSystemStatus(options?: {
  signal?: AbortSignal;
}): Promise<{
  health: HealthCheckData;
  statistics: SystemStatistics;
  info: SystemInfo;
  version: ApiVersionInfo;
}> {
  try {
    // 병렬로 모든 시스템 정보를 가져옴
    const [health, statistics, info, version] = await Promise.all([
      getHealthCheck(options),
      getSystemStatistics(undefined, options),
      getSystemInfo(options),
      getApiVersion(options),
    ]);

    return {
      health,
      statistics,
      info,
      version,
    };
  } catch (error) {
    console.error("[System API] 시스템 상태 전체 요약 조회 실패:", error);
    throw error;
  }
}

/**
 * 헬스체크 상태 확인 유틸리티
 * @description 헬스체크 결과가 정상인지 확인하는 헬퍼 함수
 *
 * @param health 헬스체크 데이터
 * @returns 시스템이 정상 상태인지 여부
 */
export function isSystemHealthy(health: HealthCheckData): boolean {
  return health.status === "UP";
}

/**
 * 시스템 부하 수준 계산 유틸리티
 * @description 시스템 통계를 기반으로 현재 부하 수준을 계산
 *
 * @param statistics 시스템 통계 데이터
 * @returns 부하 수준 ("low" | "medium" | "high")
 */
export function calculateSystemLoadLevel(
  statistics: SystemStatistics,
): "low" | "medium" | "high" {
  // 실제 구현에서는 CPU, 메모리, 네트워크 등을 종합적으로 판단
  // 현재는 기본적인 로직으로 구현

  if (!statistics.resourceUsage) {
    return "low";
  }

  const { cpu, memory, network } = statistics.resourceUsage;
  const averageUsage = (cpu + memory + (network || 0)) / (network ? 3 : 2);

  if (averageUsage < 50) return "low";
  if (averageUsage < 80) return "medium";
  return "high";
}

/**
 * 시스템 경고사항 검사 유틸리티
 * @description 시스템 상태를 분석하여 주의해야 할 사항들을 반환
 *
 * @param systemStatus 전체 시스템 상태
 * @returns 경고사항 목록
 */
export function checkSystemWarnings(systemStatus: {
  health: HealthCheckData;
  statistics: SystemStatistics;
  info: SystemInfo;
}): string[] {
  const warnings: string[] = [];

  // 헬스체크 경고
  if (!isSystemHealthy(systemStatus.health)) {
    warnings.push("시스템이 비정상 상태입니다.");
  }

  // 리소스 사용량 경고
  if (systemStatus.statistics.resourceUsage) {
    const { cpu, memory, disk } = systemStatus.statistics.resourceUsage;

    if (cpu > 90) warnings.push("CPU 사용량이 매우 높습니다.");
    if (memory > 90) warnings.push("메모리 사용량이 매우 높습니다.");
    if (disk && disk > 90) warnings.push("디스크 사용량이 매우 높습니다.");
  }

  // 데이터베이스 연결 경고
  if (
    systemStatus.health.database &&
    systemStatus.health.database.status !== "UP"
  ) {
    warnings.push("데이터베이스 연결에 문제가 있습니다.");
  }

  // Redis 연결 경고
  if (systemStatus.health.redis && systemStatus.health.redis.status !== "UP") {
    warnings.push("Redis 캐시 연결에 문제가 있습니다.");
  }

  return warnings;
}

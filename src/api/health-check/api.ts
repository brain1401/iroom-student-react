/**
 * 실제 서버 기반 헬스체크 API 함수들 (기존 목 데이터 완전 제거)
 * @description 목 데이터 대신 실제 백엔드 서버와 통신하는 헬스체크 함수들
 *
 * 주요 변경사항:
 * - 모든 복잡한 변환 로직 제거
 * - system/server-api.ts에서 구현한 실제 서버 API 함수들을 재사용
 * - 기존 인터페이스 호환성 유지하면서 실제 서버 타입으로 교체
 * - Spring Boot Actuator 스타일의 실제 헬스체크 데이터 사용
 *
 * 실제 서버 연동:
 * - status: "UP"/"DOWN" 실제 서버 상태
 * - timestamp: ISO 8601 형식의 실제 타임스탬프
 * - 데이터베이스, Redis, S3 등 실제 인프라 상태 포함
 */

import type {
  HealthCheckResponse,
  BackendHealthCheckResponse,
  HealthStatus,
  FrontendServiceInfo,
  ServiceHealthInfo,
} from "./types";

// 실제 서버 API 함수들을 import
import { getHealthCheck } from "../system/server-api";
import type { HealthCheckData } from "@/api/common/server-types";

/**
 * 백엔드 상태를 프론트엔드 상태로 변환
 * @description Spring Boot Actuator 형식을 우리 형식으로 변환
 */
function mapBackendStatusToHealthStatus(backendStatus: string): HealthStatus {
  switch (backendStatus) {
    case "UP":
      return "healthy";
    case "DOWN":
    case "OUT_OF_SERVICE":
      return "unhealthy";
    case "UNKNOWN":
    default:
      return "unknown";
  }
}

/**
 * 서비스명을 한국어로 변환
 * @description 서비스 키를 사용자 친화적인 한국어 이름으로 변환
 */
function getServiceDisplayName(serviceKey: string): string {
  switch (serviceKey) {
    case "database":
      return "데이터베이스";
    case "application":
      return "애플리케이션";
    case "aiServer":
      return "AI 서버";
    case "redis":
      return "Redis 캐시";
    case "s3":
      return "AWS S3";
    default:
      return serviceKey;
  }
}

/**
 * 개별 서비스 정보를 프론트엔드 형식으로 변환
 * @description ServiceHealthInfo를 FrontendServiceInfo로 변환
 */
function transformServiceInfo(
  serviceKey: string,
  serviceInfo: ServiceHealthInfo,
): FrontendServiceInfo {
  return {
    name: getServiceDisplayName(serviceKey),
    status: mapBackendStatusToHealthStatus(serviceInfo.status),
    message: serviceInfo.message,
    responseTime: serviceInfo.responseTimeMs,
  };
}

/**
 * 실제 서버 헬스체크 데이터를 기존 인터페이스로 변환
 * @description HealthCheckData를 HealthCheckResponse로 변환
 */
function convertHealthCheckData(
  serverData: HealthCheckData,
  responseTime: number,
): HealthCheckResponse {
  // 기본 서비스 정보 구성
  const services: FrontendServiceInfo[] = [];

  // 데이터베이스 상태 추가
  if (serverData.database) {
    services.push({
      name: "데이터베이스",
      status: mapBackendStatusToHealthStatus(
        serverData.database.status || "UNKNOWN",
      ),
      message: serverData.database.message || "데이터베이스 상태",
      responseTime: serverData.database.responseTimeMs || 0,
    });
  }

  // Redis 상태 추가
  if (serverData.redis) {
    services.push({
      name: "Redis 캐시",
      status: mapBackendStatusToHealthStatus(
        serverData.redis.status || "UNKNOWN",
      ),
      message: serverData.redis.message || "Redis 상태",
      responseTime: serverData.redis.responseTimeMs || 0,
    });
  }

  // S3 상태 추가
  if (serverData.s3) {
    services.push({
      name: "AWS S3",
      status: mapBackendStatusToHealthStatus(serverData.s3.status || "UNKNOWN"),
      message: serverData.s3.message || "S3 상태",
      responseTime: serverData.s3.responseTimeMs || 0,
    });
  }

  return {
    status: mapBackendStatusToHealthStatus(serverData.status),
    timestamp: serverData.timestamp,
    message: "서버 헬스체크 완료",
    responseTime,
    services,
  };
}

/**
 * 에러 타입을 구별하여 적절한 에러 메시지 생성
 * @description 다양한 에러 상황에 대해 사용자 친화적인 메시지 제공
 */
function createErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // 개발 환경에서 상세 에러 로깅
    if (import.meta.env.DEV) {
      console.error("🚨 헬스체크 에러 발생:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    }

    // 요청 취소 (AbortController)
    if (error.name === "AbortError") {
      return "헬스체크 요청이 취소되었습니다";
    }

    // 네트워크 타임아웃
    if (error.message.includes("timeout") || error.name === "ECONNABORTED") {
      return "서버 응답 시간 초과 (5초)";
    }

    // 네트워크 연결 실패
    if (
      error.message.includes("Network Error") ||
      error.message.includes("fetch") ||
      error.name === "ECONNREFUSED" ||
      error.name === "ENOTFOUND"
    ) {
      return "서버에 연결할 수 없습니다";
    }

    // 서버 응답 에러 (4xx, 5xx)
    if (error.message.includes("Request failed with status code")) {
      const statusMatch = error.message.match(/status code (\d+)/);
      const status = statusMatch ? statusMatch[1] : "알 수 없음";

      if (status.startsWith("4")) {
        return `클라이언트 에러 (${status})`;
      } else if (status.startsWith("5")) {
        return `서버 내부 에러 (${status})`;
      }

      return `서버에서 에러가 발생했습니다 (${status})`;
    }

    // CORS 에러
    if (
      error.message.includes("CORS") ||
      error.message.includes("Access-Control-Allow-Origin")
    ) {
      return "서버 접근 권한 에러 (CORS)";
    }

    // 기타 에러
    return `헬스체크 실패: ${error.message}`;
  }

  return "알 수 없는 헬스체크 오류가 발생했습니다";
}

/**
 * 백엔드 서버 헬스체크를 수행하는 함수 (실제 서버 API 사용)
 * @description 실제 백엔드 서버의 상태를 확인하여 정상 동작 여부를 반환
 *
 * 실제 서버 연동:
 * - Spring Boot Actuator 스타일의 헬스체크
 * - 실제 데이터베이스, Redis, S3 상태 확인
 * - status: "UP"/"DOWN" 실제 서버 응답
 * - timestamp: 실제 서버 시간 (ISO 8601)
 *
 * @param options 추가 옵션
 * @param options.signal 요청 취소를 위한 AbortSignal
 * @returns 서버 헬스체크 결과 (기존 인터페이스와 호환)
 * @throws {Error} 서버가 응답하지 않거나 에러가 발생한 경우
 *
 * @example
 * ```typescript
 * // 기본 사용법
 * const healthStatus = await fetchHealthCheck();
 * console.log(healthStatus.status); // "healthy" | "unhealthy" | "unknown"
 *
 * // 요청 취소 기능 포함
 * const controller = new AbortController();
 * const status = await fetchHealthCheck({ signal: controller.signal });
 * ```
 */
export async function fetchHealthCheck(options?: {
  signal?: AbortSignal;
}): Promise<HealthCheckResponse> {
  try {
    const startTime = Date.now();

    // 실제 서버 API 호출
    const serverData = await getHealthCheck(options);

    const responseTime = Date.now() - startTime;

    // 기존 인터페이스와 호환되는 형식으로 변환
    return convertHealthCheckData(serverData, responseTime);
  } catch (error) {
    // 구체적인 에러 메시지 생성하여 다시 throw
    throw new Error(createErrorMessage(error));
  }
}

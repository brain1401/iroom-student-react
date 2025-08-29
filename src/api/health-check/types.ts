/**
 * 헬스체크 관련 타입 정의
 * @description 백엔드 ApiResponse와 일치하는 헬스체크 전용 타입들
 */

// 공통 API 타입 import
import type {
  HealthCheckApiResponse,
  HealthCheckData,
  ServiceHealthInfo,
} from "@/api/common/types";

/**
 * 헬스체크 상태 타입
 * @description 프론트엔드에서 사용하는 사용자 친화적 상태 값
 */
export type HealthStatus = "healthy" | "unhealthy" | "unknown";

/**
 * 백엔드 서버 원본 응답 타입
 * @description 실제 백엔드에서 반환하는 ApiResponse<HealthCheckData> 형식
 */
export type BackendHealthCheckResponse = HealthCheckApiResponse;

// 공통 타입에서 export된 것들을 재export (기존 코드 호환성)
export type { ServiceHealthInfo, HealthCheckData };

/**
 * 프론트엔드용 서비스 상태 정보 타입
 * @description 개별 서비스 상태를 프론트엔드 형식으로 변환한 타입
 */
export type FrontendServiceInfo = {
  /** 서비스명 */
  name: string;
  /** 서비스 상태 */
  status: HealthStatus;
  /** 서비스 상태 메시지 */
  message: string;
  /** 서비스 응답 시간 (밀리초) */
  responseTime: number;
};

/**
 * 프론트엔드용 헬스체크 응답 데이터 타입
 * @description 백엔드 응답을 변환한 프론트엔드 전용 형식
 */
export type HealthCheckResponse = {
  /** 전체 헬스체크 상태 */
  status: HealthStatus;
  /** 응답 시간 */
  timestamp: string;
  /** 전체 상태 메시지 */
  message?: string;
  /** 전체 응답 시간 (밀리초) */
  responseTime?: number;
  /** 각 서비스별 상태 정보 (선택사항) */
  services?: FrontendServiceInfo[];
};

/**
 * 헬스체크 에러 타입
 */
export type HealthCheckError = {
  /** 에러 메시지 */
  message: string;
  /** 에러 코드 (선택사항) */
  code?: string;
  /** 발생 시간 */
  timestamp: string;
};

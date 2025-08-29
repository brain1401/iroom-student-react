import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { isAxiosError } from "axios";
import { ApiError } from "./baseClient";
import type { ApiResponse } from "@/api/common/types";
import { isErrorResponse } from "@/api/common/types";

/**
 * 응답 데이터가 ApiResponse<T> 형태인지 확인하는 타입 가드 함수
 * @description 백엔드 API와 외부 API를 구별하기 위한 유틸리티
 * @param data 응답 데이터
 * @returns ApiResponse 형태 여부
 */
function isApiResponse(data: unknown): data is ApiResponse<unknown> {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // ApiResponse의 필수 필드 확인: result, message, data
  return (
    typeof obj.result === "string" &&
    (obj.result === "SUCCESS" || obj.result === "ERROR") &&
    typeof obj.message === "string" &&
    obj.data !== undefined
  );
}

/**
 * 인터셉터 설정 옵션
 */
export type InterceptorOptions = {
  /** 인증 관련 인터셉터 여부 (401 처리 등) */
  isAuthClient?: boolean;
  /** 개발 환경에서 로깅 활성화 여부 */
  enableLogging?: boolean;
  /** 로그 메시지 접두사 */
  logPrefix?: string;
};

/**
 * 요청 인터셉터 로직 생성 함수
 * @description 공통 요청 인터셉터 로직을 생성하여 중복을 제거
 * @param options 인터셉터 설정 옵션
 * @returns 요청 인터셉터 설정 객체
 */
export function createRequestInterceptor(options: InterceptorOptions = {}) {
  const {
    enableLogging = true,
    logPrefix = "API Request",
    isAuthClient = false,
  } = options;

  const clientType = isAuthClient ? "Auth" : "";

  return {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      // 요청 로깅 (개발 환경에서만)
      if (enableLogging && import.meta.env.DEV) {
        const emoji = isAuthClient ? "🔐" : "🚀";
        console.log(
          `${emoji} [${clientType} ${logPrefix}] ${config.method?.toUpperCase()} ${config.url}`,
        );
      }
      return config;
    },
    onRejected: (error: unknown) => {
      console.error(`❌ [${clientType} ${logPrefix} Error]`, error);
      return Promise.reject(error);
    },
  };
}

/**
 * 응답 인터셉터 로직 생성 함수
 * @description 공통 응답 인터셉터 로직을 생성하여 중복을 제거
 * @param options 인터셉터 설정 옵션
 * @returns 응답 인터셉터 설정 객체
 */
export function createResponseInterceptor(options: InterceptorOptions = {}) {
  const {
    enableLogging = true,
    logPrefix = "API Response",
    isAuthClient = false,
  } = options;

  const clientType = isAuthClient ? "Auth" : "";

  return {
    onFulfilled: (response: AxiosResponse) => {
      // 응답 로깅 (개발 환경에서만)
      if (enableLogging && import.meta.env.DEV) {
        console.log(
          `✅ [${clientType} ${logPrefix}] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
        );
      }

      // ApiResponse<T> 형태인지 확인 후 처리
      const responseData = response.data;
      if (isApiResponse(responseData)) {
        // ApiResponse의 result가 ERROR인 경우 에러 throw
        if (isErrorResponse(responseData)) {
          throw new ApiError(
            `API 요청 실패: ${responseData.message}`,
            response.status,
            responseData,
          );
        }

        // SUCCESS인 경우 그대로 반환 (extractApiData는 개별 API에서 처리)
        return response;
      }

      // ApiResponse가 아닌 일반 응답 (pokemon API 등)은 그대로 반환
      return response;
    },
    onRejected: (error: unknown) => {
      // 에러 로깅
      console.error(`❌ [${clientType} ${logPrefix} Error]`, error);

      // Axios 에러인지 확인
      if (isAxiosError(error)) {
        const { response, request } = error;

        if (response) {
          // 인증 클라이언트에서 401 에러 처리
          if (isAuthClient && response.status === 401) {
            console.warn("🔓 인증이 필요합니다. 로그인을 확인해주세요.");

            // 필요시 토큰 갱신 로직을 여기에 추가
            // await refreshToken();
            // return client(error.config);
          }

          // 서버가 응답했지만 2xx 범위를 벗어난 상태 코드
          const message = `API 요청 실패: ${response.status} ${response.statusText}`;
          throw new ApiError(message, response.status, response.data, error);
        } else if (request) {
          // 요청이 전송되었지만 응답을 받지 못함
          throw new ApiError(
            "API 서버에 연결할 수 없습니다",
            undefined,
            undefined,
            error,
          );
        } else {
          // 요청 설정 중 에러 발생
          throw new ApiError(
            `API 요청 설정 에러: ${error.message}`,
            undefined,
            undefined,
            error,
          );
        }
      }

      // 기타 에러
      throw new ApiError(
        "알 수 없는 에러가 발생했습니다",
        undefined,
        undefined,
        error,
      );
    },
  };
}

/**
 * Axios 인스턴스에 공통 인터셉터를 적용하는 함수
 * @description 생성된 인터셉터를 Axios 인스턴스에 등록
 * @param client Axios 인스턴스
 * @param options 인터셉터 설정 옵션
 * @returns 인터셉터가 적용된 Axios 인스턴스
 */
export function applyInterceptors(
  client: AxiosInstance,
  options: InterceptorOptions = {},
): AxiosInstance {
  const requestInterceptor = createRequestInterceptor(options);
  const responseInterceptor = createResponseInterceptor(options);

  // 요청 인터셉터 적용
  client.interceptors.request.use(
    requestInterceptor.onFulfilled,
    requestInterceptor.onRejected,
  );

  // 응답 인터셉터 적용
  client.interceptors.response.use(
    responseInterceptor.onFulfilled,
    responseInterceptor.onRejected,
  );

  return client;
}

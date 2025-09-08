import type { AxiosInstance } from "axios";
import axios from "axios";
import { applyInterceptors } from "./interceptors";

// 공통 API 에러 클래스
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiBaseUrl = "https://iroomclass.com/api";

// 통합 API 클라이언트 생성
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    // 기본 baseURL은 백엔드 서버로 설정 (학생 정보 기반 API)
    baseURL: apiBaseUrl,
    timeout: 10000, // 10초 타임아웃
    withCredentials: false, // JWT 없음, 쿠키 불필요
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // 공통 인터셉터 적용
  return applyInterceptors(client, {
    isAuthClient: true, // 기본적으로 백엔드 API용으로 설정
    enableLogging: true,
    logPrefix: "API Request",
  });
};

// API 클라이언트 싱글톤
export const apiClient = createApiClient();

// 하위 호환성을 위한 별칭들 (기존 코드가 점진적으로 이주할 수 있도록)
export const baseApiClient = apiClient;
export const authApiClient = apiClient;

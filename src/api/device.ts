import { createServerFn } from "@tanstack/react-start";
import { getHeader } from "@tanstack/react-start/server";

/**
 * 디바이스 정보 타입 정의
 * @description PC 디바이스 여부를 나타내는 정보
 */
type DeviceInfo = {
  /** PC 디바이스 여부 (최대 너비 제한용) */
  isPC: boolean;
};

/**
 * User Agent 기반 PC 디바이스 감지 함수
 * @description 모바일/태블릿 패턴과 매칭하지 않으면 PC로 판단
 * @param userAgent - User Agent 문자열
 * @returns PC 여부 (데스크톱 브라우저)
 */
const detectPCFromUserAgent = (userAgent: string): boolean => {
  // 모바일/태블릿 패턴 (이것들이 아니면 PC)
  const mobileTabletPattern =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet/i;

  // 모바일이나 태블릿이 아니면 PC
  return !mobileTabletPattern.test(userAgent);
};

/**
 * 서버에서 디바이스 정보 감지하는 서버 함수
 * @description SSR 시점부터 올바른 디바이스 정보 제공
 *
 * 장점:
 * - Hydration mismatch 완전 해결
 * - 레이아웃 시프트(CLS) 방지
 * - SSR과 클라이언트 간 일관성 보장
 * - 성능 향상 (클라이언트 계산 불필요)
 *
 * @returns DeviceInfo 객체 (isPC 포함)
 */
export const detectDevice = createServerFn({ method: "GET" }).handler(
  (): DeviceInfo => {
    // 서버에서 User-Agent 헤더 읽기
    const userAgent = getHeader("User-Agent");

    // User Agent가 없으면 기본값 false (안전한 기본값)
    const isPC = userAgent ? detectPCFromUserAgent(userAgent) : false;

    return { isPC };
  },
);

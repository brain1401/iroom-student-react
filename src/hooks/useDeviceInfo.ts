import { useRouteContext } from "@tanstack/react-router";

/**
 * 디바이스 정보 편의 훅
 * @description 루트 컨텍스트에서 디바이스 정보를 편리하게 가져오는 커스텀 훅
 *
 * 장점:
 * - 간단한 API로 디바이스 정보 접근
 * - 타입 안전성 보장
 * - 중앙집중화된 디바이스 정보 관리
 * - 서버에서 미리 감지된 안정적인 데이터 사용
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { isPC } = useDeviceInfo();
 *   return <div className={isPC ? "max-w-6xl mx-auto" : ""}>...</div>;
 * }
 * ```
 *
 * @returns 디바이스 정보 객체 (isPC 포함)
 */
export function useDeviceInfo() {
  const { deviceInfo } = useRouteContext({ from: "__root__" });
  return deviceInfo;
}

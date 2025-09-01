import { atom } from "jotai";

/**
 * 테마별 배경 클래스 설정 타입
 * @description light/dark 테마에 따른 배경 클래스를 구분하여 관리
 */
export type ThemeBgClassConfig = {
  /** Light 테마 배경 클래스 */
  light: string;
  /** Dark 테마 배경 클래스 */
  dark: string;
};

// 메인 배경 추가 클래스 설정 (light/dark 테마별)
/**
 * 메인 배경 추가 클래스 설정을 관리하는 atom
 * @description 테마별로 다른 배경 스타일을 적용할 수 있는 추가 클래스 관리
 *
 * 사용 목적:
 * - 동적 배경 스타일 변경 (그라디언트, 패턴 등)
 * - 테마별 차별화된 배경 효과
 * - 사용자 맞춤 배경 설정
 *
 * 사용 패턴:
 * ```typescript
 * // 📌 배경 설정 변경 - useAtom 사용
 * const [bgConfig, setBgConfig] = useAtom(mainBgExtraClassAtom);
 *
 * // 📌 그라디언트 배경 적용
 * setBgConfig({
 *   light: "bg-gradient-to-br from-blue-50 to-white",
 *   dark: "bg-gradient-to-br from-gray-900 to-black"
 * });
 *
 * // 📌 단색 배경으로 리셋
 * setBgConfig({ light: "", dark: "" });
 * ```
 */
export const mainBgExtraClassAtom = atom<ThemeBgClassConfig>({
  light: "",
  dark: "",
});

// 메인 배경 추가 클래스 조합 (light/dark 자동 적용)
/**
 * 테마별 배경 클래스를 자동 조합하는 derived atom
 * @description mainBgExtraClassAtom의 light/dark 설정을 Tailwind 문법에 맞게 자동 조합
 *
 * 조합 로직:
 * - light만 있는 경우: "bg-blue-100"
 * - dark만 있는 경우: "dark:bg-gray-900"
 * - 둘 다 있는 경우: "bg-blue-100 dark:bg-gray-900"
 * - 둘 다 없는 경우: "" (빈 문자열)
 *
 * 장점:
 * - 수동으로 dark: prefix 추가할 필요 없음
 * - Tailwind CSS 문법 자동 준수
 * - 컴포넌트에서 바로 className에 적용 가능
 *
 * 사용 패턴:
 * ```typescript
 * // 📌 값만 읽기 - useAtomValue 사용
 * const combinedBgClass = useAtomValue(mainBgExtraCombinedClassAtom);
 *
 * // 📌 컴포넌트에서 직접 적용
 * <div className={cn("base-styles", combinedBgClass)}>
 *   메인 콘텐츠
 * </div>
 * ```
 */
export const mainBgExtraCombinedClassAtom = atom((get) => {
  const cfg = get(mainBgExtraClassAtom);
  const light = cfg.light.trim() || "";
  const dark = cfg.dark.trim() || "";

  // light/dark 클래스를 조합
  if (!light && !dark) return "";
  if (light && !dark) return light;
  if (!light && dark) return `dark:${dark}`;
  return `${light} ${dark ? `dark:${dark}` : ""}`.trim();
});

/**
 * 사용자 표시 정보 타입
 * @description 헤더에 표시되는 사용자 이름과 배지 라벨 값
 */
export type UserDisplayInfo = {
  /** 사용자 표시 이름 텍스트 */
  name: string;
  /** 사용자 반/그룹 배지 라벨 텍스트 */
  badgeLabel: string;
};

/**
 * 사용자 표시 정보 atom
 * @description 전역 헤더에서 읽어오는 사용자 이름/배지 상태
 */
/**
 * 사용자 표시 정보를 관리하는 atom
 * @description 전역 헤더 및 UI에서 사용되는 사용자 이름과 배지 정보 관리
 *
 * 기본값 설명:
 * - name: "김체리" (테스트/데모용 기본값)
 * - badgeLabel: "중등 B반" (학급/그룹 표시용)
 *
 * 연동 시점:
 * - 로그인 시: auth atoms에서 실제 사용자 정보로 업데이트
 * - 로그아웃 시: 기본값으로 리셋
 * - 학급 변경 시: badgeLabel 동적 업데이트
 *
 * 사용 패턴:
 * ```typescript
 * // 📌 값만 읽기 (헤더 표시용) - useAtomValue 사용
 * const userInfo = useAtomValue(userDisplayInfoAtom);
 *
 * // 📌 사용자 정보 업데이트 - useSetAtom 사용
 * const setUserInfo = useSetAtom(userDisplayInfoAtom);
 * setUserInfo({ name: "박학생", badgeLabel: "고등 A반" });
 *
 * // 📌 배지만 변경
 * setUserInfo(prev => ({ ...prev, badgeLabel: "중등 C반" }));
 * ```
 *
 * @example
 * ```typescript
 * // 로그인 성공 시 사용자 정보 설정
 * const loginSuccess = (studentData) => {
 *   setUserInfo({
 *     name: studentData.name,
 *     badgeLabel: `${studentData.grade} ${studentData.class}반`
 *   });
 * };
 * ```
 */
/**
 * 사용자 표시 정보를 관리하는 atom
 * @description 전역 헤더 및 UI에서 사용되는 사용자 이름과 배지 정보 관리
 *
 * 환경 변수 기본값:
 * - name: VITE_DEFAULT_USER_NAME 또는 "김체리" (테스트/데모용 기본값)
 * - badgeLabel: VITE_DEFAULT_USER_BADGE 또는 "중등 B반" (학급/그룹 표시용)
 *
 * 연동 시점:
 * - 로그인 시: auth atoms에서 실제 사용자 정보로 업데이트
 * - 로그아웃 시: 환경 변수 기본값으로 리셋
 * - 학급 변경 시: badgeLabel 동적 업데이트
 *
 * 사용 패턴:
 * ```typescript
 * // 📌 값만 읽기 (헤더 표시용) - useAtomValue 사용
 * const userInfo = useAtomValue(userDisplayInfoAtom);
 *
 * // 📌 사용자 정보 업데이트 - useSetAtom 사용
 * const setUserInfo = useSetAtom(userDisplayInfoAtom);
 * setUserInfo({ name: "박학생", badgeLabel: "고등 A반" });
 *
 * // 📌 배지만 변경
 * setUserInfo(prev => ({ ...prev, badgeLabel: "중등 C반" }));
 * ```
 *
 * @example
 * ```typescript
 * // 로그인 성공 시 사용자 정보 설정
 * const loginSuccess = (studentData) => {
 *   setUserInfo({
 *     name: studentData.name,
 *     badgeLabel: `${studentData.grade} ${studentData.class}반`
 *   });
 * };
 * ```
 */
export const userDisplayInfoAtom = atom<UserDisplayInfo>({
  name: import.meta.env.VITE_DEFAULT_USER_NAME || "김체리",
  badgeLabel: import.meta.env.VITE_DEFAULT_USER_BADGE || "중등 B반",
});

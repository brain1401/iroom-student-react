import { atom } from "jotai";

export type ThemeBgClassConfig = {
  light: string;
  dark: string;
};

// 메인 배경 추가 클래스 설정 (light/dark 테마별)
export const mainBgExtraClassAtom = atom<ThemeBgClassConfig>({
  light: "",
  dark: "",
});

// 메인 배경 추가 클래스 조합 (light/dark 자동 적용)
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
export const userDisplayInfoAtom = atom<UserDisplayInfo>({
  name: "김체리",
  badgeLabel: "중등 B반",
});

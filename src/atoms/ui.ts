import { atom } from "jotai";

export type ThemeBgClassConfig = {
  onLight: string;
  onDark: string;
};

// 메인 배경 추가 클래스 설정 (light/dark 테마별)
export const mainExtraClassAtom = atom<ThemeBgClassConfig>({
  onLight: "",
  onDark: "",
});

// 메인 배경 추가 클래스 조합 (light/dark 자동 적용)
export const mainExtraCombinedClassAtom = atom((get) => {
  const cfg = get(mainExtraClassAtom);
  const lightClasses = cfg.onLight.trim() || "";
  const darkClasses = cfg.onDark.trim() || "";

  // light/dark 클래스를 조합
  if (!lightClasses && !darkClasses) return "";
  if (lightClasses && !darkClasses) return lightClasses;
  if (!lightClasses && darkClasses) return `dark:${darkClasses}`;
  return `${lightClasses} ${darkClasses ? `dark:${darkClasses}` : ""}`.trim();
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

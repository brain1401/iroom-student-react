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

import * as React from "react";
import { cn } from "@/lib/utils";

type LatexProps = {
  /** 수식 원본 문자열 (LaTeX) */
  source: string;
  /** 블록/인라인 모드 */
  displayMode?: "block" | "inline";
  /** 추가 클래스명 */
  className?: string;
};

/**
 * LaTeX 수식 렌더러
 * @description latex.js 웹 컴포넌트를 이용한 수식 렌더링 래퍼
 *
 * 구성 요소:
 * - SSR 환경 호환: 커스텀 엘리먼트 지연 업그레이드
 * - baseURL 설정: CDN 자원 로딩 경로 지정
 *
 * @example
 * ```tsx
 * <Latex source={"3x^2 + 14x - 24"} />
 * <Latex source={"E = mc^2"} displayMode="inline" />
 * ```
 */
export function Latex({
  source,
  displayMode = "block",
  className,
}: LatexProps) {
  const documentBody = React.useMemo(() => {
    const wrapped =
      displayMode === "block" ? `\\[${source}\\]` : `\\(${source}\\)`;
    return [
      "\\documentclass{article}",
      "\\usepackage{amsmath}",
      "\\begin{document}",
      wrapped,
      "\\end{document}",
    ].join("\n");
  }, [source, displayMode]);

  const Wrapper = displayMode === "inline" ? "span" : "div";

  return (
    <Wrapper className={cn(className)}>
      {/* latex.js 웹 컴포넌트 */}
      {/* baseURL: CDN 자원 경로 지정 */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      {React.createElement(
        "latex-js" as any,
        { baseURL: "https://cdn.jsdelivr.net/npm/latex.js/dist/" },
        documentBody,
      )}
    </Wrapper>
  );
}

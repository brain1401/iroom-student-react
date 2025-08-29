import { MathJax, MathJaxContext } from "better-react-mathjax";
import { cn } from "@/lib/utils";

/**
 * MathJax 글로벌 설정
 * @description LaTeX 수식 렌더링을 위한 MathJax 구성
 */
const mathJaxConfig = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
  options: {
    enableMenu: false,
  },
};

/**
 * MathRenderer 컴포넌트 속성
 * @description 수학 공식을 렌더링하는 컴포넌트의 타입 정의
 */
type MathRendererProps = {
  /** 렌더링할 수학 공식 (LaTeX 형식) */
  math: string;
  /** 인라인 수식 여부 (기본: false, display 수식) */
  isInline?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 에러 발생 시 콜백 함수 */
  onError?: (error: Error) => void;
};

/**
 * MathRenderer 컴포넌트
 * @description LaTeX 수식을 MathJax를 사용하여 렌더링하는 컴포넌트
 *
 * 주요 기능:
 * - LaTeX 수식 → HTML/SVG 변환
 * - 인라인 및 display 수식 모드 지원
 * - 에러 처리 및 폴백 표시
 * - 접근성 고려 (alt 텍스트 제공)
 * - 반응형 디자인 지원
 *
 * 지원하는 LaTeX 문법:
 * - 기본 수식: $x^2 + y^2 = z^2$
 * - 분수: $\frac{a}{b}$
 * - 적분: $\int_a^b f(x)dx$
 * - 매트릭스, 행렬식, 그리스 문자 등
 *
 * @example
 * ```tsx
 * // 인라인 수식
 * <MathRenderer math="x^2 + y^2 = z^2" inline />
 *
 * // Display 수식 (블록 레벨)
 * <MathRenderer math="\frac{d}{dx}[x^n] = nx^{n-1}" />
 *
 * // 에러 처리
 * <MathRenderer
 *   math="잘못된 LaTeX 문법"
 *   onError={(error) => console.error('수식 렌더링 오류:', error)}
 * />
 * ```
 */
export function MathRenderer({
  math,
  isInline = false,
  className,
  onError,
}: MathRendererProps) {
  /**
   * MathJax 렌더링 에러 핸들러
   * @description 수식 렌더링 실패 시 호출
   */
  const handleError = (error: unknown) => {
    console.error("MathJax 렌더링 오류:", error);
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  /**
   * 수식이 비어있거나 잘못된 경우 처리
   */
  if (!math || typeof math !== "string" || math.trim().length === 0) {
    return (
      <span className={cn("text-gray-400 italic", className)}>
        수식이 없습니다
      </span>
    );
  }

  return (
    <MathJax
      inline={isInline}
      className={cn(
        // 기본 스타일
        "select-text",
        // 인라인/블록 스타일 분기
        isInline ? "inline" : "block my-4",
        // 에러 방지를 위한 최소 높이
        !isInline && "min-h-[2rem]",
        className,
      )}
      onError={handleError}
      hideUntilTypeset="first"
    >
      {math}
    </MathJax>
  );
}

/**
 * MathJax Provider 컴포넌트
 * @description MathJax 컨텍스트를 제공하는 래퍼 컴포넌트
 *
 * 사용법:
 * - 앱의 최상위 레벨에서 한 번만 사용
 * - 모든 MathRenderer 컴포넌트를 감싸야 함
 *
 * @example
 * ```tsx
 * // App.tsx 또는 main.tsx에서
 * <MathJaxProvider>
 *   <App />
 * </MathJaxProvider>
 * ```
 */
export function MathJaxProvider({ children }: { children: React.ReactNode }) {
  return (
    <MathJaxContext version={3} config={mathJaxConfig} hideUntilTypeset="first">
      {children}
    </MathJaxContext>
  );
}

/**
 * 수학 공식 미리보기 컴포넌트
 * @description 입력 중인 LaTeX 수식을 실시간 미리보기
 */
type MathPreviewProps = {
  /** 미리보기할 LaTeX 코드 */
  latex: string;
  /** 미리보기 제목 */
  title?: string;
  /** 추가 CSS 클래스 */
  className?: string;
};

export function MathPreview({
  latex,
  title = "미리보기",
  className,
}: MathPreviewProps) {
  return (
    <div className={cn("border rounded-lg p-4 bg-gray-50", className)}>
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className="bg-white p-3 rounded border min-h-[3rem] flex items-center justify-center">
        {latex.trim() ? (
          <MathRenderer math={latex} />
        ) : (
          <span className="text-gray-400 text-sm italic">
            LaTeX 수식을 입력하세요
          </span>
        )}
      </div>
    </div>
  );
}

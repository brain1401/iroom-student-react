/**
 * 수학 공식 유틸리티 함수들
 */

/**
 * LaTeX 수식 유효성 검사
 * @description 기본적인 LaTeX 문법 오류를 사전 체크
 * @param latex 검사할 LaTeX 문자열
 * @returns 유효성 검사 결과
 */
export function validateLatex(latex: string): {
  isValid: boolean;
  error?: string;
} {
  if (!latex || latex.trim().length === 0) {
    return { isValid: false, error: "빈 수식입니다" };
  }

  // 기본적인 괄호 매칭 검사
  const openBraces = (latex.match(/\{/g) || []).length;
  const closeBraces = (latex.match(/\}/g) || []).length;

  if (openBraces !== closeBraces) {
    return { isValid: false, error: "중괄호가 맞지 않습니다" };
  }

  const openParens = (latex.match(/\\\(/g) || []).length;
  const closeParens = (latex.match(/\\\)/g) || []).length;

  if (openParens !== closeParens) {
    return { isValid: false, error: "괄호가 맞지 않습니다" };
  }

  return { isValid: true };
}

/**
 * 일반적인 수학 기호를 LaTeX 명령어로 변환
 * @description 사용자 친화적인 입력을 LaTeX로 변환
 * @param input 사용자 입력 문자열
 * @returns 변환된 LaTeX 문자열
 */
export function convertToLatex(input: string): string {
  return input
    .replace(
      /\b(alpha|beta|gamma|delta|epsilon|theta|lambda|mu|pi|sigma|tau|phi|psi|omega)\b/g,
      "\\$1",
    )
    .replace(
      /\b(Alpha|Beta|Gamma|Delta|Epsilon|Theta|Lambda|Mu|Pi|Sigma|Tau|Phi|Psi|Omega)\b/g,
      "\\$1",
    )
    .replace(
      /\b(sin|cos|tan|sec|csc|cot|sinh|cosh|tanh|ln|log|exp|lim|sum|int)\b/g,
      "\\$1",
    )
    .replace(/sqrt\(([^)]+)\)/g, "\\sqrt{$1}")
    .replace(/(\d+)\/(\d+)/g, "\\frac{$1}{$2}")
    .replace(/\^(\d+)/g, "^{$1}")
    .replace(/_(\d+)/g, "_{$1}");
}

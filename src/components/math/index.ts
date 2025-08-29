/**
 * 수학 문제 시스템 컴포넌트 모음
 * @description 수학 문제 표시, 입력, 렌더링을 위한 컴포넌트들
 *
 * 컴포넌트 구조:
 * - MathRenderer: LaTeX 수식 렌더링
 * - QuestionRenderer: 문제 타입별 분기 렌더링
 * - SubjectiveQuestion: 주관식 문제 (텍스트 입력)
 * - MultipleChoiceQuestion: 객관식 문제 (선택지)
 */

// MathJax 렌더링 관련
export { MathRenderer, MathJaxProvider, MathPreview } from "./MathRenderer";

// 문제 렌더링 관련
export { QuestionRenderer, QuestionPreview } from "./QuestionRenderer";

// 주관식 문제 관련
export { SubjectiveQuestionCard, LatexHelper } from "./SubjectiveQuestion";

// 객관식 문제 관련
export {
  MultipleChoiceQuestionCard,
  OptionStats,
} from "./MultipleChoiceQuestion";

// 타입 재export (편의용)
export type {
  MathQuestion,
  QuestionType,
  SubjectiveQuestion,
  MultipleChoiceQuestion,
  QuestionOption,
} from "@/api/common/types";

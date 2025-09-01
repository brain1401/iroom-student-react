/**
 * 공통 컴포넌트 타입 정의
 * @description exam과 student 영역에서 공통으로 사용하는 타입들
 */

/**
 * 문제 상태 타입
 * @description 시험 문제의 진행 상태를 나타내는 타입
 */
export type ProblemStatus = "active" | "completed" | "locked";

/**
 * 수학 문제 카드 상태 타입
 * @description MathQuestionCard 컴포넌트에서 사용하는 상태 타입
 */
export type MathQuestionCardState =
  | "idle" // 초기 상태 - 사진 촬영 대기
  | "loading" // 로딩 중 - 분석 또는 업로드 진행
  | "completed" // 완료 - 답안 표시
  | "error"; // 오류 - 재촬영 필요

/**
 * 수학 문제 데이터 타입
 * @description 수학 문제 카드에서 사용하는 문제 데이터 구조
 */
export type MathQuestion = {
  /** 문제 고유 ID */
  id: string;

  /** 문제 번호 */
  number: number;

  /** 수학 문제 답안 (LaTeX 또는 일반 텍스트) */
  answer?: string;

  /** 문제 상태 */
  state: MathQuestionCardState;

  /** 문제 이미지 URL (선택적) */
  imageUrl?: string;

  /** 생성 시간 */
  createdAt?: Date;

  /** 마지막 수정 시간 */
  updatedAt?: Date;
};

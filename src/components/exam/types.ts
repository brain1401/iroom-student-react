/**
 * 시험 문제 상태 타입
 * @description 시험 문제의 진행 상태를 나타내는 타입
 */
export type ProblemStatus = "completed" | "active" | "locked";

/**
 * 수학 문제 카드 상태 타입
 * @description 수학 문제 카드의 현재 상태를 나타내는 타입
 */
export type MathQuestionCardState =
  | "idle"
  | "loading"
  | "captured"
  | "processing"
  | "completed"
  | "error"
  | "empty";

/**
 * 수학 문제 타입
 * @description 수학 문제의 기본 정보를 담는 타입
 */
export type MathQuestion = {
  /** 문제 고유 ID */
  id: string;
  /** 문제 번호 */
  questionNumber: number;
  /** 문제 번호 (number 형태) */
  number?: number;
  /** 문제 답안 */
  answer?: string;
  /** 문제 상태 */
  state: MathQuestionCardState;
  /** 생성 날짜 */
  createdAt?: Date;
};

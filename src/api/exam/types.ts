/**
 * 모의고사 정보를 나타내는 타입
 */
export type MockExam = {
  /** 모의고사 고유 ID */
  id: string;
  /** 모의고사 제목 */
  title: string;
  /** 모의고사 설명 */
  description: string;
  /** 문제 목록 */
  problems: Problem[];
  /** 생성 일시 (ISO 8601 형식) */
  createdAt: string;
  /** 수정 일시 (ISO 8601 형식) */
  updatedAt: string;
};

/**
 * 문제 정보를 나타내는 타입
 */
export type Problem = {
  /** 문제 고유 ID */
  id: string;
  /** 문제 제목 */
  title: string;
  /** 문제 설명 또는 내용 */
  description: string;
  /** 정답 */
  answer: string;
  /** 사용자가 제출한 답안 (선택적) */
  submittedAnswer?: string;
  /** 생성 일시 (ISO 8601 형식) */
  createdAt: string;
  /** 수정 일시 (ISO 8601 형식) */
  updatedAt: string;
  /** 이 문제가 속한 모의고사 ID */
  examId: string;
};

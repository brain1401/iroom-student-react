/**
 * 백엔드 API 공통 타입 정의
 * @description 백엔드 ApiResponse와 정확히 일치하는 프론트엔드 타입들
 */

/**
 * API 응답 결과 상태 값
 * @description 백엔드 ResultStatus enum과 정확히 일치
 */
export type ResultStatus = "SUCCESS" | "ERROR";

/**
 * 표준 API 응답 래퍼 타입
 * @description 백엔드 ApiResponse<T> record와 정확히 일치하는 구조
 *
 * 백엔드 구조:
 * ```java
 * public record ApiResponse<T>(
 *     ResultStatus result,    // 응답 결과 (필수)
 *     String message,         // 응답 메시지 (필수, null 불가)
 *     T data                  // 응답 데이터
 * )
 * ```
 */
export type ApiResponse<T = unknown> = {
  /**
   * 응답 결과 상태
   * @description SUCCESS: 요청 성공, ERROR: 요청 오류
   */
  result: ResultStatus;

  /**
   * 응답 메시지
   * @description 백엔드에서 필수 값으로 보장 (null 불가)
   */
  message: string;

  /**
   * 응답 데이터
   * @description 성공 시에는 실제 데이터, 실패 시에는 null
   */
  data: T;
};

/**
 * 성공 응답 타입 가드 함수
 * @description API 응답이 성공인지 타입 안전하게 확인
 * @param response API 응답 객체
 * @returns 성공 여부
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>,
): response is ApiResponse<T> & { result: "SUCCESS" } {
  return response.result === "SUCCESS";
}

/**
 * 실패 응답 타입 가드 함수
 * @description API 응답이 실패인지 타입 안전하게 확인
 * @param response API 응답 객체
 * @returns 실패 여부
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>,
): response is ApiResponse<T> & { result: "ERROR" } {
  return response.result === "ERROR";
}

/**
 * API 응답에서 데이터 추출 유틸리티
 * @description 성공 응답인 경우 데이터 반환, 실패 시 에러 throw
 * @param response API 응답 객체
 * @returns 응답 데이터
 * @throws {Error} 응답이 실패인 경우
 */
export function extractApiData<T>(response: ApiResponse<T>): T {
  if (isSuccessResponse(response)) {
    return response.data;
  }

  throw new Error(`API 요청 실패: ${response.message}`);
}

/**
 * 헬스체크 API 전용 타입들
 * @description 기존 health-check 타입과의 호환성을 위한 별칭
 */

/**
 * 헬스체크 서비스 상태 정보
 * @description 개별 서비스(database, application, aiServer 등)의 상태 정보
 */
export type ServiceHealthInfo = {
  /** 서비스 상태 */
  status: "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";
  /** 서비스 상태 메시지 */
  message: string;
  /** 서비스 응답 시간 (밀리초) */
  responseTimeMs: number;
};

/**
 * 헬스체크 응답 데이터 구조
 * @description 백엔드 헬스체크 API에서 반환하는 data 필드의 구조
 */
export type HealthCheckData = {
  /** 서버 상태 (Spring Boot Actuator 형식) */
  status: "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";
  /** 응답 시간 */
  timestamp: string;
  /** 전체 상태 메시지 */
  message: string;
  /** 각 서비스별 상세 상태 정보 */
  services: {
    /** 데이터베이스 서비스 상태 */
    database: ServiceHealthInfo;
    /** Spring Boot 애플리케이션 상태 */
    application: ServiceHealthInfo;
    /** AI 서버 상태 */
    aiServer: ServiceHealthInfo;
  };
};

/**
 * 헬스체크 API 응답 타입
 * @description 백엔드 헬스체크 API의 완전한 응답 구조
 */
export type HealthCheckApiResponse = ApiResponse<HealthCheckData>;

/**
 * 모의고사 API 전용 타입들
 * @description exam API에서 사용할 백엔드 응답 타입들
 */

/**
 * 모의고사 정보 타입
 * @description 기존 exam/types.ts의 MockExam과 동일하지만 백엔드 응답 래퍼 적용
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
 * 문제 정보 타입
 * @description 기존 exam/types.ts의 Problem과 동일하지만 백엔드 응답 래퍼 적용
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

/**
 * 모의고사 목록 API 응답 타입
 */
export type MockExamListApiResponse = ApiResponse<MockExam[]>;

/**
 * 개별 모의고사 API 응답 타입
 */
export type MockExamApiResponse = ApiResponse<MockExam>;

/**
 * 모의고사 ID 목록 API 응답 타입
 */
export type MockExamIdsApiResponse = ApiResponse<string[]>;

/**
 * 수학 문제 시스템 전용 타입들
 * @description 주관식/객관식 수학 문제를 위한 확장된 타입 시스템
 */

/**
 * 수학 문제 타입 분류
 * @description 수학 문제의 유형을 구분하는 타입
 */
export type QuestionType = "subjective" | "multiple_choice";

/**
 * 객관식 문제 선택지 타입
 * @description 객관식 문제에서 사용하는 선택지 구조
 */
export type QuestionOption = {
  /** 선택지 고유 ID */
  id: string;
  /** 선택지 라벨 (예: "1", "2", "3", "4", "5") */
  label: string;
  /** 선택지 내용 (LaTeX 수식 포함 가능: $$x^2 + y^2 = z^2$$) */
  text: string;
  /** 정답 여부 (백엔드 전용, 프론트엔드에서는 보통 제외) */
  isCorrect?: boolean;
};

/**
 * 기본 문제 공통 속성
 * @description 모든 수학 문제가 공통으로 가지는 속성들
 */
export type BaseMathQuestion = {
  /** 문제 고유 ID */
  id: string;
  /** 문제 제목 */
  title: string;
  /** 문제 설명 또는 내용 (LaTeX 수식 포함 가능: $$\frac{a}{b} = c$$) */
  description: string;
  /** 문제 타입 (주관식 또는 객관식) */
  type: QuestionType;
  /** 문제 배점 */
  points: number;
  /** 생성 일시 (ISO 8601 형식) */
  createdAt: string;
  /** 수정 일시 (ISO 8601 형식) */
  updatedAt: string;
  /** 이 문제가 속한 모의고사 ID */
  examId: string;
};

/**
 * 주관식 문제 타입
 * @description 서술형 답안을 요구하는 수학 문제
 */
export type SubjectiveQuestion = BaseMathQuestion & {
  /** 문제 타입: 주관식 */
  type: "subjective";
  /** 정답 (LaTeX 형식 가능: x = 3y + 2) */
  answer: string;
  /** 사용자가 제출한 답안 (선택적) */
  submittedAnswer?: string;
  /** 답안 형식 가이드 (선택적) */
  answerFormat?: "text" | "latex" | "number";
};

/**
 * 객관식 문제 타입
 * @description 선택지 중 하나를 고르는 수학 문제
 */
export type MultipleChoiceQuestion = BaseMathQuestion & {
  /** 문제 타입: 객관식 */
  type: "multiple_choice";
  /** 선택지 목록 */
  options: QuestionOption[];
  /** 정답 선택지 ID */
  correctOptionId: string;
  /** 사용자가 선택한 답안 (선택적) */
  submittedOptionId?: string;
};

/**
 * 수학 문제 통합 타입
 * @description 주관식 또는 객관식 문제를 나타내는 유니온 타입
 */
export type MathQuestion = SubjectiveQuestion | MultipleChoiceQuestion;

/**
 * 주관식 문제 타입 가드 함수
 * @description 문제가 주관식인지 타입 안전하게 확인
 * @param question 확인할 문제 객체
 * @returns 주관식 여부
 */
export function isSubjectiveQuestion(
  question: MathQuestion,
): question is SubjectiveQuestion {
  return question.type === "subjective";
}

/**
 * 객관식 문제 타입 가드 함수
 * @description 문제가 객관식인지 타입 안전하게 확인
 * @param question 확인할 문제 객체
 * @returns 객관식 여부
 */
export function isMultipleChoiceQuestion(
  question: MathQuestion,
): question is MultipleChoiceQuestion {
  return question.type === "multiple_choice";
}

/**
 * 답안 제출 요청 타입
 * @description 수학 문제 답안을 서버에 제출할 때 사용하는 타입
 */
export type SubmitAnswerRequest = {
  /** 시험 ID */
  examId: string;
  /** 문제 ID */
  questionId: string;
  /** 답안 내용 (주관식: 텍스트, 객관식: 선택지 ID) */
  answer: string;
  /** 임시저장 여부 (기본: false) */
  isTemporary?: boolean;
};

/**
 * 답안 제출 응답 타입
 * @description 답안 제출 결과를 나타내는 타입
 */
export type SubmitAnswerResponse = {
  /** 제출 성공 여부 */
  success: boolean;
  /** 제출된 답안 ID */
  submissionId: string;
  /** 제출 시간 */
  submittedAt: string;
};

/**
 * 시험 결과 정보 타입
 * @description 시험 완료 후 결과 정보
 */
export type ExamResult = {
  /** 시험 ID */
  examId: string;
  /** 총점 */
  totalScore: number;
  /** 만점 */
  maxScore: number;
  /** 정답 개수 */
  correctCount: number;
  /** 전체 문제 개수 */
  totalCount: number;
  /** 시험 완료 시간 */
  completedAt: string;
  /** 소요 시간 (분) */
  duration: number;
  /** 문제별 상세 결과 */
  questionResults: QuestionResult[];
};

/**
 * 문제별 결과 타입
 * @description 개별 문제의 채점 결과
 */
export type QuestionResult = {
  /** 문제 ID */
  questionId: string;
  /** 사용자 답안 */
  userAnswer: string;
  /** 정답 */
  correctAnswer: string;
  /** 정답 여부 */
  isCorrect: boolean;
  /** 획득 점수 */
  earnedPoints: number;
  /** 문제 배점 */
  maxPoints: number;
};

/**
 * 수학 문제 시스템 API 응답 타입들
 * @description 확장된 수학 문제 시스템을 위한 API 응답 타입들
 */
export type SubmitAnswerApiResponse = ApiResponse<SubmitAnswerResponse>;
export type ExamResultApiResponse = ApiResponse<ExamResult>;
export type MathQuestionListApiResponse = ApiResponse<MathQuestion[]>;
export type MathQuestionApiResponse = ApiResponse<MathQuestion>;

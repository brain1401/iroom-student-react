/**
 * 수학 문제 시스템 전용 타입 정의
 * @description 컴포넌트에서 사용하는 로컬 타입들
 */

/**
 * 문제 상태 타입
 * @description 개별 문제의 현재 상태를 나타냄
 */
export type QuestionState =
  | "idle" // 초기 상태 (답안 미입력)
  | "answered" // 답안 입력 완료
  | "skipped" // 건너뜀
  | "reviewing" // 검토 중
  | "submitted"; // 제출 완료

/**
 * 답안 입력 모드
 * @description 주관식 문제의 입력 방식
 */
export type AnswerInputMode =
  | "text" // 일반 텍스트 입력
  | "latex"; // LaTeX 수식 입력

/**
 * 문제 표시 설정
 * @description 문제 렌더링 옵션
 */
export type QuestionDisplayOptions = {
  /** 문제 번호 표시 여부 */
  showQuestionNumber?: boolean;
  /** 배점 표시 여부 */
  showPoints?: boolean;
  /** LaTeX 미리보기 표시 여부 */
  showLatexPreview?: boolean;
  /** 키보드 단축키 활성화 */
  enableKeyboardShortcuts?: boolean;
};

/**
 * 시험 진행 상태
 * @description 전체 시험의 진행 상황
 */
export type ExamProgressState = {
  /** 전체 문제 수 */
  totalQuestions: number;
  /** 현재 문제 번호 (1부터 시작) */
  currentQuestion: number;
  /** 진행률 (0-100) */
  progress: number;
  /** 답안 작성 완료 문제 수 */
  answeredCount: number;
  /** 시험 완료 여부 */
  isCompleted: boolean;
};

/**
 * 네비게이션 상태
 * @description 문제 간 이동 관련 상태
 */
export type NavigationState = {
  /** 이전 문제로 이동 가능 여부 */
  canGoPrevious: boolean;
  /** 다음 문제로 이동 가능 여부 */
  canGoNext: boolean;
  /** 첫 번째 문제 여부 */
  isFirst: boolean;
  /** 마지막 문제 여부 */
  isLast: boolean;
};

/**
 * MathJax 렌더링 상태
 * @description MathJax 초기화 및 렌더링 진행 상태
 */
export type MathJaxRenderState = {
  /** MathJax 초기화 완료 여부 */
  isReady: boolean;
  /** 렌더링된 수식 개수 */
  renderCount: number;
  /** 렌더링 대기 중인 수식 개수 */
  pendingCount: number;
  /** 마지막 렌더링 시간 */
  lastRenderTime: Date | null;
};

/**
 * 시험 타이머 상태
 * @description 시험 시간 관리
 */
export type ExamTimerState = {
  /** 시작 시간 */
  startTime: Date | null;
  /** 종료 시간 */
  endTime: Date | null;
  /** 일시정지 여부 */
  isPaused: boolean;
  /** 남은 시간 (초) */
  remainingTime: number;
  /** 제한 시간 (초) */
  timeLimit: number;
};

/**
 * 자동저장 상태
 * @description 답안 자동저장 관리
 */
export type AutoSaveState = {
  /** 자동저장 활성화 여부 */
  isEnabled: boolean;
  /** 자동저장 간격 (밀리초) */
  interval: number;
  /** 저장되지 않은 변경사항 여부 */
  hasUnsavedChanges: boolean;
  /** 마지막 저장 시간 */
  lastSaveTime: Date | null;
};

/**
 * 컴포넌트 공통 props 타입들
 */

/**
 * 기본 문제 컴포넌트 props
 * @description 모든 문제 컴포넌트가 공통으로 가지는 props
 */
export type BaseQuestionProps = {
  /** 현재 답안 */
  currentAnswer?: string;
  /** 답안 변경 콜백 */
  onAnswerChange?: (answer: string) => void;
  /** 읽기 전용 모드 */
  readonly?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 미리보기 컴포넌트 props
 * @description 문제 미리보기 관련 공통 props
 */
export type PreviewComponentProps = {
  /** 문제 번호 */
  questionNumber?: number;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 문제 상태 */
  questionState?: QuestionState;
  /** 표시 옵션 */
  displayOptions?: QuestionDisplayOptions;
};

/**
 * 유효성 검사 결과
 * @description 입력값 검증 결과
 */
export type ValidationResult = {
  /** 유효성 여부 */
  isValid: boolean;
  /** 에러 메시지 */
  error?: string;
  /** 경고 메시지 */
  warning?: string;
};

/**
 * LaTeX 명령어 정보
 * @description LaTeX 입력 도우미에서 사용
 */
export type LatexCommand = {
  /** 표시 라벨 */
  label: string;
  /** LaTeX 코드 */
  latex: string;
  /** 설명 */
  description: string;
  /** 카테고리 */
  category?: "basic" | "fraction" | "symbol" | "function" | "greek";
};

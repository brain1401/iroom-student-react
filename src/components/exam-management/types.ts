/**
 * 시험 관리 컴포넌트 공통 타입 정의
 * @description 시험지 등록, 관리 등에서 사용하는 공통 타입들
 */

/**
 * 단원 선택 상태
 * @description 사용자가 선택한 단원들의 정보
 */
export type UnitSelection = {
  /** 선택된 단원 ID들 */
  selectedUnitIds: string[];
  /** 학년 정보 */
  grade: number;
  /** 총 선택된 단원 수 */
  totalSelectedUnits: number;
  /** 선택된 단원별 문제 수 */
  unitQuestionCounts: Record<string, number>;
};

/**
 * 시험지 등록 폼 데이터
 * @description 시험지 생성 시 필요한 모든 정보
 */
export type ExamSheetFormData = {
  /** 시험지 이름 */
  examName: string;
  /** 학년 */
  grade: number;
  /** 선택된 단원들 */
  unitSelection: UnitSelection;
  /** 문제 설정 */
  questionSettings: {
    /** 객관식 문제 수 */
    multipleChoiceCount: number;
    /** 주관식 문제 수 */
    subjectiveCount: number;
    /** 총 배점 */
    totalPoints: number;
  };
  /** 추가 메모 */
  notes?: string;
};

/**
 * 로딩 상태 타입
 * @description 다양한 로딩 상태를 관리하기 위한 타입
 */
export type LoadingState = "idle" | "loading" | "success" | "error";

/**
 * 단원 트리 로딩 옵션
 * @description 단원 트리 조회 시 사용하는 옵션들
 */
export type UnitsTreeOptions = {
  /** 문제 포함 여부 */
  shouldIncludeQuestions: boolean;
  /** 학년 필터 */
  grade?: number;
  /** 로딩 스피너 표시 여부 */
  showLoadingSpinner: boolean;
};
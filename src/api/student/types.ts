/**
 * 학생 기본 정보 타입
 * @description 학생의 기본적인 개인정보를 담는 타입
 */
/**
 * 학생 정보 조회 API 응답 타입 (StudentInfoDto)
 * @description /api/student/info API에서 반환하는 학생 기본 정보
 */
export type StudentInfoDto = {
  /** 학생 이름 */
  name: string;
  /** 전화번호 (하이픈 포함) */
  phone: string;
  /** 생년월일 (YYYY-MM-DD 형식) */
  birthDate: string;
  /** 학년 (가장 최근 응시한 시험의 학년 기준) */
  grade: number;
};

/**
 * 학생 기본 정보 타입 (기존 호환성 유지용)
 * @description 학생의 기본적인 개인정보를 담는 타입
 */
export type StudentInfo = {
  /** 학생 고유 ID */
  studentId: string;
  /** 학생 이름 */
  name: string;
  /** 생년월일 (YYYY-MM-DD 형식) */
  birthDate: string;
  /** 전화번호 (하이픈 포함) */
  phoneNumber: string;
};
/**
 * upsert-student API 응답 타입
 * @description /auth/upsert-student API에서 반환하는 학생 정보
 */
export type UpsertStudentResponse = {
  /** 학생 고유 ID (자동 생성) */
  id: number;
  /** 학생 이름 */
  name: string;
  /** 생년월일 (YYYY-MM-DD 형식) */
  birthDate: string;
  /** 전화번호 (하이픈 포함) */
  phone: string;
  /** 생성일시 (ISO 8601 형식) */
  createdAt: string;
  /** 수정일시 (ISO 8601 형식) */
  updatedAt: string;
  /** 새로운 학생 여부 */
  newStudent: boolean;
};

/**
 * 학생 프로필 정보 타입 (마이페이지용)
 * @description 마이페이지에서 표시할 학생의 프로필 정보
 */
/**
 * 학생 프로필 정보 타입 (마이페이지용)
 * @description 마이페이지에서 표시할 학생의 프로필 정보
 */
export type StudentProfile = {
  /** 학생 이름 */
  name: string;
  /** 전화번호 */
  phone: string;
  /** 생년월일 */
  birth: string;
  /** 학년 */
  grade: string;
  // 나중에 확장 가능한 필드들
  email?: string;
  address?: string;
  parentPhone?: string;
  studentNumber?: string;
};

/**
 * 최근 제출 시험 정보 타입
 * @description 학생이 최근에 제출한 시험의 기본 정보
 */
export type RecentSubmission = {
  /** 시험명 */
  examName: string;
  /** 제출일시 */
  submittedAt: string;
  /** 시험 설명 */
  content: string;
  /** 총 문항 수 */
  totalQuestions: number;
};

/**
 * 최근 제출 시험 목록 응답 타입
 * @description 최근 제출 시험 목록 API 응답 구조 (페이지네이션 포함)
 */
export type RecentSubmissionListResponse = {
  /** 최근 제출 시험 목록 */
  content: RecentSubmission[];
  /** 페이지 정보 */
  pageable: PageableInfo;
  /** 마지막 페이지 여부 */
  last: boolean;
  /** 전체 제출 시험 수 */
  totalElements: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 첫 페이지 여부 */
  first: boolean;
  /** 현재 페이지 크기 */
  size: number;
  /** 현재 페이지 번호 */
  number: number;
  /** 정렬 정보 */
  sort: PageSort;
  /** 현재 페이지 항목 수 */
  numberOfElements: number;
  /** 빈 페이지 여부 */
  empty: boolean;
};
/**
 * 학생 3요소 인증 요청 타입
 * @description API 문서의 StudentAuthRequest에 해당하는 타입
 */
export type StudentAuthRequest = {
  /** 학생 이름 */
  name: string;
  /** 생년월일 (YYYY-MM-DD 형식) */
  birthDate: string;
  /** 전화번호 (하이픈 포함) */
  phone: string;
};

/**
 * 최근 시험 제출 내역 조회 파라미터 타입
 * @description /student/recent-submissions API의 페이징 파라미터
 */
export type RecentSubmissionsParams = {
  /** 페이지 번호 (0부터 시작, 기본값: 0) */
  page?: number;
  /** 페이지 크기 (기본값: 10, 최대값: 100) */
  size?: number;
} & StudentAuthRequest;

/**
 * 단원 정보 타입
 * @description 시험 문제의 단원 정보
 */
export type UnitInfo = {
  /** 단원 고유 식별자 */
  unitId: string;
  /** 단원명 */
  unitName: string;
  /** 단원 코드 */
  unitCode: string;
  /** 중분류명 */
  subcategoryName: string;
  /** 대분류명 */
  categoryName: string;
};

/**
 * 문제별 답안 및 채점 결과 타입
 * @description API 문서의 QuestionAnswer에 해당하는 타입
 */
export type QuestionAnswer = {
  /** 문제 ID */
  questionId: string;
  /** 문제 순서 */
  questionOrder: number;
  /** 문제 내용 (요약) */
  questionSummary: string;
  /** 문제 유형 (주관식/객관식) */
  questionType: string;
  /** 문제 난이도 */
  difficulty: string;
  /** 배점 */
  points: number;
  /** 학생 답안 */
  studentAnswer: string;
  /** 정답 */
  correctAnswer: string;
  /** 획득 점수 */
  earnedScore: number;
  /** 정답 여부 */
  isCorrect: boolean;
  /** 문제별 피드백 */
  feedback: string;
  /** 관련 단원 정보 */
  unitInfo: UnitInfo;
};

/**
 * 시험 상세 결과 타입
 * @description API 문서의 ExamDetailResultDto에 해당하는 타입
 */
export type ExamDetailResult = {
  /** 시험명 */
  examName: string;
  /** 채점 날짜 */
  gradedAt: string;
  /** 총 문제 문항 수 */
  totalQuestions: number;
  /** 객관식 문제 수 */
  objectiveCount: number;
  /** 주관식 문제 수 */
  subjectiveCount: number;
  /** 총 점수 */
  totalScore: number;
  /** 단원 정보 목록 */
  units: UnitInfo[];
  /** 문제별 질문과 답안 목록 */
  questionAnswers: QuestionAnswer[];
};

/**
 * 시험 상세 결과 조회 파라미터 타입
 * @description /student/exam-detail/{examId} API 요청 파라미터
 */
export type ExamDetailParams = {
  /** 시험 고유 식별자 */
  examId: string;
} & StudentAuthRequest;
/**
 * 시험 문제 정보 타입 (새 API 응답)
 * @description /exams/{examId}/questions API의 문제 정보 구조
 */
export type Question = {
  /** 문제 고유 ID */
  questionId: string;
  /** 문제 순서 번호 */
  seqNo: number;
  /** 문제 유형 ("MULTIPLE_CHOICE" | "SUBJECTIVE") */
  questionType: "MULTIPLE_CHOICE" | "SUBJECTIVE";
  /** 문제 내용 */
  questionText: string;
  /** 배점 */
  points: number;
  /** 난이도 */
  difficulty: string;
  /** 선택지 (객관식인 경우) */
  choices: Record<string, string>;
  /** 이미지 URL 목록 */
  imageUrls: string[];
  /** 이미지 포함 여부 */
  hasImage: boolean;
  /** 선택 방법 */
  selectionMethod: "MANUAL" | "RANDOM";
  /** 무작위 선택 여부 */
  randomlySelected: boolean;
  /** 객관식 여부 */
  multipleChoice: boolean;
  /** 주관식 여부 */
  subjective: boolean;
};

/**
 * 문제 유형별 비율 타입
 * @description 객관식/주관식 문제 비율 정보
 */
export type QuestionTypeRatio = {
  /** 객관식 비율 (0.0 ~ 1.0) */
  multipleChoiceRatio: number;
  /** 주관식 비율 (0.0 ~ 1.0) */
  subjectiveRatio: number;
};

/**
 * 시험 요약 정보 타입
 * @description 시험 기본 정보 요약
 */
export type ExamSummary = {
  /** 시험명 */
  examName: string;
  /** 학년 */
  grade: number;
  /** 총 문제 수 */
  totalQuestions: number;
  /** 총 배점 */
  totalPoints: number;
  /** 문제 구성 설명 */
  questionComposition: string;
};

/**
 * 시험 문제 조회 API 응답 데이터 타입
 * @description GET /exams/{examId}/questions API 응답의 data 필드
 */
export type ExamQuestionsData = {
  /** 시험 ID */
  examId: string;
  /** 시험명 */
  examName: string;
  /** 학년 */
  grade: number;
  /** 총 문제 수 */
  totalQuestions: number;
  /** 객관식 문제 수 */
  multipleChoiceCount: number;
  /** 주관식 문제 수 */
  subjectiveCount: number;
  /** 총 배점 */
  totalPoints: number;
  /** 문제 목록 */
  questions: Question[];
  /** 문제 유형별 비율 */
  questionTypeRatio: QuestionTypeRatio;
  /** 시험 요약 정보 */
  examSummary: ExamSummary;
};

/**
 * 페이지 정렬 정보 타입
 * @description 페이지네이션 정렬 상태
 */
export type PageSort = {
  /** 정렬 여부 */
  sorted: boolean;
  /** 정렬 정보 없음 */
  empty: boolean;
  /** 정렬되지 않음 */
  unsorted: boolean;
};

/**
 * 페이지 정보 타입
 * @description 페이지네이션 메타데이터
 */
export type PageableInfo = {
  /** 페이지 번호 (0부터 시작) */
  pageNumber: number;
  /** 페이지 크기 */
  pageSize: number;
  /** 정렬 정보 */
  sort: PageSort;
  /** 오프셋 */
  offset: number;
  /** 페이징 여부 */
  paged: boolean;
  /** 페이징 안함 여부 */
  unpaged: boolean;
};

/**
 * 시험 이력 항목 타입
 * @description 학생이 응시한 개별 시험 정보
 */
export type ExamHistoryItem = {
  /** 시험 고유 ID (UUID) */
  examId: string;
  /** 시험명 */
  examName: string;
  /** 응시일시 */
  submittedAt: string;
  /** 총 문제 수 */
  totalQuestions: number;
  /** 총점 (채점 안됨 시 null) */
  totalScore: number | null;
};

/**
 * 시험 이력 응답 타입
 * @description POST /api/student/exam-history API 응답 구조
 */
export type ExamHistoryResponse = {
  /** 시험 이력 목록 */
  content: ExamHistoryItem[];
  /** 페이지 정보 */
  pageable: PageableInfo;
  /** 마지막 페이지 여부 */
  last: boolean;
  /** 전체 시험 개수 */
  totalElements: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 첫 페이지 여부 */
  first: boolean;
  /** 현재 페이지 크기 */
  size: number;
  /** 현재 페이지 번호 */
  number: number;
  /** 정렬 정보 */
  sort: PageSort;
  /** 현재 페이지 항목 수 */
  numberOfElements: number;
  /** 빈 페이지 여부 */
  empty: boolean;
};

/**
 * 시험 이력 조회 파라미터 타입
 * @description /api/student/exam-history API 요청 파라미터
 */
export type ExamHistoryParams = {
  /** 페이지 번호 (0부터 시작, 기본값: 0) */
  page?: number;
  /** 페이지 크기 (기본값: 10, 최대: 100) */
  size?: number;
} & StudentAuthRequest;

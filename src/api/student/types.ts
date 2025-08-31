/**
 * 학생 기본 정보 타입
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
  /** 시험 고유 ID */
  examId: string;
  /** 시험명 */
  examTitle: string;
  /** 총 문항 수 */
  totalQuestions: number;
  /** 단원명 */
  chapterName: string;
  /** 제출일 */
  submittedAt: string;
  /** 시험 유형 */
  examType: "mock" | "chapter" | "comprehensive" | "final";
};

/**
 * 최근 제출 시험 목록 응답 타입
 * @description 최근 제출 시험 목록 API 응답 구조
 */
export type RecentSubmissionListResponse = {
  /** 최근 제출 시험 목록 */
  recentSubmissions: RecentSubmission[];
  /** 전체 제출 시험 수 */
  totalCount: number;
};

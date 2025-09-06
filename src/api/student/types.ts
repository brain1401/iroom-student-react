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
  studentId: string;
  /** 학생 이름 */
  name: string;
  /** 생년월일 (YYYY-MM-DD 형식) */
  birthDate: string;
  /** 전화번호 (하이픈 포함) */
  phoneNumber: string;
  /** 학년 정보 (선택적) */
  grade?: string;
  /** 학생 번호 (선택적) */
  studentNumber?: string;
  /** 이메일 (선택적) */
  email?: string;
  /** 주소 (선택적) */
  address?: string;
  /** 학부모 전화번호 (선택적) */
  parentPhone?: string;
  /** 생성일시 (ISO 8601 형식) */
  createdAt: string;
  /** 수정일시 (ISO 8601 형식) */
  updatedAt: string;
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

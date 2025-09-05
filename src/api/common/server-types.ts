/**
 * 실제 서버 응답 기반 타입 정의
 * @description curl 테스트 결과를 바탕으로 한 실제 백엔드 응답 타입들
 * @version 2025-09-05
 */

// 기존 ApiResponse<T> 타입 재사용
import type { ApiResponse, ResultStatus } from "./types";

/**
 * 누락된 타입 정의들
 * @description 서버 API에 필요하지만 curl 응답에서 확인되지 않은 타입들
 */

/**
 * 인증 관련 타입들
 */
export type StudentAuthResult = {
  /** 인증 성공 여부 */
  success: boolean;
  /** 학생 정보 */
  student?: AuthUser;
  /** 인증 메시지 */
  message: string;
};

export type TeacherAuthResult = {
  /** 인증 성공 여부 */
  success: boolean;
  /** 선생님 정보 */
  teacher?: AuthUser;
  /** 인증 메시지 */
  message: string;
};

export type AuthUser = {
  /** 사용자 ID */
  id: string;
  /** 사용자 이름 */
  name: string;
  /** 사용자 역할 */
  role: "STUDENT" | "TEACHER" | "ADMIN";
  /** 이메일 (선택적) */
  email?: string;
  /** 전화번호 (선택적) */
  phone?: string;
};

export type LogoutResult = {
  /** 로그아웃 성공 여부 */
  success: boolean;
  /** 로그아웃 메시지 */
  message: string;
};

/**
 * 시스템 관련 타입들
 */
export type SystemStatistics = {
  /** 전체 시험 수 */
  totalExams: number;
  /** 전체 시험지 수 */
  totalExamSheets: number;
  /** 활성 사용자 수 */
  activeUsers: number;
  /** 시스템 리소스 사용량 */
  resourceUsage?: {
    /** CPU 사용률 (0-100) */
    cpu: number;
    /** 메모리 사용률 (0-100) */
    memory: number;
    /** 디스크 사용률 (0-100) */
    disk?: number;
    /** 네트워크 사용률 (0-100) */
    network?: number;
  };
};

export type SystemInfo = {
  /** 서버 버전 */
  version: string;
  /** 빌드 정보 */
  build?: string;
  /** 환경 (dev, prod 등) */
  environment: string;
  /** 지원 기능 목록 */
  features?: string[];
};

export type ApiVersionInfo = {
  /** 현재 API 버전 */
  version: string;
  /** 지원하는 클라이언트 버전 */
  supportedVersions: string[];
  /** deprecated 기능 목록 */
  deprecated?: string[];
};

/**
 * 단원 관련 추가 타입들
 */
export type UnitCoverageAnalysis = {
  /** 분석 대상 시험지 ID */
  examSheetId: string;
  /** 다룬 단원 목록 */
  coveredUnits: UnitTreeNode[];
  /** 누락된 중요 단원 목록 */
  missingUnits: UnitTreeNode[];
  /** 과목별 커버리지 비율 */
  subjectCoverage: { [subject: string]: number };
};

export type UnitStatistics = {
  /** 단원별 출제 빈도 */
  frequency: { [unitId: string]: number };
  /** 단원별 평균 난이도 */
  difficulty: { [unitId: string]: number };
  /** 단원별 정답률 */
  successRate: { [unitId: string]: number };
};

export type UnitSearchParams = {
  /** 검색 키워드 */
  keyword?: string;
  /** 과목 필터 */
  subject?: string;
  /** 학년 필터 */
  grade?: number;
  /** 페이지 크기 */
  limit?: number;
  /** 오프셋 */
  offset?: number;
};

export type UnitListApiResponse = {
  /** 검색된 단원 목록 */
  items: UnitTreeNode[];
  /** 전체 개수 */
  total: number;
  /** 페이지 정보 */
  page: number;
  /** 페이지 크기 */
  size: number;
};

/**
 * 시험 관련 추가 타입들
 */
export type ExamListParams = {
  /** 페이지 번호 (0부터 시작) */
  page?: number;
  /** 페이지 크기 (기본값: 10) */
  size?: number;
  /** 정렬 기준 (예: "createdAt,desc") */
  sort?: string;
  /** 학년 필터 (1, 2, 3) */
  grade?: number;
  /** 검색어 (시험 이름으로 검색) */
  search?: string;
};

/**
 * 시험 ID 목록 API 응답 타입
 * @description GET /api/exams/ids 또는 getAllExams에서 ID만 추출한 응답
 */
export type ExamIdsApiResponse = ApiResponse<string[]>;

/**
 * 실제 서버의 시험(Exam) 관련 타입들
 * @description /api/exams 엔드포인트 실제 응답 구조
 */

/**
 * 시험 기본 정보 타입
 * @description GET /api/exams 목록에서 반환되는 개별 시험 정보
 */
export type ExamItem = {
  /** 시험 고유 ID (UUID 형식) */
  id: string;
  /** 시험 이름 (예: "1학년 1학기 중간고사 - 1차") */
  examName: string;
  /** 학년 (1, 2, 3) */
  grade: number;
  /** 시험 설명 또는 내용 */
  content: string;
  /** QR 코드 URL (현재는 null) */
  qrCodeUrl: string | null;
  /** 생성 일시 (ISO 8601) */
  createdAt: string;
  /** 시험지 정보 (상세 조회 시에만 포함) */
  examSheetInfo?: ExamSheetSummary | null;
};

/**
 * 시험지 요약 정보
 * @description ExamItem에 포함되는 시험지 기본 정보
 */
export type ExamSheetSummary = {
  /** 시험지 고유 ID */
  id: string;
  /** 시험지 이름 */
  examName: string;
  /** 총 문제 수 */
  totalQuestions: number;
  /** 총 배점 */
  totalPoints: number;
  /** 생성 일시 */
  createdAt: string;
};

/**
 * 페이지네이션된 시험 목록 응답 데이터
 * @description GET /api/exams 응답의 data 필드 구조
 */
export type ExamListData = {
  /** 현재 페이지의 시험 목록 */
  content: ExamItem[];
  /** Spring Boot Pageable 정보 */
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  /** 마지막 페이지 여부 */
  last: boolean;
  /** 전체 요소 수 */
  totalElements: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 첫 번째 페이지 여부 */
  first: boolean;
  /** 현재 페이지 크기 */
  size: number;
  /** 현재 페이지 번호 */
  number: number;
  /** 정렬 정보 */
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  /** 현재 페이지 요소 수 */
  numberOfElements: number;
  /** 빈 페이지 여부 */
  empty: boolean;
};

/**
 * 시험 상세 정보 타입
 * @description GET /api/exams/{id} 상세 조회 응답
 */
export type ExamDetail = ExamItem & {
  /** 시험지 상세 정보 (필수로 포함됨) */
  examSheetInfo: ExamSheetSummary;
};

/**
 * 문제지(ExamSheet) 관련 타입들
 * @description /api/exam-sheets 엔드포인트 실제 응답 구조
 */

/**
 * 카테고리별 문제 분포
 * @description 대분류별 문제 개수 분포
 */
export type CategoryDistribution = {
  /** 카테고리 이름 (예: "수와 연산", "기하", "문자와 식", "함수") */
  categoryName: string;
  /** 해당 카테고리의 문제 개수 */
  questionCount: number;
};

/**
 * 서브카테고리별 문제 분포
 * @description 중분류별 문제 개수 분포
 */
export type SubcategoryDistribution = {
  /** 서브카테고리 이름 (예: "제곱근과 실수", "입체도형", "방정식") */
  subcategoryName: string;
  /** 해당 서브카테고리의 문제 개수 */
  questionCount: number;
};

/**
 * 단원별 상세 정보
 * @description 세부 단원별 문제 개수와 배점 정보
 */
export type UnitDetail = {
  /** 단원 고유 ID */
  unitId: string;
  /** 단원 이름 (예: "제곱근의 계산") */
  unitName: string;
  /** 단원 코드 (예: "MS3_NUM_SQRT_CALC") */
  unitCode: string;
  /** 소속 서브카테고리 이름 */
  subcategoryName: string;
  /** 소속 카테고리 이름 */
  categoryName: string;
  /** 해당 단원의 문제 개수 */
  questionCount: number;
  /** 해당 단원의 총 배점 */
  totalPoints: number;
};

/**
 * 단원 요약 정보
 * @description 문제지의 단원별 분석 결과
 */
export type UnitSummary = {
  /** 총 단원 수 */
  totalUnits: number;
  /** 카테고리별 문제 분포 */
  categoryDistribution: CategoryDistribution[];
  /** 서브카테고리별 문제 분포 */
  subcategoryDistribution: SubcategoryDistribution[];
  /** 단원별 상세 정보 */
  unitDetails: UnitDetail[];
};

/**
 * 문제지 상세 정보
 * @description GET /api/exam-sheets 응답의 개별 문제지 정보
 */
export type ExamSheet = {
  /** 문제지 고유 ID */
  id: string;
  /** 시험 이름 */
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
  /** 문제당 평균 배점 */
  averagePointsPerQuestion: number;
  /** 생성 일시 */
  createdAt: string;
  /** 수정 일시 */
  updatedAt: string;
  /** 문제 목록 (현재는 null, 별도 API에서 제공) */
  questions: null;
  /** 단원별 분석 정보 */
  unitSummary: UnitSummary;
};

/**
 * 페이지네이션된 문제지 목록 응답 데이터
 * @description GET /api/exam-sheets 응답의 data 필드 구조
 */
export type ExamSheetListData = {
  /** 현재 페이지의 문제지 목록 */
  content: ExamSheet[];
  /** Spring Boot Pageable 정보 */
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  /** 마지막 페이지 여부 */
  last: boolean;
  /** 전체 요소 수 */
  totalElements: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 첫 번째 페이지 여부 */
  first: boolean;
  /** 현재 페이지 크기 */
  size: number;
  /** 현재 페이지 번호 */
  number: number;
  /** 정렬 정보 */
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  /** 현재 페이지 요소 수 */
  numberOfElements: number;
  /** 빈 페이지 여부 */
  empty: boolean;
};

/**
 * 단원 관리 관련 타입들
 * @description /api/units 엔드포인트 실제 응답 구조
 */

/**
 * 단원 트리 노드 타입
 * @description 계층적 단원 구조의 개별 노드
 */
export type UnitTreeNodeType = "CATEGORY" | "SUBCATEGORY" | "UNIT";

/**
 * 단원 트리 노드
 * @description GET /api/units/tree 응답의 개별 노드 구조
 */
export type UnitTreeNode = {
  /** 노드 고유 ID */
  id: string;
  /** 노드 이름 */
  name: string;
  /** 노드 타입 (대분류/중분류/세부단원) */
  type: UnitTreeNodeType;
  /** 학년 (UNIT 타입일 때만 존재, 나머지는 null) */
  grade: number | null;
  /** 표시 순서 */
  displayOrder: number;
  /** 설명 */
  description: string;
  /** 단원 코드 (UNIT 타입일 때만 존재, 나머지는 null) */
  unitCode: string | null;
  /** 하위 노드들 */
  children: UnitTreeNode[];
};

/**
 * 시스템 API 관련 타입들
 * @description /api/system 엔드포인트 실제 응답 구조
 */

/**
 * 개별 서비스 헬스체크 정보
 */
export type ServiceHealthInfo = {
  /** 서비스 상태 */
  status: "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";
  /** 서비스 메시지 */
  message?: string;
  /** 응답 시간 (밀리초) */
  responseTimeMs?: number;
};

/**
 * 헬스체크 응답 데이터
 * @description GET /api/system/health 응답의 data 필드
 */
export type HealthCheckData = {
  /** 전체 시스템 상태 */
  status: "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";
  /** 타임스탬프 */
  timestamp: string;
  /** 데이터베이스 상태 */
  database?: ServiceHealthInfo;
  /** 애플리케이션 상태 */
  application?: ServiceHealthInfo;
  /** AI 서버 상태 */
  ai_server?: ServiceHealthInfo;
  /** Redis 캐시 상태 */
  redis?: ServiceHealthInfo;
  /** AWS S3 상태 */
  s3?: ServiceHealthInfo;
};

/**
 * Hello 응답 데이터
 * @description GET /api/system/hello 응답의 data 필드
 */
export type HelloData = {
  /** 이름 */
  name: string;
  /** 인사 메시지 */
  message: string;
};

/**
 * Echo 요청 타입
 * @description POST /api/system/echo 요청 본문
 */
export type EchoRequest = {
  /** 에코할 메시지 */
  message: string;
};

/**
 * Echo 응답 데이터
 * @description POST /api/system/echo 응답의 data 필드
 */
export type EchoData = {
  /** 원본 메시지 */
  originalMessage: string;
  /** 에코 메시지 */
  echoMessage: string;
  /** 타임스탬프 */
  timestamp: string;
};

/**
 * 인증 관련 타입들
 * @description /api/auth, /api/teachers 엔드포인트 관련 타입들
 */

/**
 * 선생님 로그인 요청
 * @description POST /api/teachers/login 요청 본문
 */
export type TeacherLoginRequest = {
  /** 사용자명 */
  username: string;
  /** 비밀번호 */
  password: string;
};

/**
 * 선생님 검증 응답 데이터
 * @description POST /api/auth/verify-teacher 응답의 data 필드
 */
export type TeacherVerifyData = {
  /** 검증 결과 */
  verified: boolean;
};

/**
 * API 응답 타입 정의들
 * @description 실제 서버 API들의 완전한 응답 타입들
 */

// 시스템 API 응답들
export type HealthCheckApiResponse = ApiResponse<HealthCheckData>;
export type HelloApiResponse = ApiResponse<HelloData>;
export type EchoApiResponse = ApiResponse<EchoData>;

// 시험 관리 API 응답들
export type ExamListApiResponse = ApiResponse<ExamListData>;
export type ExamDetailApiResponse = ApiResponse<ExamDetail>;

// 문제지 관리 API 응답들
export type ExamSheetListApiResponse = ApiResponse<ExamSheetListData>;
export type ExamSheetDetailApiResponse = ApiResponse<ExamSheet>;

// 단원 관리 API 응답들
export type UnitTreeApiResponse = ApiResponse<UnitTreeNode[]>;

// 인증 API 응답들
export type TeacherVerifyApiResponse = ApiResponse<TeacherVerifyData>;

/**
 * 타입 가드 함수들
 * @description 서버 응답 타입을 안전하게 확인하는 유틸리티들
 */

/**
 * UNIT 타입 노드인지 확인
 * @param node 확인할 단원 트리 노드
 * @returns UNIT 타입 여부
 */
export function isUnitNode(node: UnitTreeNode): node is UnitTreeNode & {
  type: "UNIT";
  grade: number;
  unitCode: string;
} {
  return node.type === "UNIT" && node.grade !== null && node.unitCode !== null;
}

/**
 * CATEGORY 타입 노드인지 확인
 * @param node 확인할 단원 트리 노드
 * @returns CATEGORY 타입 여부
 */
export function isCategoryNode(node: UnitTreeNode): node is UnitTreeNode & {
  type: "CATEGORY";
} {
  return node.type === "CATEGORY";
}

/**
 * SUBCATEGORY 타입 노드인지 확인
 * @param node 확인할 단원 트리 노드
 * @returns SUBCATEGORY 타입 여부
 */
export function isSubcategoryNode(node: UnitTreeNode): node is UnitTreeNode & {
  type: "SUBCATEGORY";
} {
  return node.type === "SUBCATEGORY";
}

/**
 * 학년별 단원 필터링 유틸리티
 * @description 특정 학년의 UNIT 노드들만 추출
 * @param nodes 단원 트리 노드 배열
 * @param grade 필터링할 학년
 * @returns 해당 학년의 UNIT 노드들
 */
export function filterUnitsByGrade(
  nodes: UnitTreeNode[],
  grade: number,
): UnitTreeNode[] {
  const result: UnitTreeNode[] = [];

  function traverse(nodeList: UnitTreeNode[]) {
    for (const node of nodeList) {
      if (isUnitNode(node) && node.grade === grade) {
        result.push(node);
      }
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(nodes);
  return result;
}

/**
 * 카테고리별 단원 그룹핑 유틸리티
 * @description 단원들을 카테고리별로 그룹핑
 * @param nodes 단원 트리 노드 배열
 * @returns 카테고리별로 그룹핑된 단원 맵
 */
export function groupUnitsByCategory(
  nodes: UnitTreeNode[],
): Map<string, UnitTreeNode[]> {
  const categoryMap = new Map<string, UnitTreeNode[]>();

  function traverse(nodeList: UnitTreeNode[], currentCategory?: string) {
    for (const node of nodeList) {
      if (isCategoryNode(node)) {
        currentCategory = node.name;
        if (!categoryMap.has(currentCategory)) {
          categoryMap.set(currentCategory, []);
        }
      } else if (isUnitNode(node) && currentCategory) {
        const units = categoryMap.get(currentCategory) || [];
        units.push(node);
        categoryMap.set(currentCategory, units);
      }

      if (node.children && node.children.length > 0) {
        traverse(node.children, currentCategory);
      }
    }
  }

  traverse(nodes);
  return categoryMap;
}

/**
 * 시험지 상세 정보 타입
 * @description 시험지의 모든 상세 정보 (문제 포함)
 */
export type ExamSheetDetail = ExamSheet;

/**
 * 문제 데이터 타입
 * @description 개별 문제의 모든 정보
 */
export type QuestionData = {
  /** 문제 고유 ID */
  id: string;
  /** 문제 번호 */
  questionNumber: number;
  /** 문제 내용 */
  content: string;
  /** 문제 타입 (객관식/주관식) */
  type: "MULTIPLE_CHOICE" | "SUBJECTIVE";
  /** 배점 */
  points: number;
  /** 난이도 */
  difficulty: "상" | "중" | "하";
  /** 단원 정보 */
  unit?: {
    id: string;
    name: string;
    category: string;
  };
  /** 객관식 선택지 (객관식인 경우) */
  choices?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  /** 정답 (주관식인 경우) */
  correctAnswer?: string;
  /** 해설 */
  solution?: string;
};

/**
 * 학생 답안 제출 요청 타입
 * @description 최종 답안 제출 시 사용
 */
export type StudentAnswerSubmitRequest = {
  /** 시험지 ID */
  examSheetId: string;
  /** 답안 목록 */
  answers: {
    /** 문제 ID */
    questionId: string;
    /** 답안 내용 */
    answer: string;
    /** 제출 시간 */
    submittedAt: string;
  }[];
};

/**
 * 학생 답안 임시저장 요청 타입
 * @description 답안 임시저장 시 사용
 */
export type StudentAnswerDraftRequest = {
  /** 시험지 ID */
  examSheetId: string;
  /** 문제 ID */
  questionId: string;
  /** 답안 내용 */
  answer: string;
  /** 저장 시간 */
  savedAt: string;
};

/**
 * ApiResponse 타입 export
 * @description 다른 파일에서 사용할 수 있도록 re-export
 */
export type { ApiResponse, ResultStatus };

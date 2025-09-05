/**
 * 학생 API 모듈 통합 export
 * @description 학생 관련 API, 타입, 쿼리 옵션을 통합적으로 제공
 * @version 2025-09-05
 */

// 타입 정의
export type {
  StudentInfo,
  StudentProfile,
  RecentSubmission,
  RecentSubmissionListResponse,
} from "./types";

// API 함수들
export {
  getRecentSubmissions,
  getStudentInfo,
  logoutStudent,
  type StudentAuthRequest,
  type RecentSubmissionsParams,
} from "./server-api";

// React Query 옵션들
export {
  studentKeys,
  recentSubmissionsQueryOptions,
  studentInfoQueryOptions,
  studentQueryInvalidation,
} from "./query";
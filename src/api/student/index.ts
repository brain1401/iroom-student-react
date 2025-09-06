/**
 * 학생 API 모듈 통합 export
 * @description 학생 관련 API, 타입, 쿼리 옵션을 통합적으로 제공
 * @version 2025-09-06
 */

// 타입 정의
export type {
  StudentInfo,
  StudentInfoDto,
  StudentProfile,
  RecentSubmission,
  RecentSubmissionListResponse,
  UpsertStudentResponse,
  StudentAuthRequest,
  RecentSubmissionsParams,
} from "./types";

// API 함수들
export {
  upsertStudent,
  getRecentSubmissions,
  getStudentInfo,
} from "./api";

// React Query 옵션들
export {
  studentKeys,
  studentProfileUpsertQueryOptions,
  studentRecentSubmissionsQueryOptions,
  studentInfoQueryOptions,
  conditionalStudentProfileQueryOptions,
  conditionalRecentSubmissionsQueryOptions,
} from "./query";
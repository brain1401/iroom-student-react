/**
 * 모의고사 API 모듈 통합 export
 * @description 모의고사 관련 API 함수, 쿼리 옵션, 타입들을 중앙에서 관리
 */

// API 함수들 export
export { getAllMockExams, getMockExamById, getMockExamIds } from "./api";

// React Query 옵션들 export
export {
  examKeys,
  allMockExamsQueryOptions,
  mockExamDetailQueryOptions,
  mockExamIdsQueryOptions,
} from "./query";

// 타입들 export
export type {
  MockExam,
  Problem,
  MockExamListApiResponse,
  MockExamApiResponse,
  MockExamIdsApiResponse,
} from "./types";

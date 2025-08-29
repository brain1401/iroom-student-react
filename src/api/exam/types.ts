/**
 * 모의고사 API 타입 정의
 * @description 백엔드 ApiResponse와 일치하는 모의고사 전용 타입들
 */

// 공통 API 타입에서 import
import type {
  MockExam,
  Problem,
  MockExamListApiResponse,
  MockExamApiResponse,
  MockExamIdsApiResponse,
} from "@/api/common/types";

// 공통 타입에서 정의된 것들을 재export (기존 코드 호환성)
export type { MockExam, Problem };

// API 응답 타입들도 재export
export type {
  MockExamListApiResponse,
  MockExamApiResponse,
  MockExamIdsApiResponse,
};

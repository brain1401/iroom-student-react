/**
 * 시험 관리 페이지 레이아웃 라우트
 * @description 시험지 등록, 시험 관리, 성적 관리를 위한 공통 레이아웃
 */

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

/**
 * 탭 검증 스키마
 * @description 유효한 탭 값들을 정의
 */
const searchSchema = z.object({
  tab: z.enum(["register", "exam", "grade"]).default("register"),
});

export const Route = createFileRoute("/exam-management")({
  validateSearch: searchSchema,
  component: ExamManagementLayout,
});

/**
 * 시험 관리 레이아웃 컴포넌트
 * @description 탭 네비게이션과 공통 헤더를 포함하는 레이아웃
 */
function ExamManagementLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">시험 관리</h1>
          <p className="text-gray-600 mt-1">
            시험지 등록, 시험 관리, 성적 관리를 위한 통합 관리 시스템
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
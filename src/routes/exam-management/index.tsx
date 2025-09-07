/**
 * 시험 관리 메인 페이지
 * @description 탭 기반의 시험 관리 인터페이스
 */

import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExamSheetRegister } from "@/components/exam-management/ExamSheetRegister";
import { ExamManagement } from "@/components/exam-management/ExamManagement";
import { GradeManagement } from "@/components/exam-management/GradeManagement";

export const Route = createFileRoute("/exam-management/")({
  component: ExamManagementPage,
});

/**
 * 탭 정보 정의
 * @description 각 탭의 라벨과 컴포넌트 매핑
 */
const TABS = [
  { id: "register", label: "시험지 등록", component: ExamSheetRegister },
  { id: "exam", label: "시험 관리", component: ExamManagement },
  { id: "grade", label: "성적 / 리포트", component: GradeManagement },
] as const;

/**
 * 시험 관리 페이지 컴포넌트
 * @description 탭 네비게이션과 동적 컴포넌트 렌더링
 */
function ExamManagementPage() {
  const search = useSearch({
    from: "/exam-management",
  });
  
  const currentTab = search.tab || "register";
  const CurrentTabComponent = TABS.find(tab => tab.id === currentTab)?.component || ExamSheetRegister;

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-lg shadow-sm p-1">
        <div className="flex space-x-1">
          {TABS.map((tab) => (
            <Link
              key={tab.id}
              to="/exam-management"
              search={{ tab: tab.id }}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                currentTab === tab.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="bg-white rounded-lg shadow-sm">
        <CurrentTabComponent />
      </div>
    </div>
  );
}
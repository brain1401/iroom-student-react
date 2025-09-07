/**
 * 메인 페이지 레이아웃
 * @description 메인 페이지의 공통 레이아웃 (헤더 포함)
 *
 * 주요 기능:
 * - StudentHeader를 모든 메인 페이지에 표시
 * - 하위 라우트 내용을 Outlet으로 렌더링
 * - 로그아웃, 시험 목록, 마이페이지 네비게이션 처리
 *
 * @example
 * ```tsx
 * <Route path="/main" component={MainLayout} />
 * ```
 */

import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { StudentHeader } from "@/components/student/StudentHeader";

export const Route = createFileRoute("/main/_layout")({
  component: MainLayout,
});

function MainLayout() {
  const navigate = useNavigate();

  /** 로그아웃 핸들러 */
  const handleLogout = () => {
    // TODO: 로그아웃 로직 구현
    console.log("로그아웃 요청");
    // 로그인 페이지로 이동
    navigate({ to: "/" });
  };

  /** 시험 목록 클릭 핸들러 */
  const handleExamList = () => {
    // 현재 메인 페이지에 있으므로 아무 동작 안함
    console.log("시험 목록으로 이동");
  };

  /** 마이페이지 클릭 핸들러 */
  const handleMyPage = () => {
    // TODO: 마이페이지로 이동
    console.log("마이페이지로 이동");
    // navigate({ to: "/main/mypage" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* 학생 헤더 */}
      <StudentHeader
        student={{
          studentId: "2024001",
          name: import.meta.env.VITE_DEFAULT_USER_NAME || "정보 없음",
          birthDate: "2006-03-15",
          phoneNumber: "010-1234-5678",
        }}
      />

      {/* 하위 라우트 내용이 여기에 렌더링됨 */}
      <Outlet />
    </div>
  );
}

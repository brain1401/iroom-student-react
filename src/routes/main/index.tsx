/**
 * 메인 홈 라우트
 * @description 로그인 이후 진입하는 홈 화면 라우트
 *
 * 주요 기능:
 * - 최근 응시 시험 목록 표시
 * - 전체 시험 이력 표시 (페이지네이션)
 * - 로그아웃 기능
 */

import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { logoutAtom } from "@/atoms/auth";
import {
  studentRecentSubmissionsPageAtom,
  studentRecentSubmissionsSizeAtom,
} from "@/atoms/student";
import { examHistoryPageAtom, examHistoryPageSizeAtom } from "@/atoms/main";
import { RecentExamsSection, ExamHistorySection } from "@/components/main";
import { getRecentSubmissions, getExamHistory } from "@/api/student";

export const Route = createFileRoute("/main/")({
  ssr: true,

  // SSR 데이터 프리로딩
  loader: async ({ context }) => {
    // 기본 학생 정보로 데이터 prefetch 시도
    const defaultStudentAuth = {
      name: import.meta.env.VITE_DEFAULT_USER_NAME || "홍태극",
      birthDate: "2099-09-15",
      phone: "010-2790-6727",
      page: 0,
      size: 10,
    };

    try {
      // 최근 제출 내역 prefetch
      await context.queryClient.prefetchQuery({
        queryKey: [
          "student",
          "recent-submissions",
          {
            name: defaultStudentAuth.name,
            birthDate: defaultStudentAuth.birthDate,
            phone: defaultStudentAuth.phone,
            page: 0,
            size: 10,
          },
        ],
        queryFn: () => getRecentSubmissions(defaultStudentAuth),
        staleTime: 2 * 60 * 1000,
      });

      // 시험 이력 prefetch
      await context.queryClient.prefetchQuery({
        queryKey: [
          "student",
          "exam-history",
          {
            name: defaultStudentAuth.name,
            birthDate: defaultStudentAuth.birthDate,
            phone: defaultStudentAuth.phone,
            page: 0,
            size: 10,
          },
        ],
        queryFn: () => getExamHistory(defaultStudentAuth),
        staleTime: 5 * 60 * 1000,
      });
    } catch (error) {
      // prefetch 실패 시 무시 (클라이언트에서 재시도됨)
      console.log("Server-side student data prefetch failed:", error);
    }
  },
  component: MainPage,
});

/**
 * 로그아웃 버튼 컴포넌트
 * @description 하단에 위치한 로그아웃 액션 버튼
 */
function LogoutButton() {
  const logout = useSetAtom(logoutAtom);

  const handleLogout = () => {
    logout(); // Jotai atom 상태 초기화
    // 로그인 페이지로 이동
    window.location.href = "/";
  };

  return (
    <footer className="flex justify-start">
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="mb-10 ml-10 font-bold text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        로그아웃
      </Button>
    </footer>
  );
}

/**
 * 메인 페이지 컴포넌트
 * @description 홈 화면의 전체 레이아웃과 컴포넌트들을 조합
 *
 * 주요 구성:
 * - 최근 응시 시험 목록 (RecentExamsSection) - 상단
 * - 전체 시험 이력 (ExamHistorySection) - 하단
 * - 로그아웃 버튼 (LogoutButton)
 */
function MainPage() {
  // SSR hydration 최적화를 위한 초기 상태 동기화
  useHydrateAtoms([
    [studentRecentSubmissionsPageAtom, 0],
    [studentRecentSubmissionsSizeAtom, 10],
    [examHistoryPageAtom, 0],
    [examHistoryPageSizeAtom, 10],
  ]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* 페이지 헤더 */}
      <div className="pt-8 pb-4 px-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">홈</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          시험 응시 내역을 확인하고 관리하세요
        </p>
      </div>

      {/* 전체 시험 이력 섹션 (하단) */}
      <ExamHistorySection />

      {/* 최근 응시 시험 섹션 (상단) */}
      <RecentExamsSection />

      {/* 로그아웃 버튼 */}
      <LogoutButton />
    </main>
  );
}

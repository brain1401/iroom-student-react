import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { StudentInfo } from "@/api/student/types";
import { Button } from "@/components/ui/button";
import { useSetAtom } from "jotai";
import { logoutAtom } from "@/atoms/auth";
import { Link } from "@tanstack/react-router";
import {
  User,
  X,
  Menu,
  Settings,
  LogOut,
  BookOpen,
  BarChart3,
} from "lucide-react";

export type StudentHeaderProps = {
  /** 학생 정보 */
  student: StudentInfo;
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 학생 헤더 컴포넌트
 * @description 학생 이름과 개인정보 아이콘, 햄버거 메뉴를 포함한 헤더
 *
 * 주요 기능:
 * - 좌측에 학생 이름 표시
 * - 우측에 개인정보 아이콘과 햄버거 메뉴
 * - 햄버거 메뉴 클릭 시 확장된 메뉴 표시
 * - 로그아웃 기능 (Jotai atom 연동)
 */
export function StudentHeader({ student }: StudentHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /** 로그아웃 atom */
  const logout = useSetAtom(logoutAtom);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  /**
   * 외부 클릭 감지하여 메뉴 닫기
   * @description 메뉴 외부를 클릭하면 메뉴가 자동으로 닫힘
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  /**
   * 로그아웃 핸들러
   * @description 로그아웃 후 로그인 페이지로 이동
   */
  const handleLogout = () => {
    logout(); // Jotai atom 상태 초기화
    closeMenu(); // 메뉴 닫기
    // 로그인 페이지로 이동
    window.location.href = "/";
  };

  return (
    <header
      className={cn(
        "relative flex h-10 w-full items-center px-3 py-6 mt-5 mb-3 md:h-12 bg-white border-b border-gray-200",
        "dark:bg-slate-800 dark:border-slate-700",
      )}
    >
      {/* 좌측: 학생 이름 */}
      <div className="flex flex-1 ">
        <h1 className="text-[1.4rem] font-bold text-black dark:text-white md:text-lg">
          {student.name}
        </h1>
      </div>

      {/* 우측: 개인정보 아이콘과 메뉴 */}
      <div className="flex items-center gap-2">
        {/* 개인정보 아이콘 */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-9 w-9 rounded-[8px] p-0 hover:bg-gray-100 md:h-10 md:w-10 dark:hover:bg-gray-800"
          aria-label="개인정보"
        >
          <Link to="/main/mypage">
            <User className="size-5 text-gray-800 md:size-6 dark:text-gray-200" />
          </Link>
        </Button>

        {/* 햄버거 메뉴 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-[8px] p-0 hover:bg-gray-100 md:h-10 md:w-10 dark:hover:bg-gray-800"
          onClick={toggleMenu}
          aria-label="메뉴 열기"
        >
          <Menu className="size-5 text-gray-800 md:size-6 dark:text-gray-200" />
        </Button>

        {/* 확장된 메뉴 (햄버거 클릭 시) */}
        <div
          ref={menuRef}
          className={cn(
            "absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg",
            "dark:bg-slate-800 dark:border-slate-700 z-50",
            "transition-all duration-300 ease-out",
            "transform origin-top-right",
            isMenuOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2 pointer-events-none",
          )}
        >
          {/* 메뉴 헤더 */}
          <div className="px-3 py-2 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {student.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={closeMenu}
                aria-label="메뉴 닫기"
              >
                <X className="h-3 w-3 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>

          {/* 메뉴 항목들 */}
          <div className="py-1">
            <Button
              variant="ghost"
              asChild
              className="w-full justify-start px-3 py-2 h-auto text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={closeMenu}
            >
              <Link
                to="/main"
                onClick={(e) => {
                  // 링크 클릭 후 페이지 이동 완료되면 시험 목록 구역으로 스크롤
                  setTimeout(() => {
                    const examListSection =
                      document.getElementById("exam-list");
                    if (examListSection) {
                      examListSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }, 100);
                }}
              >
                <BookOpen className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                시험 목록
              </Link>
            </Button>

            <Button
              variant="ghost"
              asChild
              className="w-full justify-start px-3 py-2 h-auto text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={closeMenu}
            >
              <Link to="/main/mypage">
                <User className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                마이페이지
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-3 py-2 h-auto text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

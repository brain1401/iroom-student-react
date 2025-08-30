import { useState } from "react";
import { cn } from "@/lib/utils";
import type { StudentInfo } from "@/api/student/types";
import { Button } from "@/components/ui/button";
import {
  User,
  X,
  Menu,
  Settings,
  LogOut,
  BookOpen,
  BarChart3,
} from "lucide-react";

type StudentHeaderProps = {
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
 */
export function StudentHeader({ student }: StudentHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "relative flex h-12 w-full items-center px-4 py-2 md:h-15 bg-white border-b border-gray-200",
        "dark:bg-slate-800 dark:border-slate-700",
      )}
    >
      {/* 좌측: 학생 이름 */}
      <div className="flex flex-1 ">
        <h1 className="text-[1.68rem] font-bold text-black dark:text-white md:text-xl">
          {student.name}
        </h1>
      </div>

      {/* 우측: 개인정보 아이콘과 메뉴 */}
      <div className="flex items-center gap-3">
        {/* 개인정보 아이콘 */}
        <Button
          variant="ghost"
          size="sm"
          className="h-11 w-11 rounded-[10px] p-0 hover:bg-gray-100 md:h-12 md:w-12 dark:hover:bg-gray-800"
          aria-label="개인정보"
        >
          <User className="size-6 text-gray-800 md:size-7 dark:text-gray-200" />
        </Button>

        {/* 햄버거 메뉴 버튼 */}
        {!isMenuOpen && (
          <Button
            variant="ghost"
            size="sm"
            className="h-11 w-11 rounded-[10px] p-0 hover:bg-gray-100 md:h-12 md:w-12 dark:hover:bg-gray-800"
            onClick={toggleMenu}
            aria-label="메뉴 열기"
          >
            <Menu className="size-6 text-gray-800 md:size-7 dark:text-gray-200" />
          </Button>
        )}

        {/* 확장된 메뉴 (햄버거 클릭 시) */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-slate-800 dark:border-slate-700 z-50">
            {/* 메뉴 헤더 */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {student.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={closeMenu}
                  aria-label="메뉴 닫기"
                >
                  <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </div>
            </div>

            {/* 메뉴 항목들 */}
            <div className="py-2">
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 h-auto text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BookOpen className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                시험 목록
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 h-auto text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <BarChart3 className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                성적 통계
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 h-auto text-left hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Settings className="mr-3 h-4 w-4 text-gray-600 dark:text-gray-400" />
                설정
              </Button>

              <div className="border-t border-gray-200 dark:border-slate-700 my-2" />

              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 h-auto text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-3 h-4 w-4" />
                로그아웃
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

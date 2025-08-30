import { cn } from "@/lib/utils";
import type { RecentSubmission } from "@/api/student/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

type RecentSubmissionProps = {
  /** 최근 제출 시험 목록 */
  submissions: RecentSubmission[];
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 최근 제출 시험 컴포넌트
 * @description 학생이 최근에 제출한 시험들을 좌우 스크롤로 표시
 *
 * 주요 기능:
 * - 시험명, 총 문항, 단원명 표시
 * - 좌우 스크롤로 3개까지 보기
 * - 시험 유형별 배지 표시
 * - 반응형 디자인
 */
export function RecentSubmission({
  submissions,
  className,
}: RecentSubmissionProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /**
   * 스크롤 가능 여부 확인
   * @description 좌우 스크롤 버튼 활성화/비활성화 상태 업데이트
   */
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  /**
   * 컴포넌트 마운트 시와 리사이즈 시 스크롤 상태 확인
   */
  useEffect(() => {
    checkScrollPosition();

    const handleResize = () => {
      // 리사이즈 후 약간의 지연을 두고 스크롤 상태 확인
      setTimeout(checkScrollPosition, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [submissions]);

  /**
   * 좌측 스크롤
   * @description 이전 시험들로 스크롤
   */
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280 + 16; // 카드 너비 + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  };

  /**
   * 우측 스크롤
   * @description 다음 시험들로 스크롤
   */
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 280 + 16; // 카드 너비 + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }
  };

  /**
   * 시험 유형별 배지 색상 반환
   * @param examType 시험 유형
   * @returns 배지 variant
   */
  const getExamTypeBadge = (examType: RecentSubmission["examType"]) => {
    switch (examType) {
      case "mock":
        return "default";
      case "chapter":
        return "secondary";
      case "comprehensive":
        return "outline";
      case "final":
        return "destructive";
      default:
        return "default";
    }
  };

  /**
   * 시험 유형별 한글 이름 반환
   * @param examType 시험 유형
   * @returns 한글 이름
   */
  const getExamTypeName = (examType: RecentSubmission["examType"]) => {
    switch (examType) {
      case "mock":
        return "모의고사";
      case "chapter":
        return "단원평가";
      case "comprehensive":
        return "종합평가";
      case "final":
        return "기말고사";
      default:
        return "시험";
    }
  };

  if (!submissions || submissions.length === 0) {
    return (
      <Card
        className={cn(
          "w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700",
          className,
        )}
      >
        <CardContent className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-lg font-medium">최근 제출한 시험이 없습니다</p>
            <p className="text-sm mt-1">첫 번째 시험을 응시해보세요!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* 제목과 스크롤 버튼 */}
      <div className="flex items-center justify-between mb-4 mr-8 ml-8 mt-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            최근 제출 시험
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            최근에 응시한 시험들을 확인해보세요
          </p>
        </div>
      </div>

      {/* 스크롤 가능한 시험 목록 */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
          onScroll={checkScrollPosition}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {submissions.map((submission, index) => (
            <Card
              key={submission.examId}
              className={cn(
                "min-w-[280px] max-w-[280px] flex-shrink-0",
                "border border-gray-200 hover:border-blue-300 dark:border-slate-700 dark:hover:border-blue-600",
                "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                "bg-white dark:bg-slate-800",
                "overflow-hidden",
                // 첫 번째 카드만 왼쪽 마진을 주어 중앙에 위치
                index === 0 && "ml-[calc(50vw-140px)]",
              )}
            >
              <CardContent className="px-3 py-0">
                {/* 시험 유형 배지와 날짜 */}
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={getExamTypeBadge(submission.examType)}
                    className="px-2 py-1 text-xs font-medium"
                  >
                    {getExamTypeName(submission.examType)}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {new Date(submission.submittedAt).toLocaleDateString(
                      "ko-KR",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>

                {/* 시험명 */}
                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm leading-tight line-clamp-2 min-h-[1.5rem]">
                  {submission.examTitle}
                </h3>

                {/* 단원명 */}
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 font-medium">
                  📚 {submission.chapterName}
                </p>

                {/* 총 문항 수와 상세보기 버튼 */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    📝 총 {submission.totalQuestions}문항
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    상세보기 →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 스크롤 버튼들을 카드 아래 가운데에 배치 */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={cn(
                "h-10 w-10 p-0 rounded-full transition-all duration-200",
                "hover:scale-105 hover:shadow-md",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
              )}
              aria-label="이전 시험들 보기"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={cn(
                "h-10 w-10 p-0 rounded-full transition-all duration-200",
                "hover:scale-105 hover:shadow-md",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
              )}
              aria-label="다음 시험들 보기"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 스크롤 그라데이션 효과 */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent dark:from-slate-800 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent dark:from-slate-800 pointer-events-none" />
      </div>
    </div>
  );
}

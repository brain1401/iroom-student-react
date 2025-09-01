import { cn } from "@/lib/utils";
import type { RecentSubmission } from "@/api/student/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type RecentSubmissionProps = {
  /** 최근 제출 시험 목록 */
  submissions: RecentSubmission[];
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 최근 제출 시험 컴포넌트
 * @description 학생이 최근에 제출한 시험들을 캐러셀로 표시
 *
 * 주요 기능:
 * - 시험명, 총 문항, 단원명 표시
 * - 캐러셀 UI로 여러 시험 표시
 * - 시험 유형별 배지 표시
 * - 반응형 디자인 및 터치/드래그 지원
 * - 이전/다음 버튼으로 네비게이션
 */
export function RecentSubmission({
  submissions,
  className,
}: RecentSubmissionProps) {
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
          "w-full bg-gradient-to-r from-main-50 to-main-100 dark:from-slate-800 dark:to-slate-700",
          className,
        )}
      >
        <CardContent className="p-8 text-center">
          <div className="text-main-700 dark:text-gray-400">
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
      {/* 제목 */}
      <div className="flex items-center justify-between mb-6 px-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            최근 제출 시험
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            최근에 응시한 시험들을 확인해보세요
          </p>
        </div>

        {/* 시험 개수 표시 */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          총 {submissions.length}개
        </div>
      </div>

      {/* 캐러셀 컨테이너 */}
      <div className="relative px-8">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {submissions.map((submission) => (
              <CarouselItem
                key={submission.examId}
                className="pl-2 md:pl-4 pt-2 md:pt-4 basis-full sm:basis-1/2 md:basis-1/3 lg:grid-cols-1/4 xl:basis-1/5"
              >
                <Card
                  className={cn(
                    "h-full",
                    "border border-purple-300 hover:border-main-500 dark:border-slate-700 dark:hover:border-main-600",
                    "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
                    "bg-purple-100 dark:bg-slate-800",
                    "overflow-visible", // overflow-hidden 제거
                  )}
                >
                  <CardContent className="px-4 py-4">
                    {/* 시험 유형 배지와 날짜 */}
                    <div className="flex items-center justify-between mb-3">
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
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                      {submission.examTitle}
                    </h3>

                    {/* 단원명 */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 font-medium">
                      📚 {submission.chapterName}
                    </p>

                    {/* 총 문항 수와 상세보기 버튼 */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        📝 총 {submission.totalQuestions}문항
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="h-7 px-2 text-xs font-medium text-main-600 hover:text-main-700 hover:bg-main-50 dark:text-main-400 dark:hover:bg-main-900/20"
                      >
                        <Link
                          to="/main/exam/$examId"
                          params={{ examId: submission.examId }}
                        >
                          상세보기 →
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* 이전/다음 버튼 */}
          <CarouselPrevious className="-left-8 md:left-4" />
          <CarouselNext className="-right-8 md:right-4" />
        </Carousel>
      </div>

      {/* 캐러셀 인디케이터 (선택적) */}
      {submissions.length > 4 && (
        <div className="flex justify-center mt-4 space-x-2">
          {submissions
            .slice(0, Math.ceil(submissions.length / 4))
            .map((submission) => (
              <div
                key={`indicator-${submission.examId}`}
                className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"
              />
            ))}
        </div>
      )}
    </div>
  );
}

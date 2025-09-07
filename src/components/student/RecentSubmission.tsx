/**
 * 최근 응시 시험 컴포넌트
 * @description 학생이 최근에 응시한 시험 목록을 카루셀 형태로 표시
 * @version 2025-09-05
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { RecentSubmission } from "@/api/student/types";

type RecentSubmissionProps = {
  /** 최근 제출한 시험 목록 */
  submissions: RecentSubmission[];
  /** 제목 */
  title?: string;
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 최근 응시 시험 카루셀 컴포넌트
 */
export function RecentSubmission({
  submissions,
  title = "최근 응시 시험",
  className,
}: RecentSubmissionProps) {
  /**
   * 날짜 포맷팅 함수
   * @param dateString ISO 날짜 문자열
   * @returns 포맷된 날짜 문자열
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  /**
   * 상대 시간 포맷팅 함수
   * @param dateString ISO 날짜 문자열
   * @returns 상대 시간 문자열
   */
  const formatRelativeTime = (dateString: string) => {
    const submitted = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - submitted.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "오늘";
    } else if (diffInDays === 1) {
      return "어제";
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks}주 전`;
    } else {
      return formatDate(dateString);
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
        <CardContent className="py-12 text-center">
          <div className="space-y-3">
            <div className="text-4xl">📝</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              최근 응시한 시험이 없습니다
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              새로운 시험에 응시해보세요!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "w-full bg-gradient-to-r from-main-50 to-main-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6",
        className,
      )}
    >
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">📚</span>
          {title}
        </h2>
        <Badge variant="secondary" className="px-3 py-1">
          총 {submissions.length}개
        </Badge>
      </div>

      {/* 카루셀 */}
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {submissions.map((submission, index) => (
              <CarouselItem
                key={`${submission.examName}-${submission.submittedAt}-${index}`}
                className="pl-2 md:pl-4 pt-2 md:pt-4 basis-full sm:basis-1/2 md:basis-1/3 lg:grid-cols-1/4 xl:basis-1/5"
              >
                <Card
                  className={cn(
                    "h-full",
                    "border border-purple-300 hover:border-main-500 dark:border-slate-700 dark:hover:border-main-600",
                    "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
                    "bg-purple-100 dark:bg-slate-800",
                    "overflow-visible",
                  )}
                >
                  <CardContent className="px-4 py-4">
                    {/* 날짜와 배지 */}
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant="secondary"
                        className="px-2 py-1 text-xs font-medium"
                      >
                        최근 시험
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {formatRelativeTime(submission.submittedAt)}
                      </span>
                    </div>

                    {/* 시험명 */}
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                      {submission.examName}
                    </h3>

                    {/* 시험 설명 */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 font-medium line-clamp-2 min-h-[2rem]">
                      {submission.content || "시험 설명이 없습니다"}
                    </p>

                    {/* 문항 수와 응시일 정보 */}
                    <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          📝 총 {submission.totalQuestions}문항
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(submission.submittedAt)}
                        </span>
                      </div>
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

      {/* 전체 보기 링크 */}
      {submissions.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-main-600 hover:text-main-700 dark:text-main-400 dark:hover:text-main-300 font-medium transition-colors">
            전체 시험 기록 보기 →
          </button>
        </div>
      )}
    </div>
  );
}
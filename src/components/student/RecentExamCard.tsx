/**
 * 최근 응시 시험 카드 컴포넌트
 * @description 학생이 최근에 응시한 시험 정보를 카드 형태로 표시
 * @version 2025-09-05
 */

import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RecentSubmission } from "@/api/student/types";

type RecentExamCardProps = {
  /** 최근 제출 시험 데이터 */
  submission: RecentSubmission;
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 시험 유형을 한글로 변환하는 함수
 * @param examType 시험 유형
 * @returns 한글 시험 유형
 */
function GetExamTypeLabel(examType: RecentSubmission["examType"]): string {
  const typeMap = {
    mock: "모의고사",
    chapter: "단원별",
    comprehensive: "종합평가",
    final: "최종평가",
  } as const;

  return typeMap[examType] || examType;
}

/**
 * 시험 유형에 따른 배지 variant 반환
 * @param examType 시험 유형
 * @returns Badge variant
 */
function GetExamTypeBadgeVariant(examType: RecentSubmission["examType"]) {
  const variantMap = {
    mock: "default" as const,
    chapter: "secondary" as const,
    comprehensive: "outline" as const,
    final: "destructive" as const,
  };

  return variantMap[examType] || "secondary";
}

/**
 * 제출일을 상대적 시간으로 포맷팅
 * @param submittedAt ISO 날짜 문자열
 * @returns 상대적 시간 문자열
 */
function FormatSubmittedAt(submittedAt: string): string {
  const submitted = new Date(submittedAt);
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
    return submitted.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  }
}

/**
 * 최근 응시 시험 카드 컴포넌트
 */
export function RecentExamCard({ submission, className }: RecentExamCardProps) {
  const examTypeLabel = GetExamTypeLabel(submission.examType);
  const badgeVariant = GetExamTypeBadgeVariant(submission.examType);
  const submittedAtLabel = FormatSubmittedAt(submission.submittedAt);

  return (
    <Link
      to="/main/exam/$examId"
      params={{ examId: submission.examId }}
      className="block"
    >
      <Card
        className={cn(
          "h-full transition-all duration-200",
          "hover:shadow-lg hover:-translate-y-1",
          "cursor-pointer group",
          className,
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {submission.examTitle}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {submission.chapterName}
              </p>
            </div>
            <Badge variant={badgeVariant} className="text-xs shrink-0">
              {examTypeLabel}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* 시험 정보 */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">문제 수</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {submission.totalQuestions}문항
              </span>
            </div>

            {/* 제출일 */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">응시일</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {submittedAtLabel}
              </span>
            </div>

            {/* 하단 액션 영역 */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">
                결과 확인 →
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
/**
 * 최근 응시 시험 카드 컴포넌트
 * @description 학생이 최근에 응시한 시험 정보를 카드 형태로 표시
 * @version 2025-09-05
 */

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
 * 제출일을 상대적 시간으로 포맷팅
 * @param submittedAt ISO 날짜 문자열
 * @returns 상대적 시간 문자열
 */
function formatSubmittedAt(submittedAt: string): string {
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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-200",
        "hover:shadow-lg hover:scale-[1.02]",
        className,
      )}
    >
      {/* 헤더 영역 */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base line-clamp-2 flex-1">
            {submission.examName}
          </h3>
          <Badge variant="outline" className="shrink-0">
            {submission.totalQuestions}문제
          </Badge>
        </div>
      </CardHeader>

      {/* 콘텐츠 영역 */}
      <CardContent className="space-y-3">
        {/* 시험 설명 */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {submission.content}
        </p>

        {/* 응시 정보 */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">응시일</span>
            <span className="font-medium">{formatDate(submission.submittedAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">응시시간</span>
            <span className="font-medium">{formatTime(submission.submittedAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">상대시간</span>
            <span className="font-medium">{formatSubmittedAt(submission.submittedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
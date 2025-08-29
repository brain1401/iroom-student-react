import React from "react";
import { Check, X, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Link } from "@tanstack/react-router";

type ExamData = {
  /** 시험 아이디 */
  examId: string;
  /** 시험 제목 */
  title: string;
  /** 맞은 문제 수 */
  correctCount: number;
  /** 틀린 문제 수 */
  incorrectCount: number;
  /** 정답률 (0-100) */
  accuracyRate: number;
};

/**
 * 시험 결과 카드 컴포넌트 Props 타입
 */
type ExamResultCardProps = {
  /** 시험 데이터 */
  exam: ExamData;
  /** 진행바 표시 여부 */
  showProgressBar?: boolean;
  /** 뒤로가기 버튼 표시 여부 */
  showBackButton?: boolean;
  /** 카드 클릭 핸들러 */
  onClick?: () => void;
  /** 뒤로가기 버튼 클릭 핸들러 */
  onBackClick?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 시험 결과 카드 컴포넌트
 * @description 시험 제목, 점수, 정답률을 표시하는 재사용 가능한 카드
 *
 * 주요 기능:
 * - 시험 결과 정보 시각화 (제목, 점수, 정답률)
 * - 정답률 진행바 표시 (선택적)
 * - 클릭 가능한 인터랙션
 * - 키보드 네비게이션 지원
 * - 다양한 크기와 변형 지원
 * - 접근성 고려 설계
 *
 * @example
 * ```tsx
 * <ExamResultCard
 *   title="가나다 시험"
 *   correctCount={12}
 *   incorrectCount={8}
 *   accuracyRate={60}
 *   onClick={() => navigateToDetail()}
 * />
 * ```
 */
export const ExamResultCard = React.memo<ExamResultCardProps>(
  ({
    exam: { examId, title, correctCount, incorrectCount, accuracyRate },
    showProgressBar = true,
    showBackButton = false,
    className,
    ...props
  }) => {
    const totalCount = correctCount + incorrectCount;
    const progressPercentage =
      totalCount === 0 ? 0 : (correctCount / totalCount) * 100;
    const accuracyRateText = `정답률 ${accuracyRate}%`;
    const totalCountText = `총 ${totalCount}문항`;

    /**
     * 뒤로가기 버튼 클릭 핸들러
     * 이벤트 전파 방지로 카드 클릭과 분리
     */
    const handleBackClick = (_event: React.MouseEvent) => {};

    return (
      <Link
        to="/main/exam/$examId"
        params={{ examId }}
        className={cn("cursor-pointer", className)}
        aria-label={`${title} 시험 결과, ${accuracyRateText}, ${totalCountText} 중 ${correctCount}개 정답`}
        {...props}
      >
        {/* 헤더 영역: 제목과 뒤로가기 버튼 */}
        <div className="mb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl leading-tight font-bold text-black">
              {title}
            </h3>
          </div>

          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 size-6 shrink-0 hover:bg-gray-100"
              onClick={handleBackClick}
              aria-label="뒤로가기"
            >
              <ChevronLeft className="size-4" />
            </Button>
          )}
        </div>

        {/* 점수 영역: 맞은 개수, 틀린 개수, 총 문항 */}
        <div className="mb-3 flex items-center gap-6">
          {/* 맞은 문제 */}
          <div className="flex items-center gap-2">
            <div className="flex size-4 items-center justify-center rounded-full border-2 border-blue-600">
              <Check className="size-2.5 text-blue-600" strokeWidth={3} />
            </div>
            <span className="text-xl font-bold text-blue-600">
              {correctCount}
            </span>
          </div>

          {/* 틀린 문제 */}
          <div className="flex items-center gap-2">
            <X className="size-[1.5rem] text-red-500" strokeWidth={3} />
            <span className="text-xl font-bold text-red-500">
              {incorrectCount}
            </span>
          </div>

          {/* 총 문항 */}
          <div className="ml-auto">
            <span className="text-sm font-normal text-gray-500">
              {totalCountText}
            </span>
          </div>
        </div>

        {/* 진행바 영역 */}
        {showProgressBar && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">
              {accuracyRateText}
            </p>
            <Progress
              value={progressPercentage}
              className={cn(
                "h-2 bg-red-100",
                "[&>div]:bg-blue-600", // Indicator 색상 커스터마이징
              )}
              aria-label={`진행률 ${progressPercentage.toFixed(1)}%`}
            />
          </div>
        )}
        {/* 구분선 (피그마 디자인과 일치) */}
        <div className="absolute right-4 -bottom-px left-0 h-px bg-gray-200" />
      </Link>
    );
  },
);

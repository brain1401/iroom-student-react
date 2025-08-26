import React, { useCallback } from "react";
import { Check, X, ChevronLeft } from "lucide-react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

/**
 * 시험 결과 카드 변형 타입
 */
type ExamResultCardVariant = "default" | "compact";

/**
 * 시험 결과 카드 크기 타입
 */
type ExamResultCardSize = "sm" | "md" | "lg";

const examResultCardVariants = cva(
  "group relative flex flex-col bg-white border border-gray-200 rounded-xl p-4 transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
        compact: "p-3",
      },
      size: {
        sm: "min-h-[80px]",
        md: "min-h-[120px]",
        lg: "min-h-[140px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

/**
 * 시험 결과 카드 컴포넌트 Props 타입
 */
type ExamResultCardProps = {
  /** 시험 제목 */
  title: string;
  /** 맞은 문제 수 */
  correctCount: number;
  /** 틀린 문제 수 */
  incorrectCount: number;
  /** 정답률 (0-100) */
  accuracyRate: number;
  /** 전체 문제 수 (선택적, 없으면 계산) */
  totalCount?: number;
  /** 카드 변형 */
  variant?: ExamResultCardVariant;
  /** 카드 크기 */
  size?: ExamResultCardSize;
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
  /** 자식 요소 */
  children?: React.ReactNode;
} & VariantProps<typeof examResultCardVariants>;

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
    title,
    correctCount,
    incorrectCount,
    accuracyRate,
    totalCount: providedTotalCount,
    variant = "default",
    size = "md",
    showProgressBar = true,
    showBackButton = false,
    onClick,
    onBackClick,
    className,
    children,
    ...props
  }) => {
    // 인라인으로 간단한 계산 로직 처리
    const totalCount = providedTotalCount ?? correctCount + incorrectCount;
    const progressPercentage =
      totalCount === 0 ? 0 : (correctCount / totalCount) * 100;
    const accuracyRateText = `정답률 ${accuracyRate}%`;
    const totalCountText = `총 ${totalCount}문항`;

    /**
     * 키보드 이벤트 핸들러
     * Enter 또는 Space 키로 카드 클릭 동작 실행
     */
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if ((event.key === "Enter" || event.key === " ") && onClick) {
          event.preventDefault();
          onClick();
        }
      },
      [onClick],
    );

    /**
     * 뒤로가기 버튼 클릭 핸들러
     * 이벤트 전파 방지로 카드 클릭과 분리
     */
    const handleBackClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        onBackClick?.();
      },
      [onBackClick],
    );

    return (
      <article
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={cn(
          examResultCardVariants({ variant, size }),
          onClick && "cursor-pointer",
          className,
        )}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-label={
          onClick
            ? `${title} 시험 결과, ${accuracyRateText}, ${totalCountText} 중 ${correctCount}개 정답`
            : undefined
        }
        {...props}
      >
        {/* 헤더 영역: 제목과 뒤로가기 버튼 */}
        <header className="mb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl leading-tight font-bold text-black">
              {title}
            </h3>
          </div>

          {showBackButton && onBackClick && (
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
        </header>

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

        {/* 추가 컨텐츠 영역 */}
        {children && (
          <div className="mt-4 border-t border-gray-100 pt-4">{children}</div>
        )}

        {/* 구분선 (피그마 디자인과 일치) */}
        <div className="absolute right-4 -bottom-px left-0 h-px bg-gray-200" />
      </article>
    );
  },
);
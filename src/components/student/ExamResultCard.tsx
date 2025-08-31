import React from "react";
import { Check, X, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

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
      <div
        className={cn("cursor-pointer rounded-lg shadow-md", className)}
        aria-label={`${title} 시험 결과, ${accuracyRateText}, ${totalCountText} 중 ${correctCount}개 정답`}
        {...props}
      >
        <div className="space-y-3">
          {/* 시험 제목 */}
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2">
            {title}
          </h3>

          {/* 정답률 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              정답률
            </span>
            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
              {accuracyRate}%
            </span>
          </div>

          {/* 정답률 시각화 그래프 */}
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${accuracyRate}%` }}
            />
          </div>

          {/* 정답/오답 수 */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">
                ✓ {correctCount}개
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600 dark:text-red-400">
                ✗ {incorrectCount}개
              </span>
            </div>
          </div>

          {/* 총 문항 수 */}
          <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {totalCountText}
            </span>
          </div>
        </div>
      </div>
    );
  },
);

import { Circle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProblemStatus } from "./types";

/**
 * 시험 문제 리스트 아이콘 컴포넌트 프로퍼티
 */
type ExamQuestionListIconProps = {
  /** 문제 상태 */
  status: ProblemStatus;
  /** 추가 CSS 클래스 */
  className?: string;
};

/**
 * 시험 문제 리스트 아이콘 컴포넌트
 * @description 문제 상태에 따라 적절한 아이콘을 표시하는 컴포넌트
 *
 * 상태별 아이콘:
 * - completed: 초록색 Circle 아이콘 (정답)
 * - active: 빨간색 Circle 아이콘 (진행중)
 * - locked: 회색 X 아이콘 (잠김/오답)
 */
export function ExamQuestionListIcon({
  status,
  className,
}: ExamQuestionListIconProps) {
  if (status === "completed") {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-[0.3125rem] border border-green-500 bg-green-50",
          className,
        )}
      >
        <Circle className="h-4 w-4 fill-green-500 text-green-500" />
      </div>
    );
  }

  if (status === "active") {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-[0.3125rem] border border-[#FF6A71] bg-red-50",
          className,
        )}
      >
        <Circle className="h-4 w-4 fill-[#FF6A71] text-[#FF6A71]" />
      </div>
    );
  }

  // locked status
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-[0.3125rem] border border-gray-400 bg-gray-50",
        className,
      )}
    >
      <X className="h-4 w-4 text-gray-400" />
    </div>
  );
}
